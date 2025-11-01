import fs from 'fs';
import path from 'path';

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

// Use environment variable or default path
// In production (Railway), volume is at /app/backend/data
// In development, it's relative to dist folder
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'domains.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created data directory:', DATA_DIR);
  }
}

// Initialize storage file if it doesn't exist
function initializeStorage() {
  console.log(`📂 Storage location: ${DATA_DIR}`);
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    console.log('📝 Created domains.json file at:', DATA_FILE);
  } else {
    console.log('📄 Found existing domains.json at:', DATA_FILE);
  }
}

/**
 * Read all domains from storage
 */
export function getAllDomains(): DomainSuggestion[] {
  try {
    initializeStorage();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const domains = JSON.parse(data);
    console.log(`✅ Loaded ${domains.length} domains from server (${DATA_DIR})`);
    return domains;
  } catch (error) {
    console.error('Error reading domains:', error);
    return [];
  }
}

/**
 * Save all domains to storage
 */
export function saveAllDomains(domains: DomainSuggestion[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(domains, null, 2));
    console.log(`💾 Saved ${domains.length} domains to storage`);
    return true;
  } catch (error) {
    console.error('Error saving domains:', error);
    return false;
  }
}

/**
 * Add new domains to storage
 */
export function addDomains(newDomains: DomainSuggestion[]): DomainSuggestion[] {
  const existingDomains = getAllDomains();
  const updated = [...newDomains, ...existingDomains];
  saveAllDomains(updated);
  return updated;
}

/**
 * Update a specific domain
 */
export function updateDomain(id: string, updates: Partial<DomainSuggestion>): DomainSuggestion[] {
  const domains = getAllDomains();
  const updatedDomains = domains.map(domain =>
    domain.id === id ? { ...domain, ...updates } : domain
  );
  saveAllDomains(updatedDomains);
  return updatedDomains;
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id: string): DomainSuggestion[] {
  const domains = getAllDomains();
  const updatedDomains = domains.map(domain =>
    domain.id === id ? { ...domain, isFavorite: !domain.isFavorite } : domain
  );
  saveAllDomains(updatedDomains);
  return updatedDomains;
}

/**
 * Remove a domain
 */
export function removeDomain(id: string): DomainSuggestion[] {
  const domains = getAllDomains();
  const updatedDomains = domains.filter(domain => domain.id !== id);
  saveAllDomains(updatedDomains);
  return updatedDomains;
}

/**
 * Update multiple domains (for reverification)
 */
export function updateMultipleDomains(updates: Map<string, Partial<DomainSuggestion>>): DomainSuggestion[] {
  const domains = getAllDomains();
  const updatedDomains = domains.map(domain => {
    if (updates.has(domain.domain)) {
      return { ...domain, ...updates.get(domain.domain) };
    }
    return domain;
  });
  saveAllDomains(updatedDomains);
  return updatedDomains;
}

/**
 * Clear all domains (useful for testing)
 */
export function clearAllDomains(): boolean {
  return saveAllDomains([]);
}

// Initialize storage on module load
initializeStorage();
