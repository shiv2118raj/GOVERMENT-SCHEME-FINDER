import mongoose from "mongoose";
import "dotenv/config";
import Scheme from "./models/scheme.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Comprehensive scheme data with 50+ government schemes
const sampleSchemes = [
  // AGRICULTURE SCHEMES
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "Financial assistance of Rs. 6,000 per year to small and marginal farmers",
    category: "Agriculture",
    eligibility: {
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Farmer"
    },
    benefits: [
      "Rs. 2,000 every 4 months (total Rs. 6,000/year)",
      "Direct bank transfer",
      "No paperwork required after registration"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Land Records"],
    applicationProcess: "Apply online through PM-KISAN portal or visit nearest CSC",
    officialWebsite: "https://pmkisan.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Crop insurance scheme to protect farmers against crop loss",
    category: "Agriculture",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Farmer"
    },
    benefits: [
      "Comprehensive crop insurance coverage",
      "Low premium rates (2% for Kharif, 1.5% for Rabi)",
      "Quick claim settlement",
      "Coverage for natural disasters"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Land Records", "Sowing Certificate"],
    applicationProcess: "Apply through banks, CSCs, or insurance companies",
    officialWebsite: "https://pmfby.gov.in",
    isActive: true
  },
  {
    name: "Kisan Credit Card (KCC)",
    description: "Credit facility for farmers to meet agricultural and allied activities",
    category: "Agriculture",
    eligibility: {
      minAge: 18,
      maxAge: 75,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Farmer"
    },
    benefits: [
      "Credit limit up to Rs. 3 lakh without collateral",
      "Low interest rate (7% per annum)",
      "Flexible repayment options",
      "Insurance coverage"
    ],
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
    applicationProcess: "Apply through banks or cooperative societies",
    officialWebsite: "https://www.nabard.org",
    isActive: true
  },
  {
    name: "Soil Health Card Scheme",
    description: "Free soil testing and health cards for farmers",
    category: "Agriculture",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Farmer"
    },
    benefits: [
      "Free soil testing",
      "Customized fertilizer recommendations",
      "Improved crop productivity",
      "Reduced input costs"
    ],
    documents: ["Aadhaar Card", "Land Records"],
    applicationProcess: "Contact local agriculture department or soil testing labs",
    officialWebsite: "https://soilhealth.dac.gov.in",
    isActive: true
  },

  // EDUCATION SCHEMES
  {
    name: "Beti Bachao Beti Padhao",
    description: "Scheme to address declining Child Sex Ratio and promote girls' education",
    category: "Education",
    eligibility: {
      minAge: 0,
      maxAge: 18,
      caste: ["All"],
      gender: "Female",
      state: ["All"]
    },
    benefits: [
      "Financial assistance for education",
      "Awareness campaigns",
      "Improved access to quality education"
    ],
    documents: ["Birth Certificate", "School Enrollment Certificate", "Bank Account"],
    applicationProcess: "Apply through schools or district education office",
    officialWebsite: "https://wcd.nic.in",
    isActive: true
  },
  {
    name: "National Scholarship Portal - SC/ST Scholarship",
    description: "Financial assistance for SC/ST students pursuing higher education",
    category: "Education",
    eligibility: {
      minAge: 16,
      maxAge: 35,
      income: "Below 2.5 LPA",
      caste: ["SC", "ST"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Tuition fee reimbursement",
      "Maintenance allowance",
      "Book allowance"
    ],
    documents: ["Caste Certificate", "Income Certificate", "Mark Sheets", "Bank Details"],
    applicationProcess: "Apply online through National Scholarship Portal",
    officialWebsite: "https://scholarships.gov.in",
    isActive: true
  },
  {
    name: "PM Scholarship Scheme",
    description: "Scholarships for children of Ex-Servicemen and Ex-Coast Guard personnel",
    category: "Education",
    eligibility: {
      minAge: 18,
      maxAge: 25,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Rs. 2,500 per month for boys",
      "Rs. 3,000 per month for girls",
      "Duration: Full course period"
    ],
    documents: ["Ex-Serviceman Certificate", "Mark Sheets", "Admission Certificate"],
    applicationProcess: "Apply online through KSB portal",
    officialWebsite: "https://ksb.gov.in",
    isActive: true
  },
  {
    name: "Mid Day Meal Scheme",
    description: "Free lunch program for school children",
    category: "Education",
    eligibility: {
      minAge: 6,
      maxAge: 14,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Free nutritious meals",
      "Improved school attendance",
      "Better nutrition for children"
    ],
    documents: ["School Enrollment Certificate"],
    applicationProcess: "Automatic enrollment through schools",
    officialWebsite: "https://mdm.gov.in",
    isActive: true
  },
  {
    name: "Sarva Shiksha Abhiyan",
    description: "Universal elementary education program",
    category: "Education",
    eligibility: {
      minAge: 6,
      maxAge: 14,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Free elementary education",
      "Free textbooks and uniforms",
      "Infrastructure development"
    ],
    documents: ["Birth Certificate", "Address Proof"],
    applicationProcess: "Enroll through local schools",
    officialWebsite: "https://samagra.gov.in",
    isActive: true
  },

  // HEALTHCARE SCHEMES
  {
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
    description: "Health insurance scheme providing coverage up to Rs. 5 lakh per family",
    category: "Healthcare",
    eligibility: {
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Health insurance up to Rs. 5 lakh per family per year",
      "Cashless treatment at empaneled hospitals",
      "Coverage for pre and post hospitalization"
    ],
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    applicationProcess: "Visit nearest CSC or apply online",
    officialWebsite: "https://pmjay.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    description: "Accident insurance scheme providing coverage of Rs. 2 lakh",
    category: "Healthcare",
    eligibility: {
      minAge: 18,
      maxAge: 70,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Rs. 2 lakh coverage for accidental death/disability",
      "Rs. 1 lakh for partial disability",
      "Annual premium of Rs. 12 only"
    ],
    documents: ["Aadhaar Card", "Bank Account Details"],
    applicationProcess: "Apply through banks or online",
    officialWebsite: "https://jansuraksha.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    description: "Life insurance scheme providing coverage of Rs. 2 lakh",
    category: "Healthcare",
    eligibility: {
      minAge: 18,
      maxAge: 50,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Rs. 2 lakh life insurance coverage",
      "Annual premium of Rs. 330",
      "Renewable every year"
    ],
    documents: ["Aadhaar Card", "Bank Account Details"],
    applicationProcess: "Apply through banks or online",
    officialWebsite: "https://jansuraksha.gov.in",
    isActive: true
  },
  {
    name: "Janani Suraksha Yojana (JSY)",
    description: "Safe motherhood intervention scheme",
    category: "Healthcare",
    eligibility: {
      minAge: 18,
      maxAge: 45,
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "Female",
      state: ["All"]
    },
    benefits: [
      "Cash assistance for institutional delivery",
      "Rs. 1,400 for rural areas, Rs. 1,000 for urban areas",
      "Free delivery and post-natal care"
    ],
    documents: ["Aadhaar Card", "BPL Card", "Pregnancy Registration"],
    applicationProcess: "Register at nearest health center",
    officialWebsite: "https://nhm.gov.in",
    isActive: true
  },

  // HOUSING SCHEMES
  {
    name: "Pradhan Mantri Awas Yojana (Urban)",
    description: "Housing scheme for urban poor to own a pucca house",
    category: "Housing",
    eligibility: {
      minAge: 18,
      income: "Below 18 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Any"
    },
    benefits: [
      "Interest subsidy on home loans",
      "Credit linked subsidy up to Rs. 2.67 lakh",
      "Affordable housing options"
    ],
    documents: ["Aadhaar Card", "Income Certificate", "Property Documents"],
    applicationProcess: "Apply online through PMAY portal",
    officialWebsite: "https://pmaymis.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Awas Yojana (Gramin)",
    description: "Housing scheme for rural poor",
    category: "Housing",
    eligibility: {
      minAge: 18,
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Any"
    },
    benefits: [
      "Rs. 1.2 lakh assistance for plain areas",
      "Rs. 1.3 lakh for hilly/difficult areas",
      "Technical support for construction"
    ],
    documents: ["Aadhaar Card", "BPL Card", "Land Documents"],
    applicationProcess: "Apply through Gram Panchayat",
    officialWebsite: "https://pmayg.nic.in",
    isActive: true
  },

  // EMPLOYMENT SCHEMES
  {
    name: "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
    description: "Employment guarantee scheme for rural households",
    category: "Employment",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Unemployed"
    },
    benefits: [
      "100 days guaranteed employment per household",
      "Minimum wage as per state rates",
      "Work within 5 km of residence"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Address Proof"],
    applicationProcess: "Apply through Gram Panchayat or online",
    officialWebsite: "https://nrega.nic.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    description: "Skill development scheme for youth",
    category: "Employment",
    eligibility: {
      minAge: 18,
      maxAge: 45,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Unemployed/Underemployed"
    },
    benefits: [
      "Free skill training",
      "Monetary reward up to Rs. 8,000",
      "Placement assistance",
      "Industry-recognized certification"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Educational Certificates"],
    applicationProcess: "Apply online through PMKVY portal or training centers",
    officialWebsite: "https://pmkvyofficial.org",
    isActive: true
  },
  {
    name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
    description: "Rural skill development and placement program",
    category: "Employment",
    eligibility: {
      minAge: 15,
      maxAge: 35,
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Rural youth"
    },
    benefits: [
      "Free residential training",
      "Stipend during training",
      "Guaranteed placement",
      "Post-placement support"
    ],
    documents: ["Aadhaar Card", "Income Certificate", "Educational Certificates"],
    applicationProcess: "Apply through DDU-GKY centers",
    officialWebsite: "https://ddugky.gov.in",
    isActive: true
  },

  // FINANCIAL SCHEMES
  {
    name: "Mudra Loan Scheme",
    description: "Micro-finance scheme for small businesses and entrepreneurs",
    category: "Financial",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Self-employed/Entrepreneur"
    },
    benefits: [
      "Loan up to Rs. 10 lakh without collateral",
      "Low interest rates",
      "Easy application process"
    ],
    documents: ["Aadhaar Card", "PAN Card", "Business Plan", "Bank Statements"],
    applicationProcess: "Apply through banks or NBFCs",
    officialWebsite: "https://mudra.org.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    description: "Financial inclusion program for banking services",
    category: "Financial",
    eligibility: {
      minAge: 10,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Zero balance bank account",
      "RuPay debit card",
      "Overdraft facility up to Rs. 10,000",
      "Life insurance coverage"
    ],
    documents: ["Aadhaar Card", "Address Proof"],
    applicationProcess: "Visit any bank branch",
    officialWebsite: "https://pmjdy.gov.in",
    isActive: true
  },
  {
    name: "Stand Up India Scheme",
    description: "Bank loans for SC/ST and women entrepreneurs",
    category: "Financial",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["SC", "ST", "All"],
      gender: "Female",
      state: ["All"],
      employment: "Entrepreneur"
    },
    benefits: [
      "Loan between Rs. 10 lakh to Rs. 1 crore",
      "Lower interest rates",
      "Handholding support"
    ],
    documents: ["Aadhaar Card", "Caste Certificate", "Business Plan", "Educational Certificates"],
    applicationProcess: "Apply through banks or online portal",
    officialWebsite: "https://standupmitra.in",
    isActive: true
  },

  // WOMEN & CHILD WELFARE
  {
    name: "Sukanya Samriddhi Yojana",
    description: "Savings scheme for girl child education and marriage",
    category: "Women & Child Welfare",
    eligibility: {
      minAge: 0,
      maxAge: 10,
      income: "Any",
      caste: ["All"],
      gender: "Female",
      state: ["All"]
    },
    benefits: [
      "High interest rate (currently 7.6%)",
      "Tax benefits under Section 80C",
      "Maturity after 21 years"
    ],
    documents: ["Birth Certificate", "Aadhaar Card", "Address Proof"],
    applicationProcess: "Open account at post office or authorized banks",
    officialWebsite: "https://www.nsiindia.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    description: "Maternity benefit scheme for pregnant and lactating mothers",
    category: "Women & Child Welfare",
    eligibility: {
      minAge: 18,
      maxAge: 45,
      income: "Any",
      caste: ["All"],
      gender: "Female",
      state: ["All"]
    },
    benefits: [
      "Rs. 5,000 cash incentive",
      "Paid in three installments",
      "Nutrition support"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Pregnancy Registration"],
    applicationProcess: "Register at Anganwadi centers",
    officialWebsite: "https://pmmvy.nic.in",
    isActive: true
  },

  // SENIOR CITIZEN SCHEMES
  {
    name: "Pradhan Mantri Vaya Vandana Yojana (PMVVY)",
    description: "Pension scheme for senior citizens",
    category: "Senior Citizens",
    eligibility: {
      minAge: 60,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Guaranteed pension for 10 years",
      "8% per annum return",
      "Purchase price up to Rs. 15 lakh"
    ],
    documents: ["Aadhaar Card", "PAN Card", "Bank Account Details"],
    applicationProcess: "Apply through LIC offices",
    officialWebsite: "https://licindia.in",
    isActive: true
  },
  {
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    description: "Monthly pension for elderly below poverty line",
    category: "Senior Citizens",
    eligibility: {
      minAge: 60,
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Rs. 200 per month (60-79 years)",
      "Rs. 500 per month (80+ years)",
      "Direct bank transfer"
    ],
    documents: ["Aadhaar Card", "BPL Card", "Age Proof", "Bank Account Details"],
    applicationProcess: "Apply through local authorities",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },

  // DISABILITY SCHEMES
  {
    name: "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
    description: "Monthly pension for persons with disabilities",
    category: "Disability",
    eligibility: {
      minAge: 18,
      maxAge: 79,
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Rs. 300 per month",
      "Direct bank transfer",
      "Additional state benefits"
    ],
    documents: ["Disability Certificate", "Aadhaar Card", "BPL Card", "Bank Account Details"],
    applicationProcess: "Apply through local authorities",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },

  // STARTUP & BUSINESS
  {
    name: "Startup India Scheme",
    description: "Support ecosystem for startups in India",
    category: "Business",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Entrepreneur"
    },
    benefits: [
      "Tax exemptions for 3 years",
      "Fast-track patent examination",
      "Easy compliance and regulations",
      "Funding support"
    ],
    documents: ["Incorporation Certificate", "Business Plan", "PAN Card"],
    applicationProcess: "Register online on Startup India portal",
    officialWebsite: "https://startupindia.gov.in",
    isActive: true
  },

  // DIGITAL INDIA
  {
    name: "Digital India Land Records Modernization",
    description: "Digitization of land records for transparency",
    category: "Digital Services",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Online access to land records",
      "Reduced corruption",
      "Quick property verification"
    ],
    documents: ["Property Documents", "Aadhaar Card"],
    applicationProcess: "Access through state land record portals",
    officialWebsite: "https://digitalindia.gov.in",
    isActive: true
  },

  // FOOD SECURITY
  {
    name: "National Food Security Act (NFSA)",
    description: "Subsidized food grains through Public Distribution System",
    category: "Food Security",
    eligibility: {
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "5 kg food grains per person per month",
      "Rice at Rs. 3/kg, Wheat at Rs. 2/kg",
      "Priority and Antyodaya households coverage"
    ],
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    applicationProcess: "Apply through local food & civil supplies department",
    officialWebsite: "https://dfpd.gov.in",
    isActive: true
  },

  // MSME SCHEMES
  {
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    description: "Credit linked subsidy scheme for generating employment through micro enterprises",
    category: "MSME",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      education: "8th Pass minimum",
      employment: "Unemployed/Self-employed"
    },
    benefits: [
      "Margin money subsidy up to 35% for general category",
      "Up to 25% subsidy for manufacturing sector",
      "Up to 35% subsidy for service sector",
      "Maximum project cost up to Rs. 25 lakh for manufacturing"
    ],
    documents: ["Aadhaar Card", "Educational Certificate", "Caste Certificate", "Project Report", "Bank Account Details"],
    applicationProcess: "Apply online through PMEGP portal or visit KVIC/DIC offices",
    officialWebsite: "https://www.kviconline.gov.in/pmegpeportal",
    isActive: true
  },
  {
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    description: "Collateral-free credit facility for micro and small enterprises",
    category: "MSME",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "MSME Owner"
    },
    benefits: [
      "Collateral-free loans up to Rs. 2 crore",
      "Credit guarantee coverage up to 85%",
      "Reduced documentation",
      "Lower interest rates"
    ],
    documents: ["MSME Registration", "Project Report", "Financial Statements", "Aadhaar Card"],
    applicationProcess: "Apply through participating banks and financial institutions",
    officialWebsite: "https://cgtmse.in",
    isActive: true
  },
  {
    name: "Micro Units Development and Refinance Agency (MUDRA) Yojana",
    description: "Funding support for micro enterprises and small businesses",
    category: "MSME",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Micro Entrepreneur"
    },
    benefits: [
      "Shishu: Loans up to Rs. 50,000",
      "Kishore: Loans from Rs. 50,001 to Rs. 5 lakh",
      "Tarun: Loans from Rs. 5,00,001 to Rs. 10 lakh",
      "No collateral required"
    ],
    documents: ["Aadhaar Card", "PAN Card", "Business Plan", "Bank Statements"],
    applicationProcess: "Apply through banks, NBFCs, and MFIs",
    officialWebsite: "https://mudra.org.in",
    isActive: true
  },
  {
    name: "Technology Upgradation Fund Scheme (TUFS)",
    description: "Technology upgradation in textile and jute industries",
    category: "MSME",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Textile/Jute Industry"
    },
    benefits: [
      "Capital investment subsidy up to 15%",
      "Interest reimbursement for 5 years",
      "Technology upgradation support",
      "Export promotion benefits"
    ],
    documents: ["Industry Registration", "Project Report", "Environmental Clearance", "Financial Documents"],
    applicationProcess: "Apply through Ministry of Textiles portal",
    officialWebsite: "https://texmin.nic.in",
    isActive: true
  },

  // E-SHRAM SOCIAL SECURITY SCHEMES
  {
    name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
    description: "Voluntary pension scheme for unorganized workers",
    category: "Social Security",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      income: "Below 15,000 per month",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Unorganized Worker"
    },
    benefits: [
      "Guaranteed monthly pension of Rs. 3,000 after 60 years",
      "Family pension of Rs. 1,500 in case of death",
      "Voluntary and contributory scheme",
      "Government co-contribution"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Mobile Number"],
    applicationProcess: "Register through e-Shram portal or CSCs",
    officialWebsite: "https://eshram.gov.in",
    isActive: true
  },
  {
    name: "Atal Pension Yojana (APY)",
    description: "Guaranteed pension scheme for unorganized sector workers",
    category: "Social Security",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Guaranteed pension from Rs. 1,000 to Rs. 5,000 per month",
      "Government co-contribution for eligible subscribers",
      "Spouse pension and return of corpus",
      "Tax benefits under Section 80CCD"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Mobile Number"],
    applicationProcess: "Apply through banks or e-Shram portal",
    officialWebsite: "https://npscra.nsdl.co.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY) - e-Shram",
    description: "Life insurance scheme for e-Shram registered workers",
    category: "Social Security",
    eligibility: {
      minAge: 18,
      maxAge: 50,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "e-Shram Registered"
    },
    benefits: [
      "Life insurance cover of Rs. 2 lakh",
      "Annual premium of Rs. 330",
      "Renewable every year till age 55",
      "Death benefit to nominee"
    ],
    documents: ["e-Shram Card", "Aadhaar Card", "Bank Account Details"],
    applicationProcess: "Auto-enrollment through e-Shram registration",
    officialWebsite: "https://eshram.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY) - e-Shram",
    description: "Accident insurance scheme for e-Shram registered workers",
    category: "Social Security",
    eligibility: {
      minAge: 18,
      maxAge: 70,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "e-Shram Registered"
    },
    benefits: [
      "Accident insurance cover of Rs. 2 lakh",
      "Annual premium of Rs. 12",
      "Partial disability cover of Rs. 1 lakh",
      "Auto-renewable"
    ],
    documents: ["e-Shram Card", "Aadhaar Card", "Bank Account Details"],
    applicationProcess: "Auto-enrollment through e-Shram registration",
    officialWebsite: "https://eshram.gov.in",
    isActive: true
  },

  // CENTRAL GOVERNMENT SCHEMES
  {
    name: "Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY)",
    description: "Free food grains distribution scheme during COVID-19 and beyond",
    category: "Food Security",
    eligibility: {
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Additional 5 kg free food grains per person per month",
      "1 kg free pulses per household per month",
      "Coverage under NFSA beneficiaries",
      "Extended support during emergencies"
    ],
    documents: ["Ration Card", "Aadhaar Card", "NFSA Card"],
    applicationProcess: "Automatic distribution through Fair Price Shops",
    officialWebsite: "https://dfpd.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    description: "Free LPG connections to women from BPL households",
    category: "Energy",
    eligibility: {
      minAge: 18,
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "Female",
      state: ["All"]
    },
    benefits: [
      "Free LPG connection worth Rs. 1,600",
      "Deposit-free LPG connection",
      "EMI facility for stove and refill",
      "Priority to SC/ST households"
    ],
    documents: ["BPL Card", "Aadhaar Card", "Bank Account Details", "Address Proof"],
    applicationProcess: "Apply through LPG distributors or online portal",
    officialWebsite: "https://pmuy.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Sahaj Bijli Har Ghar Yojana (Saubhagya)",
    description: "Universal household electrification scheme",
    category: "Energy",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Free electricity connections to all households",
      "Free internal wiring for BPL families",
      "Concessional connections for others",
      "Solar power packs for remote areas"
    ],
    documents: ["Aadhaar Card", "Address Proof", "BPL Card (if applicable)"],
    applicationProcess: "Apply through electricity distribution companies",
    officialWebsite: "https://saubhagya.gov.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
    description: "Rural road connectivity program",
    category: "Infrastructure",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Rural Resident"
    },
    benefits: [
      "All-weather road connectivity to villages",
      "Improved access to markets and services",
      "Employment generation in rural areas",
      "Enhanced quality of life"
    ],
    documents: ["Village Identification", "Population Census Data"],
    applicationProcess: "Implemented through state governments and PRIs",
    officialWebsite: "https://pmgsy.nic.in",
    isActive: true
  },

  // DBT BHARAT SCHEMES
  {
    name: "PM-KISAN Samman Nidhi (DBT)",
    description: "Direct benefit transfer of Rs. 6,000 per year to farmers",
    category: "Agriculture",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Farmer"
    },
    benefits: [
      "Rs. 2,000 every 4 months (Rs. 6,000/year)",
      "Direct bank transfer",
      "No intermediaries",
      "Aadhaar-based authentication"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Land Records"],
    applicationProcess: "Apply online through PM-KISAN portal",
    officialWebsite: "https://pmkisan.gov.in",
    isActive: true
  },
  {
    name: "National Social Assistance Programme (NSAP)",
    description: "Social security for elderly, widows, and disabled persons",
    category: "Social Security",
    eligibility: {
      minAge: 60,
      income: "Below 2 LPA",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Old Age Pension: Rs. 200-500 per month",
      "Widow Pension: Rs. 300 per month",
      "Disability Pension: Rs. 300 per month",
      "Direct bank transfer"
    ],
    documents: ["Aadhaar Card", "Age Proof", "BPL Card", "Bank Account Details"],
    applicationProcess: "Apply through local authorities or online portals",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },
  {
    name: "Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS) - DBT",
    description: "Guaranteed employment with direct wage payment",
    category: "Employment",
    eligibility: {
      minAge: 18,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Rural Unemployed"
    },
    benefits: [
      "100 days guaranteed employment per household",
      "Direct wage payment to bank accounts",
      "Minimum wage as per state rates",
      "Work within 5 km of residence"
    ],
    documents: ["Job Card", "Aadhaar Card", "Bank Account Details"],
    applicationProcess: "Apply through Gram Panchayat or online portal",
    officialWebsite: "https://nrega.nic.in",
    isActive: true
  },
  {
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY) - DBT",
    description: "Skill development with direct monetary rewards",
    category: "Employment",
    eligibility: {
      minAge: 18,
      maxAge: 45,
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Unemployed/Underemployed"
    },
    benefits: [
      "Free skill training",
      "Direct monetary reward up to Rs. 8,000",
      "Industry-recognized certification",
      "Placement assistance"
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Educational Certificates"],
    applicationProcess: "Apply online through PMKVY portal",
    officialWebsite: "https://pmkvyofficial.org",
    isActive: true
  },

  // ADDITIONAL CENTRAL SCHEMES
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY) - Enhanced",
    description: "Comprehensive crop insurance with technology integration",
    category: "Agriculture",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"],
      employment: "Farmer"
    },
    benefits: [
      "Comprehensive risk coverage from pre-sowing to post-harvest",
      "Low premium rates (2% for Kharif, 1.5% for Rabi)",
      "Use of technology for quick settlement",
      "Coverage for prevented sowing and mid-season adversities"
    ],
    documents: ["Aadhaar Card", "Land Records", "Sowing Certificate", "Bank Account Details"],
    applicationProcess: "Apply through banks, CSCs, or insurance companies",
    officialWebsite: "https://pmfby.gov.in",
    isActive: true
  },
  {
    name: "Swachh Bharat Mission (Urban & Rural)",
    description: "Clean India mission for sanitation and waste management",
    category: "Sanitation",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Individual household latrines (IHHL) construction",
      "Community and public toilets",
      "Solid waste management",
      "Incentives for toilet construction"
    ],
    documents: ["Aadhaar Card", "Address Proof", "BPL Card (if applicable)"],
    applicationProcess: "Apply through local urban/rural local bodies",
    officialWebsite: "https://swachhbharatmission.gov.in",
    isActive: true
  },
  {
    name: "Digital India Initiative",
    description: "Digital empowerment and infrastructure development",
    category: "Digital Services",
    eligibility: {
      income: "Any",
      caste: ["All"],
      gender: "All",
      state: ["All"]
    },
    benefits: [
      "Digital literacy programs",
      "Common Service Centers (CSCs)",
      "Digital infrastructure development",
      "E-governance services"
    ],
    officialWebsite: "https://digitalindia.gov.in",
    isActive: true
  },
  // SCHOLARSHIP SCHEMES - NATIONAL SCHOLARSHIP PORTAL
  {
    name: "NEC Merit Scholarship",
    description: "Financial support for students of North Eastern Region for higher professional courses",
    category: "Education",
    eligibility: {
      minAge: 18,
      maxAge: 35,
      income: "Below 8 LPA",
      state: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
      education: "Diploma, Degree, Post-graduate, M.Phil., PhD"
    },
    benefits: [
      "Financial assistance for professional courses",
      "Covers tuition and other expenses",
      "Available for students studying anywhere in India"
    ],
    documents: ["Domicile Certificate", "Income Certificate", "Mark Sheets", "Admission Proof"],
    applicationProcess: "Apply online through NEC portal or respective state authorities",
    officialWebsite: "https://necouncil.gov.in",
    isActive: true
  },
  {
    name: "Prime Minister's Scholarship Scheme For RPF/RPSF",
    description: "Scholarships for wards of Ex/Serving RPF/RPSF personnel",
    category: "Education",
    eligibility: {
      minAge: 18,
      maxAge: 25,
      employment: "Children of RPF/RPSF personnel"
    },
    benefits: [
      "150 scholarships per academic year",
      "50% reserved for girls",
      "Covers professional degree courses"
    ],
    documents: ["Service Certificate", "Mark Sheets", "Admission Proof", "Bank Details"],
    applicationProcess: "Apply online through RPF/RPSF portal",
    officialWebsite: "https://indianrailways.gov.in",
    isActive: true
  },
  {
    name: "Central Sector Scheme Of Scholarships For College And University Students",
    description: "Merit-based scholarships for college and university students",
    category: "Education",
    eligibility: {
      minAge: 18,
      maxAge: 25,
      income: "Below 8 LPA",
      education: "Regular graduate, post-graduate courses"
    },
    benefits: [
      "82,000 scholarships awarded annually",
      "Merit-based selection from all state boards",
      "Financial assistance for higher education"
    ],
    documents: ["Mark Sheets", "Income Certificate", "Bank Details", "College Admission Proof"],
    applicationProcess: "Apply online through National Scholarship Portal",
    officialWebsite: "https://scholarships.gov.in",
    isActive: true
  },
  {
    name: "National Means Cum Merit Scholarship",
    description: "Scholarships for meritorious students from economically weaker sections",
    category: "Education",
    eligibility: {
      minAge: 14,
      maxAge: 18,
      income: "Below 1.5 LPA",
      education: "Class 9 onwards"
    },
    benefits: [
      "1 lakh scholarships provided",
      "Monthly scholarship assistance",
      "Encourages continuation of studies"
    ],
    documents: ["Income Certificate", "Mark Sheets", "School Certificate", "Bank Details"],
    applicationProcess: "Apply through respective state education departments",
    officialWebsite: "https://scholarships.gov.in",
    isActive: true
  },
  {
    name: "National Fellowship and Scholarship for Higher Education of ST Students",
    description: "Fellowships and scholarships for Scheduled Tribe students",
    category: "Education",
    eligibility: {
      caste: ["ST"],
      education: "Higher education courses"
    },
    benefits: [
      "Fellowship for PhD/M.Phil students",
      "Scholarship for graduation/post-graduation",
      "Covers tuition and maintenance"
    ],
    documents: ["Caste Certificate", "Income Certificate", "Admission Proof", "Bank Details"],
    applicationProcess: "Apply through Ministry of Tribal Affairs portal",
    officialWebsite: "https://tribal.nic.in",
    isActive: true
  },
  {
    name: "Top Class Education Scheme for SC Students",
    description: "Scholarships for SC students in top-ranked institutions",
    category: "Education",
    eligibility: {
      caste: ["SC"],
      income: "Below 8 LPA"
    },
    benefits: [
      "4,200 scholarships annually",
      "30% reserved for SC girls",
      "Full tuition fee coverage"
    ],
    documents: ["Caste Certificate", "Income Certificate", "Admission Proof", "Bank Details"],
    applicationProcess: "Apply through notified institutions",
    officialWebsite: "https://socialjustice.gov.in",
    isActive: true
  },
  {
    name: "Pre Matric Scholarships Scheme for Minorities",
    description: "Scholarships for minority community students from class 1 to 10",
    category: "Education",
    eligibility: {
      minAge: 6,
      maxAge: 16,
      income: "Below 1 LPA",
      caste: ["Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi"],
      education: "Class 1 to 10"
    },
    benefits: [
      "Merit-based scholarships",
      "Covers school fees and maintenance",
      "Encourages education among minorities"
    ],
    documents: ["Minority Certificate", "Income Certificate", "School Certificate", "Bank Details"],
    applicationProcess: "Apply online through National Scholarship Portal",
    officialWebsite: "https://scholarships.gov.in",
    isActive: true
  },
  {
    name: "Post Matric Scholarships Scheme for Minorities",
    description: "Scholarships for minority students pursuing higher education",
    category: "Education",
    eligibility: {
      minAge: 17,
      income: "Below 2 LPA",
      caste: ["Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi"],
      education: "Post-matriculation courses"
    },
    benefits: [
      "Tuition fee reimbursement",
      "Maintenance allowance",
      "Course fee coverage"
    ],
    documents: ["Minority Certificate", "Income Certificate", "Mark Sheets", "Bank Details"],
    applicationProcess: "Apply online through National Scholarship Portal",
    officialWebsite: "https://scholarships.gov.in",
    isActive: true
  },
  {
    name: "Merit Cum Means Scholarship For Professional and Technical Courses",
    description: "Scholarships for professional and technical courses for minorities",
    category: "Education",
    eligibility: {
      minAge: 17,
      income: "Below 2 LPA",
      caste: ["Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi"],
      education: "Technical/Professional courses"
    },
    benefits: [
      "Course fee reimbursement",
      "Maintenance allowance",
      "Merit-based selection"
    ],
    documents: ["Minority Certificate", "Income Certificate", "Course Admission Proof", "Bank Details"],
    applicationProcess: "Apply online through National Scholarship Portal",
    officialWebsite: "https://scholarships.gov.in",
    isActive: true
  },

  // SOCIAL ASSISTANCE SCHEMES - NSAP
  {
    name: "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
    description: "Monthly pension for persons with severe disabilities",
    category: "Social Security",
    eligibility: {
      minAge: 18,
      maxAge: 79,
      income: "Below 2 LPA",
      disability: "Severe/Multiple disabilities"
    },
    benefits: [
      "Rs. 300 per month pension",
      "Direct bank transfer",
      "State government may add more"
    ],
    documents: ["Disability Certificate", "Income Certificate", "Age Proof", "Bank Account Details"],
    applicationProcess: "Apply through local authorities or NSAP portal",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },
  {
    name: "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
    description: "Monthly pension for widows in need",
    category: "Social Security",
    eligibility: {
      minAge: 40,
      maxAge: 59,
      income: "Below 2 LPA",
      gender: "Female",
      maritalStatus: "Widow"
    },
    benefits: [
      "Rs. 300 per month pension",
      "Direct bank transfer",
      "Support for family needs"
    ],
    documents: ["Death Certificate of Husband", "Income Certificate", "Age Proof", "Bank Account Details"],
    applicationProcess: "Apply through local authorities or NSAP portal",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },
  {
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    description: "Monthly pension for elderly citizens",
    category: "Social Security",
    eligibility: {
      minAge: 60,
      income: "Below 2 LPA"
    },
    benefits: [
      "Rs. 200 per month (60-79 years)",
      "Rs. 500 per month (80+ years)",
      "Direct bank transfer"
    ],
    documents: ["Age Proof", "Income Certificate", "Bank Account Details", "Address Proof"],
    applicationProcess: "Apply through local authorities or NSAP portal",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },
  {
    name: "National Family Benefit Scheme (NFBS)",
    description: "Lump sum assistance on death of primary breadwinner",
    category: "Social Security",
    eligibility: {
      minAge: 18,
      maxAge: 64,
      income: "Below 2 LPA",
      employment: "Primary breadwinner"
    },
    benefits: [
      "Rs. 20,000 lump sum assistance",
      "Paid to surviving family member",
      "One-time benefit"
    ],
    documents: ["Death Certificate", "Income Certificate", "Bank Account Details", "Family Details"],
    applicationProcess: "Apply through local authorities or NSAP portal",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },
  {
    name: "Annapurna Scheme",
    description: "Free food grains for senior citizens not covered under NOAPS",
    category: "Social Security",
    eligibility: {
      minAge: 65,
      income: "Below poverty line",
      other: "Not receiving old age pension"
    },
    benefits: [
      "10 kg food grains per month free of cost",
      "Rice, wheat, or other grains",
      "Nutritional support"
    ],
    documents: ["Age Proof", "Income Certificate", "Not receiving pension certificate"],
    applicationProcess: "Apply through local food & civil supplies department",
    officialWebsite: "https://nsap.nic.in",
    isActive: true
  },

  // GIRL CHILD SCHEME
  {
    name: "Sukanya Samriddhi Yojana",
    description: "Savings scheme for girl child education and marriage",
    category: "Women & Child Welfare",
    eligibility: {
      minAge: 0,
      maxAge: 10,
      gender: "Female"
    },
    benefits: [
      "High interest rate (8.2% per annum)",
      "Tax benefits under Section 80C",
      "Maturity after 21 years or marriage",
      "Minimum Rs. 250, maximum Rs. 1.5 lakh annual deposit"
    ],
    documents: ["Birth Certificate", "Address Proof", "Bank Account Details"],
    applicationProcess: "Open account at post office or authorized banks",
    officialWebsite: "https://www.nsiindia.gov.in",
    isActive: true
  }
];

async function seedSchemes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log("🗑️ Cleared existing schemes");

    // Insert sample schemes
    const result = await Scheme.insertMany(sampleSchemes);
    console.log(`✅ Added ${result.length} sample schemes`);

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedSchemes();
