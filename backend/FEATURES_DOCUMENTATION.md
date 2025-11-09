# 🚀 SchemeSeva Enhanced Features Documentation

## Overview

This document describes the new features added to SchemeSeva backend, including Interactive Chatbot with Form Auto-Fill, AI-Powered Document Processing, and Accessibility Features.

## 🤖 Interactive Chatbot with Form Auto-Fill

### Features

- **Conversational Form Filling**: Users can fill application forms through natural conversation
- **Smart Question Flow**: Adaptive questioning based on user responses
- **Real-time Validation**: Immediate feedback on user inputs
- **Eligible Scheme Suggestions**: Automatic scheme recommendations based on user data

### API Endpoints

#### 1. Send Message to Chatbot

```http
POST /api/chatbot/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I want to apply for a scheme",
  "userId": "optional_user_id"
}
```

**Response:**

```json
{
  "success": true,
  "response": {
    "type": "form_start",
    "message": "Great! I'll help you fill out a scheme application form.",
    "questions": [...],
    "currentQuestion": {
      "field": "name",
      "label": "What is your full name?",
      "type": "text",
      "required": true
    },
    "formData": {}
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

#### 2. Process Document for Auto-Fill

```http
POST /api/chatbot/process-document
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- document: <file>
- documentType: "aadhaar" | "pan" | "income" | "caste" | "education"
```

**Response:**

```json
{
  "success": true,
  "response": {
    "type": "document_processed",
    "message": "Great! I've extracted information from your document.",
    "extractedData": {
      "name": "John Doe",
      "age": 25,
      "gender": "Male"
    },
    "confidence": 95
  }
}
```

#### 3. Get Conversation History

```http
GET /api/chatbot/history
Authorization: Bearer <token>
```

#### 4. Clear Conversation

```http
DELETE /api/chatbot/clear
Authorization: Bearer <token>
```

### Conversation Flow Example

1. **Welcome Message**

   ```
   User: "Hello"
   Bot: "Hello! I'm your SchemeSeva assistant. I can help you with:
   - Fill Application Form 📝
   - Process Documents 📄
   - Search Schemes 🔍
   - Application Help ❓"
   ```

2. **Form Filling Process**

   ```
   User: "Fill form"
   Bot: "Great! Let's start with some basic information. What is your full name?"

   User: "John Doe"
   Bot: "Great! What is your age?"

   User: "25"
   Bot: "What is your gender?"
   User: "Male"
   Bot: "What is your category/caste?"
   User: "General"
   // ... continues through all fields
   ```

3. **Scheme Recommendations**
   ```
   Bot: "Perfect! I've collected all your information. Here are the schemes you're eligible for:
   1. PM-KISAN Samman Nidhi
   2. Pradhan Mantri Jan Dhan Yojana
   3. MGNREGA
   ..."
   ```

## 📄 AI-Powered Document Processing

### Supported Document Types

- **Aadhaar Card**: Extracts name, age, gender, address
- **PAN Card**: Extracts name, PAN number, father's name
- **Income Certificate**: Extracts annual income, name
- **Caste Certificate**: Extracts caste/category, certificate number
- **Education Certificate**: Extracts qualification, institution, year

### Document Processing Flow

1. User uploads document
2. OCR service extracts text
3. AI processes and validates extracted data
4. Data is mapped to form fields
5. User can review and correct extracted information

### Integration with Chatbot

The document processing seamlessly integrates with the chatbot:

- Upload document → Extract data → Auto-fill form → Continue conversation

## ♿ Accessibility Features

### Features Available

- **Font Size Scaling**: Small, Medium, Large, X-Large
- **Theme Customization**: Light, Dark, High-Contrast
- **Text-to-Speech**: Configurable speech settings
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Enhanced visibility
- **Screen Reader Support**: ARIA labels and semantic HTML

### API Endpoints

#### 1. Get User Accessibility Settings

```http
GET /api/accessibility/settings
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "settings": {
    "userId": "user@example.com",
    "settings": {
      "fontSize": "medium",
      "theme": "light",
      "speechRate": 1.0,
      "speechPitch": 1.0,
      "speechVolume": 1.0,
      "autoSpeak": false,
      "keyboardNavigation": true,
      "highContrast": false
    },
    "preferences": {
      "suggestedFontSize": "medium",
      "suggestedTheme": "light",
      "accessibilityScore": 0.7
    }
  }
}
```

#### 2. Update Accessibility Settings

```http
PUT /api/accessibility/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "fontSize": "large",
  "theme": "dark",
  "highContrast": true,
  "autoSpeak": true
}
```

#### 3. Generate Accessibility CSS

```http
POST /api/accessibility/css
Authorization: Bearer <token>
Content-Type: application/json

{
  "settings": {
    "fontSize": "large",
    "theme": "dark",
    "highContrast": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "css": {
    "fontSize": {
      "--base-font-size": "18px",
      "--heading-scale": "1.3",
      "--button-font-size": "18px"
    },
    "theme": {
      "--bg-primary": "#1a1a1a",
      "--bg-secondary": "#2d2d2d",
      "--text-primary": "#ffffff",
      "--accent-color": "#4dabf7"
    },
    "highContrast": {
      "--bg-primary": "#ffffff",
      "--text-primary": "#000000",
      "filter": "contrast(150%)"
    }
  }
}
```

#### 4. Get Text-to-Speech Configuration

```http
GET /api/accessibility/tts-config
Authorization: Bearer <token>
```

#### 5. Get Accessibility Report

```http
GET /api/accessibility/report
Authorization: Bearer <token>
```

#### 6. Get Keyboard Shortcuts

```http
GET /api/accessibility/keyboard-shortcuts
```

**Response:**

```json
{
  "success": true,
  "shortcuts": {
    "Alt + 1": "Navigate to main content",
    "Alt + 2": "Navigate to navigation menu",
    "Alt + A": "Toggle accessibility menu",
    "Alt + T": "Toggle theme (light/dark)",
    "Alt + F": "Increase font size",
    "Alt + C": "Toggle high contrast",
    "Alt + S": "Toggle text-to-speech"
  }
}
```

### Accessibility Compliance

- **WCAG 2.1 AA Compliance**: Meets Web Content Accessibility Guidelines
- **Section 508 Compliance**: Meets US federal accessibility standards
- **Screen Reader Support**: Compatible with NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Full keyboard accessibility

## 🔧 Implementation Examples

### Frontend Integration - Chatbot

```javascript
// Send message to chatbot
const sendMessage = async (message) => {
  const response = await fetch("/api/chatbot/message", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  return data.response;
};

// Process document
const processDocument = async (file, documentType) => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("documentType", documentType);

  const response = await fetch("/api/chatbot/process-document", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

### Frontend Integration - Accessibility

```javascript
// Get accessibility settings
const getAccessibilitySettings = async () => {
  const response = await fetch("/api/accessibility/settings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.settings;
};

// Apply accessibility CSS
const applyAccessibilityCSS = async (settings) => {
  const response = await fetch("/api/accessibility/css", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ settings }),
  });

  const data = await response.json();

  // Apply CSS to document
  Object.entries(data.css).forEach(([category, styles]) => {
    Object.entries(styles).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  });
};
```

## 🎯 Benefits

### For Users

- **Easier Form Filling**: Natural conversation instead of complex forms
- **Faster Applications**: Auto-fill from documents
- **Better Accessibility**: Customizable interface for all users
- **Guided Experience**: Step-by-step assistance

### For Administrators

- **Reduced Errors**: Validated data entry
- **Better User Experience**: Higher completion rates
- **Compliance**: Meets accessibility standards
- **Analytics**: Track user interactions and preferences

## 🚀 Future Enhancements

### Planned Features

- **Voice Input**: Speech-to-text for form filling
- **Multi-language Support**: Support for regional languages
- **Advanced AI**: Machine learning for better recommendations
- **Mobile App Integration**: Native mobile app support
- **Offline Support**: Work without internet connection

### Integration Opportunities

- **Government APIs**: Direct integration with government databases
- **Payment Gateways**: Integrated payment processing
- **SMS/Email Notifications**: Automated status updates
- **Digital Signatures**: Electronic signature support

## 📞 Support

For technical support or questions about these features:

- **Email**: support@schemeseva.com
- **Documentation**: https://docs.schemeseva.com
- **API Reference**: https://api.schemeseva.com/docs

---

**Last Updated**: January 20, 2024
**Version**: 2.0.0
