
// In a real app, this would use fetch()
const DATA_MAP: Record<string, any> = {
  // Empty as constitution default data is removed
};

export const fetcher = <T>(url: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    // Reduced latency for better UX
    setTimeout(() => {
      const data = DATA_MAP[url];
      if (data) {
        resolve(data as T);
      } else {
        reject(new Error(`404 Not Found: ${url}`));
      }
    }, 200); 
  });
};
