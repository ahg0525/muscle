import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const enableMocking = async () => {
  // 개발 환경이거나 MSW를 강제로 사용하는 경우
  if (import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_MSW === 'true') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
};

enableMocking().then(() => {
  console.log('MSW 초기화 완료');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('MSW 초기화 실패:', error);
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});