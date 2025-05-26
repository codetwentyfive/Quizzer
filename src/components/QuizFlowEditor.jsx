import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  ConnectionLineType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FiPlus, FiDownload } from 'react-icons/fi';

// Custom Node Components
const QuestionNode = ({ data, selected }) => {
  const getNodeColor = (type) => {
    switch (type) {
      case 'singleChoice': return 'bg-blue-100 border-blue-500';
      case 'multipleChoice': return 'bg-green-100 border-green-500';
      case 'textInput': return 'bg-purple-100 border-purple-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'singleChoice': return '📝';
      case 'multipleChoice': return '☑️';
      case 'textInput': return '✏️';
      default: return '❓';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-3 min-w-[250px] max-w-[350px] ${getNodeColor(data.type)} ${selected ? 'ring-4 ring-blue-400' : ''}`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
        }}
      />
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{getTypeIcon(data.type)}</span>
        <span className="text-xs bg-white px-2 py-1 rounded font-medium text-gray-700">
          {data.sectionTitle}
        </span>
      </div>
      <div className="font-bold text-sm text-gray-800 mb-2">
        {data.label}
      </div>
      <div className="text-xs text-gray-700 line-clamp-2 mb-2">
        {data.text}
      </div>
      {data.options && data.options.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-600 mb-1">
            Antwortoptionen:
          </div>
          {data.options.slice(0, 3).map((option, index) => (
            <div key={option.id} className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded text-gray-600 truncate">
              {index + 1}. {option.text}
            </div>
          ))}
          {data.options.length > 3 && (
            <div className="text-xs text-gray-500 italic">
              +{data.options.length - 3} weitere...
            </div>
          )}
        </div>
      )}
      {data.hasRouting && (
        <div className="mt-2 flex items-center">
          <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded font-medium">
            🔀 Routing aktiv
          </span>
        </div>
      )}
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
        }}
      />
    </div>
  );
};

const SectionNode = ({ data, selected }) => {
  return (
    <div className={`px-6 py-4 shadow-lg rounded-lg border-3 bg-yellow-100 border-yellow-500 min-w-[280px] ${selected ? 'ring-4 ring-blue-400' : ''}`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
        }}
      />
      
      <div className="flex items-center justify-center mb-2">
        <span className="text-3xl">📁</span>
      </div>
      <div className="font-bold text-center text-gray-800 mb-1 text-lg">
        {data.label}
      </div>
      <div className="text-sm text-center text-gray-600">
        {data.questionCount} Frage{data.questionCount !== 1 ? 'n' : ''}
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
        }}
      />
    </div>
  );
};

const EndNode = ({ selected }) => {
  return (
    <div className={`px-6 py-4 shadow-lg rounded-lg border-3 bg-red-100 border-red-500 min-w-[200px] ${selected ? 'ring-4 ring-blue-400' : ''}`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
        }}
      />
      
      <div className="flex items-center justify-center mb-2">
        <span className="text-3xl">🏁</span>
      </div>
      <div className="font-bold text-center text-gray-800 text-lg">
        Quiz Ende
      </div>
    </div>
  );
};

const nodeTypes = {
  question: QuestionNode,
  section: SectionNode,
  end: EndNode,
};

const QuizFlowEditor = ({ quiz, onQuizUpdate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert quiz data to nodes and edges
  const initializeFlow = useCallback(() => {
    if (!quiz || !quiz.sections) return;

    const newNodes = [];
    const newEdges = [];
    const sectionSpacing = 500;
    const questionSpacing = 200;

    // Add end node
    newNodes.push({
      id: 'end',
      type: 'end',
      position: { x: quiz.sections.length * sectionSpacing, y: 300 },
      data: {},
    });

    quiz.sections.forEach((section, sectionIndex) => {
      const sectionX = sectionIndex * sectionSpacing;
      
      // Add section node
      newNodes.push({
        id: `section-${section.id}`,
        type: 'section',
        position: { x: sectionX, y: 0 },
        data: {
          label: section.title,
          questionCount: section.questions.length,
          sectionId: section.id,
        },
      });

      section.questions.forEach((question, questionIndex) => {
        const questionY = 150 + (questionIndex * questionSpacing);
        
        // Check if question has routing
        const hasRouting = question.routing && Object.keys(question.routing).length > 0;
        
        // Add question node
        newNodes.push({
          id: question.id,
          type: 'question',
          position: { x: sectionX, y: questionY },
          data: {
            label: `Q${sectionIndex + 1}.${questionIndex + 1}`,
            text: question.text,
            type: question.type,
            options: question.options || [],
            sectionTitle: section.title,
            questionId: question.id,
            sectionId: section.id,
            hasRouting: hasRouting,
          },
        });

        // Add edge from section to first question
        if (questionIndex === 0) {
          newEdges.push({
            id: `section-${section.id}-to-${question.id}`,
            source: `section-${section.id}`,
            target: question.id,
            type: 'smoothstep',
            style: { 
              stroke: '#fbbf24', 
              strokeWidth: 3,
              strokeDasharray: '10,5'
            },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24', width: 20, height: 20 },
            label: 'Start',
            labelStyle: { fontSize: 12, fontWeight: 'bold', fill: '#fbbf24' },
            labelBgStyle: { fill: 'white', fillOpacity: 0.9, rx: 4 },
          });
        }

        // Add routing edges with improved visibility
        if (question.routing && Object.keys(question.routing).length > 0) {
          Object.entries(question.routing).forEach(([optionId, route], routeIndex) => {
            let targetId;
            let edgeColor = '#6b7280';
            
            switch (route.type) {
              case 'question':
                targetId = route.target;
                edgeColor = '#3b82f6';
                break;
              case 'section':
                // Find first question in target section
                const targetSection = quiz.sections.find(s => s.slug === route.target);
                if (targetSection && targetSection.questions.length > 0) {
                  targetId = targetSection.questions[0].id;
                  edgeColor = '#10b981';
                } else {
                  // If section has no questions, route to end
                  targetId = 'end';
                  edgeColor = '#ef4444';
                }
                break;
              case 'end':
                targetId = 'end';
                edgeColor = '#ef4444';
                break;
              default:
                return; // Skip unknown route types
            }

            if (targetId) {
              const option = question.options?.find(opt => opt.id === optionId);
              const optionText = option ? option.text : `Option ${routeIndex + 1}`;
              
              const edgeId = `${question.id}-${optionId}-to-${targetId}`;
              
              newEdges.push({
                id: edgeId,
                source: question.id,
                target: targetId,
                type: 'smoothstep',
                style: { 
                  stroke: edgeColor, 
                  strokeWidth: 4,
                  strokeDasharray: route.type === 'end' ? '8,4' : 'none'
                },
                markerEnd: { 
                  type: MarkerType.ArrowClosed, 
                  color: edgeColor, 
                  width: 25, 
                  height: 25 
                },
                label: `${optionText.substring(0, 25)}${optionText.length > 25 ? '...' : ''}`,
                labelStyle: { 
                  fontSize: 11, 
                  fontWeight: 'bold', 
                  fill: edgeColor,
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                },
                labelBgStyle: { 
                  fill: 'white', 
                  fillOpacity: 0.95, 
                  rx: 6,
                  stroke: edgeColor,
                  strokeWidth: 1
                },
              });
            }
          });
        } else {
          // Default sequential flow with lighter styling
          const nextQuestion = section.questions[questionIndex + 1];
          if (nextQuestion) {
            newEdges.push({
              id: `${question.id}-to-${nextQuestion.id}`,
              source: question.id,
              target: nextQuestion.id,
              type: 'smoothstep',
              style: { 
                stroke: '#9ca3af', 
                strokeWidth: 2, 
                strokeDasharray: '8,8',
                opacity: 0.6
              },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af', width: 15, height: 15 },
              label: 'Standard',
              labelStyle: { fontSize: 10, fill: '#9ca3af' },
              labelBgStyle: { fill: 'white', fillOpacity: 0.8, rx: 3 },
            });
          } else {
            // Last question in section
            const nextSection = quiz.sections[sectionIndex + 1];
            if (nextSection && nextSection.questions.length > 0) {
              newEdges.push({
                id: `${question.id}-to-${nextSection.questions[0].id}`,
                source: question.id,
                target: nextSection.questions[0].id,
                type: 'smoothstep',
                style: { 
                  stroke: '#9ca3af', 
                  strokeWidth: 2, 
                  strokeDasharray: '8,8',
                  opacity: 0.6
                },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af', width: 15, height: 15 },
                label: 'Nächste Sektion',
                labelStyle: { fontSize: 10, fill: '#9ca3af' },
                labelBgStyle: { fill: 'white', fillOpacity: 0.8, rx: 3 },
              });
            } else {
              // End of quiz
              newEdges.push({
                id: `${question.id}-to-end`,
                source: question.id,
                target: 'end',
                type: 'smoothstep',
                style: { 
                  stroke: '#ef4444', 
                  strokeWidth: 2, 
                  strokeDasharray: '8,8',
                  opacity: 0.6
                },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444', width: 15, height: 15 },
                label: 'Quiz Ende',
                labelStyle: { fontSize: 10, fill: '#ef4444' },
                labelBgStyle: { fill: 'white', fillOpacity: 0.8, rx: 3 },
              });
            }
          }
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [quiz, setNodes, setEdges]);

  // Initialize flow when component mounts or quiz changes
  React.useEffect(() => {
    initializeFlow();
  }, [initializeFlow]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      style: { strokeWidth: 3, stroke: '#3b82f6' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
    }, eds)),
    [setEdges]
  );

  const addNewQuestion = useCallback(() => {
    if (!quiz.sections || quiz.sections.length === 0) {
      alert('Bitte fügen Sie zuerst eine Sektion hinzu.');
      return;
    }

    const newQuestion = {
      id: `q${Date.now()}`,
      text: 'Neue Frage',
      type: 'singleChoice',
      options: [
        { id: `opt${Date.now()}1`, text: 'Option 1', value: 'option1' },
        { id: `opt${Date.now()}2`, text: 'Option 2', value: 'option2' }
      ]
    };

    // Add to first section for now
    const updatedQuiz = {
      ...quiz,
      sections: quiz.sections.map((section, index) => 
        index === 0 
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    };

    onQuizUpdate(updatedQuiz);
  }, [quiz, onQuizUpdate]);

  const addNewSection = useCallback(() => {
    const newSection = {
      id: `section${Date.now()}`,
      title: 'Neue Sektion',
      slug: `neue-sektion-${Date.now()}`,
      questions: []
    };

    const updatedQuiz = {
      ...quiz,
      sections: [...(quiz.sections || []), newSection]
    };

    onQuizUpdate(updatedQuiz);
  }, [quiz, onQuizUpdate]);

  const exportQuiz = useCallback(() => {
    const dataStr = JSON.stringify(quiz, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${quiz.quizTitle || 'quiz'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [quiz]);

  const flowStats = useMemo(() => {
    const totalQuestions = quiz?.sections?.reduce((count, section) => count + section.questions.length, 0) || 0;
    const totalSections = quiz?.sections?.length || 0;
    const routedQuestions = quiz?.sections?.reduce((count, section) => 
      count + section.questions.filter(q => q.routing && Object.keys(q.routing).length > 0).length, 0) || 0;

    return { totalQuestions, totalSections, routedQuestions };
  }, [quiz]);

  return (
    <div className="h-screen w-full bg-gray-50">
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { strokeWidth: 3 },
            markerEnd: { type: MarkerType.ArrowClosed }
          }}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'question': return '#3b82f6';
                case 'section': return '#fbbf24';
                case 'end': return '#ef4444';
                default: return '#6b7280';
              }
            }}
            maskColor="rgba(255, 255, 255, 0.2)"
          />
          <Background variant="dots" gap={20} size={2} color="#e5e7eb" />
          
          {/* Control Panel */}
          <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{quiz?.quizTitle || 'Quiz Flow Editor'}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded"></span>
                    <span>{flowStats.totalSections} Sektionen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-400 rounded"></span>
                    <span>{flowStats.totalQuestions} Fragen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-orange-400 rounded"></span>
                    <span>{flowStats.routedQuestions} mit Routing</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={addNewSection}
                  className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                >
                  <FiPlus size={14} />
                  <span>Sektion</span>
                </button>
                
                <button
                  onClick={addNewQuestion}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <FiPlus size={14} />
                  <span>Frage</span>
                </button>
                
                <button
                  onClick={exportQuiz}
                  className="flex items-center space-x-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  <FiDownload size={14} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </Panel>

          {/* Enhanced Legend */}
          <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
            <h4 className="font-bold mb-3 text-gray-800">Legende</h4>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium mb-2 text-gray-700">Knotentypen:</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                    <span>📝 Einfachauswahl</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                    <span>☑️ Mehrfachauswahl</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded"></div>
                    <span>✏️ Texteingabe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                    <span>📁 Sektion</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                    <span>🏁 Quiz Ende</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <h5 className="font-medium mb-2 text-gray-700">Verbindungen:</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-1 bg-blue-500 rounded"></div>
                    <span>Routing zu Frage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-1 bg-green-500 rounded"></div>
                    <span>Routing zu Sektion</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-1 bg-red-500 rounded"></div>
                    <span>Routing zu Ende</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-1 bg-yellow-500 border-dashed border-t-2 border-yellow-500"></div>
                    <span>Sektion Start</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-1 bg-gray-400 border-dashed border-t-2 border-gray-400"></div>
                    <span>Standard Flow</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default QuizFlowEditor; 