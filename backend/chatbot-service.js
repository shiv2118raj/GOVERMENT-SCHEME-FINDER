#!/usr/bin/env node

/**
 * Interactive Chatbot Service with Form Auto-Fill
 * Handles conversational form filling and AI-powered document processing
 */

import "dotenv/config";
import Scheme from "./models/scheme.js";
import OCRService from "./ocr-service.js";

class ChatbotService {
  constructor() {
    this.conversationStates = new Map(); // userID -> conversation state
    this.formFields = new Map(); // userID -> form data
    this.ocrService = null; // Initialize lazily
  }

  // Get OCR service instance (lazy initialization)
  getOCRService() {
    if (!this.ocrService) {
      this.ocrService = new OCRService();
    }
    return this.ocrService;
  }

  // Initialize conversation for a user
  initializeConversation(userId) {
    const conversationState = {
      step: 'welcome',
      currentForm: null,
      collectedData: {},
      pendingQuestions: [],
      currentQuestionIndex: 0,
      isFormFilling: false,
      documentProcessing: false
    };

    this.conversationStates.set(userId, conversationState);
    return conversationState;
  }

  // Get or create conversation state for user
  getConversationState(userId) {
    if (!this.conversationStates.has(userId)) {
      return this.initializeConversation(userId);
    }
    return this.conversationStates.get(userId);
  }

  // Process user message and generate response
  async processMessage(userId, message, userData = {}) {
    const state = this.getConversationState(userId);
    
    try {
      // Handle different conversation states
      switch (state.step) {
        case 'welcome':
          return await this.handleWelcome(userId, message, state);
        
        case 'form_filling':
          return await this.handleFormFilling(userId, message, state);
        
        case 'document_processing':
          return await this.handleDocumentProcessing(userId, message, state);
        
        case 'scheme_search':
          return await this.handleSchemeSearch(userId, message, state);
        
        case 'application_assistance':
          return await this.handleApplicationAssistance(userId, message, state);
        
        default:
          return await this.handleGeneralQuery(userId, message, state);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        type: 'error',
        message: 'Sorry, I encountered an error. Please try again.',
        suggestions: ['Start over', 'Help']
      };
    }
  }

  // Welcome conversation
  async handleWelcome(userId, message, state) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('form') || lowerMessage.includes('apply') || lowerMessage.includes('scheme')) {
      state.step = 'form_filling';
      state.isFormFilling = true;
      
      return {
        type: 'form_start',
        message: 'Great! I\'ll help you fill out a scheme application form. Let\'s start with some basic information.',
        questions: this.getInitialQuestions(),
        currentQuestion: this.getInitialQuestions()[0],
        formData: {}
      };
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('upload') || lowerMessage.includes('scan')) {
      state.step = 'document_processing';
      state.documentProcessing = true;
      
      return {
        type: 'document_processing',
        message: 'I can help you extract information from documents to auto-fill forms. Please upload a document (Aadhaar, PAN, Income Certificate, etc.)',
        supportedDocuments: ['Aadhaar Card', 'PAN Card', 'Income Certificate', 'Caste Certificate', 'Education Certificate'],
        suggestions: ['Upload Aadhaar', 'Upload PAN', 'Upload Income Certificate', 'Back to main menu']
      };
    }
    
    // Default welcome response
    return {
      type: 'welcome',
      message: 'Hello! I\'m your SchemeSeva assistant. I can help you with:',
      options: [
        { label: 'Fill Application Form', action: 'start_form_filling', icon: '📝' },
        { label: 'Process Documents', action: 'start_document_processing', icon: '📄' },
        { label: 'Search Schemes', action: 'search_schemes', icon: '🔍' },
        { label: 'Application Help', action: 'application_help', icon: '❓' }
      ],
      suggestions: ['Fill form', 'Upload document', 'Search schemes', 'Help']
    };
  }

  // Form filling conversation
  async handleFormFilling(userId, message, state) {
    const currentQuestion = state.pendingQuestions[state.currentQuestionIndex];
    
    if (!currentQuestion) {
      // No more questions, process the form
      return await this.processCompletedForm(userId, state);
    }
    
    // Validate and store the answer
    const validation = this.validateAnswer(message, currentQuestion);
    
    if (!validation.isValid) {
      return {
        type: 'validation_error',
        message: validation.message,
        currentQuestion: currentQuestion,
        suggestions: currentQuestion.suggestions || []
      };
    }
    
    // Store the answer
    state.collectedData[currentQuestion.field] = validation.value;
    
    // Move to next question
    state.currentQuestionIndex++;
    
    if (state.currentQuestionIndex < state.pendingQuestions.length) {
      const nextQuestion = state.pendingQuestions[state.currentQuestionIndex];
      return {
        type: 'next_question',
        message: `Great! ${currentQuestion.label}: ${validation.value}`,
        currentQuestion: nextQuestion,
        progress: Math.round((state.currentQuestionIndex / state.pendingQuestions.length) * 100),
        formData: state.collectedData
      };
    } else {
      // All questions answered
      return await this.processCompletedForm(userId, state);
    }
  }

  // Document processing conversation
  async handleDocumentProcessing(userId, message, state) {
    // This would integrate with the OCR service
    // For now, return a mock response
    return {
      type: 'document_processing',
      message: 'Document processing functionality will be integrated with the OCR service. Please upload a document to extract information.',
      suggestions: ['Upload Aadhaar', 'Upload PAN', 'Back to main menu']
    };
  }

  // Get initial questions for form filling
  getInitialQuestions() {
    return [
      {
        field: 'name',
        label: 'What is your full name?',
        type: 'text',
        required: true,
        validation: 'name'
      },
      {
        field: 'age',
        label: 'What is your age?',
        type: 'number',
        required: true,
        validation: 'age'
      },
      {
        field: 'gender',
        label: 'What is your gender?',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Other'],
        suggestions: ['Male', 'Female', 'Other']
      },
      {
        field: 'category',
        label: 'What is your category/caste?',
        type: 'select',
        required: true,
        options: ['General', 'OBC', 'SC', 'ST'],
        suggestions: ['General', 'OBC', 'SC', 'ST']
      },
      {
        field: 'income',
        label: 'What is your annual income? (in rupees)',
        type: 'number',
        required: true,
        validation: 'income'
      },
      {
        field: 'state',
        label: 'Which state do you live in?',
        type: 'text',
        required: true,
        validation: 'state'
      },
      {
        field: 'education',
        label: 'What is your highest education level?',
        type: 'select',
        required: true,
        options: ['Below 10th', '10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'PhD'],
        suggestions: ['Below 10th', '10th Pass', '12th Pass', 'Graduate', 'Post Graduate']
      },
      {
        field: 'employment',
        label: 'What is your employment status?',
        type: 'select',
        required: true,
        options: ['Unemployed', 'Student', 'Employed', 'Self-employed', 'Retired'],
        suggestions: ['Unemployed', 'Student', 'Employed', 'Self-employed', 'Retired']
      }
    ];
  }

  // Validate user answer
  validateAnswer(answer, question) {
    switch (question.validation) {
      case 'name':
        if (answer.length < 2) {
          return { isValid: false, message: 'Please enter a valid name (at least 2 characters)' };
        }
        return { isValid: true, value: answer.trim() };
      
      case 'age':
        const age = parseInt(answer);
        if (isNaN(age) || age < 0 || age > 120) {
          return { isValid: false, message: 'Please enter a valid age (0-120)' };
        }
        return { isValid: true, value: age };
      
      case 'income':
        const income = parseInt(answer.replace(/[,\s]/g, ''));
        if (isNaN(income) || income < 0) {
          return { isValid: false, message: 'Please enter a valid income amount' };
        }
        return { isValid: true, value: income };
      
      case 'state':
        if (answer.length < 2) {
          return { isValid: false, message: 'Please enter a valid state name' };
        }
        return { isValid: true, value: answer.trim() };
      
      default:
        // For select fields
        if (question.options && question.options.includes(answer)) {
          return { isValid: true, value: answer };
        }
        return { isValid: false, message: `Please select from: ${question.options.join(', ')}` };
    }
  }

  // Process completed form and suggest schemes
  async processCompletedForm(userId, state) {
    try {
      // Find eligible schemes based on collected data
      const eligibleSchemes = await this.findEligibleSchemes(state.collectedData);
      
      state.step = 'scheme_selection';
      state.eligibleSchemes = eligibleSchemes;
      
      return {
        type: 'form_completed',
        message: 'Perfect! I\'ve collected all your information. Here are the schemes you\'re eligible for:',
        formData: state.collectedData,
        eligibleSchemes: eligibleSchemes.slice(0, 5), // Show top 5
        suggestions: ['Apply to scheme', 'View all schemes', 'Modify information', 'Start over']
      };
    } catch (error) {
      console.error('Error processing form:', error);
      return {
        type: 'error',
        message: 'Sorry, I couldn\'t process your form. Please try again.',
        suggestions: ['Start over', 'Help']
      };
    }
  }

  // Find eligible schemes based on user data
  async findEligibleSchemes(userData) {
    try {
      const schemes = await Scheme.find({ isActive: true });
      
      const eligibleSchemes = schemes.filter(scheme => {
        // Check age eligibility
        if (scheme.eligibility?.age && userData.age) {
          const minAge = scheme.eligibility.age.min || 0;
          const maxAge = scheme.eligibility.age.max || 999;
          if (userData.age < minAge || userData.age > maxAge) return false;
        }
        
        // Check income eligibility
        if (scheme.eligibility?.income && userData.income) {
          const schemeIncome = parseInt(scheme.eligibility.income.replace(/[^0-9]/g, ''));
          if (userData.income > schemeIncome) return false;
        }
        
        // Check category eligibility
        if (scheme.eligibility?.caste && userData.category) {
          const schemeCategories = scheme.eligibility.caste;
          if (schemeCategories.length > 0 && !schemeCategories.includes('All') && !schemeCategories.includes(userData.category)) {
            return false;
          }
        }
        
        // Check gender eligibility
        if (scheme.eligibility?.gender && userData.gender) {
          if (scheme.eligibility.gender !== 'All' && scheme.eligibility.gender !== userData.gender) {
            return false;
          }
        }
        
        return true;
      });
      
      // Sort by relevance (you can implement more sophisticated scoring)
      return eligibleSchemes.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error finding eligible schemes:', error);
      return [];
    }
  }

  // Process document and extract form data
  async processDocumentForFormFilling(filePath, documentType, userId) {
    try {
      const state = this.getConversationState(userId);
      
      // Use OCR service to extract data
      const ocrResult = await this.getOCRService().processDocument(filePath, documentType);
      
      if (!ocrResult.success) {
        return {
          type: 'document_error',
          message: 'Sorry, I couldn\'t process your document. Please try uploading a clearer image.',
          suggestions: ['Try again', 'Upload different document', 'Fill form manually']
        };
      }
      
      // Map extracted data to form fields
      const extractedData = this.mapDocumentDataToForm(ocrResult.extractedData, documentType);
      
      // Update conversation state with extracted data
      state.collectedData = { ...state.collectedData, ...extractedData };
      state.documentProcessed = true;
      
      return {
        type: 'document_processed',
        message: 'Great! I\'ve extracted information from your document. Here\'s what I found:',
        extractedData: extractedData,
        confidence: ocrResult.confidence,
        suggestions: ['Continue with form', 'Correct information', 'Upload another document']
      };
    } catch (error) {
      console.error('Error processing document:', error);
      return {
        type: 'document_error',
        message: 'Sorry, I encountered an error processing your document.',
        suggestions: ['Try again', 'Fill form manually']
      };
    }
  }

  // Map document data to form fields
  mapDocumentDataToForm(extractedData, documentType) {
    const formData = {};
    
    switch (documentType.toLowerCase()) {
      case 'aadhaar':
        if (extractedData.name) formData.name = extractedData.name;
        if (extractedData.dateOfBirth) {
          formData.age = this.calculateAge(extractedData.dateOfBirth);
        }
        if (extractedData.gender) formData.gender = extractedData.gender;
        break;
      
      case 'pan':
        if (extractedData.name) formData.name = extractedData.name;
        if (extractedData.dateOfBirth) {
          formData.age = this.calculateAge(extractedData.dateOfBirth);
        }
        break;
      
      case 'income':
        if (extractedData.name) formData.name = extractedData.name;
        if (extractedData.annualIncome) formData.income = extractedData.annualIncome;
        break;
      
      case 'caste':
        if (extractedData.name) formData.name = extractedData.name;
        if (extractedData.caste) formData.category = this.mapCasteToCategory(extractedData.caste);
        break;
    }
    
    return formData;
  }

  // Calculate age from date of birth
  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Map caste to category
  mapCasteToCategory(caste) {
    const casteLower = caste.toLowerCase();
    if (casteLower.includes('sc') || casteLower.includes('scheduled caste')) return 'SC';
    if (casteLower.includes('st') || casteLower.includes('scheduled tribe')) return 'ST';
    if (casteLower.includes('obc') || casteLower.includes('other backward class')) return 'OBC';
    return 'General';
  }

  // Clear conversation state
  clearConversation(userId) {
    this.conversationStates.delete(userId);
    this.formFields.delete(userId);
  }

  // Get conversation history
  getConversationHistory(userId) {
    const state = this.getConversationState(userId);
    return {
      step: state.step,
      collectedData: state.collectedData,
      progress: state.currentQuestionIndex / state.pendingQuestions.length * 100
    };
  }
}

export default ChatbotService;
