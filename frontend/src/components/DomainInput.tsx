import React, { useState } from 'react';

interface DomainInputProps {
  onAddDomains: (domains: string[]) => void;
  isChecking: boolean;
}

export const DomainInput: React.FC<DomainInputProps> = ({ onAddDomains, isChecking }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    // Parse input - split by newlines and filter out empty lines
    const domains = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      // Remove any domain extensions if user included them
      .map(domain => domain.replace(/\.(com|ai|se|no)$/i, ''))
      // Remove any invalid characters
      .map(domain => domain.toLowerCase().replace(/[^a-z0-9-]/g, ''))
      .filter(domain => domain.length > 0);

    if (domains.length > 0) {
      onAddDomains(domains);
      setInputText('');
    }
  };

  return (
    <div className="input-section">
      <h2>Add Domain Suggestions</h2>
      <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
        Enter domain names (one per line, without extensions like .com or .ai)
      </p>
      <div className="input-group">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={'Example:\nnordicai\naicompany\nscandinavia-tech'}
          disabled={isChecking}
        />
      </div>
      <button onClick={handleSubmit} disabled={isChecking || !inputText.trim()}>
        {isChecking ? 'Checking...' : 'Check Availability'}
      </button>
      <div className="stats" style={{ marginTop: '15px' }}>
        <div className="stat-item">
          <span className="stat-label">Domains to check</span>
          <span className="stat-value">
            {inputText.split('\n').filter(line => line.trim().length > 0).length}
          </span>
        </div>
      </div>
    </div>
  );
};
