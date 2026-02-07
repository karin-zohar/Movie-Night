// 'key':  API name 
// 'value' : list of timestamps of when the API was last called
const apiRequestRegistry = new Map<string, number[]>();

export const waitForRateLimit = async (
  key: string, 
  maxRequests: number, 
  intervalInSeconds: number
): Promise<void> => {

  if (!apiRequestRegistry.has(key)) {
    apiRequestRegistry.set(key, []);
  }
  const timestamps = apiRequestRegistry.get(key)!;

  const now = Date.now();
  const windowStart = now - intervalInSeconds * 1000;

  const recentTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);
  timestamps.length = 0; // empties the array
  timestamps.push(...recentTimestamps);

  if (timestamps.length >= maxRequests) {
    const waitTime = timestamps[0] + intervalInSeconds * 1000 - now;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    
    return waitForRateLimit(key, maxRequests, intervalInSeconds);
  }

  timestamps.push(Date.now());
};