# Quizzer - Interactive Quiz Application

An interactive, multi-step quiz application built with React, Tailwind CSS, and Framer Motion.

## Features

- Multi-section, multi-question quiz flow
- Progress tracking and step navigation
- Various question types (single choice, multiple choice, text input)
- Beautiful animations for question transitions
- Results page with export options (JSON, Markdown)
- Mobile responsive design

## Customizing Quiz Content

All quiz content is stored in `src/data/questions.json`. Edit this file to customize:

- Quiz title and section names
- Questions and answer options
- Result page formatting

## Development

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quizzer.git
cd quizzer

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at http://localhost:3000.

### Building for Production

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## Project Structure

- `src/components/` - React components
- `src/data/` - JSON data for quiz questions
- `src/App.jsx` - Main application component
- `public/` - Static assets

## Technologies

- React
- Tailwind CSS for styling
- Framer Motion for animations
- React Markdown for formatting results

## License

ISC