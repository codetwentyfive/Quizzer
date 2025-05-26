# Quizzer - Interactive Quiz Application

A modern, accessible React-based quiz application with advanced routing, validation, and user experience features.

## 🚀 Features

### Core Functionality
- **Interactive Quiz Taking**: Smooth navigation through questions with progress tracking
- **Multiple Question Types**: Single choice, multiple choice, and text input questions
- **Advanced Routing**: Conditional navigation based on user responses
- **Visual Flow Editor**: Node-based visual editor for designing quiz structure and routing
- **Progress Tracking**: Real-time progress indicators and section navigation
- **Results Display**: Comprehensive results page with user responses
- **Built-in Quiz Editor**: Create and modify quizzes with drag-and-drop functionality
- **File Upload Support**: Load quizzes from JSON files with validation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Error Handling**: Robust error boundaries and user-friendly error messages

## 📁 Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx      # Error handling component
│   ├── Notification.jsx       # User notification system
│   ├── ProgressBar.jsx        # Quiz progress visualization
│   ├── QuestionCard.jsx       # Individual question display
│   ├── QuestionEditor.jsx     # Question editing interface
│   ├── QuizEditor.jsx         # Main quiz editing interface
│   ├── ResultsPage.jsx        # Quiz results and export
│   ├── SectionEditor.jsx      # Section editing interface
│   └── StartScreen.jsx        # Landing page and file upload
├── data/
│   └── marvel_questions.json  # Sample quiz data
├── utils/
│   ├── quizNavigation.js      # Navigation logic and validation
│   ├── testQuizData.js        # Test data for validation
│   └── validation.js          # Data validation utilities
├── App.jsx                    # Main application component
└── index.js                   # Application entry point
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quizzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📋 Usage Guide

### Taking a Quiz

1. **Start**: Click "Quiz starten" on the landing page
2. **Navigate**: Use "Weiter" and "Zurück" buttons to move between questions
3. **Answer**: Select options or enter text as required
4. **Complete**: View results and download reports

### Creating a Quiz

1. **Editor Access**: Click "Eigenes Quiz erstellen" or upload a quiz file
2. **Add Sections**: Create logical groupings for your questions
3. **Add Questions**: Support for multiple question types:
   - **Single Choice**: One correct answer from multiple options
   - **Multiple Choice**: Multiple correct answers possible
   - **Text Input**: Free-form text responses
4. **Configure Routing**: Set up conditional navigation based on answers
5. **Export**: Download your quiz as JSON for sharing

### File Upload

- **Supported Format**: JSON files only
- **Size Limit**: Maximum 5MB
- **Validation**: Automatic structure validation and sanitization

3. **Upload Files**: Drag and drop or select JSON files (max 5MB)

## 🎨 Visual Flow Editor

The quiz application now includes a powerful **Visual Flow Editor** that allows you to design and visualize quiz structure using a node-based interface.

### Features

- **Node-Based Design**: Questions and sections are represented as visual nodes
- **Interactive Connections**: Drag to create routing connections between questions
- **Real-Time Visualization**: See the complete quiz flow at a glance
- **Drag & Drop**: Easily rearrange nodes to organize your quiz layout
- **Routing Visualization**: Visual representation of conditional navigation paths
- **Export Capability**: Generate JSON directly from the visual editor

### How to Use

1. **Access Flow Editor**: In the Quiz Editor, click the "Flow" toggle button in the header
2. **View Quiz Structure**: Existing questions appear as colored nodes:
   - 🔵 **Blue**: Single choice questions
   - 🟢 **Green**: Multiple choice questions  
   - 🟣 **Purple**: Text input questions
   - 🟡 **Yellow**: Section nodes
   - 🔴 **Red**: End quiz node
3. **Create Connections**: Drag from answer options to target questions/sections
4. **Add New Elements**: Use the control panel to add sections and questions
5. **Export**: Generate updated JSON with your visual design

### Node Types

- **Question Nodes**: Display question text, type, and answer options
- **Section Nodes**: Represent quiz sections with question counts
- **End Node**: Marks the completion point of the quiz
- **Connection Lines**: Show routing paths between elements

### Benefits

- **Visual Understanding**: See the entire quiz flow structure instantly
- **Complex Routing**: Easily design branching logic and conditional paths
- **Error Prevention**: Visual validation of routing connections
- **Intuitive Design**: Drag-and-drop interface for non-technical users
- **Quick Prototyping**: Rapidly design and test quiz structures

## 📊 Quiz Data Structure

### Basic Structure
```json
{
  "quizTitle": "Your Quiz Title",
  "sections": [
    {
      "id": "unique-section-id",
      "title": "Section Title",
      "slug": "section-slug",
      "questions": [...]
    }
  ],
  "resultMessages": [...]
}
```

### Question Types

#### Single Choice
```json
{
  "id": "question-id",
  "text": "Question text",
  "type": "singleChoice",
  "options": [
    {
      "id": "option-id",
      "text": "Option text",
      "value": "option-value"
    }
  ],
  "routing": {
    "option-id": {
      "type": "question|section|end",
      "target": "target-id-or-slug"
    }
  }
}
```

#### Multiple Choice
```json
{
  "id": "question-id",
  "text": "Question text",
  "type": "multipleChoice",
  "options": [...]
}
```

#### Text Input
```json
{
  "id": "question-id",
  "text": "Question text",
  "type": "textInput"
}
```

### Routing Options

- **Question Routing**: `{ "type": "question", "target": "question-id" }`
- **Section Routing**: `{ "type": "section", "target": "section-slug" }`
- **End Quiz**: `{ "type": "end" }`

## 🧪 Testing

### Validation Testing
```javascript
import { runValidationTests } from './src/utils/testQuizData';

// Run comprehensive validation tests
const tests = runValidationTests();
tests.forEach(test => {
  console.log(`