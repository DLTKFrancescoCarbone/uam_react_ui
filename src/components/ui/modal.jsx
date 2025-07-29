import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`modal-content ${className}`}>
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({ children, onClose, className = '' }) => (
  <div className={`modal-header ${className}`}>
    <div className="modal-header-content">
      {children}
    </div>
    {onClose && (
      <button
        onClick={onClose}
        className="modal-close-button"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);

const ModalTitle = ({ children, className = '' }) => (
  <h2 className={`modal-title ${className}`}>
    {children}
  </h2>
);

const ModalContent = ({ children, className = '' }) => (
  <div className={`modal-body ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = '' }) => (
  <div className={`modal-footer ${className}`}>
    {children}
  </div>
);

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalTitle.displayName = 'ModalTitle';
ModalContent.displayName = 'ModalContent';
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter };
