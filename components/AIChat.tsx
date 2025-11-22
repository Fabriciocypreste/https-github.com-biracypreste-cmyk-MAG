
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Bot, User } from 'lucide-react';
import { useStore } from '../store';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function AIChat() {
  const { isChatOpen, closeChat } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Olá! Eu sou a IA da RedFlix. Como posso te ajudar a encontrar o filme ou série perfeito hoje?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    if (isChatOpen && !chatSessionRef.current) {
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "Você é um assistente especialista em filmes e séries da plataforma 'RedFlix'. Seu tom é divertido, casual e apaixonado por cinema. Ajude os usuários a escolherem o que assistir, dê curiosidades sobre filmes e explique finais complexos. Você deve recomendar filmes populares como 'Stranger Things', 'Breaking Bad', 'The Witcher', e também cobrir esportes como Futebol se perguntarem.",
            }
        });
    }
  }, [isChatOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userText = inputValue;
    setInputValue('');
    const userMsgId = Date.now().toString();
    
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);
    setIsLoading(true);

    try {
        const streamResult = await chatSessionRef.current.sendMessageStream({ message: userText });
        
        let fullResponse = '';
        const modelMsgId = (Date.now() + 1).toString();
        
        // Add placeholder for model response
        setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

        for await (const chunk of streamResult) {
             const chunkTyped = chunk as GenerateContentResponse;
             const chunkText = chunkTyped.text;
             if (chunkText) {
                 fullResponse += chunkText;
                 setMessages(prev => prev.map(msg => 
                     msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
                 ));
             }
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isChatOpen) return null;

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#181818] z-[100] shadow-2xl border-l border-white/10 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-red-500" />
                    <h2 className="font-bold text-white">RedFlix AI</h2>
                </div>
                <button onClick={closeChat} className="p-2 hover:bg-white/10 rounded-full transition">
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'model' ? 'bg-red-600' : 'bg-gray-600'}`}>
                            {msg.role === 'model' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-black/40 text-gray-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                             <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-black/40 p-3 rounded-lg">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="relative">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pergunte sobre filmes..."
                        className="w-full bg-[#2a2a2a] border border-gray-700 rounded-full py-3 pl-4 pr-12 text-white focus:outline-none focus:border-red-500 transition"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:hover:bg-red-600"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
}
