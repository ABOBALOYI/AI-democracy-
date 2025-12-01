import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDelete = (e, convId) => {
    e.stopPropagation();
    if (onDeleteConversation) {
      onDeleteConversation(convId);
    }
  };

  // Filter out empty conversations (no messages and default title)
  const activeConversations = conversations.filter(
    (conv) => conv.message_count > 0 || conv.title !== 'New Conversation'
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
          </svg>
          <span>LLM Council</span>
        </div>
        <button className="new-conversation-btn" onClick={onNewConversation}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
          </svg>
          New Chat
        </button>
      </div>

      <div className="conversation-list">
        {activeConversations.length === 0 ? (
          <div className="no-conversations">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>
            <span>No conversations yet</span>
            <span className="no-conversations-hint">Start a new chat to begin</span>
          </div>
        ) : (
          activeConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="conversation-info">
                <div className="conversation-title">
                  {conv.title || 'New Conversation'}
                </div>
                <div className="conversation-meta">
                  <span>{formatDate(conv.created_at)}</span>
                  <span className="meta-dot">•</span>
                  <span>{conv.message_count} msg{conv.message_count !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <button 
                className="conversation-delete"
                onClick={(e) => handleDelete(e, conv.id)}
                title="Delete conversation"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
