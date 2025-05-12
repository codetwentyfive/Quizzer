import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ResultsPage = ({ answers, questions, resultMessages }) => {
  const [markdown, setMarkdown] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  useEffect(() => {
    generateMarkdown();
    generateJson();
  }, [answers, questions, resultMessages]);

  const generateMarkdown = () => {
    let md = `# ${resultMessages.defaultIntro}\n\n`;
    
    md += `## ${resultMessages.participationProfileTitle}\n\n`;
    questions.forEach((section) => {
      md += `### ${section.title}\n\n`;
      
      section.questions.forEach((question) => {
        md += `**${question.text}**\n\n`;
        
        const answer = answers[question.id];
        if (!answer) {
          md += "_Keine Antwort_\n\n";
          return;
        }
        
        if (question.type === 'singleChoice') {
          const selectedOption = question.options.find(opt => opt.value === answer);
          md += selectedOption ? `- ${selectedOption.text}\n\n` : "_Keine Antwort_\n\n";
        } else if (question.type === 'multipleChoice') {
          if (Array.isArray(answer) && answer.length > 0) {
            answer.forEach(ans => {
              const selectedOption = question.options.find(opt => opt.value === ans);
              if (selectedOption) md += `- ${selectedOption.text}\n`;
            });
            md += '\n';
          } else {
            md += "_Keine Antwort_\n\n";
          }
        } else if (question.type === 'textInput') {
          md += `${answer}\n\n`;
        }
      });
    });
    
    md += `## ${resultMessages.recommendationsTitle}\n\n`;
    md += "Basierend auf deinen Antworten, empfehlen wir: (Beispielinhalt)\n\n";
    
    md += `## ${resultMessages.explanationsTitle}\n\n`;
    md += "Hier findest du weitere Informationen zu: (Beispielinhalt)\n\n";
    
    md += `## ${resultMessages.practicalTipsTitle}\n\n`;
    md += "Praktische Schritte für dich: (Beispielinhalt)\n\n";
    
    setMarkdown(md);
  };
  
  const generateJson = () => {
    const output = {
      title: "Interaktives Beteiligungs-Quiz - Ergebnisse",
      timestamp: new Date().toISOString(),
      answers: Object.keys(answers).map(questionId => {
        // Find the question data
        let questionData = null;
        let sectionTitle = "";
        
        questions.forEach(section => {
          const found = section.questions.find(q => q.id === questionId);
          if (found) {
            questionData = found;
            sectionTitle = section.title;
          }
        });
        
        if (!questionData) return null;
        
        let displayAnswer = '';
        
        if (questionData.type === 'singleChoice') {
          const option = questionData.options.find(opt => opt.value === answers[questionId]);
          displayAnswer = option ? option.text : '';
        } else if (questionData.type === 'multipleChoice') {
          const selectedAnswers = answers[questionId] || [];
          displayAnswer = selectedAnswers.map(ans => {
            const option = questionData.options.find(opt => opt.value === ans);
            return option ? option.text : '';
          }).filter(Boolean);
        } else {
          displayAnswer = answers[questionId] || '';
        }
        
        return {
          section: sectionTitle,
          question: questionData.text,
          answer: answers[questionId],
          displayAnswer
        };
      }).filter(Boolean)
    };
    
    setJsonOutput(JSON.stringify(output, null, 2));
  };
  
  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-beige p-8 rounded-lg shadow-lg max-w-4xl mx-auto mb-8"
    >
      <h1 className="text-3xl font-extrabold mb-6 text-primary-blue">Deine Quiz-Ergebnisse</h1>
      
      <div className="prose max-w-none mb-8">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={downloadMarkdown}
          className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
        >
          Als Markdown herunterladen
        </button>
        <button
          onClick={downloadJson}
          className="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold"
        >
          Als JSON herunterladen
        </button>
      </div>
      
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">JSON Output (für Entwickler)</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
          {jsonOutput}
        </pre>
      </div>
    </motion.div>
  );
};

export default ResultsPage; 