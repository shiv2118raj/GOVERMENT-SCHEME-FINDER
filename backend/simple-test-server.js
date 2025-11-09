#!/usr/bin/env node

/**
 * Simple server test to check if basic functionality works
 */

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({
    status: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// Start server on different port to avoid conflicts
const PORT = 5003;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}/test`);
});

export default app;
