import React from 'react';

const Modal = ({ isOpen, onClose, title, children, showCancel = true, onConfirm, confirmText = "OK", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '15px',
                    padding: '30px',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    animation: 'slideIn 0.3s ease',
                    color: 'var(--text-main)'
                }}>
                <style>
                    {`
            @keyframes slideIn {
              from {
                transform: translateY(-50px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}
                </style>

                <h2 style={{
                    color: 'var(--ocean-blue)',
                    fontSize: '1.8rem',
                    marginBottom: '20px',
                    marginTop: 0
                }}>
                    {title}
                </h2>

                <div style={{ marginBottom: '25px' }}>
                    {children}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {showCancel && (
                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'var(--border-color)',
                                color: 'var(--text-main)',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--text-secondary)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--border-color)'}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm || onClose}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--aqua-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'var(--ocean-blue)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'var(--aqua-blue)'}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
