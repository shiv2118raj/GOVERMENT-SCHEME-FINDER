import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simple demo chatbot without OpenAI dependency
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const language = req.body.language || 'en';

  try {
    // Simple rule-based responses for demo
    let reply = "";

    // Check for application-related queries
    if (userMessage.toLowerCase().includes("application") || userMessage.toLowerCase().includes("my application") || userMessage.toLowerCase().includes("status")) {
      reply = "I can help you check your application status! However, you'll need to be logged in to view your personal application details. For now, here are some general tips:\n\n• **Submitted applications** are usually reviewed within 15-30 days\n• **Draft applications** need to be completed and submitted\n• **Approved applications** will show disbursement status\n\nWould you like help applying for a new scheme instead?";
    } else if (userMessage.toLowerCase().includes("scheme") || userMessage.toLowerCase().includes("government")) {
      reply = "I can help you find government schemes! Here are some popular ones:\n\n• **PM Kisan** - Financial assistance for farmers\n• **Ayushman Bharat** - Health insurance for families\n• **PM Awas Yojana** - Housing for all\n• **Mudra Loan** - Business loans up to ₹10 lakhs\n\nWould you like more details about any specific scheme?";
    } else if (userMessage.toLowerCase().includes("farmer") || userMessage.toLowerCase().includes("kisan")) {
      reply = "For farmers, I recommend:\n\n• **PM Kisan Samman Nidhi** - ₹6,000 annual income support\n• **Kisan Credit Card** - Easy agricultural loans\n• **PM Fasal Bima Yojana** - Crop insurance\n\nEligibility: Small and marginal farmers with land records.";
    } else if (userMessage.toLowerCase().includes("health") || userMessage.toLowerCase().includes("medical")) {
      reply = "For healthcare, consider:\n\n• **Ayushman Bharat** - Health coverage up to ₹5 lakhs per family\n• **PM Jan Arogya Yojana** - Cashless treatment\n• **Rashtriya Swasthya Bima Yojana** - Health insurance for BPL families\n\nCovers hospitalization, surgery, and medicines.";
    } else if (userMessage.toLowerCase().includes("education") || userMessage.toLowerCase().includes("study")) {
      reply = "For education, check:\n\n• **National Scholarship Portal** - Various scholarships\n• **Post Matric Scholarship** - For SC/ST/OBC students\n• **Pragati Scholarship** - For girl students in technical education\n• **Saksham Scholarship** - For specially-abled students\n\nApply through the National Scholarship Portal.";
    } else if (userMessage.toLowerCase().includes("housing") || userMessage.toLowerCase().includes("home")) {
      reply = "For housing assistance:\n\n• **PM Awas Yojana** - Affordable housing for all\n• **Rural Housing Scheme** - Houses for rural poor\n• **Urban Housing Scheme** - Housing in urban areas\n\nFinancial assistance up to ₹2.5 lakhs for house construction.";
    } else if (userMessage.toLowerCase().includes("pension") || userMessage.toLowerCase().includes("old age")) {
      reply = "For senior citizens:\n\n• **National Old Age Pension** - Monthly pension for elderly\n• **Widow Pension Scheme** - Support for widows\n• **Disability Pension** - For disabled persons\n\nMonthly assistance from ₹200-₹500 depending on state.";
    } else {
      reply = "I'm Scheme Genie, your government schemes assistant! I can help you with:\n\n• Agricultural schemes (PM Kisan, Crop Insurance)\n• Healthcare schemes (Ayushman Bharat)\n• Educational scholarships\n• Housing assistance (PM Awas Yojana)\n• Pension schemes for elderly\n• Business loans (Mudra Yojana)\n• **Check your application status**\n\nWhat type of scheme are you interested in?";
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat service unavailable" });
  }
});

app.get("/", (req, res) => {
  res.send("Scheme Genie Backend is running!");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Simple demo admin login
  if (email === 'kishu@gmail.com' && password === '123') {
    return res.json({
      msg: "Login success ✅",
      token: "demo_token_12345",
      role: "admin"
    });
  }

  // Default user login
  res.json({
    msg: "Login success ✅",
    token: "demo_token_12345",
    role: "user"
  });
});

// Schemes endpoint
app.get("/api/schemes", (req, res) => {
  res.json(sampleSchemes);
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🚀 Scheme Genie Auth Server running on port ${PORT}`);
});
