const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Scheme Schema
const schemeSchema = new mongoose.Schema({
  State: String,
  Scheme_Name: String,
  Description: String,
  Department: String,
  Search_Terms: String,
  Official_Portal_URL: String,
});

const Scheme = mongoose.model('Scheme', schemeSchema);

// API Routes
app.use(cors());
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// eslint-disable-next-line no-undef
const response = await axios.post("http://localhost:5001/chat", { message: userInput });
// eslint-disable-next-line no-undef
setMessages(prev => [...prev, { sender: "bot", text: response.data.reply }]);