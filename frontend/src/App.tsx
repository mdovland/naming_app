import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DomainInput } from './components/DomainInput';
import { Filters } from './components/Filters';
import { DomainTable } from './components/DomainTable';
import { Shortlist } from './components/Shortlist';
import { DomainSuggestion, TLD, FilterState } from './types';
import './App.css';

const ALL_TLDS: TLD[] = ['com', 'ai', 'se', 'no'];

function App() {
  const [domains, setDomains] = useState<DomainSuggestion[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isReverifying, setIsReverifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    tlds: ALL_TLDS,
    showOnlyAvailable: false,
    searchText: ''
  });

  // Load data from backend on mount
  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const response = await axios.get('/api/domains');
      setDomains(response.data);
      console.log(`✅ Loaded ${response.data.length} domains from server`);
    } catch (error) {
      console.error('Error loading domains:', error);
      alert('Failed to load domains from server. Please check that the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkDomains = async (domainNames: string[]) => {
    setIsChecking(true);

    try {
      console.log('Checking domains:', domainNames);

      // Use the new endpoint that checks AND saves
      const response = await axios.post('/api/domains', {
        domains: domainNames,
        tlds: ALL_TLDS
      });

      console.log('Check response:', response.data);

      // Update local state with all domains from server
      setDomains(response.data);
    } catch (error: any) {
      console.error('Error checking domains:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to check domains: ${errorMessage}\n\nPlease check:\n1. Backend server is running on port 3001\n2. Browser console for details`);
    } finally {
      setIsChecking(false);
    }
  };

  const reverifyShortlist = async () => {
    const shortlistedDomains = domains.filter(d => d.isFavorite);
    if (shortlistedDomains.length === 0) return;

    setIsReverifying(true);

    try {
      console.log('Re-verifying shortlisted domains...');

      const response = await axios.post('/api/domains/reverify', {
        tlds: ALL_TLDS
      });

      console.log('Re-verification response:', response.data);

      // Update local state with all domains from server
      setDomains(response.data);
    } catch (error: any) {
      console.error('Error reverifying domains:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to reverify domains: ${errorMessage}\n\nPlease check:\n1. Backend server is running\n2. Browser console for details`);
    } finally {
      setIsReverifying(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const response = await axios.patch(`/api/domains/${id}/favorite`);
      setDomains(response.data);
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite status');
    }
  };

  const removeDomain = async (id: string) => {
    try {
      const response = await axios.delete(`/api/domains/${id}`);
      setDomains(response.data);
    } catch (error: any) {
      console.error('Error removing domain:', error);
      alert('Failed to remove domain');
    }
  };

  // Filter domains based on current filters
  const filteredDomains = domains.filter(domain => {
    // Search filter
    if (filters.searchText && !domain.domain.toLowerCase().includes(filters.searchText.toLowerCase())) {
      return false;
    }

    // Show only available filter
    if (filters.showOnlyAvailable) {
      const hasAnyAvailable = filters.tlds.some(tld => domain.availability[tld] === true);
      if (!hasAnyAvailable) return false;
    }

    return true;
  });

  const shortlistedDomains = filteredDomains.filter(d => d.isFavorite);

  if (isLoading) {
    return (
      <div className="app">
        <header>
          <h1>🌐 Domain Name Availability Checker</h1>
          <p>Check domain availability across .com, .ai, .se, and .no extensions</p>
        </header>
        <div className="loading">
          <p>⏳ Loading domains from server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>🌐 Domain Name Availability Checker</h1>
        <p>Check domain availability across .com, .ai, .se, and .no extensions</p>
        <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
          ✨ Shared with your team - all changes are synced!
        </p>
      </header>

      <DomainInput onAddDomains={checkDomains} isChecking={isChecking} />

      <Filters filters={filters} onFilterChange={setFilters} />

      <Shortlist
        domains={shortlistedDomains}
        visibleTLDs={filters.tlds}
        onToggleFavorite={toggleFavorite}
        onReverify={reverifyShortlist}
        isReverifying={isReverifying}
      />

      <DomainTable
        domains={filteredDomains}
        visibleTLDs={filters.tlds}
        onToggleFavorite={toggleFavorite}
        onRemove={removeDomain}
        title="All Domain Suggestions"
        emptyMessage="No domain suggestions yet. Add some domains above to get started!"
      />
    </div>
  );
}

export default App;
