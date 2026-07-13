import { useEffect, useRef } from 'react';

// Stack to keep track of active modal close handlers
const modalStack: { id: symbol; closeHandler: () => void }[] = [];
let programmaticBackCount = 0;

// Single global popstate listener
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    if (programmaticBackCount > 0) {
      programmaticBackCount--;
      return;
    }
    
    // Pop the top-most modal
    if (modalStack.length > 0) {
      const topModal = modalStack.pop();
      if (topModal) {
        topModal.closeHandler();
      }
    }
  });
}

export function useModalHistory(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  const modalIdRef = useRef(Symbol());

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      try { window.history.pushState({ isModal: true }, ''); } catch (e) {}
      
      const modalId = modalIdRef.current;
      
      const handlerObj = {
        id: modalId,
        closeHandler: () => {
          onCloseRef.current();
        }
      };
      
      modalStack.push(handlerObj);
      
      return () => {
        const index = modalStack.findIndex(m => m.id === modalId);
        if (index !== -1) {
          // Modal was closed programmatically, not by browser back
          modalStack.splice(index, 1);
          programmaticBackCount++;
          try { window.history.back(); } catch (e) {}
        }
      };
    }
  }, [isOpen]);
}
