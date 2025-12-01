import ReactMarkdown from 'react-markdown';
import './Stage3.css';

export default function Stage3({ finalResponse, isAutoChairman = true }) {
  if (!finalResponse) {
    return null;
  }

  const modelName = finalResponse.model.split('/')[1] || finalResponse.model;

  return (
    <div className="stage stage3">
      <h3 className="stage-title">Stage 3: Final Council Answer</h3>
      <div className="final-response">
        <div className="chairman-label">
          <span className="chairman-icon">👑</span>
          Chairman: {modelName}
          {isAutoChairman && <span className="winner-badge">Winner</span>}
        </div>
        <div className="final-text markdown-content">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
