import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { checkDomainAvailability, checkBulkDomains } from './domainChecker';
import * as storage from './storage';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from frontend build (for production)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Check single domain with multiple TLDs
app.post('/api/check-domain', async (req: Request, res: Response) => {
  try {
    const { domain, tlds } = req.body;

    if (!domain || !tlds || !Array.isArray(tlds)) {
      return res.status(400).json({ error: 'Domain name and TLDs array required' });
    }

    const results = await checkDomainAvailability(domain, tlds);
    res.json(results);
  } catch (error) {
    console.error('Error checking domain:', error);
    res.status(500).json({ error: 'Failed to check domain availability' });
  }
});

// Check multiple domains with multiple TLDs
app.post('/api/check-domains-bulk', async (req: Request, res: Response) => {
  try {
    const { domains, tlds } = req.body;

    if (!domains || !Array.isArray(domains) || !tlds || !Array.isArray(tlds)) {
      return res.status(400).json({ error: 'Domains array and TLDs array required' });
    }

    const results = await checkBulkDomains(domains, tlds);
    res.json(results);
  } catch (error) {
    console.error('Error checking domains:', error);
    res.status(500).json({ error: 'Failed to check domain availability' });
  }
});

// ========== STORAGE ENDPOINTS ==========

// Get all domains
app.get('/api/domains', (req: Request, res: Response) => {
  try {
    const domains = storage.getAllDomains();
    res.json(domains);
  } catch (error) {
    console.error('Error getting domains:', error);
    res.status(500).json({ error: 'Failed to retrieve domains' });
  }
});

// Add new domains (after checking)
app.post('/api/domains', async (req: Request, res: Response) => {
  try {
    const { domains, tlds } = req.body;

    if (!domains || !Array.isArray(domains) || !tlds || !Array.isArray(tlds)) {
      return res.status(400).json({ error: 'Domains array and TLDs array required' });
    }

    // Check availability first
    const results = await checkBulkDomains(domains, tlds);

    // Convert to DomainSuggestion format
    const newDomains: storage.DomainSuggestion[] = results.map((result: any) => ({
      id: `${result.domain}-${Date.now()}-${Math.random()}`,
      domain: result.domain,
      availability: result.availability,
      timestamp: result.timestamp,
      isFavorite: false,
      lastChecked: result.timestamp
    }));

    // Add to storage
    const allDomains = storage.addDomains(newDomains);
    res.json(allDomains);
  } catch (error) {
    console.error('Error adding domains:', error);
    res.status(500).json({ error: 'Failed to add domains' });
  }
});

// Toggle favorite
app.patch('/api/domains/:id/favorite', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const domains = storage.toggleFavorite(id);
    res.json(domains);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// Remove domain
app.delete('/api/domains/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const domains = storage.removeDomain(id);
    res.json(domains);
  } catch (error) {
    console.error('Error removing domain:', error);
    res.status(500).json({ error: 'Failed to remove domain' });
  }
});

// Reverify favorites
app.post('/api/domains/reverify', async (req: Request, res: Response) => {
  try {
    const { tlds } = req.body;

    if (!tlds || !Array.isArray(tlds)) {
      return res.status(400).json({ error: 'TLDs array required' });
    }

    // Get all favorite domains
    const allDomains = storage.getAllDomains();
    const favorites = allDomains.filter(d => d.isFavorite);

    if (favorites.length === 0) {
      return res.json(allDomains);
    }

    // Re-check availability
    const domainNames = favorites.map(d => d.domain);
    const results = await checkBulkDomains(domainNames, tlds);

    // Create update map
    const updates = new Map();
    results.forEach((result: any) => {
      updates.set(result.domain, {
        availability: result.availability,
        lastChecked: result.timestamp
      });
    });

    // Update storage
    const updatedDomains = storage.updateMultipleDomains(updates);
    res.json(updatedDomains);
  } catch (error) {
    console.error('Error reverifying domains:', error);
    res.status(500).json({ error: 'Failed to reverify domains' });
  }
});

// Clear all domains (useful for testing)
app.delete('/api/domains', (req: Request, res: Response) => {
  try {
    storage.clearAllDomains();
    res.json({ message: 'All domains cleared' });
  } catch (error) {
    console.error('Error clearing domains:', error);
    res.status(500).json({ error: 'Failed to clear domains' });
  }
});

// Catch-all route: serve frontend for any non-API routes (must be last)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('📁 Using file-based storage for shared domain data');
  console.log('🌍 Serving frontend from:', publicPath);
});
