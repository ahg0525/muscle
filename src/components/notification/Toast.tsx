import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '../common/colors';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose, 
  isVisible 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <Container type={type}>
      <ToastMessage>{message}</ToastMessage>
    </Container>
  );
};

export default Toast;

const slideInDown = keyframes`
  from {
    top: -100px;
    opacity: 0;
  }
  to {
    top: 20px;
    opacity: 1;
  }
`;

const Container = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: ${slideInDown} 0.3s ease-out forwards;
  background: ${({ type }) => 
    type === 'success' ? colors.green : 
    type === 'error' ? colors.red : 
    colors.lightBlack
  };
  color: white;
  font-weight: 500;
  white-space: nowrap;
  width: max-content;
  text-align: center;
`;

const ToastMessage = styled.div`
  font-size: 14px;
`;