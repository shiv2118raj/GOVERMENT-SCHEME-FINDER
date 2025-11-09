const pmAwasYojana = {
  id: 'pm-awas-yojana',
  name: 'Pradhan Mantri Awas Yojana',
  shortName: 'PMAY',
  description: 'Pradhan Mantri Awas Yojana (PMAY) is a flagship mission of the Government of India which aims to provide affordable housing to the urban poor by the year 2022. The scheme has two components: PMAY-Urban (PMAY-U) for the urban poor and PMAY-Gramin (PMAY-G) for rural areas.',
  launchYear: 2015,
  ministry: 'Ministry of Housing and Urban Affairs',
  officialLink: 'https://pmaymis.gov.in/',
  helpline: '1800-11-3383',
  
  keywords: ['pmay', 'awas yojana', 'pradhan mantri awas yojana', 'housing scheme', 'home loan subsidy'],
  
  benefits: [
    'Interest subsidy of up to ₹2.67 lakh on home loans',
    'Subsidy available for both new construction and extension of existing houses',
    'Women ownership (single or joint) is mandatory for the house',
    'Preference to senior citizens and differently-abled persons in allotment of ground floors',
    'Use of sustainable technology for construction'
  ],
  
  eligibility: [
    'Family should not own a pucca house in any part of India',
    'Family should not have availed central assistance under any housing scheme',
    'Annual income should be within the specified limits based on the category (EWS/LIG/MIG)', 
    'The house should be in the name of a female member of the family',
    'Beneficiary family should not have availed any central assistance under any housing scheme'
  ],
  
  incomeCategories: [
    { category: 'EWS (Economically Weaker Section)', income: 'Up to ₹3 lakhs', carpetArea: '30 sq.m.' },
    { category: 'LIG (Lower Income Group)', income: '₹3-6 lakhs', carpetArea: '60 sq.m.' },
    { category: 'MIG-I (Middle Income Group I)', income: '₹6-12 lakhs', carpetArea: '120-160 sq.m.' },
    { category: 'MIG-II (Middle Income Group II)', income: '₹12-18 lakhs', carpetArea: '150-200 sq.m.' }
  ],
  
  documentsRequired: [
    'Aadhaar Card',
    'Proof of Identity (Voter ID/Passport/Driving License)',
    'Proof of Residence (Ration Card/Utility Bills)',
    'Income Certificate',
    'Caste Certificate (if applicable)',
    'Property Documents (if any)', 
    'Bank Account Details',
    'Affidavit for not owning a pucca house'
  ],
  
  howToApply: `1. Visit the official PMAY website (https://pmaymis.gov.in/)
2. Click on 'Citizen Assessment' and select 'Benefits under 3 components'
3. Fill in your Aadhaar number and personal details
4. Provide your current residential address and contact information
5. Upload the required documents
6. Submit the application
7. Note the application number for future reference

You can also apply through:
- Common Service Centers (CSC)
- PMAY Helpdesk
- Local Urban Local Bodies (ULB) office`,
  
  // Subsidy details
  subsidyDetails: [
    { category: 'EWS/LIG', loanAmount: 'Up to ₹6 lakhs', subsidy: '6.5%', maxSubsidy: '₹2.67 lakh' },
    { category: 'MIG-I', loanAmount: 'Up to ₹9 lakhs', subsidy: '4%', maxSubsidy: '₹2.35 lakh' },
    { category: 'MIG-II', loanAmount: 'Up to ₹12 lakhs', subsidy: '3%', maxSubsidy: '₹2.30 lakh' }
  ],
  
  // Common questions and answers
  faqs: [
    {
      question: 'What is the carpet area limit under PMAY?',
      answer: 'The carpet area limit is 30 sq.m. for EWS, 60 sq.m. for LIG, 120-160 sq.m. for MIG-I, and 150-200 sq.m. for MIG-II categories.'
    },
    {
      question: 'Can I apply for PMAY if I already own a plot?',
      answer: 'Yes, you can apply under the CLSS (Credit Linked Subsidy Scheme) component if you meet the eligibility criteria.'
    },
    {
      question: 'Is Aadhaar mandatory for PMAY?',
      answer: 'Yes, Aadhaar is mandatory for availing benefits under PMAY.'
    },
    {
      question: 'Can I get PMAY benefit for home renovation?',
      answer: 'No, PMAY is only for new construction or acquisition of a new house. It does not cover renovation or repair works.'
    },
    {
      question: 'How to check PMAY application status?',
      answer: 'You can check your application status on the PMAY website using your application number or Aadhaar number.'
    }
  ]
};

export default pmAwasYojana;
