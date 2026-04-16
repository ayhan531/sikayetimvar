import createCache from '@emotion/cache';

export const createEmotionCache = () => {
  return createCache({
    key: 'mui',
    prepend: true,
  });
};
