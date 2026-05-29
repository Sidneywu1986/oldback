import { useState } from 'react';
import { ArrowRight, Filter, Building2 } from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  category: string;
  company: string;
  description: string;
  image: string;
}

const categories = ['全部', '电子制造', '汽车维修', '家电售后', '医疗器械'];

const mockCases: CaseItem[] = [
  {
    id: '1',
    title: '某大型电子制造企业回收项目',
    category: '电子制造',
    company: '某知名电子科技公司',
    description: '为该企业建立完整的电子元器件回收体系，年回收量超过100万件，节约成本30%。',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Electronic%20manufacturing%20factory%2C%20modern%20production%20line%2C%20clean%20environment&image_size=landscape_4_3',
  },
  {
    id: '2',
    title: '汽车零部件回收解决方案',
    category: '汽车维修',
    company: '某连锁汽车维修集团',
    description: '定制化汽车零部件回收方案，实现旧件价值最大化，提升企业盈利能力。',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Auto%20repair%20workshop%2C%20professional%20garage%2C%20car%20maintenance&image_size=landscape_4_3',
  },
  {
    id: '3',
    title: '家电售后回收合作项目',
    category: '家电售后',
    company: '某家电品牌售后服务商',
    description: '建立家电售后旧件回收网络，覆盖全国500+服务网点，回收效率提升40%。',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Home%20appliance%20service%2C%20professional%20repair%2C%20modern%20tools&image_size=landscape_4_3',
  },
  {
    id: '4',
    title: '医疗器械回收管理系统',
    category: '医疗器械',
    company: '某医疗器械公司',
    description: '专业医疗器械回收管理，确保合规处理，降低企业运营风险。',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Medical%20equipment%20facility%2C%20clean%20laboratory%2C%20professional%20environment&image_size=landscape_4_3',
  },
];

export default function CasesPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  const filteredCases = selectedCategory === '全部'
    ? mockCases
    : mockCases.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[rgba(0,0,0,0.95)] mb-4">成功案例</h1>
          <p className="text-[#615d59]">探索我们与各行业客户的成功合作案例</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          <Filter className="w-4 h-4 text-[#a39e98]" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-red text-white'
                  : 'bg-warm-white text-[#615d59] hover:bg-[rgba(0,0,0,0.05)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden hover:shadow-notion-card transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedCase(caseItem)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 aspect-video md:aspect-auto">
                  <img
                    src={caseItem.image}
                    alt={caseItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <span className="px-3 py-1 bg-[#f2f9ff] text-[#097fe8] rounded-pill text-xs font-medium">
                      {caseItem.category}
                    </span>
                    <h3 className="font-semibold text-[rgba(0,0,0,0.95)] mt-3 mb-2 group-hover:text-primary-red transition-colors">
                      {caseItem.title}
                    </h3>
                    <p className="text-sm text-[#615d59]">{caseItem.description}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Building2 className="w-4 h-4 text-[#a39e98]" />
                    <span className="text-sm text-[#a39e98]">{caseItem.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-[#a39e98] mx-auto mb-4" />
            <p className="text-[#615d59]">暂无相关案例</p>
          </div>
        )}
      </div>

      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCase(null)}>
          <div className="bg-white rounded-2xl shadow-notion-deep w-full max-w-3xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img src={selectedCase.image} alt={selectedCase.title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8 overflow-y-auto">
                <span className="px-3 py-1 bg-[#f2f9ff] text-[#097fe8] rounded-pill text-xs font-medium">
                  {selectedCase.category}
                </span>
                <h2 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mt-4 mb-4">{selectedCase.title}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-[#a39e98]" />
                  <span className="text-[#615d59]">{selectedCase.company}</span>
                </div>
                <p className="text-[#615d59] leading-relaxed">{selectedCase.description}</p>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="mt-6 bg-primary-red hover:bg-primary-red-dark text-white px-6 py-3 rounded-xs font-medium text-sm flex items-center gap-2 transition-all"
                >
                  <span>了解更多</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedCase(null)}
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
