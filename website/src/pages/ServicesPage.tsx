import { Recycle, Package, Coins, Truck, RefreshCw, Shield } from 'lucide-react'

const services = [
  {
    icon: Package,
    title: '配件回收',
    description: '覆盖各类电子配件、机械零件的专业回收服务',
    features: ['全面覆盖', '专业评估', '即时报价'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Electronic%20parts%20recycling%20center%20with%20organized%20components%2C%20professional%20warehouse&image_size=landscape_4_3',
  },
  {
    icon: RefreshCw,
    title: '环保处理',
    description: '绿色环保处理方案，实现资源循环再利用',
    features: ['环保认证', '合规处理', '资源再生'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Eco-friendly%20waste%20processing%2C%20green%20technology%2C%20sustainable%20recycling&image_size=landscape_4_3',
  },
  {
    icon: Coins,
    title: '积分兑换',
    description: '灵活的积分体系，兑换各类商品和服务',
    features: ['即时到账', '多样兑换', '专属优惠'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Loyalty%20points%20reward%20system%2C%20digital%20wallet%2C%20modern%20UI&image_size=landscape_4_3',
  },
  {
    icon: Truck,
    title: '上门取件',
    description: '专业物流团队，提供上门取件服务',
    features: ['全国覆盖', '快速响应', '安全运输'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Logistics%20delivery%20truck%2C%20professional%20transportation%2C%20clean%20modern%20vehicle&image_size=landscape_4_3',
  },
]

const processSteps = [
  { step: '01', title: '提交订单', description: '在线提交回收需求' },
  { step: '02', title: '专业评估', description: '专业团队评估定价' },
  { step: '03', title: '上门取件', description: '物流团队上门取件' },
  { step: '04', title: '确认收货', description: '验收确认发放积分' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-warm-white via-white to-[rgba(196,30,58,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(196,30,58,0.08)] text-primary-red rounded-pill text-sm font-medium mb-6">
              <Recycle className="w-4 h-4" />
              服务项目
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[rgba(0,0,0,0.95)] mb-6">
              全方位回收服务
            </h1>
            <p className="text-lg text-[#615d59] leading-relaxed">
              我们提供专业、高效、透明的旧件回收服务，
              让每一次回收都变得简单便捷。
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden hover:shadow-notion-card transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/95 rounded-xl flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-primary-red" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[rgba(0,0,0,0.95)] mb-2">{service.title}</h3>
                  <p className="text-[#615d59] mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-warm-white text-[#615d59] rounded-pill text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[rgba(0,0,0,0.95)] mb-4">
              回收流程
            </h2>
            <p className="text-[#615d59]">
              简单四步，完成回收
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative text-center"
              >
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-6 hover:shadow-notion-card transition-all duration-300">
                  <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-red">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-[rgba(0,0,0,0.95)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#615d59]">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[rgba(0,0,0,0.1)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[rgba(0,0,0,0.95)] mb-4">
                  为什么选择我们？
                </h2>
                <p className="text-[#615d59] mb-6">
                  我们凭借专业的团队、先进的技术和优质的服务，
                  赢得了众多客户的信赖和好评。
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[rgba(0,0,0,0.95)]">安全保障</p>
                      <p className="text-sm text-[#615d59]">资金托管，交易安全</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[rgba(0,0,0,0.95)]">快速结算</p>
                      <p className="text-sm text-[#615d59]">验收后即时发放积分</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[rgba(0,0,0,0.95)]">专业评估</p>
                      <p className="text-sm text-[#615d59]">资深专家团队评估定价</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Professional%20business%20meeting%2C%20handshake%2C%20trust%20and%20partnership%2C%20modern%20office&image_size=landscape_4_3"
                  alt="合作"
                  className="rounded-xl shadow-notion-card w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
