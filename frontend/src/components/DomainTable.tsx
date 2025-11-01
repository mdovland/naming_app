import React from 'react';
import { DomainSuggestion, TLD } from '../types';

interface DomainTableProps {
  domains: DomainSuggestion[];
  visibleTLDs: TLD[];
  onToggleFavorite: (id: string) => void;
  onRemove?: (id: string) => void;
  title: string;
  showActions?: boolean;
  emptyMessage?: string;
}

export const DomainTable: React.FC<DomainTableProps> = ({
  domains,
  visibleTLDs,
  onToggleFavorite,
  onRemove,
  title,
  showActions = true,
  emptyMessage = 'No domains to display'
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

  const exportToCSV = () => {
    const headers = ['Domain', ...visibleTLDs.map(tld => `.${tld}`), 'Added'];
    const rows = domains.map(domain => [
      domain.domain,
      ...visibleTLDs.map(tld => {
        const avail = domain.availability[tld];
        return avail === null ? 'Unknown' : avail ? 'Available' : 'Taken';
      }),
      formatDate(domain.timestamp)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domain-check-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="table-section">
      <h2>
        {title}
        {domains.length > 0 && (
          <div className="table-actions">
            <button className="secondary" onClick={exportToCSV}>
              Export CSV
            </button>
          </div>
        )}
      </h2>

      {domains.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
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
                <th>Added</th>
                {showActions && <th>Actions</th>}
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
                    {formatDate(domain.timestamp)}
                  </td>
                  {showActions && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className={`icon-button ${domain.isFavorite ? 'favorite' : ''}`}
                          onClick={() => onToggleFavorite(domain.id)}
                          title={domain.isFavorite ? 'Remove from shortlist' : 'Add to shortlist'}
                        >
                          {domain.isFavorite ? '★' : '☆'}
                        </button>
                        {onRemove && (
                          <button
                            className="icon-button"
                            onClick={() => onRemove(domain.id)}
                            title="Remove"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total Domains</span>
              <span className="stat-value">{domains.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">In Shortlist</span>
              <span className="stat-value">
                {domains.filter(d => d.isFavorite).length}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
