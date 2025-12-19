import React, { useState, useEffect } from 'react';

function FishCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState('right');
    const [userRole, setUserRole] = useState(null);

    // Get user role from sessionStorage
    useEffect(() => {
        const updateRole = () => {
            const user = sessionStorage.getItem('user');
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    setUserRole(userData.role);
                } catch (e) {
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
        };

        updateRole();

        // Listen for storage changes
        window.addEventListener('storage', updateRole);
        return () => window.removeEventListener('storage', updateRole);
    }, []);

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e) => {
            setTargetPosition({ x: e.clientX, y: e.clientY });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Smooth animation loop with direction update
    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            setPosition(prev => {
                const dx = targetPosition.x - prev.x;
                const dy = targetPosition.y - prev.y;

                // Update direction based on where fish is moving TO (not FROM)
                if (Math.abs(dx) > 1) {
                    setDirection(dx > 0 ? 'right' : 'left');
                }

                return {
                    x: prev.x + dx * 0.15,
                    y: prev.y + dy * 0.15
                };
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [targetPosition]);

    // Different fish for different roles
    const getFishEmoji = () => {
        switch (userRole) {
            case 'customer':
                return '🐠'; // Tropical fish for customers
            case 'retailer':
                return '🐟'; // Regular fish for retailers
            case 'wholesaler':
                return '🦈'; // Pufferfish for wholesalers
            case 'admin':
                return '🐡'; // Shark for admin
            default:
                return '🐠'; // Default tropical fish
        }
    };

    // Different colors for different roles
    const getRoleColor = () => {
        switch (userRole) {
            case 'customer':
                return 'rgba(76, 175, 80, 0.6)'; // Green
            case 'retailer':
                return 'rgba(255, 152, 0, 0.6)'; // Orange
            case 'wholesaler':
                return 'rgba(33, 150, 243, 0.6)'; // Blue
            case 'admin':
                return 'rgba(156, 39, 176, 0.6)'; // Purple
            default:
                return 'rgba(100, 200, 255, 0.6)'; // Default blue
        }
    };

    return (
        <>
            {/* Fish cursor */}
            <div
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    fontSize: '36px',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    transform: `translate(-50%, -50%) scaleX(${direction === 'left' ? -1 : 1}) rotate(${direction === 'left' ? '-10deg' : '10deg'})`,
                    transition: 'transform 0.2s ease',
                    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
                    animation: 'swim 1s ease-in-out infinite',
                }}
            >
                {getFishEmoji()}
            </div>

            {/* Bubble trail */}
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        position: 'fixed',
                        left: `${position.x - (direction === 'right' ? 30 : -30) - i * 20}px`,
                        top: `${position.y - 5 + Math.sin(Date.now() / 500 + i) * 5}px`,
                        width: `${8 - i * 2}px`,
                        height: `${8 - i * 2}px`,
                        backgroundColor: getRoleColor(),
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: 99998,
                        opacity: 0.8 - i * 0.25,
                        animation: `bubble ${1 + i * 0.3}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                        border: `1px solid rgba(255,255,255,0.5)`,
                    }}
                />
            ))}

            {/* Wave effect */}
            <div
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: '60px',
                    height: '60px',
                    pointerEvents: 'none',
                    zIndex: 99997,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            border: `2px solid ${getRoleColor()}`,
                            borderRadius: '50%',
                            animation: `ripple 2s ease-out infinite`,
                            animationDelay: `${i * 0.4}s`,
                        }}
                    />
                ))}
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes swim {
          0%, 100% {
            transform: translate(-50%, -50%) scaleX(${direction === 'left' ? -1 : 1}) translateY(0px) rotate(${direction === 'left' ? '-10deg' : '10deg'});
          }
          50% {
            transform: translate(-50%, -50%) scaleX(${direction === 'left' ? -1 : 1}) translateY(-8px) rotate(${direction === 'left' ? '-5deg' : '5deg'});
          }
        }

        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-40px) scale(0.4);
            opacity: 0;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        body, body * {
          cursor: none !important;
        }

        button, a, input, select, textarea {
          cursor: none !important;
        }
      `}</style>
        </>
    );
}

export default FishCursor;
