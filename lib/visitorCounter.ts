// lib/visitorCounter.ts

export const incrementVisitorCount = () => {
    if (typeof window !== 'undefined') {
      const currentCount = localStorage.getItem('visitorCount');
      const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
      localStorage.setItem('visitorCount', newCount.toString());
    }
  };
  
  export const getVisitorCount = () => {
    if (typeof window !== 'undefined') {
      const currentCount = localStorage.getItem('visitorCount');
      return currentCount ? parseInt(currentCount) : 0;
    }
    return 0;
  };
  