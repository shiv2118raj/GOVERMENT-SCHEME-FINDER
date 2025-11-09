import express from "express";
import Application from "./models/application.js";
import User from "./models/user.js";

const router = express.Router();

// Simple demo chatbot without OpenAI dependency
router.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const language = req.body.language || 'en';
  const userId = req.body.userId; // Assuming userId is passed for personalized responses

  try {
    // Simple rule-based responses for demo
    let reply = "";

    // Check for application-related queries
    if (userMessage.toLowerCase().includes("application") || userMessage.toLowerCase().includes("my application") || userMessage.toLowerCase().includes("status")) {
      reply = await handleApplicationQuery(userMessage, userId);
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

// Function to handle application-related queries
async function handleApplicationQuery(message, userId) {
  try {
    if (!userId) {
      return "To check your application status, please log in first and provide your user ID.";
    }

    // Try to find user by email first, then get their applications
    const user = await User.findOne({ email: userId });
    if (!user) {
      return "User not found. Please make sure you're logged in properly.";
    }

    // Get user's applications using the user's _id
    const applications = await Application.find({ userId: user._id }).populate('schemeId').sort({ createdAt: -1 });

    if (applications.length === 0) {
      return "You haven't submitted any applications yet. Would you like help applying for a government scheme?";
    }

    if (message.toLowerCase().includes("all") || message.toLowerCase().includes("list")) {
      // Show all applications
      let response = "Here are your recent applications:\n\n";
      applications.slice(0, 5).forEach((app, index) => {
        const schemeName = app.schemeId?.name || 'Unknown Scheme';
        const status = app.status.charAt(0).toUpperCase() + app.status.slice(1);
        const date = app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Not submitted';
        response += `${index + 1}. **${schemeName}** - Status: ${status} (${date})\n`;
      });

      if (applications.length > 5) {
        response += `\n... and ${applications.length - 5} more applications.`;
      }

      return response;
    } else {
      // Show latest application status
      const latestApp = applications[0];
      const schemeName = latestApp.schemeId?.name || 'Unknown Scheme';
      const status = latestApp.status.charAt(0).toUpperCase() + latestApp.status.slice(1);

      let statusMessage = `Your latest application for **${schemeName}** is currently **${status}**.`;

      switch (latestApp.status) {
        case 'draft':
          statusMessage += "\n\n💡 Your application is still in draft mode. Please complete and submit it to proceed.";
          break;
        case 'submitted':
          statusMessage += "\n\n⏳ Your application has been submitted and is waiting for review.";
          break;
        case 'under_review':
          statusMessage += "\n\n🔍 Your application is currently under review by the authorities.";
          break;
        case 'approved':
          statusMessage += "\n\n✅ Congratulations! Your application has been approved!";
          break;
        case 'rejected':
          statusMessage += "\n\n❌ Your application was rejected.";
          if (latestApp.remarks) {
            statusMessage += ` Reason: ${latestApp.remarks}`;
          }
          break;
        case 'completed':
          statusMessage += "\n\n🎉 Your application process has been completed!";
          break;
      }

      if (latestApp.submittedAt) {
        statusMessage += `\n\n📅 Submitted on: ${new Date(latestApp.submittedAt).toLocaleDateString()}`;
      }

      return statusMessage;
    }
  } catch (error) {
    console.error("Error handling application query:", error);
    return "I'm having trouble accessing your application information right now. Please try again later or contact support.";
  }
}

export default router;