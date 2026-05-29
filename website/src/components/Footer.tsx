import { Recycle, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'

const footerLinks = {
  services: [
    { label: '旧件回收', href: '/services' },
    { label: '环保处置', href: '/services' },
    { label: '物流网络', href: '/services' },
    { label: '积分兑换', href: '/services' },
    { label: '数据看板', href: '/services' },
  ],
  about: [
    { label: '公司简介', href: '/about' },
    { label: '核心团队', href: '/about' },
    { label: '发展历程', href: '/about' },
    { label: '资质证书', href: '/about' },
    { label: '加入我们', href: '/contact' },
  ],
  support: [
    { label: '帮助中心', href: '#' },
    { label: '操作指南', href: '#' },
    { label: 'API文档', href: '#' },
    { label: '服务协议', href: '#' },
    { label: '隐私政策', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#fafaf8] border-t border-[rgba(0,0,0,0.06)]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-primary-red rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(196,30,58,0.3)]">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-[rgba(0,0,0,0.95)] tracking-tight">飞玖回收</span>
            </div>
            <p className="text-sm text-[#615d59] leading-relaxed mb-6 max-w-sm">
              飞玖回收是国内领先的维修行业旧件回收闭环管理平台，通过智能化系统为全国数万家维修企业提供从回收到处置的一站式解决方案。
            </p>
            
            <div className="space-y-3">
              <a href="tel:400-888-9999" className="flex items-center gap-3 text-sm text-[rgba(0,0,0,0.95)] hover:text-primary-red transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[rgba(196,30,58,0.06)] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary-red" />
                </div>
                <div>
                  <p className="font-semibold">400-888-9999</p>
                  <p className="text-xs text-[#a39e98]">周一至周日 09:00 - 21:00</p>
                </div>
              </a>
              <a href="mailto:business@feijiu.com" className="flex items-center gap-3 text-sm text-[rgba(0,0,0,0.95)] hover:text-primary-red transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[rgba(196,30,58,0.06)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary-red" />
                </div>
                <p className="font-semibold">business@feijiu.com</p>
              </a>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[rgba(196,30,58,0.06)] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary-red" />
                </div>
                <div>
                  <p className="text-[#615d59]">浙江省杭州市余杭区</p>
                  <p className="text-xs text-[#a39e98]">未来科技城·梦想小镇</p>
                </div>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-sm text-[rgba(0,0,0,0.95)] mb-4 tracking-tight uppercase">
                {title === 'services' ? '服务项目' : title === 'about' ? '关于我们' : '支持帮助'}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-[#615d59] hover:text-primary-red transition-colors flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#a39e98]">
            &copy; {new Date().getFullYear()} 杭州飞玖网络科技有限公司 版权所有
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#a39e98] hover:text-primary-red transition-colors">浙ICP备2024XXXXXXXX号-1</a>
            <a href="#" className="text-xs text-[#a39e98] hover:text-primary-red transition-colors">浙公网安备 3301100200XXXX号</a>
            <span className="text-xs text-[#a39e98]">增值电信业务经营许可证：浙B2-2024XXXX</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
