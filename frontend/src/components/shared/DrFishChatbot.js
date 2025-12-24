import React, { useState, useEffect, useRef } from 'react';
import { analyzeMessage } from '../../services/chatService';
import './DrFishChatbot.css';

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
                className="chatbot-fab"
            >
                {isOpen ? '✕' : '🩺'}
                {!isOpen && (
                    <span className="chatbot-status"></span>
                )}
            </button>

            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>

                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-avatar">
                        🐟
                    </div>
                    <div className="chatbot-title">
                        <h3>Dr. Fish AI</h3>
                        <div className="chatbot-subtitle">Aquarium Specialist</div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="chatbot-messages">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message-bubble ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}
                        >
                            {renderText(msg.text)}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator">
                            Dr. Fish is thinking... 🌊
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="chatbot-input-area">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask Dr. Fish..."
                        className="chatbot-input"
                    />
                    <button
                        type="submit"
                        className="chatbot-send-btn"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </>
    );
};

export default DrFishChatbot;
