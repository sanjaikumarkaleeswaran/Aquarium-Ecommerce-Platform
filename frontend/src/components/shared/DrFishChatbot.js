import React, { useState, useEffect, useRef } from 'react';
import { analyzeMessage } from '../../services/chatService';

const DrFishChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "👋 Hi! I'm Dr. Fish. Ask me anything about your aquarium! 🐠", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // Get full response from AI, passing history for context
            const responseText = await analyzeMessage(userMsg.text, messages);

            // Initialize empty bot message
            const botMsgId = Date.now() + 1;
            setMessages(prev => [...prev, { id: botMsgId, text: '', sender: 'bot' }]);
            setIsTyping(false); // Stop "thinking" indicator, start "streaming"

            // Stream the text character by character
            let i = 0;
            const streamInterval = setInterval(() => {
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId
                        ? { ...msg, text: responseText.substring(0, i + 1) }
                        : msg
                ));
                i++;
                if (i === responseText.length) {
                    clearInterval(streamInterval);
                }
            }, 30); // Speed of typing (30ms per char)

        } catch (error) {
            console.error("Chat error:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), text: "⚠️ Something swam wrong. Please try again.", sender: 'bot' }]);
        }
    };

    // Helper to render markdown-like bold text
    const renderText = (text) => {
        return text.split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block', marginBottom: '5px' }}>
                {line.split('**').map((part, j) =>
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
            </span>
        ));
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={toggleChat}
                style={{
                    position: 'fixed',
                    bottom: '100px', // Above the comparison bar
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#00a8cc',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0, 168, 204, 0.4)',
                    cursor: 'pointer',
                    zIndex: 9999, // High z-index to sit on top
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? '✕' : '🩺'}
                {!isOpen && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        width: '15px',
                        height: '15px',
                        backgroundColor: '#4caf50',
                        borderRadius: '50%',
                        border: '2px solid white'
                    }}></span>
                )}
            </button>

            {/* Chat Window */}
            <div style={{
                position: 'fixed',
                bottom: '170px',
                right: '30px',
                width: '350px',
                height: '500px',
                backgroundColor: 'var(--card-bg)', // Adapts to dark mode
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                display: isOpen ? 'flex' : 'none',
                flexDirection: 'column',
                zIndex: 9999,
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                animation: 'slideUp 0.3s ease-out'
            }}>
                <style>
                    {`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}
                </style>

                {/* Header */}
                <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, var(--ocean-blue), var(--aqua-blue))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }}>
                        🐟
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Dr. Fish AI</h3>
                        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Aquarium Specialist</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--input-bg)', // Light bg in light mode, dark in dark mode
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '12px 16px',
                                borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                backgroundColor: msg.sender === 'user' ? 'var(--ocean-blue)' : 'var(--card-bg)',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
                            }}
                        >
                            {renderText(msg.text)}
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{
                            alignSelf: 'flex-start',
                            padding: '10px 15px',
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '15px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            Dr. Fish is thinking... 🌊
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} style={{
                    padding: '15px',
                    backgroundColor: 'var(--card-bg)',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    gap: '10px'
                }}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask Dr. Fish..."
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '25px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--input-bg)',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--ocean-blue)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                        }}
                    >
                        ➤
                    </button>
                </form>
            </div>
        </>
    );
};

export default DrFishChatbot;
