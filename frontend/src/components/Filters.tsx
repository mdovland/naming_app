import React from 'react';
import { TLD, FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const allTLDs: TLD[] = ['com', 'ai', 'se', 'no'];

  const handleTLDToggle = (tld: TLD) => {
    const newTLDs = filters.tlds.includes(tld)
      ? filters.tlds.filter(t => t !== tld)
      : [...filters.tlds, tld];

    onFilterChange({
      ...filters,
      tlds: newTLDs
    });
  };

  const handleShowOnlyAvailableToggle = () => {
    onFilterChange({
      ...filters,
      showOnlyAvailable: !filters.showOnlyAvailable
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchText: e.target.value
    });
  };

  return (
    <div className="filters">
      <h3>Filters</h3>
      <div className="filter-group">
        <div>
          <strong style={{ marginRight: '10px', fontSize: '14px' }}>TLDs:</strong>
          <div className="checkbox-group" style={{ display: 'inline-flex' }}>
            {allTLDs.map(tld => (
              <label key={tld} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.tlds.includes(tld)}
                  onChange={() => handleTLDToggle(tld)}
                />
                .{tld}
              </label>
            ))}
          </div>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.showOnlyAvailable}
            onChange={handleShowOnlyAvailableToggle}
          />
          Show only available domains
        </label>

        <input
          type="text"
          className="search-input"
          placeholder="Search domain names..."
          value={filters.searchText}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};
