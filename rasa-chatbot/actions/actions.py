from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import re

class ActionRecommendIncomeSchemes(Action):
    def name(self) -> Text:
        return "action_recommend_income_schemes"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get income information from entities or slots
        income_amount = tracker.get_slot("income_amount")
        income_unit = tracker.get_slot("income_unit")
        
        # Try to extract from latest message if not in slots
        latest_message = tracker.latest_message.get('text', '')
        
        if not income_amount:
            # Extract income from message using regex
            income_pattern = r'(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|crores?|thousands?)'
            match = re.search(income_pattern, latest_message.lower())
            if match:
                income_amount = float(match.group(1))
                income_unit = match.group(0).split()[-1] if len(match.group(0).split()) > 1 else "lpa"
        
        if income_amount:
            # Convert to LPA for standardization
            if income_unit and income_unit.lower() in ['lakhs', 'lakh']:
                income_lpa = income_amount
            elif income_unit and income_unit.lower() in ['thousands', 'thousand']:
                income_lpa = income_amount / 100
            elif income_unit and income_unit.lower() in ['crores', 'crore']:
                income_lpa = income_amount * 100
            else:
                income_lpa = income_amount  # Assume LPA
            
            # Provide recommendations based on income brackets
            if income_lpa <= 3:
                message = f"""With an income of {income_amount} {income_unit or 'LPA'}, you're eligible for several schemes:

💰 **Financial Assistance:**
• PM-KISAN (if you're a farmer) - ₹6,000/year
• PMJDY - Zero balance bank account with benefits
• PMSBY - Accident insurance for ₹12/year
• PMJJBY - Life insurance for ₹330/year

🏠 **Housing:**
• PMAY - Housing subsidy for first-time buyers
• Interest subsidy on home loans

📚 **Skill Development:**
• PMKVY - Free skill training with stipend
• DDU-GKY - Rural skill development

🏥 **Healthcare:**
• Ayushman Bharat - Free health insurance up to ₹5 lakh

Would you like detailed information about any of these schemes?"""
            
            elif income_lpa <= 8:
                message = f"""With an income of {income_amount} {income_unit or 'LPA'}, here are relevant schemes:

🏠 **Housing Benefits:**
• PMAY Credit Linked Subsidy - Interest subsidy on home loans
• Tax benefits under Section 80C and 24(b)

💼 **Professional Development:**
• Startup India - If you're planning to start a business
• PMKVY Advanced courses

🏥 **Healthcare:**
• ESI benefits if employed in organized sector
• Tax deductions for health insurance premiums

📈 **Investment:**
• PPF, ELSS, and other tax-saving investments
• National Pension Scheme (NPS)

Would you like more details about any specific scheme?"""
            
            else:
                message = f"""With an income of {income_amount} {income_unit or 'LPA'}, here are suitable schemes:

📈 **Investment & Tax Benefits:**
• PPF, ELSS, NSC for tax savings
• National Pension Scheme (NPS)
• Tax benefits under various sections

💼 **Business Development:**
• Startup India - For new ventures
• MUDRA loans for business expansion
• Export promotion schemes

🏠 **Housing:**
• Home loan tax benefits
• Property investment schemes

Would you like information about business or investment schemes?"""
            
            dispatcher.utter_message(text=message)
            return [SlotSet("income_amount", income_amount), SlotSet("income_unit", income_unit)]
        
        else:
            # Ask for income if not provided
            dispatcher.utter_message(text="To provide personalized scheme recommendations, could you tell me your annual income? (e.g., 2 LPA, 5 lakhs, etc.)")
            return []

class ActionGetSchemeDetails(Action):
    def name(self) -> Text:
        return "action_get_scheme_details"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get scheme name from entities
        scheme_entities = tracker.latest_message.get('entities', [])
        scheme_name = None
        
        for entity in scheme_entities:
            if entity.get('entity') == 'scheme_name':
                scheme_name = entity.get('value')
                break
        
        if not scheme_name:
            # Try to extract from message
            latest_message = tracker.latest_message.get('text', '').lower()
            scheme_keywords = {
                'pm-kisan': 'PM-KISAN',
                'pmkisan': 'PM-KISAN',
                'ayushman': 'Ayushman Bharat',
                'pmkvy': 'PMKVY',
                'pmay': 'PMAY',
                'mgnrega': 'MGNREGA',
                'startup india': 'Startup India'
            }
            
            for keyword, full_name in scheme_keywords.items():
                if keyword in latest_message:
                    scheme_name = full_name
                    break
        
        # Provide scheme details
        scheme_details = {
            'PM-KISAN': """🌾 **PM-KISAN Scheme Details:**

**Objective:** Direct income support to farmers
**Benefit:** ₹6,000 per year in 3 installments
**Eligibility:** 
• Small & marginal farmers
• Land holding up to 2 hectares
• Valid Aadhaar card required

**Documents:** Aadhaar, Land records, Bank account details
**How to Apply:** Online at pmkisan.gov.in or through CSCs""",

            'Ayushman Bharat': """🏥 **Ayushman Bharat Scheme Details:**

**Objective:** Health insurance for poor families
**Benefit:** Up to ₹5 lakh per family per year
**Coverage:** 1,400+ medical packages, hospitalization

**Eligibility:** 
• SECC-2011 beneficiaries
• Rural & urban poor families
• Free treatment at empaneled hospitals

**Documents:** Aadhaar, Ration card, SECC verification
**How to Apply:** Visit nearest hospital or Ayushman Mitra""",

            'PMKVY': """📚 **PMKVY Scheme Details:**

**Objective:** Skill development and certification
**Benefit:** Free training + ₹8,000 average monetary reward
**Duration:** 150-300 hours of training

**Eligibility:** 
• Age 18-45 years
• School/college dropouts preferred
• Unemployed youth

**Sectors:** IT, Healthcare, Tourism, Agriculture, etc.
**How to Apply:** Visit pmkvyofficial.org or training centers""",

            'PMAY': """🏠 **PMAY Scheme Details:**

**Objective:** Housing for all by 2022
**Benefit:** 
• Urban: ₹2.5 lakh subsidy
• Rural: ₹1.2-1.3 lakh assistance

**Eligibility:** 
• No pucca house in family name
• Annual income limits apply
• First-time home buyers

**Documents:** Income proof, Aadhaar, Bank details
**How to Apply:** pmaymis.gov.in or local authorities""",

            'MGNREGA': """💼 **MGNREGA Scheme Details:**

**Objective:** Employment guarantee for rural households
**Benefit:** 100 days guaranteed employment per household
**Wage:** Minimum wage as per state rates

**Eligibility:** 
• Rural households
• Adult members willing to do unskilled work
• Work within 5 km of residence

**Documents:** Aadhaar, Bank account, Address proof
**How to Apply:** Apply through Gram Panchayat or online""",

            'PMFBY': """🌾 **PM Fasal Bima Yojana Details:**

**Objective:** Crop insurance for farmers
**Benefit:** Comprehensive crop insurance coverage
**Premium:** 2% for Kharif, 1.5% for Rabi crops

**Eligibility:** 
• All farmers (loanee & non-loanee)
• Covers all food crops, oilseeds, annual commercial crops

**Documents:** Aadhaar, Land records, Bank account, Sowing certificate
**How to Apply:** Through banks, CSCs, or insurance companies""",

            'Sukanya Samriddhi': """👧 **Sukanya Samriddhi Yojana Details:**

**Objective:** Savings scheme for girl child
**Benefit:** High interest rate (7.6% currently)
**Maturity:** 21 years from account opening

**Eligibility:** 
• Girl child aged 0-10 years
• Maximum 2 accounts per family
• Tax benefits under Section 80C

**Documents:** Birth certificate, Aadhaar, Address proof
**How to Apply:** Post office or authorized banks""",

            'PMSBY': """🛡️ **PM Suraksha Bima Yojana Details:**

**Objective:** Accident insurance scheme
**Benefit:** ₹2 lakh for accidental death/disability
**Premium:** Only ₹12 per year

**Eligibility:** 
• Age 18-70 years
• Bank account holder
• Auto-renewable annually

**Documents:** Aadhaar, Bank account details
**How to Apply:** Through banks or online""",

            'PMJJBY': """💙 **PM Jeevan Jyoti Bima Yojana Details:**

**Objective:** Life insurance scheme
**Benefit:** ₹2 lakh life insurance coverage
**Premium:** ₹330 per year

**Eligibility:** 
• Age 18-50 years
• Bank account holder
• Renewable every year

**Documents:** Aadhaar, Bank account details
**How to Apply:** Through banks or online""",

            'Mudra Loan': """💰 **Mudra Loan Scheme Details:**

**Objective:** Micro-finance for small businesses
**Benefit:** Loan up to ₹10 lakh without collateral
**Categories:** Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L)

**Eligibility:** 
• Small businesses, entrepreneurs
• Manufacturing, trading, service activities
• Low interest rates

**Documents:** Aadhaar, PAN, Business plan, Bank statements
**How to Apply:** Through banks or NBFCs"""
        }
        
        if scheme_name and scheme_name in scheme_details:
            dispatcher.utter_message(text=scheme_details[scheme_name])
        else:
            dispatcher.utter_message(text="I can provide details about PM-KISAN, Ayushman Bharat, PMKVY, PMAY, and other major schemes. Which specific scheme would you like to know about?")
        
        return []
