import { useState } from 'react';
import { ArrowLeft, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';

const ACTIVITY_TYPES = [
  { value: 'full_reduction', label: '满减活动' },
  { value: 'discount', label: '折扣活动' },
  { value: 'points_double', label: '积分加倍' },
  { value: 'new_user_gift', label: '新人礼包' },
];

export default function PromotionCreatePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activity_type: '',
    priority: 1,
    start_time: '',
    end_time: '',
    rules: {} as Record<string, unknown>,
    applicable_tags: [] as number[],
    exclude_tags: [] as number[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      activity_type: value,
      rules: getDefaultRules(value),
    }));
  };

  const getDefaultRules = (type: string): Record<string, unknown> => {
    switch (type) {
      case 'full_reduction':
        return { threshold: 100, discount: 10 };
      case 'discount':
        return { rate: 0.9, categories: [] };
      case 'points_double':
        return { multiplier: 2 };
      case 'new_user_gift':
        return { points: 100, amount: 0 };
      default:
        return {};
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入活动名称';
    if (!formData.activity_type) newErrors.activity_type = '请选择活动类型';
    if (formData.activity_type === 'full_reduction') {
      if (!formData.rules.threshold) newErrors.threshold = '请输入满减门槛';
      if (!formData.rules.discount) newErrors.discount = '请输入优惠金额';
    }
    if (formData.activity_type === 'discount') {
      if (!formData.rules.rate) newErrors.rate = '请输入折扣比例';
    }
    if (formData.activity_type === 'points_double') {
      if (!formData.rules.multiplier) newErrors.multiplier = '请输入加倍倍数';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post('/promotions/activities', formData);
      window.location.href = '/promotions';
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  const renderRuleFields = () => {
    switch (formData.activity_type) {
      case 'full_reduction':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="threshold" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">满减门槛（元）</Label>
              <Input
                id="threshold"
                type="number"
                value={formData.rules.threshold as string || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, rules: { ...prev.rules, threshold: parseFloat(e.target.value) } }))}
                className={`border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20 ${errors.threshold ? 'border-primary-red' : ''}`}
              />
              {errors.threshold && <p className="text-primary-red text-sm mt-1">{errors.threshold}</p>}
            </div>
            <div>
              <Label htmlFor="discount" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">优惠金额（元）</Label>
              <Input
                id="discount"
                type="number"
                value={formData.rules.discount as string || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, rules: { ...prev.rules, discount: parseFloat(e.target.value) } }))}
                className={`border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20 ${errors.discount ? 'border-primary-red' : ''}`}
              />
              {errors.discount && <p className="text-primary-red text-sm mt-1">{errors.discount}</p>}
            </div>
          </div>
        );
      case 'discount':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="rate" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">折扣比例（如0.9表示9折）</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={formData.rules.rate as string || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, rules: { ...prev.rules, rate: parseFloat(e.target.value) } }))}
                className={`border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20 ${errors.rate ? 'border-primary-red' : ''}`}
              />
              {errors.rate && <p className="text-primary-red text-sm mt-1">{errors.rate}</p>}
            </div>
          </div>
        );
      case 'points_double':
        return (
          <div>
            <Label htmlFor="multiplier" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">积分加倍倍数</Label>
            <Input
              id="multiplier"
              type="number"
              value={formData.rules.multiplier as string || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, rules: { ...prev.rules, multiplier: parseFloat(e.target.value) } }))}
              className={`border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20 ${errors.multiplier ? 'border-primary-red' : ''}`}
            />
            {errors.multiplier && <p className="text-primary-red text-sm mt-1">{errors.multiplier}</p>}
          </div>
        );
      case 'new_user_gift':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="points" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">赠送积分</Label>
              <Input
                id="points"
                type="number"
                value={formData.rules.points as string || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, rules: { ...prev.rules, points: parseInt(e.target.value) } }))}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">赠送金额（元）</Label>
              <Input
                id="amount"
                type="number"
                value={formData.rules.amount as string || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, rules: { ...prev.rules, amount: parseFloat(e.target.value) } }))}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => window.history.back()} className="text-[#615d59] hover:text-[rgba(0,0,0,0.95)]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">创建促销活动</h1>
          <p className="text-[#615d59] mt-1">设置活动基本信息和规则</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-notion-card border-[rgba(0,0,0,0.1)] p-6">
          <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.95)] mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#dd5b00]" />
            基本信息
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">活动名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="请输入活动名称"
                className={`border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20 ${errors.name ? 'border-primary-red' : ''}`}
              />
              {errors.name && <p className="text-primary-red text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">活动描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="请输入活动描述"
                rows={3}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>

            <div>
              <Label htmlFor="activity_type" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">活动类型 *</Label>
              <Select value={formData.activity_type} onValueChange={handleTypeChange}>
                <SelectTrigger className="border-[rgba(0,0,0,0.1)]">
                  <SelectValue placeholder="请选择活动类型" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.activity_type && <p className="text-primary-red text-sm mt-1">{errors.activity_type}</p>}
            </div>

            <div>
              <Label htmlFor="priority" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">优先级</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-notion-card border-[rgba(0,0,0,0.1)] p-6">
          <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.95)] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0075de]" />
            时间设置
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">开始时间</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
              <p className="text-sm text-[#a39e98] mt-1">不设置则立即生效</p>
            </div>
            <div>
              <Label htmlFor="end_time" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">结束时间</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
              <p className="text-sm text-[#a39e98] mt-1">不设置则长期有效</p>
            </div>
          </div>
        </div>

        {formData.activity_type && (
          <div className="bg-white rounded-xl shadow-notion-card border-[rgba(0,0,0,0.1)] p-6">
            <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.95)] mb-4">活动规则</h3>
            {renderRuleFields()}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">
            取消
          </Button>
          <Button type="submit" className="bg-primary-red hover:bg-primary-red-dark text-white">创建活动</Button>
        </div>
      </form>
    </div>
  );
}