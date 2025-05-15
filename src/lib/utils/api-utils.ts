/**
 * Utility functions for API requests with improved error handling and retries
 */

/**
 * Fetch with timeout to prevent hanging requests
 * @param url The URL to fetch
 * @param options Fetch options
 * @param timeout Timeout in milliseconds
 * @returns Promise that resolves to the fetch response or rejects with timeout error
 */
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = 10000
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]) as Promise<Response>;
};

/**
 * Fetch with retry logic for more reliable API requests
 * @param url The URL to fetch
 * @param options Fetch options
 * @param maxRetries Maximum number of retries
 * @param timeout Timeout in milliseconds
 * @returns Promise that resolves to the fetch response or rejects after all retries fail
 */
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  timeout = 10000
): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add cache-busting parameter
      const urlWithTimestamp = url.includes('?') 
        ? `${url}&_t=${Date.now()}`
        : `${url}?_t=${Date.now()}`;
      
      // Add cache control headers
      const optionsWithCacheControl = {
        ...options,
        headers: {
          ...options.headers,
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      };
      
      // Attempt the fetch with timeout
      const response = await fetchWithTimeout(urlWithTimestamp, optionsWithCacheControl, timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Otherwise, wait before retrying
      console.warn(`API request failed (attempt ${attempt + 1}/${maxRetries + 1}): ${lastError.message}`);
      console.log(`Retrying in ${(attempt + 1) * 1000}ms...`);
      
      // Wait longer between each retry
      await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
    }
  }
  
  // This should never happen due to the throw in the loop, but TypeScript needs it
  throw lastError || new Error('Unknown error in fetchWithRetry');
};

/**
 * Fetch JSON data with retry logic
 * @param url The URL to fetch
 * @param options Fetch options
 * @param maxRetries Maximum number of retries
 * @param timeout Timeout in milliseconds
 * @returns Promise that resolves to the parsed JSON data
 */
export const fetchJsonWithRetry = async <T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  timeout = 10000
): Promise<T> => {
  const response = await fetchWithRetry(url, options, maxRetries, timeout);
  return await response.json() as T;
};
