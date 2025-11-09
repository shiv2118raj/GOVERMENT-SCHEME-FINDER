import axios from 'axios';

export const schemeGenieChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase().trim();
    let response = "I'm not sure about that. Could you please specify which scheme you're referring to?";

    // Fetch all schemes from your backend
    const { data: schemes } = await axios.get("http://localhost:5002/api/schemes");
    const matchedScheme = schemes.find(s => 
      s.name && msg.includes(s.name.toLowerCase())
    );

    if (matchedScheme) {
      // If user message includes a scheme name
      if (msg.includes("document") || msg.includes("required")) {
        response = `For the ${matchedScheme.name}, the required documents are: ${Array.isArray(matchedScheme.documents) ? matchedScheme.documents.join(", ") : matchedScheme.documents}.`;
      } 
      else if (msg.includes("benefit") || msg.includes("amount")) {
        response = `The ${matchedScheme.name} provides benefits like ${matchedScheme.benefits}.`;
      } 
      else if (msg.includes("eligibility") || msg.includes("criteria")) {
        response = `Eligibility for ${matchedScheme.name}: ${matchedScheme.eligibility}.`;
      } 
      else if (msg.includes("apply") || msg.includes("register")) {
        response = `You can apply for ${matchedScheme.name} at ${matchedScheme.applicationLink || 'the official scheme website'} or directly through SchemeSeva.`;
      } 
      else if (msg.includes("how long") || msg.includes("days") || msg.includes("time")) {
        response = `It usually takes around ${matchedScheme.duration || "15–45 days"} to get benefits under ${matchedScheme.name}.`;
      } 
      else {
        response = `Here's what I found about ${matchedScheme.name}:\n📋 Eligibility: ${matchedScheme.eligibility}\n🪪 Documents: ${Array.isArray(matchedScheme.documents) ? matchedScheme.documents.join(", ") : matchedScheme.documents}\n💰 Benefits: ${matchedScheme.benefits}\n⏳ Duration: ${matchedScheme.duration || "15–45 days"}`;
      }
    }
    // No specific scheme name found
    else if (msg.includes("best scheme") || msg.includes("top scheme") || msg.includes("popular scheme")) {
      const topSchemes = schemes.slice(0, 3).map(s => s.name).join(", ");
      response = `The most popular schemes right now are: ${topSchemes}. Which one would you like to know more about?`;
    } 
    else if (msg.includes("scheme")) {
      response = `We have several schemes you might be interested in: ${schemes.map(s => s.name).join(", ")}.\nPlease type the name of the scheme for more details.`;
    }

    res.status(200).json({ response });
  } catch (err) {
    console.error("Chatbot API Error:", err.message);
    res.status(500).json({ 
      response: "Sorry, I couldn't connect to the SchemeSeva database right now. Please try again later." 
    });
  }
};

export default {
  schemeGenieChatbot
};
