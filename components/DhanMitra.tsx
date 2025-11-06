import React, { useState, useRef, useEffect } from 'react';
import { XIcon, PaperAirplaneIcon, SparklesIcon, UserIcon } from './Icons';
import { getDhanMitraResponse } from '../services/geminiService';
import { suggestedQueries } from '../utils/dhanMitraQueries';

interface DhanMitraModalProps {
    onClose: () => void;
}

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

const DhanMitraModal: React.FC<DhanMitraModalProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', parts: [{ text: "Hello! I'm DhanMitra, your financial assistant. How can I help you today?" }] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (query?: string) => {
        const userMessage = query || input;
        if (!userMessage.trim()) return;

        const newUserMessage: Message = { role: 'user', parts: [{ text: userMessage }] };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);
        
        try {
            const history = messages.map(msg => ({
                role: msg.role,
                parts: msg.parts.map(p => ({ text: p.text }))
            }));

            const responseText = await getDhanMitraResponse(userMessage, history);
            const modelMessage: Message = { role: 'model', parts: [{ text: responseText }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error: any) {
            const errorMessage: Message = { role: 'model', parts: [{ text: `Sorry, something went wrong. ${error.message}` }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4 sm:items-center animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto h-[85vh] max-h-[700px] flex flex-col transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2 text-amber-500" />
                        DhanMitra AI
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-500 rounded-full hover:bg-slate-200/50 transition-colors"
                        aria-label="Close chat"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <SparklesIcon className="w-5 h-5 text-amber-600" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.parts[0].text}</p>
                            </div>
                            {msg.role === 'user' && (
                                 <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-5 h-5 text-slate-800" />
                                </div>
                            )}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                <SparklesIcon className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-slate-200 text-slate-800 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {messages.length <= 1 && !isLoading && (
                    <div className="p-4 border-t border-slate-200">
                        <p className="text-sm text-center text-slate-500 mb-2">Or try one of these suggestions:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {suggestedQueries.map((query, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(query)}
                                    className="px-3 py-1.5 text-sm text-rose-700 bg-rose-500/10 rounded-full hover:bg-rose-500/20 transition-colors"
                                >
                                    {query}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="p-4 bg-slate-100/50 border-t border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your question here..."
                            disabled={isLoading}
                            className="flex-1 w-full px-4 py-2 bg-white/50 border border-slate-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || !input.trim()}
                            className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full flex items-center justify-center hover:from-rose-600 hover:to-orange-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DhanMitraModal;