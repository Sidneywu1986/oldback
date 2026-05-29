import { useState } from 'react';
import { MessageCircle, Send, X, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！欢迎使用飞玖回收在线客服，请问有什么可以帮助您的？',
      isUser: false,
      timestamp: '刚刚',
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: '刚刚',
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '感谢您的咨询！我们的客服人员会尽快回复您。如有紧急问题，请拨打服务热线：400-888-9999。',
        isUser: false,
        timestamp: '刚刚',
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-red hover:bg-primary-red-dark text-white rounded-full shadow-notion-card flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
        aria-label="在线客服"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-notion-deep w-full max-w-md max-h-[70vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 bg-primary-red text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">在线客服</h3>
                  <p className="text-xs text-white/80">工作日 9:00-18:00</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.isUser ? 'bg-primary-red/10' : 'bg-warm-white'
                  }`}>
                    {msg.isUser ? (
                      <User className="w-4 h-4 text-primary-red" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-[#615d59]" />
                    )}
                  </div>
                  <div className={`max-w-[70%] ${msg.isUser ? 'text-right' : ''}`}>
                    <p className={`px-4 py-2 rounded-xl text-sm ${
                      msg.isUser
                        ? 'bg-primary-red text-white rounded-tr-md'
                        : 'bg-warm-white text-[rgba(0,0,0,0.95)] rounded-tl-md'
                    }`}>
                      {msg.content}
                    </p>
                    <p className="text-xs text-[#a39e98] mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[rgba(0,0,0,0.1)]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xl focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="px-4 py-3 bg-primary-red hover:bg-primary-red-dark disabled:bg-[#a39e98] text-white rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
