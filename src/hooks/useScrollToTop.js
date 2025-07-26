import { useCallback } from 'react';

const useScrollToTop = () => {
  return useCallback(() => {
    // Multiple fallback methods for reliable scrolling
    const scrollMethods = [
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      () => window.scrollTo(0, 0),
      () => document.documentElement.scrollTop = 0,
      () => document.body.scrollTop = 0
    ];

    // Try each method with a small delay between attempts
    scrollMethods.forEach((method, index) => {
      setTimeout(() => {
        try {
          method();
        } catch (error) {
          console.warn(`Scroll method ${index + 1} failed:`, error);
        }
      }, index * 10);
    });

    // Additional fallback with requestAnimationFrame
    requestAnimationFrame(() => {
      try {
        window.scrollTo(0, 0);
      } catch (error) {
        console.warn('RequestAnimationFrame scroll failed:', error);
      }
    });
  }, []);
};

// New hook for scrolling specific containers
const useScrollContainerToTop = () => {
  return useCallback((containerSelector) => {
    const scrollContainer = (selector) => {
      try {
        const container = document.querySelector(selector);
        if (container) {
          // Multiple scroll methods for containers
          const methods = [
            () => container.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
            () => container.scrollTo(0, 0),
            () => { container.scrollTop = 0; }
          ];

          methods.forEach((method, index) => {
            setTimeout(() => {
              try {
                method();
              } catch (error) {
                console.warn(`Container scroll method ${index + 1} failed:`, error);
              }
            }, index * 10);
          });

          // Additional fallback with requestAnimationFrame
          requestAnimationFrame(() => {
            try {
              container.scrollTop = 0;
            } catch (error) {
              console.warn('Container scroll RAF failed:', error);
            }
          });
        }
      } catch (error) {
        console.warn('Container scroll failed:', error);
      }
    };

    if (containerSelector) {
      scrollContainer(containerSelector);
    }
  }, []);
};

export default useScrollToTop;
export { useScrollContainerToTop };