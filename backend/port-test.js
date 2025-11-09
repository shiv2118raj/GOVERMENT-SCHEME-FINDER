import express from "express";

const app = express();
const PORT = 5003; // Try different port

app.get("/", (req, res) => {
  res.json({ message: "Port test server is working!", port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Port test server running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log("Server should stay running...");
});
