const pmKisan = {
  id: 'pm-kisan',
  name: 'PM Kisan Samman Nidhi',
  shortName: 'PM-KISAN',
  description: 'PM-KISAN is a Central Sector Scheme with 100% funding from the Government of India. The scheme provides income support of ₹6,000 per year to all farmer families across the country in three equal installments of ₹2,000 every four months.',
  launchYear: 2019,
  ministry: 'Ministry of Agriculture & Farmers Welfare',
  officialLink: 'https://pmkisan.gov.in/',
  helpline: '155261 / 011-23381092',
  
  // Keywords for matching user queries
  keywords: ['pm kisan', 'kisan samman nidhi', 'kisan yojana', 'farmer scheme'],
  
  // Scheme details
  benefits: [
    'Financial benefit of ₹6,000 per year in three equal installments',
    'Benefit transferred directly to bank accounts of beneficiaries',
    'No middlemen involved in the process',
    'Covers all farmer families across the country'
  ],
  
  eligibility: [
    'Small and marginal farmers with cultivable landholding in their names',
    'All farmer families in the country irrespective of the size of their landholdings',
    'Farmer families holding cultivable land can apply',
    'No income limit for the beneficiary family'
  ],
  
  documentsRequired: [
    'Aadhaar Card',
    'Land Records (Khatauni/Khasra/Khata)',
    'Bank Account Details',
    'Aadhaar-linked Mobile Number',
    'Citizenship Certificate (if required)'
  ],
  
  howToApply: `1. Visit the official PM-KISAN portal (https://pmkisan.gov.in/)
2. Click on 'New Farmer Registration'
3. Select your state and fill in the required details
4. Enter your Aadhaar number and verify
5. Fill in the registration form with personal and land details
6. Upload required documents
7. Submit the application

You can also apply through the nearest Common Service Centre (CSC) or Agriculture Department office.`,
  
  // Additional scheme-specific information
  installments: [
    { name: '1st Installment', period: 'April - July' },
    { name: '2nd Installment', period: 'August - November' },
    { name: '3rd Installment', period: 'December - March' }
  ],
  
  // Common questions and answers
  faqs: [
    {
      question: 'How can I check my PM Kisan status?',
      answer: 'You can check your PM Kisan status on the official portal (https://pmkisan.gov.in/) using your Aadhaar number, account number, or mobile number.'
    },
    {
      question: 'Is Aadhaar mandatory for PM Kisan?',
      answer: 'Yes, Aadhaar is mandatory for availing benefits under the PM-KISAN scheme.'
    },
    {
      question: 'How to update bank account details in PM Kisan?',
      answer: 'You can update your bank account details by logging into the PM-KISAN portal or by contacting the nearest Agriculture Department office.'
    }
  ]
};

export default pmKisan;
