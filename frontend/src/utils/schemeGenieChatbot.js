// Import scheme data
import pmKisan from '../data/schemes/pmKisan';
import pmegp from '../data/schemes/pmegp';
import pmAwasYojana from '../data/schemes/pmAwasYojana';
import startupIndia from '../data/schemes/startupIndia';

// List of all available schemes
const schemes = {
  'pm kisan': pmKisan,
  'pmegp': pmegp,
  'pm awas yojana': pmAwasYojana,
  'pradhan mantri awas yojana': pmAwasYojana,
  'startup india': startupIndia,
  'startup india scheme': startupIndia,
};

// Function to find a scheme by name or keyword
function findScheme(query) {
  const queryLower = query.toLowerCase();
  
  // Check for exact matches first
  if (schemes[queryLower]) {
    return schemes[queryLower];
  }
  
  // Check for partial matches
  for (const [key, scheme] of Object.entries(schemes)) {
    if (key.includes(queryLower) || scheme.keywords.some(kw => queryLower.includes(kw))) {
      return scheme;
    }
  }
  
  return null;
}

// Main chatbot function
export function schemeGenieChatbot(userMessage) {
  if (!userMessage || typeof userMessage !== 'string') {
    return "I didn't catch that. Could you please rephrase your question?";
  }

  const message = userMessage.toLowerCase().trim();
  
  // Check if user is asking about a specific scheme
  for (const [schemeName, schemeData] of Object.entries(schemes)) {
    if (message.includes(schemeName) || schemeData.keywords.some(kw => message.includes(kw))) {
      return handleSchemeSpecificQuery(message, schemeData);
    }
  }

  // Handle general queries
  return handleGeneralQuery(message);
}

// Handle scheme-specific queries
function handleSchemeSpecificQuery(message, scheme) {
  // Check for specific questions about the scheme
  if (containsAny(message, ['what is', 'tell me about', 'explain'])) {
    return `${scheme.name}:\n\n${scheme.description}\n\nEligibility: ${scheme.eligibility.join('\n- ')}`;
  }
  
  if (containsAny(message, ['documents', 'papers', 'required', 'need'])) {
    return `📄 Documents required for ${scheme.name}:\n- ${scheme.documentsRequired.join('\n- ')}`;
  }
  
  if (containsAny(message, ['benefit', 'amount', 'money', 'subsidy', 'loan'])) {
    return `💰 Benefits of ${scheme.name}:\n- ${scheme.benefits.join('\n- ')}`;
  }
  
  if (containsAny(message, ['eligibility', 'who can apply', 'qualify', 'criteria'])) {
    return `✅ Eligibility for ${scheme.name}:\n- ${scheme.eligibility.join('\n- ')}`;
  }
  
  if (containsAny(message, ['how to apply', 'apply', 'registration', 'process'])) {
    return `📝 How to apply for ${scheme.name}:\n${scheme.howToApply}`;
  }
  
  if (containsAny(message, ['status', 'track', 'progress', 'application status'])) {
    return `🔍 To check your ${scheme.name} application status:\n1. Visit the official portal: ${scheme.officialLink}\n2. Enter your application/registration number\n3. Check the status of your application`;
  }
  
  // Default response for scheme
  return `Here's what I know about ${scheme.name}:\n\n${scheme.description}\n\nWould you like to know about:\n- Documents required\n- Benefits\n- Eligibility criteria\n- How to apply\n- Application status`;
}

// Handle general queries
function handleGeneralQuery(message) {
  // Greetings
  if (containsAny(message, ['hello', 'hi', 'hey', 'greetings'])) {
    return "Hello! 👋 I'm SchemeGenie — your AI Scheme Finder. How can I help you today?";
  }

  // Best scheme
  if (containsAny(message, ['best scheme', 'top scheme', 'trending scheme', 'popular scheme'])) {
    return "Here are some of the most popular government schemes right now:\n\n" +
      "1️⃣ PM Kisan Samman Nidhi - Financial support for farmers\n" +
      "2️⃣ PMEGP - Loans for entrepreneurs\n" +
      "3️⃣ PM Awas Yojana - Housing for all\n" +
      "4️⃣ StartUp India - Support for new businesses\n\n" +
      "You can ask me about any of these schemes for more details!";
  }

  // Documents required
  if (containsAny(message, ['document', 'required documents', 'papers needed'])) {
    return "📋 Most government schemes require these common documents:\n\n" +
      "• Aadhaar Card\n" +
      "• PAN Card\n" +
      "• Bank Account Details\n" +
      "• Address Proof\n" +
      "• Income Certificate\n" +
      "• Caste Certificate (if applicable)\n" +
      "• Recent Passport Size Photos\n\n" +
      "Would you like to know the specific documents needed for a particular scheme?";
  }

  // Duration / Processing Time
  if (containsAny(message, ['how long', 'duration', 'processing time', 'time taken'])) {
    return "⏳ Processing times vary by scheme:\n\n" +
      "• Loan-based schemes: 15-30 days\n" +
      "• Subsidy schemes: 30-60 days\n" +
      "• Housing schemes: 2-6 months\n\n" +
      "The exact duration depends on document verification and government processing times. " +
      "You can track your application status through the respective scheme's portal.";
  }

  // Thank you
  if (containsAny(message, ['thank', 'thanks', 'thank you'])) {
    return "You're welcome! 😊 Let me know if you need any more information about government schemes.";
  }

  // Default response
  return "I'm here to help you with information about government schemes. " +
    "You can ask me about:\n\n" +
    "• Specific scheme details\n" +
    "• Eligibility criteria\n" +
    "• Required documents\n" +
    "• How to apply\n" +
    "• Application status\n\n" +
    "For example, you could ask: 'What is PM Kisan?' or 'How to apply for PMEGP?'";
}

// Helper function to check if message contains any of the keywords
function containsAny(message, keywords) {
  return keywords.some(keyword => message.includes(keyword.toLowerCase()));
}

export default schemeGenieChatbot;
