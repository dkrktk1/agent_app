import { useEffect, useRef } from 'react';

export function useModalHistory(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ isModal: true }, '');
      
      let popped = false;
      
      const handlePopState = () => {
        popped = true;
        onCloseRef.current();
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (!popped) {
          window.history.back();
        }
      };
    }
  }, [isOpen]);
}
