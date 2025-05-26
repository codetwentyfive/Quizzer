import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiMove, FiX, FiAlertCircle } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const OptionEditor = ({ option, onUpdate, onDelete, isDragging, showRouting, routing, onUpdateRouting, onRemoveRouting }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg ${
        isDragging ? 'opacity-50' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3 p-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <FiMove size={16} />
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-3">
          <input
            type="text"
            value={option.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Option Text"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={option.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder="Option Wert"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 p-1"
          title="Option löschen"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      {/* Routing Configuration */}
      {showRouting && (
        <div className="px-3 pb-3 border-t border-gray-200 bg-orange-50">
          <div className="pt-3">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              🔀 Routing für "{option.text}"
            </label>
            
            {routing ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <select
                    value={routing.type}
                    onChange={(e) => onUpdateRouting(e.target.value, routing.target)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="section">Zu Sektion</option>
                    <option value="question">Zu Frage (ID)</option>
                    <option value="end">Quiz beenden</option>
                  </select>
                  
                  {routing.type !== 'end' && (
                    <input
                      type="text"
                      value={routing.target}
                      onChange={(e) => onUpdateRouting(routing.type, e.target.value)}
                      placeholder={routing.type === 'section' ? 'Sektions-Slug' : 'Frage-ID'}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  )}
                  
                  <button
                    onClick={onRemoveRouting}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Routing entfernen"
                  >
                    <FiX size={12} />
                  </button>
                </div>
                
                <div className="text-xs text-gray-600">
                  {routing.type === 'section' && `Springt zu Sektion: ${routing.target}`}
                  {routing.type === 'question' && `Springt zu Frage ID: ${routing.target}`}
                  {routing.type === 'end' && 'Beendet das Quiz vorzeitig'}
                </div>
              </div>
            ) : (
              <button
                onClick={() => onUpdateRouting('section', '')}
                className="w-full text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
              >
                + Routing hinzufügen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const QuestionEditor = ({ question, onUpdate }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRouting, setShowRouting] = useState(false);
  const [notification, setNotification] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleQuestionTextChange = (text) => {
    onUpdate({ text });
  };

  const handlePlaceholderChange = (placeholder) => {
    onUpdate({ placeholder });
  };

  const handleQuestionTypeChange = (type) => {
    const updates = { type };
    
    if (type === 'textInput') {
      updates.placeholder = 'Antwort hier eingeben...';
      delete updates.options;
      delete updates.routing; // Remove routing for text inputs
    } else if (type === 'singleChoice' || type === 'multipleChoice') {
      if (!question.options || question.options.length === 0) {
        updates.options = [
          { id: uuidv4(), text: 'Option 1', value: 'option_1' },
          { id: uuidv4(), text: 'Option 2', value: 'option_2' }
        ];
      }
      delete updates.placeholder;
    }
    
    onUpdate(updates);
  };

  const addOption = () => {
    const newOption = {
      id: uuidv4(),
      text: `Option ${question.options.length + 1}`,
      value: `option_${question.options.length + 1}`
    };
    
    onUpdate({
      options: [...question.options, newOption]
    });
  };

  const updateOption = (optionId, updates) => {
    onUpdate({
      options: question.options.map(option =>
        option.id === optionId ? { ...option, ...updates } : option
      )
    });
  };

  const deleteOption = (optionId) => {
    if (question.options.length <= 2) {
      setNotification({
        type: 'error',
        message: 'Eine Frage muss mindestens 2 Optionen haben.'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    // Remove routing for deleted option
    const updatedRouting = { ...question.routing };
    delete updatedRouting[optionId];
    
    onUpdate({
      options: question.options.filter(option => option.id !== optionId),
      routing: updatedRouting
    });
  };

  const updateRouting = (optionId, routeType, routeTarget) => {
    const currentRouting = question.routing || {};
    
    onUpdate({
      routing: {
        ...currentRouting,
        [optionId]: {
          type: routeType, // 'section', 'question', 'end'
          target: routeTarget
        }
      }
    });
  };

  const removeRouting = (optionId) => {
    const updatedRouting = { ...question.routing };
    delete updatedRouting[optionId];
    
    onUpdate({
      routing: updatedRouting
    });
  };

  const handleOptionDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = question.options.findIndex(option => option.id === active.id);
      const newIndex = question.options.findIndex(option => option.id === over.id);
      
      onUpdate({
        options: arrayMove(question.options, oldIndex, newIndex)
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
            notification.type === 'error' 
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-blue-100 border border-blue-400 text-blue-700'
          }`}
        >
          <FiAlertCircle size={16} />
          <span className="text-sm">{notification.message}</span>
        </motion.div>
      )}

      {/* Question Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fragetyp
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuestionTypeChange('singleChoice')}
            className={`p-3 text-sm border rounded-lg transition-colors ${
              question.type === 'singleChoice'
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            📝 Einfachauswahl
          </button>
          <button
            onClick={() => handleQuestionTypeChange('multipleChoice')}
            className={`p-3 text-sm border rounded-lg transition-colors ${
              question.type === 'multipleChoice'
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            ☑️ Mehrfachauswahl
          </button>
          <button
            onClick={() => handleQuestionTypeChange('textInput')}
            className={`p-3 text-sm border rounded-lg transition-colors ${
              question.type === 'textInput'
                ? 'border-purple-500 bg-purple-50 text-purple-800'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            ✏️ Texteingabe
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fragetext
        </label>
        <textarea
          value={question.text}
          onChange={(e) => handleQuestionTextChange(e.target.value)}
          placeholder="Geben Sie hier Ihre Frage ein..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* Text Input Placeholder */}
      {question.type === 'textInput' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platzhalter Text
          </label>
          <input
            type="text"
            value={question.placeholder || ''}
            onChange={(e) => handlePlaceholderChange(e.target.value)}
            placeholder="z.B. Ihre Antwort hier..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Options Editor */}
      {(question.type === 'singleChoice' || question.type === 'multipleChoice') && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Antwortoptionen
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowRouting(!showRouting)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                  showRouting 
                    ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <span>🔀</span>
                <span>Routing</span>
              </button>
              <button
                onClick={addOption}
                className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FiPlus size={14} />
                <span>Option hinzufügen</span>
              </button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleOptionDragEnd}
          >
            <SortableContext
              items={question.options?.map(o => o.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <OptionEditor
                      option={option}
                      onUpdate={(updates) => updateOption(option.id, updates)}
                      onDelete={() => deleteOption(option.id)}
                      showRouting={showRouting}
                      routing={question.routing?.[option.id]}
                      onUpdateRouting={(routeType, routeTarget) => updateRouting(option.id, routeType, routeTarget)}
                      onRemoveRouting={() => removeRouting(option.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {question.options && question.options.length < 6 && (
            <div className="mt-3 text-center">
              <button
                onClick={addOption}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                + Weitere Option hinzufügen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Question Preview */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Vorschau:</h4>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-3">{question.text}</h5>
          
          {question.type === 'textInput' ? (
            <input
              type="text"
              placeholder={question.placeholder}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            />
          ) : (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={option.id} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type={question.type === 'singleChoice' ? 'radio' : 'checkbox'}
                      name="preview"
                      disabled
                      className="text-blue-600"
                    />
                    <span className="text-sm">{option.text}</span>
                  </label>
                  {showRouting && question.routing?.[option.id] && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      → {question.routing[option.id].type}: {question.routing[option.id].target}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor; 