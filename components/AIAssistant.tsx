
import React, { useState, useRef, useEffect } from 'react';
import { getSchoolInfoAnswer } from '../services/geminiService';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if(!isOpen) {
            setMessages([]);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getSchoolInfoAnswer(input);
            const aiMessage: Message = { sender: 'ai', text: aiResponse };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: '오류가 발생했습니다. 다시 시도해주세요.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    }

    return (
        <>
            <button
                onClick={handleToggle}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-indigo-700 transition-transform transform hover:scale-110 z-50"
                aria-label="AI Assistant"
            >
                <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-robot'}`}></i>
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden border border-slate-200">
                    <header className="bg-indigo-600 text-white p-4 text-center font-bold">
                        <h3 className="text-lg">무엇이 궁금한가요?</h3>
                        <p className="text-sm opacity-80">AI 학교생활 도우미</p>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                        <div className="space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-slate-200 text-slate-800 p-3 rounded-lg max-w-xs">
                                    안녕하세요! 학교 생활에 대해 궁금한 점을 물어보세요. (예: 오늘 급식 메뉴 알려줘)
                                </div>
                            </div>
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-200 text-slate-800 p-3 rounded-lg max-w-xs">
                                        <i className="fa-solid fa-spinner fa-spin"></i> 생각 중...
                                    </div>
                                </div>
                            )}
                             <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="여기에 질문을 입력하세요..."
                                disabled={isLoading}
                                className="flex-1 p-3 border-2 border-slate-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-slate-100"
                            />
                            <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-indigo-700 disabled:bg-slate-400">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
