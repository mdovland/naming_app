import React from 'react';
import { DomainSuggestion, TLD } from '../types';

interface ShortlistProps {
  domains: DomainSuggestion[];
  visibleTLDs: TLD[];
  onToggleFavorite: (id: string) => void;
  onReverify: () => void;
  isReverifying: boolean;
}

export const Shortlist: React.FC<ShortlistProps> = ({
  domains,
  visibleTLDs,
  onToggleFavorite,
  onReverify,
  isReverifying
}) => {
  const getStatusBadge = (available: boolean | null) => {
    if (available === null) {
      return <span className="status-badge status-unknown">Unknown</span>;
    }
    if (available === true) {
      return <span className="status-badge status-available">Available</span>;
    }
    return <span className="status-badge status-taken">Taken</span>;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="table-section">
      <h2>
        Shortlist (Favorites)
        {domains.length > 0 && (
          <div className="table-actions">
            <button
              className="secondary"
              onClick={onReverify}
              disabled={isReverifying}
            >
              {isReverifying ? 'Re-verifying...' : 'Re-verify All'}
            </button>
          </div>
        )}
      </h2>

      {domains.length === 0 ? (
        <div className="empty-state">
          <p>No favorites yet. Click the star (☆) icon on domains to add them to your shortlist.</p>
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Domain Name</th>
                {visibleTLDs.map(tld => (
                  <th key={tld}>.{tld}</th>
                ))}
                <th>Last Checked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map(domain => (
                <tr key={domain.id}>
                  <td><strong>{domain.domain}</strong></td>
                  {visibleTLDs.map(tld => (
                    <td key={tld}>
                      {getStatusBadge(domain.availability[tld])}
                    </td>
                  ))}
                  <td style={{ fontSize: '12px', color: '#666' }}>
                    {formatDate(domain.lastChecked || domain.timestamp)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-button favorite"
                        onClick={() => onToggleFavorite(domain.id)}
                        title="Remove from shortlist"
                      >
                        ★
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Shortlisted</span>
              <span className="stat-value">{domains.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">All Available</span>
              <span className="stat-value">
                {domains.filter(d =>
                  visibleTLDs.every(tld => d.availability[tld] === true)
                ).length}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
