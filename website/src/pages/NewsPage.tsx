import { useState } from 'react';
import { Calendar, ArrowRight, Search, Tag } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '飞玖回收荣获2024年度最佳环保企业奖',
    excerpt: '飞玖回收凭借卓越的环保贡献和创新的回收模式，荣获行业权威奖项。',
    content: '<p>2024年5月，飞玖回收在全国环保产业大会上荣获「年度最佳环保企业奖」。这一奖项是对飞玖回收在推动循环经济、促进资源再利用方面所做努力的高度认可。</p><p>飞玖回收CEO表示：「我们将继续秉承绿色发展理念，不断创新回收模式，为建设美丽中国贡献力量。」</p>',
    category: '企业新闻',
    date: '2024-05-15',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Award%20ceremony%20with%20trophy%2C%20business%20success%2C%20professional%20event&image_size=landscape_4_3',
  },
  {
    id: '2',
    title: '全新智能回收系统上线，效率提升30%',
    excerpt: '飞玖回收最新推出的智能回收系统，通过AI技术实现回收流程智能化管理。',
    content: '<p>近日，飞玖回收正式上线全新智能回收管理系统。该系统采用先进的AI算法，能够自动识别旧件类型、评估价值，大幅提升回收效率。</p><p>据测试数据显示，新系统使回收处理效率提升了30%，客户满意度也得到显著提升。</p>',
    category: '技术动态',
    date: '2024-05-10',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Modern%20AI%20technology%20dashboard%2C%20digital%20interface%2C%20smart%20system&image_size=landscape_4_3',
  },
  {
    id: '3',
    title: '与多家知名企业达成战略合作',
    excerpt: '飞玖回收与行业龙头企业签署战略合作协议，共同推动回收产业发展。',
    content: '<p>飞玖回收宣布与多家行业领先企业达成战略合作，涵盖电子制造、汽车维修、家电售后等多个领域。</p><p>通过合作，各方将共享资源、优势互补，共同构建更加完善的回收生态体系。</p>',
    category: '合作动态',
    date: '2024-05-05',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Business%20partnership%20agreement%20signing%2C%20professional%20meeting&image_size=landscape_4_3',
  },
];

export default function NewsPage() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = mockNews.filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[rgba(0,0,0,0.95)] mb-4">新闻资讯</h1>
          <p className="text-[#615d59]">了解飞玖回收的最新动态和行业资讯</p>
        </div>

        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a39e98]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索新闻..."
            className="w-full pl-12 pr-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xl focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden hover:shadow-notion-card transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedNews(news)}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#f2f9ff] text-[#097fe8] rounded-pill text-xs font-medium">
                    {news.category}
                  </span>
                  <span className="text-xs text-[#a39e98] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {news.date}
                  </span>
                </div>
                <h3 className="font-semibold text-[rgba(0,0,0,0.95)] mb-2 line-clamp-2 group-hover:text-primary-red transition-colors">
                  {news.title}
                </h3>
                <p className="text-sm text-[#615d59] line-clamp-2">{news.excerpt}</p>
                <div className="mt-4 flex items-center text-sm text-primary-red opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>阅读详情</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-[#a39e98] mx-auto mb-4" />
            <p className="text-[#615d59]">暂无相关新闻</p>
          </div>
        )}
      </div>

      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-2xl shadow-notion-deep w-full max-w-3xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#f2f9ff] text-[#097fe8] rounded-pill text-xs font-medium">
                  {selectedNews.category}
                </span>
                <span className="text-xs text-[#a39e98] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {selectedNews.date}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-4">{selectedNews.title}</h2>
              <div className="prose prose-sm max-w-none text-[#615d59]">
                <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
              </div>
            </div>
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#615d59] hover:text-[rgba(0,0,0,0.95)] shadow-sm transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
