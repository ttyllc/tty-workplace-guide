import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBubbleProps {
  quoteContext: any;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ quoteContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am the TTY Solutions Architect. How can I help you with your workplace setup?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMsg,
            { 
              role: 'system', 
              content: `User Current Quote: ${JSON.stringify(quoteContext)}` 
            }
          ],
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the architect. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm mb-4">
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
             <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-accent text-surface rounded-tr-none' : 'bg-surface text-fg border border-border rounded-tl-none shadow-sm'}`}>
               {m.content}
             </div>
          </motion.div>
        ))}
         {isLoading && (
           <div className="flex justify-start">
             <div className="bg-surface border border-border text-muted text-xs italic p-3 rounded-2xl rounded-tl-none shadow-sm">
               Architect is thinking...
             </div>
           </div>
         )}
       </div>
 
       <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm flex gap-2">
         <input
           type="text"
           className="flex-1 p-2 text-sm focus:outline-none bg-transparent"
           placeholder="Ask a question..."
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
         />
         <button 
           onClick={sendMessage}
           disabled={isLoading}
           className="bg-accent text-surface px-3 py-2 rounded-lg hover:bg-accent-hover transition disabled:opacity-50"
         >
           ↑
         </button>
       </div>
    </div>
  );
};

export default ChatBubble;
