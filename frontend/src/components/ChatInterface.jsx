import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import './ChatInterface.css';

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
  councilModels = [],
  chairmanModel,
  onChairmanChange,
}) {
  const [input, setInput] = useState('');
  const [showChairmanMenu, setShowChairmanMenu] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const messagesEndRef = useRef(null);
  const chairmanMenuRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chairmanMenuRef.current && !chairmanMenuRef.current.contains(e.target)) {
        setShowChairmanMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key to close modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowCompareModal(false);
        setSelectedResponse(null);
        setShowChairmanMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Get all AI responses from conversation
  const getAIResponses = () => {
    if (!conversation?.messages) return [];
    const responses = [];
    conversation.messages.forEach((msg) => {
      if (msg.role === 'assistant' && msg.stage1) {
        msg.stage1.forEach((resp) => {
          responses.push({
            model: resp.model,
            shortName: resp.model.split('/')[1] || resp.model,
            response: resp.response,
          });
        });
      }
    });
    return responses;
  };

  const aiResponses = getAIResponses();

  const handleSelectChairman = (model) => {
    onChairmanChange(model);
    setShowChairmanMenu(false);
  };

  const getShortModelName = (model) => model?.split('/')[1] || model || 'Auto';

  if (!conversation) {
    return (
      <div className="chat-interface">
        <div className="empty-state">
          <h2>Welcome to LLM Council</h2>
          <p>Create a new conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      {/* Chat Header with Title */}
      <div className="chat-header">
        <h2 className="chat-title">{conversation.title || 'New Conversation'}</h2>
      </div>

      <div className="messages-container">
        {conversation.messages.length === 0 ? (
          <div className="empty-state">
            <h2>Start a conversation</h2>
            <p>Ask a question to consult the LLM Council</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="message-group">
              {msg.role === 'user' ? (
                <div className="user-message">
                  <div className="message-label">You</div>
                  <div className="message-content">
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="assistant-message">
                  <div className="message-label">LLM Council</div>
                  {msg.loading?.stage1 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Running Stage 1: Collecting individual responses...</span>
                    </div>
                  )}
                  {msg.stage1 && <Stage1 responses={msg.stage1} />}
                  {msg.loading?.stage2 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Running Stage 2: Peer rankings...</span>
                    </div>
                  )}
                  {msg.stage2 && (
                    <Stage2
                      rankings={msg.stage2}
                      labelToModel={msg.metadata?.label_to_model}
                      aggregateRankings={msg.metadata?.aggregate_rankings}
                    />
                  )}
                  {msg.loading?.stage3 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Running Stage 3: Final synthesis...</span>
                    </div>
                  )}
                  {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Consulting the council...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Single Response Modal */}
      {selectedResponse && (
        <div className="response-modal-overlay" onClick={() => setSelectedResponse(null)}>
          <div className="response-modal" onClick={(e) => e.stopPropagation()}>
            <div className="response-modal-header">
              <div className="response-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="response-modal-title">
                <span className="model-label">{selectedResponse.shortName}</span>
                <span className="model-full">{selectedResponse.model}</span>
              </div>
              <button className="response-modal-close" onClick={() => setSelectedResponse(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            <div className="response-modal-content markdown-content">
              <ReactMarkdown>{selectedResponse.response}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Compare All Modal */}
      {showCompareModal && aiResponses.length > 0 && (
        <div className="compare-modal-overlay" onClick={() => setShowCompareModal(false)}>
          <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compare-modal-header">
              <div className="compare-modal-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
                <span>Compare All Responses</span>
                <span className="compare-count">{aiResponses.length} models</span>
              </div>
              <button className="compare-modal-close" onClick={() => setShowCompareModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            <div className="compare-modal-content">
              {aiResponses.map((resp, idx) => (
                <div key={idx} className="compare-card">
                  <div className="compare-card-header">
                    <span className="compare-card-name">{resp.shortName}</span>
                    <span className="compare-card-provider">{resp.model.split('/')[0]}</span>
                  </div>
                  <div className="compare-card-content markdown-content">
                    <ReactMarkdown>{resp.response}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          className="message-input"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={2}
        />
        <div className="input-controls">
          {/* Compare All Button - only show when there are responses */}
          {aiResponses.length > 0 && (
            <button 
              type="button" 
              className="control-btn compare-btn"
              onClick={() => setShowCompareModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
              </svg>
              Compare ({aiResponses.length})
            </button>
          )}

          {/* Chairman Selector */}
          <div className="chairman-wrapper" ref={chairmanMenuRef}>
            <button 
              type="button" 
              className={`control-btn chairman-btn ${showChairmanMenu ? 'active' : ''}`}
              onClick={() => setShowChairmanMenu(!showChairmanMenu)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
              </svg>
              <span className="chairman-name">{chairmanModel ? getShortModelName(chairmanModel) : 'Auto'}</span>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
              </svg>
            </button>
            {showChairmanMenu && (
              <div className="chairman-menu">
                <div className="chairman-menu-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
                  <span>Select Chairman</span>
                </div>
                <div className="chairman-menu-list">
                  {/* Auto option */}
                  <button
                    className={`chairman-menu-item ${!chairmanModel ? 'selected' : ''}`}
                    onClick={() => handleSelectChairman(null)}
                  >
                    <span className="chairman-item-name">Auto (Winner)</span>
                    <span className="chairman-item-provider">Top ranked model</span>
                    {!chairmanModel && (
                      <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                  <div className="chairman-menu-divider"></div>
                  {councilModels.map((model) => (
                    <button
                      key={model}
                      className={`chairman-menu-item ${model === chairmanModel ? 'selected' : ''}`}
                      onClick={() => handleSelectChairman(model)}
                    >
                      <span className="chairman-item-name">{model.split('/')[1] || model}</span>
                      <span className="chairman-item-provider">{model.split('/')[0]}</span>
                      {model === chairmanModel && (
                        <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="send-button" disabled={!input.trim() || isLoading}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
