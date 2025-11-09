#!/usr/bin/env node

/**
 * Automated Backend Startup Script
 * Starts the backend server with full automation enabled
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting SchemeSeva Backend with Full Automation...');
console.log('📋 This will start:');
console.log('   • Main API Server (port 5002)');
console.log('   • Automation Service (background processing)');
console.log('   • Health Monitoring');
console.log('   • Auto-restart on failures');
console.log('');

const backendProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  detached: false
});

backendProcess.on('error', (error) => {
  console.error('❌ Failed to start backend:', error);
  process.exit(1);
});

backendProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Backend shutdown gracefully');
  } else {
    console.log(`❌ Backend exited with code ${code}`);
  }
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down backend...');
  backendProcess.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down backend...');
  backendProcess.kill('SIGTERM');
});

console.log('🎯 Backend is running! Visit http://localhost:5002 to access the API');
console.log('🔍 Health check available at: http://localhost:5002/health');
console.log('📊 Automation stats at: http://localhost:5002/api/automation/stats');
console.log('🛠️ Admin dashboard at: http://localhost:3000/admin');
console.log('');
console.log('Press Ctrl+C to stop the server gracefully.');
