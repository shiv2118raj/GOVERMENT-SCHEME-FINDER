#!/usr/bin/env node

/**
 * PDF Generation Service
 * Generates PDF documents from application data and HTML templates
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFService {
  constructor() {
    this.browser = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (!this.isInitialized) {
      try {
        console.log('📄 Initializing PDF service...');
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        });
        this.isInitialized = true;
        console.log('✅ PDF service initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize PDF service:', error);
        throw error;
      }
    }
  }

  async generateApplicationPDF(applicationData) {
    await this.initialize();

    try {
      console.log(`📄 Generating PDF for application: ${applicationData.trackingId}`);

      const page = await this.browser.newPage();

      // Set viewport for consistent PDF size
      await page.setViewport({ width: 1200, height: 800 });

      // Generate HTML content for the PDF
      const htmlContent = this.generateApplicationHTML(applicationData);

      // Set HTML content
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      // Wait for any dynamic content to load
      await page.waitForTimeout(1000);

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await page.close();

      console.log(`✅ PDF generated successfully for application: ${applicationData.trackingId}`);
      return pdfBuffer;

    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      throw error;
    }
  }

  generateApplicationHTML(applicationData) {
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getStatusColor = (status) => {
      const colors = {
        'submitted': '#ffa500',
        'under_review': '#007bff',
        'approved': '#28a745',
        'rejected': '#dc3545',
        'requires_resubmission': '#ffc107'
      };
      return colors[status] || '#6c757d';
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Summary - ${applicationData.trackingId}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
          }
          .tracking-id {
            font-size: 1.2rem;
            margin-top: 10px;
            opacity: 0.9;
          }
          .application-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            overflow: hidden;
          }
          .card-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #dee2e6;
          }
          .card-header h3 {
            margin: 0;
            color: #495057;
            font-size: 1.1rem;
          }
          .card-body {
            padding: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 15px;
          }
          .status-submitted { background: #fff3cd; color: #856404; }
          .status-under_review { background: #cce7ff; color: #004085; }
          .status-approved { background: #d4edda; color: #155724; }
          .status-rejected { background: #f8d7da; color: #721c24; }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .info-item strong {
            display: block;
            color: #495057;
            margin-bottom: 5px;
            font-size: 0.9rem;
          }
          .info-item span {
            color: #6c757d;
            font-size: 1rem;
          }
          .scheme-details {
            background: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .scheme-details h4 {
            margin-top: 0;
            color: #495057;
          }
          .timeline {
            position: relative;
            padding-left: 30px;
          }
          .timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #dee2e6;
          }
          .timeline-item {
            position: relative;
            margin-bottom: 20px;
            padding-left: 20px;
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: -23px;
            top: 5px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #667eea;
            border: 3px solid white;
          }
          .timeline-content h5 {
            margin: 0 0 5px 0;
            color: #495057;
          }
          .timeline-content p {
            margin: 0;
            color: #6c757d;
            font-size: 0.9rem;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 0.8rem;
          }
          @media print {
            body { background: white; }
            .header { background: #333 !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏛️ SchemeSeva</h1>
          <p>Government Scheme Application Portal</p>
          <div class="tracking-id">Application Tracking ID: ${applicationData.trackingId}</div>
        </div>

        <div class="application-card">
          <div class="card-header">
            <h3>📋 Application Summary</h3>
          </div>
          <div class="card-body">
            <div class="status-badge status-${applicationData.status}">
              Status: ${applicationData.status.replace('_', ' ').toUpperCase()}
            </div>

            <div class="info-grid">
              <div class="info-item">
                <strong>Scheme Name</strong>
                <span>${applicationData.schemeId?.name || 'N/A'}</span>
              </div>
              <div class="info-item">
                <strong>Scheme Category</strong>
                <span>${applicationData.schemeId?.category || 'N/A'}</span>
              </div>
              <div class="info-item">
                <strong>Application Date</strong>
                <span>${formatDate(applicationData.createdAt)}</span>
              </div>
              <div class="info-item">
                <strong>Estimated Approval</strong>
                <span>${applicationData.estimatedApprovalDays || 30} days</span>
              </div>
            </div>

            ${applicationData.schemeId?.description ? `
              <div class="scheme-details">
                <h4>Scheme Description</h4>
                <p>${applicationData.schemeId.description}</p>
              </div>
            ` : ''}

            ${applicationData.rejectionReason ? `
              <div class="info-item" style="background: #f8d7da; border-left-color: #dc3545;">
                <strong>Rejection Reason</strong>
                <span>${applicationData.rejectionReason}</span>
              </div>
            ` : ''}

            ${applicationData.adminRemarks ? `
              <div class="info-item" style="background: #fff3cd; border-left-color: #ffc107;">
                <strong>Admin Remarks</strong>
                <span>${applicationData.adminRemarks}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="application-card">
          <div class="card-header">
            <h3>📅 Application Timeline</h3>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-content">
                  <h5>Application Created</h5>
                  <p>${formatDate(applicationData.createdAt)}</p>
                </div>
              </div>

              ${applicationData.submittedAt ? `
                <div class="timeline-item">
                  <div class="timeline-content">
                    <h5>Application Submitted</h5>
                    <p>${formatDate(applicationData.submittedAt)}</p>
                  </div>
                </div>
              ` : ''}

              ${applicationData.reviewedAt ? `
                <div class="timeline-item">
                  <div class="timeline-content">
                    <h5>Under Review</h5>
                    <p>${formatDate(applicationData.reviewedAt)}</p>
                  </div>
                </div>
              ` : ''}

              ${applicationData.completedAt ? `
                <div class="timeline-item">
                  <div class="timeline-content">
                    <h5>${applicationData.status === 'approved' ? 'Approved' : 'Completed'}</h5>
                    <p>${formatDate(applicationData.completedAt)}</p>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This document was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>SchemeSeva - Government Scheme Application Portal</p>
        </div>
      </body>
      </html>
    `;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.isInitialized = false;
      console.log('🧹 PDF service cleaned up');
    }
  }
}

// Export for use in other modules
export default PDFService;

// For testing PDF service independently
if (import.meta.url === `file://${process.argv[1]}`) {
  const pdf = new PDFService();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down PDF service...');
    await pdf.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down...');
    await pdf.cleanup();
    process.exit(0);
  });

  console.log('📄 PDF Service ready for testing');
  console.log('💡 Usage: generateApplicationPDF(applicationData)');
}
