// --- 1. Bring in required libraries ---
import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config"; // this loads your .env file automatically

// --- 2. Initialize app ---
const app = express();
app.use(cors());
app.use(express.json());

// --- 3. Create an API endpoint the frontend will call ---
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message; // message from the user

  try {
    // --- 4. Make a call to your API provider using your saved API key ---
    const response = await axios.post(
      "https://example.googleapis.com/chat", // fake URL just for example
      { query: userMessage },
      {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,  // use your key safely here
        },
      }
    );

    // --- 5. Send the API’s reply back to the React app ---
    res.json({ reply: response.data.reply });
  } catch (error) {
    console.error("API error:", error.message);
    res.status(500).json({ reply: "Something went wrong on the server." });
  }
});

// --- 6. Start the server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));