import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Zap, TrendingUp, Users, Recycle, BarChart3, Truck, Leaf, Star, ChevronRight, Phone, Clock } from 'lucide-react'

const stats = [
  { icon: Recycle, value: '1,286,492', label: '累计回收件数', trend: '+12.5%', trendUp: true },
  { icon: BarChart3, value: '53.8', label: '回收货值(亿元)', suffix: '亿', trend: '+8.3%', trendUp: true },
  { icon: Users, value: '58,000+', label: '合作维修企业', trend: '+23%', trendUp: true },
  { icon: Star, value: '99.8%', label: '客户满意度', trend: '持平', trendUp: true },
]

const features = [
  {
    icon: Shield,
    title: '安全可靠',
    desc: '银行级资金托管，每笔交易全链路可追溯，保障回收资金安全',
    gradient: 'from-[#0075de] to-[#005ab3]',
    bg: 'bg-[rgba(0,117,222,0.06)]',
  },
  {
    icon: Zap,
    title: '高效便捷',
    desc: '智能匹配回收订单，从提交到结算全流程线上化，缩短处理周期',
    gradient: 'from-[#dd5b00] to-[#b84d00]',
    bg: 'bg-[rgba(221,91,0,0.06)]',
  },
  {
    icon: TrendingUp,
    title: '价值最大',
    desc: 'AI评估模型 + 资深专家复核，确保旧件定价公允，收益最大化',
    gradient: 'from-[#1aae39] to-[#158a2d]',
    bg: 'bg-[rgba(26,174,57,0.06)]',
  },
  {
    icon: Users,
    title: '专业团队',
    desc: '10年+行业经验团队，覆盖全国的服务网络，7×24小时技术支持',
    gradient: 'from-[#391c57] to-[#2d1544]',
    bg: 'bg-[rgba(57,28,87,0.06)]',
  },
]

const services = [
  {
    icon: Recycle,
    title: '旧件回收',
    desc: '空调、洗衣机、冰箱、电视、热水器五大品类全覆盖，标准化回收流程',
    points: ['智能估价系统', '48小时极速结算', '全程物流追踪'],
  },
  {
    icon: Leaf,
    title: '环保处置',
    desc: '合规拆解、资源化利用，助力企业ESG达标，年处理能力超500万件',
    points: ['国家资质认证', '无害化处理', '碳减排报告'],
  },
  {
    icon: Truck,
    title: '物流网络',
    desc: '覆盖全国300+城市，自营+合作物流体系，上门取件零等待',
    points: ['全国时效48h', '实时轨迹追踪', '保险全覆盖'],
  },
]

const testimonials = [
  {
    quote: '接入飞玖回收后，我们的旧件处理效率提升了60%，月度回收收益增长了近40%，团队再也不用为旧件库存发愁。',
    author: '陈建国', role: '运营总监', company: '恒达维修连锁集团',
  },
  {
    quote: '积分体系设计得很灵活，既可以兑换维修配件也能抵扣服务费，我们的师傅参与积极性非常高。',
    author: '林伟明', role: '总经理', company: '鑫源汽车服务有限公司',
  },
  {
    quote: '专业的评估团队给出的回收价格一直很公道，三年合作下来累计回收金额超过2000万，非常信赖。',
    author: '周丽华', role: '供应链负责人', company: '东方机电设备有限公司',
  },
]

const partners = ['海尔集团', '美的集团', '格力电器', 'TCL科技', '海信集团', '长虹电器', '奥克斯', '方太集团']

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Grid pattern background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,30,58,0.08),transparent_70%)] rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,117,222,0.06),transparent_70%)] rounded-full translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(196,30,58,0.04),transparent_70%)] rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left - Copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(196,30,58,0.2)] bg-[rgba(196,30,58,0.04)] text-primary-red text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-primary-red rounded-full animate-pulse" />
                专业旧件回收闭环平台
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[rgba(0,0,0,0.95)] leading-[1.08] tracking-tight mb-6">
                让每一件旧配件<br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary-red via-[#e8405a] to-primary-red bg-clip-text text-transparent">
                    重获价值
                  </span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,4 Q50,0 100,4 Q150,8 200,4" fill="none" stroke="#c41e3a" strokeWidth="2" strokeOpacity="0.3"/>
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg text-[#615d59] leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                飞玖回收专注维修行业旧件回收领域，通过智能估价 + 全程托管 + 极速结算，
                为全国 <span className="text-primary-red font-semibold">58,000+</span> 家维修企业提供一站式回收解决方案。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => navigate('/services')}
                  className="bg-[#c41e3a] hover:bg-[#a01830] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(196,30,58,0.3)] hover:shadow-[0_6px_30px_rgba(196,30,58,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                  了解服务方案
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={() => navigate('/contact')}
                  className="bg-white hover:bg-[#fafaf8] text-[rgba(0,0,0,0.95)] px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 border-2 border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.15)] flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  预约演示
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-[#a39e98]">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 7×24h 服务</span>
                <span className="w-1 h-1 bg-[rgba(0,0,0,0.15)] rounded-full" />
                <span>48h 极速结算</span>
                <span className="w-1 h-1 bg-[rgba(0,0,0,0.15)] rounded-full" />
                <span>100% 资金托管</span>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto max-w-md">
                {/* Main card */}
                <div className="relative z-10 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)] p-6">
                  {/* Header bar */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(0,0,0,0.06)]">
                    <div className="w-10 h-10 bg-primary-red rounded-xl flex items-center justify-center">
                      <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[rgba(0,0,0,0.95)]">今日回收概览</p>
                      <p className="text-xs text-[#a39e98]">实时数据更新</p>
                    </div>
                  </div>
                  
                  {/* Stats in card */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#f9f9f7] rounded-xl">
                      <span className="text-sm text-[#615d59]">待处理订单</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[rgba(0,0,0,0.95)]">2,847</span>
                        <span className="text-xs text-[#1aae39] bg-[rgba(26,174,57,0.08)] px-2 py-0.5 rounded-full">↑12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#f9f9f7] rounded-xl">
                      <span className="text-sm text-[#615d59]">今日成交额</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[rgba(0,0,0,0.95)]">¥486,320</span>
                        <span className="text-xs text-[#1aae39] bg-[rgba(26,174,57,0.08)] px-2 py-0.5 rounded-full">↑8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#f9f9f7] rounded-xl">
                      <span className="text-sm text-[#615d59]">在线师傅</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[rgba(0,0,0,0.95)]">12,584</span>
                        <span className="text-xs text-[#1aae39] bg-[rgba(26,174,57,0.08)] px-2 py-0.5 rounded-full">↑5%</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  <div className="mt-5 flex items-end gap-1.5 h-16">
                    {[35, 52, 38, 65, 45, 72, 58, 68, 48, 55, 80, 62].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{
                        height: `${h}%`,
                        background: i === 11 
                          ? 'linear-gradient(180deg, #c41e3a, rgba(196,30,58,0.3))' 
                          : 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03))',
                      }} />
                    ))}
                  </div>
                  <p className="text-xs text-[#a39e98] mt-2 text-center">过去12小时回收量趋势</p>
                </div>

                {/* Floating pill */}
                <div className="absolute -top-6 -right-4 z-20 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[rgba(26,174,57,0.08)] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#1aae39]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#a39e98]">本月环比增长</p>
                    <p className="font-bold text-[rgba(0,0,0,0.95)]">+35.2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="relative py-16 lg:py-20 bg-[#fafaf8]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '100% 48px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06)] transition-all duration-300 border-t-[3px] border-t-primary-red/0 hover:border-t-primary-red">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(196,30,58,0.06)] flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-red" />
                  </div>
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-[#1aae39] bg-[rgba(26,174,57,0.08)]' : 'text-[#a39e98] bg-[rgba(0,0,0,0.04)]'} px-2 py-1 rounded-full`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl lg:text-3xl font-black text-[rgba(0,0,0,0.95)] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-[#a39e98] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-18">
            <span className="text-sm font-semibold text-primary-red tracking-wider uppercase mb-3 block">Why Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[rgba(0,0,0,0.95)] mb-4">为什么选择飞玖回收</h2>
            <p className="text-[#615d59] max-w-xl mx-auto text-lg">
              深耕行业10年，用技术和服务重新定义旧件回收
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} 
                className="group relative bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <f.icon className={`w-6 h-6 bg-gradient-to-br ${f.gradient} bg-clip-text text-transparent`} />
                </div>
                <h3 className="font-bold text-[rgba(0,0,0,0.95)] mb-2.5">{f.title}</h3>
                <p className="text-sm text-[#615d59] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section className="py-20 lg:py-28 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-18">
            <span className="text-sm font-semibold text-primary-red tracking-wider uppercase mb-3 block">Our Services</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[rgba(0,0,0,0.95)] mb-4">全方位回收解决方案</h2>
            <p className="text-[#615d59] max-w-xl mx-auto text-lg">
              从回收到处置，一站式闭环管理
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} onClick={() => navigate('/services')}
                className="group cursor-pointer bg-white rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1.5">
                <div className="w-14 h-14 bg-[rgba(196,30,58,0.06)] rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-primary-red group-hover:shadow-[0_8px_25px_rgba(196,30,58,0.3)]">
                  <s.icon className="w-7 h-7 text-primary-red transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-lg text-[rgba(0,0,0,0.95)] mb-2.5 group-hover:text-primary-red transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-[#615d59] leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-[#a39e98]">
                      <span className="w-1 h-1 bg-primary-red rounded-full" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.06)] flex items-center text-sm font-medium text-primary-red">
                  <span>了解详情</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-18">
            <span className="text-sm font-semibold text-primary-red tracking-wider uppercase mb-3 block">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[rgba(0,0,0,0.95)] mb-4">客户证言</h2>
            <p className="text-[#615d59] max-w-xl mx-auto text-lg">
              来自合作企业的真实反馈
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
                {/* Quote mark */}
                <div className="absolute top-4 right-6 text-6xl font-serif text-[rgba(196,30,58,0.08)] leading-none select-none">"</div>
                
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map(_ => (
                    <Star key={_} className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" />
                  ))}
                </div>
                <p className="text-sm text-[#615d59] leading-relaxed mb-6 relative z-10">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(0,0,0,0.06)]">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[rgba(0,0,0,0.95)]">{t.author}</p>
                    <p className="text-xs text-[#a39e98]">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PARTNERS ====== */}
      <section className="py-14 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-[#a39e98] tracking-widest uppercase mb-8">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {partners.map((p, i) => (
              <span key={i} className="text-lg font-bold text-[rgba(0,0,0,0.12)] hover:text-[rgba(0,0,0,0.25)] transition-colors cursor-default select-none">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1c1114] to-[#1a0f12]" />
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        
        {/* Accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(196,30,58,0.2),transparent_70%)]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            准备好提升回收效率了吗？
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
            立即预约演示，了解飞玖回收如何帮助您的企业降低旧件管理成本、提升回收收益
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/contact')}
              className="bg-primary-red hover:bg-[#a01830] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-[0_4px_25px_rgba(196,30,58,0.5)] hover:shadow-[0_8px_35px_rgba(196,30,58,0.6)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
              预约免费演示
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/services')}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/15 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 backdrop-blur-sm">
              浏览服务方案
            </button>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-white/35">
            <span>✓ 无需签约</span>
            <span>✓ 免费评估</span>
            <span>✓ 30分钟快速接入</span>
          </div>
        </div>
      </section>
    </div>
  )
}
