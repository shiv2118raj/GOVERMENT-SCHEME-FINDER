#!/usr/bin/env node

/**
 * Enhanced Backend Health Monitor with Automation Service Support
 * Monitors the backend server and restarts it if it goes down
 * Also monitors automation service health
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const BACKEND_URL = 'http://localhost:5002/health';
const AUTOMATION_URL = 'http://localhost:5002/api/automation/stats';
const CHECK_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

let retryCount = 0;
let backendProcess = null;
let automationStats = null;

function checkBackendHealth() {
  const req = http.get(BACKEND_URL, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const health = JSON.parse(data);
        console.log(`✅ Backend healthy - Status: ${health.status}, Uptime: ${Math.floor(health.uptime)}s`);
        retryCount = 0; // Reset retry count on successful check

        // Check automation stats if available
        checkAutomationStats();
      } catch (error) {
        console.error('❌ Failed to parse health response:', error.message);
        handleBackendFailure();
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Backend health check failed:', error.message);
    handleBackendFailure();
  });

  req.setTimeout(5000, () => {
    console.error('❌ Backend health check timed out');
    req.destroy();
    handleBackendFailure();
  });
}

function checkAutomationStats() {
  const req = http.get(AUTOMATION_URL, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const stats = JSON.parse(data);
        automationStats = stats;

        console.log(`🤖 Automation Stats: ${stats.applicationsProcessed} apps processed, ${stats.documentsVerified} docs verified, ${stats.notificationsSent} notifications sent`);

        if (stats.errors > 0) {
          console.warn(`⚠️ Automation errors detected: ${stats.errors} errors`);
        }
      } catch (error) {
        console.log('ℹ️ Automation stats not available (service may not be running)');
      }
    });
  });

  req.on('error', () => {
    console.log('ℹ️ Automation stats endpoint not available');
  });

  req.setTimeout(2000, () => req.destroy());
}

function handleBackendFailure() {
  retryCount++;

  if (retryCount >= MAX_RETRIES) {
    console.log(`🔄 Restarting backend (attempt ${retryCount})...`);

    if (backendProcess) {
      backendProcess.kill('SIGTERM');
    }

    startBackend();
    retryCount = 0;
  } else {
    console.log(`⚠️ Backend check failed (${retryCount}/${MAX_RETRIES}), will retry...`);
  }
}

function startBackend() {
  console.log('🚀 Starting backend server...');

  backendProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    detached: true
  });

  backendProcess.on('error', (error) => {
    console.error('❌ Failed to start backend:', error);
  });

  backendProcess.on('exit', (code) => {
    console.log(`🛑 Backend process exited with code ${code}`);
    if (code !== 0) {
      handleBackendFailure();
    }
  });

  // Unref so the parent process can exit
  backendProcess.unref();
}

console.log('🔍 Starting enhanced backend health monitor...');
console.log(`📊 Health check interval: ${CHECK_INTERVAL / 1000} seconds`);
console.log(`🔄 Max retries: ${MAX_RETRIES}`);
console.log(`🌐 Monitoring: ${BACKEND_URL}`);
console.log(`🤖 Also monitoring automation service`);

// Start initial backend
startBackend();

// Set up periodic health checks
setInterval(checkBackendHealth, CHECK_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down health monitor...');

  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }

  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down...');

  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }

  process.exit(0);
});
