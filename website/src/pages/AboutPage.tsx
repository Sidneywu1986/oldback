import { Recycle, Users, TrendingUp, Award, Target, Shield } from 'lucide-react'

const milestones = [
  { year: '2020', event: '公司成立，开始探索旧件回收领域' },
  { year: '2021', event: '完成首轮融资，团队规模扩大至50人' },
  { year: '2022', event: '平台上线，服务超过1000家企业客户' },
  { year: '2023', event: '覆盖全国30个省市，累计回收量突破50万件' },
  { year: '2024', event: '成为行业领先的旧件回收平台' },
]

const values = [
  {
    icon: Shield,
    title: '诚信为本',
    description: '坚持诚信经营，建立长期信任关系',
  },
  {
    icon: Target,
    title: '客户至上',
    description: '以客户需求为导向，提供优质服务',
  },
  {
    icon: TrendingUp,
    title: '创新驱动',
    description: '持续创新，引领行业发展',
  },
  {
    icon: Users,
    title: '合作共赢',
    description: '与合作伙伴共同成长',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-warm-white via-white to-[rgba(196,30,58,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(196,30,58,0.08)] text-primary-red rounded-pill text-sm font-medium mb-6">
              <Recycle className="w-4 h-4" />
              关于我们
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[rgba(0,0,0,0.95)] mb-6">
              专业回收，共创绿色未来
            </h1>
            <p className="text-lg text-[#615d59] leading-relaxed">
              飞玖回收成立于2020年，是一家专注于维修行业旧件回收的创新型企业。
              我们致力于通过智能化技术和专业服务，为客户提供透明、高效、安全的回收解决方案。
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[rgba(0,0,0,0.95)] mb-6">
                我们的使命
              </h2>
              <p className="text-[#615d59] leading-relaxed mb-6">
                飞玖回收致力于构建一个透明、高效的旧件回收生态系统，
                通过技术创新和专业服务，帮助维修企业实现可持续发展，
                同时为环保事业贡献力量。
              </p>
              <p className="text-[#615d59] leading-relaxed mb-8">
                我们相信，每一件旧件都有其价值，通过科学的回收和处理，
                不仅可以减少资源浪费，还能创造新的经济价值。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-warm-white rounded-xl p-4">
                  <Users className="w-8 h-8 text-primary-red mb-2" />
                  <p className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">50+</p>
                  <p className="text-sm text-[#615d59]">专业团队</p>
                </div>
                <div className="bg-warm-white rounded-xl p-4">
                  <Award className="w-8 h-8 text-primary-red mb-2" />
                  <p className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">10+</p>
                  <p className="text-sm text-[#615d59]">行业资质</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-red/10 to-[#0075de]/10 rounded-2xl blur-xl" />
              <img
                src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Modern%20company%20team%20working%20together%20in%20bright%20office%2C%20professional%20collaboration%2C%20clean%20workspace&image_size=landscape_4_3"
                alt="团队"
                className="relative rounded-2xl shadow-notion-card w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[rgba(0,0,0,0.95)] mb-4">
              核心价值观
            </h2>
            <p className="text-[#615d59]">
              我们的价值观指引着每一个决策和行动
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-6 text-center hover:shadow-notion-card transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-red" />
                </div>
                <h3 className="font-semibold text-[rgba(0,0,0,0.95)] mb-2">{value.title}</h3>
                <p className="text-sm text-[#615d59]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[rgba(0,0,0,0.95)] mb-4">
              发展历程
            </h2>
            <p className="text-[#615d59]">
              回顾我们的成长之路
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[rgba(0,0,0,0.1)]" />
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 flex justify-center">
                      <div className="w-12 h-12 bg-primary-red/10 rounded-full flex items-center justify-center border-2 border-primary-red">
                        <span className="text-xs font-bold text-primary-red">{milestone.year}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-3">
                      <p className="text-[rgba(0,0,0,0.95)] font-medium">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-r from-primary-red to-primary-red-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            加入我们
          </h2>
          <p className="text-white/80 mb-8">
            如果你认同我们的价值观，欢迎加入飞玖回收大家庭
          </p>
          <button className="bg-white text-primary-red px-8 py-4 rounded-xs font-semibold text-base transition-all duration-200 hover:bg-warm-white">
            查看职位
          </button>
        </div>
      </section>
    </div>
  )
}
