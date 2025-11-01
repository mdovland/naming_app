export interface DomainSuggestion {
  id: string;
  domain: string;
  availability: {
    [key: string]: boolean | null;
  };
  timestamp: string;
  isFavorite: boolean;
  lastChecked?: string;
}

export type TLD = 'com' | 'ai' | 'se' | 'no';

export interface FilterState {
  tlds: TLD[];
  showOnlyAvailable: boolean;
  searchText: string;
}
