# Rasa Chatbot Setup Guide

## Prerequisites
- Python 3.8+ installed
- pip package manager

## Installation Steps

### 1. Create Virtual Environment (Recommended)
```bash
python -m venv rasa-env
rasa-env\Scripts\activate  # On Windows
# source rasa-env/bin/activate  # On Linux/Mac
```

### 2. Install Rasa
```bash
pip install rasa==3.6.4
pip install rasa-sdk==3.6.1
```

### 3. Train the Model
```bash
cd rasa-chatbot
rasa train
```

### 4. Start Rasa Action Server (Terminal 1)
```bash
cd rasa-chatbot
rasa run actions --port 5055
```

### 5. Start Rasa Server (Terminal 2)
```bash
cd rasa-chatbot
rasa run --enable-api --cors "*" --port 5005
```

### 6. Test the Integration
The backend server will automatically try to connect to Rasa at `http://localhost:5005`

## File Structure
```
rasa-chatbot/
├── domain.yml          # Intents, entities, responses, actions
├── config.yml          # NLU pipeline and policies
├── data/
│   ├── nlu.yml         # Training examples
│   └── stories.yml     # Conversation flows
├── actions/
│   └── actions.py      # Custom actions
├── endpoints.yml       # Action server configuration
└── models/             # Trained models (created after training)
```

## Key Features
- **Intent Recognition**: Understands user queries about schemes, documents, eligibility
- **Entity Extraction**: Extracts income amounts, scheme names, etc.
- **Custom Actions**: Provides personalized scheme recommendations
- **Fallback**: Backend falls back to simple responses if Rasa is unavailable

## Testing Commands
```bash
# Test in terminal
rasa shell

# Test via API
curl -X POST http://localhost:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender": "test", "message": "my salary is 2 lpa"}'
```
