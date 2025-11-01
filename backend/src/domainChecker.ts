import axios from 'axios';

interface DomainAvailability {
  domain: string;
  tld: string;
  available: boolean | null;
  error?: string;
}

interface DomainResult {
  domain: string;
  availability: {
    [key: string]: boolean | null;
  };
  timestamp: string;
}

// Delay helper for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check domain availability using RapidAPI Domainr
 */
async function checkWithRapidAPI(domain: string, tld: string): Promise<boolean | null> {
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST || 'domainr.p.rapidapi.com';

  if (!apiKey) {
    console.warn('RAPIDAPI_KEY not configured, using fallback DNS check');
    return checkWithDNS(domain, tld);
  }

  try {
    const fullDomain = `${domain}.${tld}`;
    console.log(`🔍 Checking ${fullDomain} with RapidAPI...`);

    // Use Domainr status endpoint for checking domain availability
    const response = await axios.get('https://domainr.p.rapidapi.com/v2/status', {
      params: {
        'domain': fullDomain
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      },
      timeout: 10000
    });

    console.log(`✅ RapidAPI response for ${fullDomain}:`, JSON.stringify(response.data, null, 2));

    // Domainr status response structure:
    // status[0].summary: "inactive", "active", "undelegated", etc.
    // "inactive" or "undelegated" typically means available
    // "active" means registered

    if (response.data && response.data.status && response.data.status.length > 0) {
      const domainStatus = response.data.status[0];
      const summary = domainStatus.summary?.toLowerCase();

      // Available states: inactive, undelegated, unknown
      // Taken states: active, parked, redirect, etc.
      const availableStates = ['inactive', 'undelegated', 'unknown'];
      const isAvailable = availableStates.includes(summary);

      console.log(`📊 ${fullDomain} - Status: ${summary} - Available: ${isAvailable}`);
      return isAvailable;
    }

    return null; // Unknown status
  } catch (error: any) {
    console.error(`❌ RapidAPI error for ${domain}.${tld}:`, error.response?.status, error.response?.data || error.message);

    // If RapidAPI fails, fallback to DNS check
    console.log(`⚠️  Falling back to DNS check for ${domain}.${tld}`);
    return checkWithDNS(domain, tld);
  }
}

/**
 * Fallback: Check domain availability using DNS lookup
 */
async function checkWithDNS(domain: string, tld: string): Promise<boolean | null> {
  const fullDomain = `${domain}.${tld}`;

  try {
    // Use Google DNS API for checking
    const dnsCheck = await axios.get(`https://dns.google/resolve?name=${fullDomain}&type=A`, {
      timeout: 5000,
      validateStatus: () => true
    });

    // If DNS resolves, domain is likely taken
    if (dnsCheck.data && dnsCheck.data.Answer && dnsCheck.data.Answer.length > 0) {
      return false; // Domain is taken
    }

    // No DNS record found - might be available
    return true;

  } catch (error) {
    // DNS lookup failed - unknown status
    return null;
  }
}

/**
 * Check single domain with single TLD
 */
async function checkSingleDomain(domain: string, tld: string): Promise<DomainAvailability> {
  const fullDomain = `${domain}.${tld}`;

  try {
    const available = await checkWithRapidAPI(domain, tld);

    return {
      domain: fullDomain,
      tld,
      available
    };
  } catch (error: any) {
    return {
      domain: fullDomain,
      tld,
      available: null,
      error: error.message || 'Unable to verify'
    };
  }
}

/**
 * Check domain availability across multiple TLDs
 */
export async function checkDomainAvailability(domain: string, tlds: string[]): Promise<DomainResult> {
  const availability: { [key: string]: boolean | null } = {};

  // Check each TLD with a delay to avoid rate limiting
  for (let i = 0; i < tlds.length; i++) {
    const tld = tlds[i];
    const result = await checkSingleDomain(domain, tld);
    availability[tld] = result.available;

    // Add delay between checks to respect RapidAPI rate limits
    // Free tier has strict rate limits
    if (i < tlds.length - 1) {
      await delay(1500); // 1.5 seconds between each TLD check
    }
  }

  return {
    domain,
    availability,
    timestamp: new Date().toISOString()
  };
}

/**
 * Check multiple domains across multiple TLDs
 */
export async function checkBulkDomains(domains: string[], tlds: string[]): Promise<DomainResult[]> {
  const results: DomainResult[] = [];

  console.log(`Checking ${domains.length} domains across ${tlds.length} TLDs...`);

  // Process domains sequentially to respect rate limits
  // RapidAPI free tier: 10,000 requests/month
  // That's about 333 requests/day or ~14 per hour to be safe

  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];
    console.log(`Checking domain ${i + 1}/${domains.length}: ${domain}`);

    const result = await checkDomainAvailability(domain, tlds);
    results.push(result);

    // Add delay between domains (already have delay between TLDs)
    if (i < domains.length - 1) {
      console.log('⏳ Waiting 2 seconds before next domain to respect rate limits...');
      await delay(2000); // 2 seconds between domains
    }
  }

  console.log(`Completed checking ${domains.length} domains`);
  return results;
}

/**
 * Re-verify a list of domains (used for shortlist re-checking)
 */
export async function reverifyDomains(domains: string[], tlds: string[]): Promise<DomainResult[]> {
  console.log(`Re-verifying ${domains.length} domains...`);
  return checkBulkDomains(domains, tlds);
}
