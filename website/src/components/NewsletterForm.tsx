import { useState } from 'react';
import { Mail, CheckCircle, Send } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a39e98]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入您的邮箱地址"
            className="w-full pl-12 pr-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all"
            disabled={isLoading || isSubmitted}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isSubmitted}
          className={`px-6 py-3 rounded-xs font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isSubmitted
              ? 'bg-notion-green text-white'
              : 'bg-primary-red hover:bg-primary-red-dark text-white'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : isSubmitted ? (
            <>
              <CheckCircle className="w-4 h-4" />
              订阅成功
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              订阅
            </>
          )}
        </button>
      </div>
      {error && <p className="text-sm text-primary-red">{error}</p>}
      <p className="text-xs text-[#a39e98]">
        订阅后我们会定期发送最新资讯和优惠信息，您可以随时取消订阅
      </p>
    </form>
  );
}
