import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        addToast(message, 'error', duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        addToast(message, 'info', duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        addToast(message, 'warning', duration);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '400px'
        }}>
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const getToastStyle = (type) => {
        const baseStyle = {
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: '2px solid',
            position: 'relative',
            overflow: 'hidden'
        };

        const styles = {
            success: {
                ...baseStyle,
                backgroundColor: '#d4edda',
                borderColor: '#28a745',
                color: '#155724'
            },
            error: {
                ...baseStyle,
                backgroundColor: '#f8d7da',
                borderColor: '#dc3545',
                color: '#721c24'
            },
            warning: {
                ...baseStyle,
                backgroundColor: '#fff3cd',
                borderColor: '#ffc107',
                color: '#856404'
            },
            info: {
                ...baseStyle,
                backgroundColor: '#d1ecf1',
                borderColor: '#17a2b8',
                color: '#0c5460'
            }
        };

        return styles[type] || styles.info;
    };

    const getIcon = (type) => {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    };

    return (
        <>
            <div
                onClick={onClose}
                style={getToastStyle(toast.type)}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                }}
            >
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                    {getIcon(toast.type)}
                </div>
                <div style={{
                    flex: 1,
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                }}>
                    {toast.message}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'inherit',
                        opacity: 0.6,
                        padding: '0 5px',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                >
                    ×
                </button>
            </div>
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </>
    );
};

export default ToastProvider;
