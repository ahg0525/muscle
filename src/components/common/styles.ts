import { css } from '@emotion/react';

export const breakpoints = {
  mobile: 768,
  desktop: 769,
  maxWidth: 1400
};

export const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #000000;
    color: #ffffff;
    min-height: 100vh;
  }
`;

export const containerStyles = css`
  max-width: ${breakpoints.maxWidth}px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (min-width: ${breakpoints.desktop}px) {
    padding: 0 24px;
  }
`;