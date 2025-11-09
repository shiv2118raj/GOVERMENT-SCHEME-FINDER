import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🔍 Initializing OCR service...');
      this.worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      await this.worker.load();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
        this.isInitialized = true;
        console.log('✅ OCR service initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize OCR service:', error);
        throw error;
      }
    }

  async processDocument(filePath, documentType) {
    if (!this.isInitialized) {
      await this.initialize();
  }

    try {
      console.log(`🔍 Processing ${documentType} document: ${filePath}`);

      const { data: { text, confidence } } = await this.worker.recognize(filePath);
      
      const extractedData = this.extractDocumentData(text, documentType);

      console.log(`✅ OCR processing completed. Confidence: ${confidence}%`);

      return {
        extractedText: text,
        confidence: confidence,
        processedAt: new Date(),
        isProcessed: true,
        extractedData
      };
    } catch (error) {
      console.error('❌ OCR processing failed:', error);
      throw error;
    }
  }

  extractDocumentData(text, documentType) {
    const data = {
      documentNumber: '',
      issueDate: null,
      expiryDate: null,
      issuingAuthority: '',
      name: '',
      fatherName: '',
      address: '',
      dob: null
    };

    // Common patterns for different document types
    const patterns = {
      'Aadhaar Card': {
        documentNumber: /(\d{4}\s?\d{4}\s?\d{4})/g,
        name: /Name[:\s]+([A-Za-z\s]+)/i,
        fatherName: /Father[:\s]+([A-Za-z\s]+)/i,
        dob: /DOB[:\s]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
        address: /Address[:\s]+([A-Za-z0-9\s,.-]+)/i
      },
      'PAN Card': {
        documentNumber: /([A-Z]{5}[0-9]{4}[A-Z]{1})/g,
        name: /Name[:\s]+([A-Za-z\s]+)/i,
        fatherName: /Father[:\s]+([A-Za-z\s]+)/i,
        dob: /DOB[:\s]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i
      },
      'Income Proof': {
        documentNumber: /(Salary|Income|Certificate)[:\s]+([A-Za-z0-9\s]+)/i,
        issuingAuthority: /(Issued by|Authority)[:\s]+([A-Za-z\s]+)/i,
        issueDate: /(Date|Issued)[:\s]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i
      },
      'Caste Certificate': {
        documentNumber: /(Certificate|No)[:\s]+([A-Za-z0-9\s]+)/i,
        issuingAuthority: /(Issued by|Authority)[:\s]+([A-Za-z\s]+)/i,
        issueDate: /(Date|Issued)[:\s]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i
      },
      'Residence Certificate': {
        documentNumber: /(Certificate|No)[:\s]+([A-Za-z0-9\s]+)/i,
        issuingAuthority: /(Issued by|Authority)[:\s]+([A-Za-z\s]+)/i,
        issueDate: /(Date|Issued)[:\s]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i
      },
      'Ration Card': {
        documentNumber: /(Card|No)[:\s]+([A-Za-z0-9\s]+)/i,
        name: /Name[:\s]+([A-Za-z\s]+)/i,
        address: /Address[:\s]+([A-Za-z0-9\s,.-]+)/i
      }
    };

    const documentPatterns = patterns[documentType] || patterns['Aadhaar Card'];

    // Extract document number
    const docNumberMatch = text.match(documentPatterns.documentNumber);
    if (docNumberMatch) {
      data.documentNumber = docNumberMatch[1] || docNumberMatch[0];
    }

    // Extract name
    const nameMatch = text.match(documentPatterns.name);
    if (nameMatch) {
      data.name = nameMatch[1].trim();
    }

    // Extract father's name
    const fatherMatch = text.match(documentPatterns.fatherName);
    if (fatherMatch) {
      data.fatherName = fatherMatch[1].trim();
    }

    // Extract DOB
    const dobMatch = text.match(documentPatterns.dob);
    if (dobMatch) {
      const dobStr = dobMatch[1];
      data.dob = new Date(dobStr);
    }

    // Extract address
    const addressMatch = text.match(documentPatterns.address);
    if (addressMatch) {
      data.address = addressMatch[1].trim();
    }

    // Extract issuing authority
    const authorityMatch = text.match(documentPatterns.issuingAuthority);
    if (authorityMatch) {
      data.issuingAuthority = authorityMatch[1].trim();
    }

    // Extract issue date
    const issueDateMatch = text.match(documentPatterns.issueDate);
    if (issueDateMatch) {
      const dateStr = issueDateMatch[1];
      data.issueDate = new Date(dateStr);
    }

    return data;
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      console.log('🔍 OCR service terminated');
    }
  }
}

export default new OCRService();