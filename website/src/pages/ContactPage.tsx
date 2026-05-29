import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    title: '服务热线',
    content: '400-888-9999',
    subContent: '周一至周日 9:00-18:00',
  },
  {
    icon: Mail,
    title: '电子邮箱',
    content: 'contact@feijiu.com',
    subContent: '24小时内回复',
  },
  {
    icon: MapPin,
    title: '公司地址',
    content: '北京市朝阳区科技园区A座',
    subContent: '',
  },
  {
    icon: Clock,
    title: '工作时间',
    content: '周一至周日',
    subContent: '9:00 - 18:00',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-warm-white via-white to-[rgba(196,30,58,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[rgba(0,0,0,0.95)] mb-6">
              联系我们
            </h1>
            <p className="text-lg text-[#615d59] leading-relaxed">
              有任何问题或需求，欢迎随时与我们联系
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-8">联系方式</h2>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-red" />
                    </div>
                    <div>
                      <p className="text-sm text-[#a39e98] mb-1">{item.title}</p>
                      <p className="font-medium text-[rgba(0,0,0,0.95)]">{item.content}</p>
                      {item.subContent && (
                        <p className="text-sm text-[#615d59]">{item.subContent}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="font-semibold text-[rgba(0,0,0,0.95)] mb-4">关注我们</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-warm-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center text-[#615d59] hover:text-primary-red hover:border-primary-red/30 transition-colors"
                    aria-label="微信"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c4.801 0 8.692-3.29 8.692-7.343 0-4.054-3.891-7.339-8.692-7.339zm-3.12 5.318c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 5.57 8.68c0-.651.52-1.18 1.162-1.18zm6.238 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.12 2.867c-1.797-.052-3.444.592-4.687 1.726-.598.582-.996 1.305-1.172 2.076a.722.722 0 0 1-.709.577 2.576 2.576 0 0 1-1.316-.395.354.354 0 0 0-.183.057l-1.394.816a.26.26 0 0 1-.217.026.227.227 0 0 1-.156-.384l.314-1.18a.49.49 0 0 1 .179-.332C4.993 14.36 7.058 13.415 9.53 13.415c.276 0 .543.027.811.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576 1.583-2.13 2.862-4.256 3.403z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-warm-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center text-[#615d59] hover:text-primary-red hover:border-primary-red/30 transition-colors"
                    aria-label="微博"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10.098 20c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.274c-.384.31-1.459.141-2.04-.446-.579-.584-.41-1.665.175-2.049.585-.385 1.662-.213 2.047.371.384.584.213 1.664-.182 2.124zm1.048-2.218c-.271.221-1.037.101-1.449-.322-.412-.421-.293-1.188.178-1.408.471-.222 1.14.099 1.411.52.271.421.152 1.186-.14 1.41zm1.048-2.218c-.168.136-.64.063-.897-.199-.258-.26-.181-.739.134-.876.414-.135.716.089.896.412.18.322.103.799-.134.863z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-warm-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center text-[#615d59] hover:text-primary-red hover:border-primary-red/30 transition-colors"
                    aria-label="抖音"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.036 16.683c-.216.135-.494.203-.771.203-.277 0-.555-.068-.771-.203C14.455 16.024 13.282 15 12 15s-2.455 1.024-3.265 1.683c-.216.135-.494.203-.771.203-.277 0-.555-.068-.771-.203C5.545 16.024 4.372 15 3.199 15v4.632c1.173 0 2.345-1.024 3.156-1.683.216-.135.494-.203.771-.203.277 0 .555.068.771.203.811.659 1.983 1.683 3.156 1.683s2.345-1.024 3.156-1.683c.216-.135.494-.203.771-.203.277 0 .555.068.771.203.811.659 1.983 1.683 3.156 1.683V15c-1.173 0-2.345 1.024-3.164 1.683zM8 10.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm8 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-8">在线留言</h2>
              
              <form onSubmit={handleSubmit} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">姓名 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all"
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">公司名称</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all"
                      placeholder="请输入公司名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">手机号码 *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all"
                      placeholder="请输入手机号码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">电子邮箱</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all"
                      placeholder="请输入电子邮箱"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">留言内容 *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 transition-all resize-none"
                    placeholder="请输入您的问题或需求"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className={`w-full py-4 rounded-xs font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSubmitted
                      ? 'bg-notion-green text-white'
                      : 'bg-primary-red hover:bg-primary-red-dark text-white'
                  }`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      提交成功
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      提交留言
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
