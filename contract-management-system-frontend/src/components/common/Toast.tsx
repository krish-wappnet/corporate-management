import { useEffect } from 'react';
import { message } from 'antd';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastProps {
  type: ToastType;
  content: string;
  duration?: number;
  onClose?: () => void;
}

const Toast = ({ type, content, duration = 3, onClose }: ToastProps) => {
  useEffect(() => {
    message[type]({
      content,
      duration,
      onClose,
      className: 'custom-toast',
      style: {
        marginTop: '24px',
      },
    });
  }, [type, content, duration, onClose]);

  return null;
};

export default Toast;

// Helper functions for different toast types
export const showToast = (type: ToastType, content: string, duration?: number) => {
  message[type]({
    content,
    duration: duration || 3,
    className: 'custom-toast',
    style: {
      marginTop: '24px',
    },
  });
};

export const showSuccessToast = (content: string, duration?: number) => {
  showToast('success', content, duration);
};

export const showErrorToast = (content: string, duration?: number) => {
  showToast('error', content, duration);
};

export const showInfoToast = (content: string, duration?: number) => {
  showToast('info', content, duration);
};

export const showWarningToast = (content: string, duration?: number) => {
  showToast('warning', content, duration);
};

export const showLoadingToast = (content: string, duration?: number) => {
  showToast('loading', content, duration);
};
