import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiMove, FiTrash2, FiPlus, FiEdit3, FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SectionEditor = ({ 
  section, 
  isActive, 
  onClick, 
  onUpdate, 
  onDelete, 
  onAddQuestion 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(section.title);
  const [showQuestionMenu, setShowQuestionMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate({ title: tempTitle, slug: tempTitle.toLowerCase().replace(/\s+/g, '-') });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(section.title);
    setIsEditing(false);
  };

  const handleAddQuestion = (type) => {
    onAddQuestion(type);
    setShowQuestionMenu(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`border rounded-lg p-3 transition-all ${
          isDragging ? 'opacity-50 shadow-lg' : ''
        } ${
          isActive 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mr-2"
          >
            <FiMove />
          </div>

          {/* Section Content */}
          <div className="flex-1" onClick={onClick}>
            {isEditing ? (
              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sektion Titel"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <button
                  onClick={handleSave}
                  className="text-green-600 hover:text-green-800 p-1"
                >
                  <FiCheck size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div className="cursor-pointer">
                <h4 className="font-medium text-gray-800">{section.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {section.questions.length} Frage{section.questions.length !== 1 ? 'n' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {!isEditing && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="text-gray-500 hover:text-blue-600 p-1"
                  title="Bearbeiten"
                >
                  <FiEdit3 size={14} />
                </button>
                
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuestionMenu(!showQuestionMenu);
                    }}
                    className="text-gray-500 hover:text-green-600 p-1 "
                    title="Frage hinzufügen"
                  >
                    <FiPlus size={14} />
                  </button>
                  
                  {showQuestionMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-max"
                    >
                      <button
                        onClick={() => handleAddQuestion('singleChoice')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700"
                      >
                        📝 Einfachauswahl
                      </button>
                      <button
                        onClick={() => handleAddQuestion('multipleChoice')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-gray-700"
                      >
                        ☑️ Mehrfachauswahl
                      </button>
                      <button
                        onClick={() => handleAddQuestion('textInput')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 text-gray-700"
                      >
                        ✏️ Texteingabe
                      </button>
                    </motion.div>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  className="text-gray-500 hover:text-red-600 p-1"
                  title="Löschen"
                >
                  <FiTrash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Close menu when clicking outside */}
        {showQuestionMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowQuestionMenu(false)}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-bold mb-4">Sektion löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie die Sektion "{section.title}" und alle ihre Fragen löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SectionEditor; 