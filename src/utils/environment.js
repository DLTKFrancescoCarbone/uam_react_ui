// Environment configuration
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

// Disable React Fast Refresh WebSocket in production
if (isProd && typeof window !== 'undefined') {
  // This prevents the WebSocket connection attempts in production
  window.__REACT_REFRESH_RUNTIME__ = {
    performReactRefresh: () => {},
    register: () => {},
    createSignatureFunctionForTransform: () => () => {},
  };
}

export { isProd, isDev };
