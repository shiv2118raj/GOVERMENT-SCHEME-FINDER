const pmegp = {
  id: 'pmegp',
  name: 'Prime Minister\'s Employment Generation Programme',
  shortName: 'PMEGP',
  description: 'PMEGP is a credit-linked subsidy program that promotes self-employment through setting up of micro-enterprises in the non-farm sector by helping unemployed youth and traditional artisans.',
  launchYear: 2008,
  ministry: 'Ministry of Micro, Small and Medium Enterprises',
  officialLink: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
  helpline: '1800-180-6763',
  
  keywords: ['pmegp', 'employment generation', 'self employment', 'business loan', 'subsidy scheme'],
  
  benefits: [
    'Subsidy ranging from 15% to 35% of the project cost',
    'Margin money subsidy for setting up new enterprises',
    'No collateral security for loans up to ₹10 lakhs',
    'Project cost up to ₹25 lakhs for manufacturing sector and ₹10 lakhs for service sector',
    'Training and handholding support'
  ],
  
  eligibility: [
    'Any individual above 18 years of age',
    'No income ceiling for assistance for setting up projects',
    'Self Help Groups (SHGs), Charitable Trusts, Co-operative Societies, Production Co-operative Societies',
    'Institutions registered under Societies Registration Act, 1860',
    'Special category including SC/ST/OBC/Minorities/Women/Ex-servicemen/Physically Handicapped/NEH Region beneficiaries'
  ],
  
  documentsRequired: [
    'Aadhaar Card',
    'Caste Certificate (if applicable)',
    'Project Report',
    'Educational Qualification Certificate',
    'Experience Certificate (if any)', 
    'Proof of Residence',
    'Quotations of machinery/equipment',
    'Land/Building documents (if owned)'
  ],
  
  howToApply: `1. Visit the official PMEGP portal (https://www.kviconline.gov.in/pmegpeportal/)
2. Click on 'Online Application Form'
3. Register as a new user or login if already registered
4. Fill in the application form with all required details
5. Upload necessary documents
6. Submit the application
7. Note the application number for future reference

You can also apply through:
- KVIC/KVIB/DIC offices
- Coir Board
- Khadi and Village Industries Commission (KVIC) website`,
  
  // Subsidy details
  subsidyPattern: [
    { category: 'General Category', 'Urban': '15%', 'Rural': '25%' },
    { category: 'Special Category (SC/ST/OBC/Minorities/Women/Ex-servicemen/PH/NEH Region)', 'Urban': '25%', 'Rural': '35%' }
  ],
  
  // Common questions and answers
  faqs: [
    {
      question: 'What is the maximum loan amount under PMEGP?',
      answer: 'The maximum project cost is ₹25 lakhs for manufacturing sector and ₹10 lakhs for service sector.'
    },
    {
      question: 'Is there any age limit for PMEGP?',
      answer: 'The applicant should be above 18 years of age. There is no upper age limit.'
    },
    {
      question: 'How much time does it take to get PMEGP loan approval?',
      answer: 'The processing time is typically 60-90 days from the date of application submission.'
    },
    {
      question: 'Is training mandatory under PMEGP?',
      answer: 'Yes, beneficiaries are required to undergo Entrepreneurship Development Program (EDP) training before the release of the loan.'
    }
  ]
};

export default pmegp;
