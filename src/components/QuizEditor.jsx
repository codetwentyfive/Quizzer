import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FiPlus, FiDownload, FiEye, FiTrash2, FiGrid, FiList } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import SectionEditor from './SectionEditor';
import QuestionEditor from './QuestionEditor';
import QuizPreview from './QuizPreview';
import QuizFlowEditor from './QuizFlowEditor';

const QuizEditor = ({ onBack, initialQuizData = null }) => {
  const [quiz, setQuiz] = useState(initialQuizData || {
    quizTitle: 'Neues Quiz',
    sections: [],
    resultMessages: {
      defaultIntro: 'Hier ist dein persönliches Wissensprofil:',
      knowledgeProfileTitle: '1. Wissensprofil:',
      recommendationsTitle: '2. Nächste Schritte:',
      explanationsTitle: '3. Hintergründe:',
      comicTipsTitle: '4. Empfehlungen:'
    }
  });

  const [activeSection, setActiveSection] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState('traditional'); // 'traditional' or 'flow'
  const [draggedType, setDraggedType] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add new section
  const addSection = () => {
    const newSection = {
      id: uuidv4(),
      slug: `section-${quiz.sections.length + 1}`,
      title: `Neue Sektion ${quiz.sections.length + 1}`,
      questions: []
    };
    setQuiz(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setActiveSection(newSection.id);
  };

  // Update section
  const updateSection = (sectionId, updates) => {
    setQuiz(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  // Delete section
  const deleteSection = (sectionId) => {
    setQuiz(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    if (activeSection === sectionId) {
      setActiveSection(null);
      setActiveQuestion(null);
    }
  };

  // Add question to section
  const addQuestion = (sectionId, questionType) => {
    const newQuestion = {
      id: uuidv4(),
      text: 'Neue Frage',
      type: questionType,
      ...(questionType === 'textInput' 
        ? { placeholder: 'Antwort hier eingeben...' }
        : { options: [
            { id: uuidv4(), text: 'Option 1', value: 'option_1' },
            { id: uuidv4(), text: 'Option 2', value: 'option_2' }
          ] }
      )
    };

    setQuiz(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    }));
    setActiveQuestion(newQuestion.id);
  };

  // Update question
  const updateQuestion = (sectionId, questionId, updates) => {
    setQuiz(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId ? { ...question, ...updates } : question
              )
            }
          : section
      )
    }));
  };

  // Delete question
  const deleteQuestion = (sectionId, questionId) => {
    setQuiz(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
          : section
      )
    }));
    if (activeQuestion === questionId) {
      setActiveQuestion(null);
    }
  };

  // Handle drag end for sections
  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setQuiz(prev => {
        const oldIndex = prev.sections.findIndex(section => section.id === active.id);
        const newIndex = prev.sections.findIndex(section => section.id === over.id);
        
        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex)
        };
      });
    }
  };

  // Handle drag end for questions within a section
  const handleQuestionDragEnd = (event, sectionId) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setQuiz(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                questions: arrayMove(
                  section.questions,
                  section.questions.findIndex(q => q.id === active.id),
                  section.questions.findIndex(q => q.id === over.id)
                )
              }
            : section
        )
      }));
    }
  };

  // Export quiz as JSON
  const exportQuiz = () => {
    const dataStr = JSON.stringify(quiz, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${quiz.quizTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const currentSection = activeSection ? quiz.sections.find(s => s.id === activeSection) : null;
  const currentQuestion = activeQuestion && currentSection 
    ? currentSection.questions.find(q => q.id === activeQuestion) 
    : null;

  if (showPreview) {
    return (
      <QuizPreview 
        quiz={quiz} 
        onClose={() => setShowPreview(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-soft-pink">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Zurück
              </button>
              <input
                type="text"
                value={quiz.quizTitle}
                onChange={(e) => setQuiz(prev => ({ ...prev, quizTitle: e.target.value }))}
                className="text-2xl font-bold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
                placeholder="Quiz Titel"
              />
            </div>
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('traditional')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'traditional' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FiList size={16} />
                  <span className="text-sm">Liste</span>
                </button>
                <button
                  onClick={() => setViewMode('flow')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'flow' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FiGrid size={16} />
                  <span className="text-sm">Flow</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEye />
                <span>Vorschau</span>
              </button>
              <button
                onClick={exportQuiz}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiDownload />
                <span>Exportieren</span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {quiz.sections.length} Sektionen • {quiz.sections.reduce((count, section) => count + section.questions.length, 0)} Fragen
          </div>
        </div>

        {/* Conditional Content Based on View Mode */}
        {viewMode === 'flow' ? (
          <QuizFlowEditor 
            quiz={quiz}
            onQuizUpdate={setQuiz}
          />
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Sections List */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Sektionen</h3>
                  <button
                    onClick={addSection}
                    className="bg-primary-blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleSectionDragEnd}
                >
                  <SortableContext items={quiz.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {quiz.sections.map((section) => (
                        <SectionEditor
                          key={section.id}
                          section={section}
                          isActive={activeSection === section.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setActiveQuestion(null);
                          }}
                          onUpdate={(updates) => updateSection(section.id, updates)}
                          onDelete={() => deleteSection(section.id)}
                          onAddQuestion={(type) => addQuestion(section.id, type)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                
                {quiz.sections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Keine Sektionen vorhanden.</p>
                    <p className="text-sm">Klicke auf + um eine Sektion hinzuzufügen.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-bold text-lg mb-4">
                  {currentSection ? `Fragen: ${currentSection.title}` : 'Wähle eine Sektion'}
                </h3>
                
                {currentSection ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleQuestionDragEnd(event, currentSection.id)}
                  >
                    <SortableContext 
                      items={currentSection.questions.map(q => q.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {currentSection.questions.map((question, index) => (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              activeQuestion === question.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveQuestion(question.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-500">
                                    Q{index + 1}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    question.type === 'singleChoice' ? 'bg-blue-100 text-blue-800' :
                                    question.type === 'multipleChoice' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {question.type === 'singleChoice' ? 'Einfach' :
                                     question.type === 'multipleChoice' ? 'Mehrfach' : 'Text'}
                                  </span>
                                  {question.routing && Object.keys(question.routing).length > 0 && (
                                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
                                      🔀 Routing
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {question.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ID: {question.id}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteQuestion(currentSection.id, question.id);
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Wähle eine Sektion aus der linken Liste aus.</p>
                  </div>
                )}
                
                {/* Routing Reference */}
                {currentSection && (
                  <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">📋 Routing Referenz</h4>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-medium">Aktuelle Sektion:</span>
                        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {currentSection.slug}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Alle Sektionen:</span>
                          <div className="mt-1 space-y-1">
                            {quiz.sections.map(section => (
                              <div key={section.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {section.slug}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Frage IDs (diese Sektion):</span>
                          <div className="mt-1 space-y-1">
                            {currentSection.questions.map(question => (
                              <div key={question.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {question.id}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Question Editor */}
            <div className="col-span-5">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-bold text-lg mb-4">
                  {currentQuestion ? 'Frage bearbeiten' : 'Wähle eine Frage'}
                </h3>
                
                {currentQuestion && currentSection ? (
                  <QuestionEditor
                    question={currentQuestion}
                    onUpdate={(updates) => updateQuestion(currentSection.id, currentQuestion.id, updates)}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Wähle eine Frage zum Bearbeiten aus.</p>
                    {currentSection && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">Oder füge eine neue Frage hinzu:</p>
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => addQuestion(currentSection.id, 'singleChoice')}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            Einfachauswahl
                          </button>
                          <button
                            onClick={() => addQuestion(currentSection.id, 'multipleChoice')}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                          >
                            Mehrfachauswahl
                          </button>
                          <button
                            onClick={() => addQuestion(currentSection.id, 'textInput')}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors"
                          >
                            Texteingabe
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEditor; 