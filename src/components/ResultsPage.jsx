import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiBookOpen, FiExternalLink, FiDownload, FiVideo, FiUsers, FiTarget } from 'react-icons/fi';

const ResultsPage = ({ answers, questions, resultMessages }) => {
  const [markdown, setMarkdown] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  // Placeholder resource cards data
  const resourceCards = [
    {
      id: 1,
      title: "Vertiefende Lektüre",
      description: "Entdecke weiterführende Artikel und Studien zu deinen Interessensgebieten.",
      icon: FiBookOpen,
      type: "guide",
      color: "blue",
      comingSoon: true
    },
    {
      id: 2,
      title: "Video-Tutorials",
      description: "Lerne mit praktischen Video-Anleitungen und Experteninterviews.",
      icon: FiVideo,
      type: "video",
      color: "purple",
      comingSoon: true
    },
    {
      id: 3,
      title: "Community Forum",
      description: "Tausche dich mit anderen Teilnehmern aus und stelle Fragen.",
      icon: FiUsers,
      type: "community",
      color: "green",
      comingSoon: true
    },
    {
      id: 4,
      title: "Praxis-Tools",
      description: "Nutze interaktive Tools und Vorlagen für die praktische Umsetzung.",
      icon: FiTarget,
      type: "tools",
      color: "orange",
      comingSoon: true
    },
    {
      id: 5,
      title: "Persönlicher Leitfaden",
      description: "Erhalte einen maßgeschneiderten Aktionsplan basierend auf deinen Antworten.",
      icon: FiDownload,
      type: "personalized",
      color: "indigo",
      comingSoon: true
    },
    {
      id: 6,
      title: "Weitere Ressourcen",
      description: "Zusätzliche Links, Empfehlungen und weiterführende Materialien.",
      icon: FiExternalLink,
      type: "links",
      color: "teal",
      comingSoon: true
    }
  ];

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const getColorClasses = (color, comingSoon) => {
    const baseClasses = "transition-all duration-300";
    const hoverClasses = comingSoon ? "" : "hover:scale-105 hover:shadow-lg cursor-pointer";
    
    const colorMap = {
      blue: `bg-blue-50 border-blue-200 ${comingSoon ? 'text-blue-400' : 'text-blue-600 hover:bg-blue-100'}`,
      purple: `bg-purple-50 border-purple-200 ${comingSoon ? 'text-purple-400' : 'text-purple-600 hover:bg-purple-100'}`,
      green: `bg-green-50 border-green-200 ${comingSoon ? 'text-green-400' : 'text-green-600 hover:bg-green-100'}`,
      orange: `bg-orange-50 border-orange-200 ${comingSoon ? 'text-orange-400' : 'text-orange-600 hover:bg-orange-100'}`,
      indigo: `bg-indigo-50 border-indigo-200 ${comingSoon ? 'text-indigo-400' : 'text-indigo-600 hover:bg-indigo-100'}`,
      teal: `bg-teal-50 border-teal-200 ${comingSoon ? 'text-teal-400' : 'text-teal-600 hover:bg-teal-100'}`
    };

    return `${baseClasses} ${hoverClasses} ${colorMap[color]}`;
  };

  const generateMarkdown = useCallback(() => {
    let md = `# ${resultMessages?.defaultIntro || 'Quiz Ergebnisse'}\n\n`;
    
    // Add sections for each answer
    questions.forEach(section => {
      md += `## ${section.title}\n\n`;
      
      section.questions.forEach(question => {
        const answer = answers[question.id];
        if (answer) {
          md += `**${question.text}**\n\n`;
          
          if (question.type === 'singleChoice') {
            const option = question.options.find(opt => opt.value === answer);
            md += `Antwort: ${option ? option.text : answer}\n\n`;
          } else if (question.type === 'multipleChoice') {
            const selectedAnswers = answer.map(ans => {
              const option = question.options.find(opt => opt.value === ans);
              return option ? option.text : ans;
            });
            md += `Antworten: ${selectedAnswers.join(', ')}\n\n`;
          } else {
            md += `Antwort: ${answer}\n\n`;
          }
        }
      });
    });
    
    md += "---\n\n";
    md += "Praktische Schritte für dich: (Beispielinhalt)\n\n";
    
    setMarkdown(md);
  }, [answers, questions, resultMessages]);
  
  const generateJson = useCallback(() => {
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
  }, [answers, questions]);

  useEffect(() => {
    generateMarkdown();
    generateJson();
  }, [generateMarkdown, generateJson]);
  
  const downloadMarkdown = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Clean up the URL object to prevent memory leaks
    URL.revokeObjectURL(url);
  }, [markdown]);
  
  const downloadJson = useCallback(() => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Clean up the URL object to prevent memory leaks
    URL.revokeObjectURL(url);
  }, [jsonOutput]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-beige p-8 rounded-lg shadow-lg max-w-4xl mx-auto mb-8"
    >
      <h1 className="text-3xl font-extrabold mb-6 text-primary-blue">Deine Quiz-Ergebnisse</h1>
      
      {/* Resource Cards Section */}
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🎯 Für dich empfohlene Ressourcen</h2>
          <p className="text-gray-600">
            Basierend auf deinen Antworten haben wir passende Materialien und Tools für dich zusammengestellt.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {resourceCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className={`p-6 rounded-lg border-2 relative ${getColorClasses(card.color, card.comingSoon)}`}
              >
                {card.comingSoon && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                      Bald verfügbar
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${card.comingSoon ? 'bg-gray-100' : `bg-${card.color}-100`}`}>
                    <IconComponent 
                      size={24} 
                      className={card.comingSoon ? 'text-gray-400' : ''} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${card.comingSoon ? 'text-gray-500' : ''}`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${card.comingSoon ? 'text-gray-400' : 'text-gray-600'}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
                
                {!card.comingSoon && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-sm font-medium flex items-center space-x-1 hover:underline">
                      <span>Mehr erfahren</span>
                      <FiExternalLink size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <p className="text-blue-800 text-sm">
            💡 <strong>Hinweis:</strong> Diese Ressourcen werden basierend auf deinen Antworten personalisiert. 
            Links und Inhalte werden in Kürze hinzugefügt.
          </p>
        </motion.div>
      </div>
      
      <div className="prose max-w-none mb-8">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={downloadMarkdown}
          className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
          aria-label="Quiz-Ergebnisse als Markdown-Datei herunterladen"
        >
          Als Markdown herunterladen
        </button>
        <button
          onClick={downloadJson}
          className="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold"
          aria-label="Quiz-Ergebnisse als JSON-Datei herunterladen"
        >
          Als JSON herunterladen
        </button>
      </div>
      
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">JSON Output (für Entwickler)</h2>
        <pre 
          className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm"
          aria-label="JSON-Ausgabe der Quiz-Ergebnisse"
        >
          {jsonOutput}
        </pre>
      </div>
    </motion.div>
  );
};

export default React.memo(ResultsPage); 