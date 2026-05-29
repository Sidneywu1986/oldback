import { useState, useEffect, useRef, useCallback } from "react";
import { Recycle, Clock, Users, Wallet, TrendingUp, TrendingDown, AlertCircle, RefreshCw, ChevronRight, Filter, X, MousePointerClick } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { RecycleOrder } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface DashboardStats {
  total_recycle: number; pending_audit: number; total_masters: number;
  total_fund: number; today_recycle: number; today_points: number;
}
interface TrendItem { date: string; recycle: number; fund: number; }
interface MasterPerformance {
  master_id: number; name: string; phone: string; level: string;
  credit_score: number; recycle_count: number; total_points: number; total_amount: number;
}

const TIME_RANGES = [
  { key: 'today', label: '今天', days: 1 },
  { key: '7d', label: '近7天', days: 7 },
  { key: '30d', label: '近30天', days: 30 },
  { key: '90d', label: '近90天', days: 90 },
] as const;
type TimeRangeKey = typeof TIME_RANGES[number]['key'];

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 600 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(elapsed(now, start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}
const elapsed = (now: number, start: number) => now - start;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-4 py-3 text-xs">
      <p className="font-semibold text-[rgba(0,0,0,0.95)] mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#a39e98]">{p.name}:</span>
          <span className="font-semibold text-[rgba(0,0,0,0.95)]">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

interface FilterState {
  timeRange: TimeRangeKey;
  status: string | null;
  activeDate: string | null;
  activeMasterId: number | null;
}

const initialFilters: FilterState = {
  timeRange: '30d', status: null, activeDate: null, activeMasterId: null,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecycleOrder[]>([]);
  const [statusDist, setStatusDist] = useState<{ name: string; value: number; color: string }[]>([]);
  const [topMasters, setTopMasters] = useState<MasterPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [pointedBarIndex, setPointedBarIndex] = useState<number | null>(null);

  const hasActiveFilter = filters.status !== null || filters.activeDate !== null || filters.activeMasterId !== null;
  const activeFilterCount = [filters.status, filters.activeDate, filters.activeMasterId].filter(Boolean).length;

  const fullRecentOrders = recentOrders;

  const filteredRecentOrders = fullRecentOrders.filter(o => {
    if (filters.status !== null) {
      const name = ['待审核','审核通过','审核驳回','已入库','已处置','待重传','已关闭','积分已发放'][o.status] || '';
      if (name !== filters.status) return false;
    }
    if (filters.activeDate && o.create_time) {
      if (!o.create_time.startsWith(filters.activeDate)) return false;
    }
    if (filters.activeMasterId !== null && o.master_id !== filters.activeMasterId) return false;
    return true;
  });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    const days = TIME_RANGES.find(t => t.key === filters.timeRange)?.days ?? 30;
    try {
      const [dash] = await Promise.all([
        api.get<{ stats: DashboardStats; trend: TrendItem[]; recent: RecycleOrder[]; status_distribution: { name: string; value: number; color: string }[] }>(
          `/dashboard/full?days=${days}`
        ),
        api.get<MasterPerformance[]>(`/reports/master-performance?days=${days}`).then(d => setTopMasters(d.slice(0, 5))).catch(() => {}),
      ]);
      setStats(dash.stats);
      setTrend(dash.trend || []);
      setRecentOrders(dash.recent || []);
      setStatusDist(dash.status_distribution || []);
    } catch (err: any) {
      setError(err?.message || "加载数据失败");
    } finally { setLoading(false); }
  }, [filters.timeRange]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const clearFilters = () => setFilters(prev => ({ ...initialFilters, timeRange: prev.timeRange }));
  const setTimeRange = (key: TimeRangeKey) => setFilters(prev => ({ ...prev, timeRange: key, activeDate: null }));

  // Chart handlers
  const handleTrendClick = (data: any) => {
    if (!data?.activePayload?.[0]) return;
    const date = data.activePayload[0].payload.date;
    setFilters(prev => ({
      ...prev,
      activeDate: prev.activeDate === date ? null : date,
      status: null,
      activeMasterId: null,
    }));
  };

  const handlePieClick = (data: any) => {
    const name = data?.name;
    if (!name) return;
    setFilters(prev => ({
      ...prev,
      status: prev.status === name ? null : name,
      activeDate: null,
      activeMasterId: null,
    }));
  };

  const handleMasterClick = (master: MasterPerformance) => {
    setFilters(prev => ({
      ...prev,
      activeMasterId: prev.activeMasterId === master.master_id ? null : master.master_id,
      status: null,
      activeDate: null,
    }));
  };

  const handleBarHover = (data: any) => {
    if (data?.activeTooltipIndex !== undefined) {
      setPointedBarIndex(data.activeTooltipIndex);
    }
  };
  const handleBarLeave = () => setPointedBarIndex(null);

  const statConfig = stats ? [
    { title: "回收总量", value: stats.total_recycle, icon: Recycle, accent: "#c41e3a", sub: "累计回收单数" },
    { title: "待审核", value: stats.pending_audit, icon: Clock, accent: "#dd5b00", sub: "需立即处理" },
    { title: "注册师傅", value: stats.total_masters, icon: Users, accent: "#1aae39", sub: "全国认证师傅" },
    { title: "资金总额", value: stats.total_fund, icon: Wallet, accent: "#0075de", sub: "平台流转资金", isCurrency: true },
    { title: "今日回收", value: stats.today_recycle, icon: TrendingUp, accent: "#2a9d99", sub: "较昨日 +12.5%", trend: true, trendUp: true },
    { title: "今日积分", value: stats.today_points, icon: TrendingUp, accent: "#391c57", sub: "较昨日 +8.3%", trend: true, trendUp: true },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({length: 6}).map((_, i) => (
            <Card key={i} className="border-[rgba(0,0,0,0.08)]">
              <CardContent className="p-5"><div className="space-y-3 animate-pulse">
                <div className="h-3 bg-[rgba(0,0,0,0.06)] rounded w-16" />
                <div className="h-7 bg-[rgba(0,0,0,0.08)] rounded w-24" />
                <div className="h-2.5 bg-[rgba(0,0,0,0.04)] rounded w-20" />
              </div></CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2].map(i => (
            <Card key={i} className="border-[rgba(0,0,0,0.08)]">
              <CardContent className="p-6 h-[300px] animate-pulse bg-[#fafaf8] rounded-xl" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-[rgba(0,0,0,0.08)] max-w-lg mx-auto mt-24">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[rgba(196,30,58,0.06)] rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-primary-red" />
          </div>
          <h3 className="text-lg font-bold text-[rgba(0,0,0,0.95)] mb-1">数据加载失败</h3>
          <p className="text-sm text-[#615d59] mb-6">{error}</p>
          <Button onClick={fetchDashboard} className="bg-primary-red hover:bg-[#a01830] text-white gap-2">
            <RefreshCw className="w-4 h-4" /> 重新加载
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">

      {/* Time Range Tabs + Active Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center bg-[#fafaf8] rounded-xl p-1 gap-0.5 border border-[rgba(0,0,0,0.06)]">
          {TIME_RANGES.map((t) => (
            <button key={t.key} onClick={() => setTimeRange(t.key)}
              className={`px-4 py-1.5 rounded-[10px] text-xs font-semibold transition-all duration-200 ${
                filters.timeRange === t.key
                  ? 'bg-white text-[rgba(0,0,0,0.95)] shadow-sm ring-1 ring-[rgba(0,0,0,0.06)]'
                  : 'text-[#a39e98] hover:text-[#615d59]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {hasActiveFilter && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(196,30,58,0.05)] border border-[rgba(196,30,58,0.15)] rounded-xl text-xs font-medium text-primary-red">
              <Filter className="w-3 h-3" />
              {activeFilterCount} 项筛选生效
            </div>
            <Button size="sm" variant="ghost"
              onClick={clearFilters}
              className="h-7 text-xs text-[#a39e98] hover:text-[rgba(0,0,0,0.95)] px-2 gap-1">
              <X className="w-3 h-3" /> 清除
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statConfig.map((card) => (
          <Card key={card.title} className={`group relative overflow-hidden border-[rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5`}>
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: card.accent }} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2.5">
                <span className="text-xs text-[#a39e98] font-medium">{card.title}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor: `${card.accent}10`}}>
                  <card.icon size={16} style={{color: card.accent}} />
                </div>
              </div>
              <div className="text-2xl font-black text-[rgba(0,0,0,0.95)] tracking-tight mb-1">
                {card.isCurrency ? `¥${(card.value / 10000).toFixed(1)}万` : <AnimatedCounter value={card.value} />}
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{color: card.trendUp ? '#1aae39' : '#a39e98'}}>
                {card.trend && (card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                <span>{card.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recycle Trend - Clickable for drill-down by date */}
        <Card className="border-[rgba(0,0,0,0.08)]">
          <CardHeader className="pb-1 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[rgba(0,0,0,0.95)]">回收趋势</CardTitle>
              <p className={`text-xs mt-0.5 transition-colors ${filters.activeDate ? 'text-primary-red font-medium' : 'text-[#a39e98]'}`}>
                {filters.activeDate ? `已筛选: ${filters.activeDate}` : '点击数据点钻取日期数据'}
              </p>
            </div>
            {filters.activeDate && (
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="text-xs text-primary-red hover:bg-[rgba(196,30,58,0.04)] h-6 px-2"
                  onClick={() => setFilters(prev => ({ ...prev, activeDate: null }))}>取消</Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend} onClick={handleTrendClick}>
                <defs>
                  <linearGradient id="recycleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c41e3a" stopOpacity={0.12}/>
                    <stop offset="100%" stopColor="#c41e3a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#a39e98'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#a39e98'}} axisLine={false} tickLine={false} width={40} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="recycle" name="回收量" stroke="#c41e3a" strokeWidth={2.5} dot={false}
                  activeDot={{r: 5, strokeWidth: 2.5, stroke: '#fff', fill: '#c41e3a', cursor: 'pointer', className: 'hover:scale-150 transition-transform'}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fund Flow - Bar hover highlights */}
        <Card className="border-[rgba(0,0,0,0.08)]">
          <CardHeader className="pb-1 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[rgba(0,0,0,0.95)]">资金流水</CardTitle>
              <p className="text-xs text-[#a39e98] mt-0.5">鼠标悬停高亮对应柱</p>
            </div>
            <Badge variant="outline" className="bg-[rgba(0,117,222,0.06)] text-[#0075de] text-xs border-[rgba(0,117,222,0.15)]">共 {trend.length} 天</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trend} onMouseMove={handleBarHover} onMouseLeave={handleBarLeave}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#a39e98'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#a39e98'}} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 10000 ? `${(v/10000).toFixed(0)}万` : v} width={45} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="fund" name="资金" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {trend.map((_, i) => (
                    <Cell key={i} fill={pointedBarIndex === i ? '#c41e3a' : '#0075de'}
                      style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - with cross-linking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Records - filtered by active filters */}
        <Card className="border-[rgba(0,0,0,0.08)] lg:col-span-2">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[rgba(0,0,0,0.95)]">
                最近回收记录
                {hasActiveFilter && (
                  <span className="ml-2 font-normal text-xs text-primary-red">
                    — 已筛选 {filteredRecentOrders.length}/{fullRecentOrders.length} 条
                  </span>
                )}
              </CardTitle>
              <p className="text-xs text-[#a39e98] mt-0.5">
                {hasActiveFilter ? '左侧饼图/排行可联动筛选' : '实时更新的订单动态 · 点击左侧图表联动筛选'}
              </p>
            </div>
            <Button size="sm" variant="ghost" className="text-xs text-primary-red hover:text-primary-red hover:bg-[rgba(196,30,58,0.04)]">查看全部 <ChevronRight className="w-3 h-3 ml-0.5" /></Button>
          </CardHeader>
          <CardContent>
            {hasActiveFilter && (
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                {filters.status && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(196,30,58,0.06)] text-[11px] font-medium text-primary-red">
                    <MousePointerClick className="w-3 h-3" />
                    状态: {filters.status}
                    <button onClick={() => setFilters(prev => ({...prev, status: null}))} className="ml-0.5 hover:text-[#a01830]"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.activeDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(0,117,222,0.06)] text-[11px] font-medium text-[#0075de]">
                    <MousePointerClick className="w-3 h-3" />
                    日期: {filters.activeDate}
                    <button onClick={() => setFilters(prev => ({...prev, activeDate: null}))} className="ml-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.activeMasterId && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(57,28,87,0.06)] text-[11px] font-medium text-[#391c57]">
                    <MousePointerClick className="w-3 h-3" />
                    师傅: #{filters.activeMasterId}
                    <button onClick={() => setFilters(prev => ({...prev, activeMasterId: null}))} className="ml-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs text-[#a39e98] font-medium w-[130px]">订单号</TableHead>
                  <TableHead className="text-xs text-[#a39e98] font-medium">配件名称</TableHead>
                  <TableHead className="text-xs text-[#a39e98] font-medium">师傅</TableHead>
                  <TableHead className="text-xs text-[#a39e98] font-medium">金额</TableHead>
                  <TableHead className="text-xs text-[#a39e98] font-medium">状态</TableHead>
                  <TableHead className="text-xs text-[#a39e98] font-medium text-right">时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecentOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">
                    <div className="text-[#a39e98]">
                      <Filter className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">当前筛选条件下无匹配记录</p>
                      {hasActiveFilter && (
                        <Button size="sm" variant="ghost" className="mt-2 text-xs text-primary-red" onClick={clearFilters}>清除所有筛选</Button>
                      )}
                    </div>
                  </TableCell></TableRow>
                ) : filteredRecentOrders.slice(0, 6).map((o) => (
                  <TableRow key={o.id} className={`hover:bg-[rgba(0,0,0,0.015)] transition-all duration-200 ${
                    filters.activeMasterId === o.master_id ? 'bg-[rgba(57,28,87,0.03)]' :
                    filters.activeDate && o.create_time?.startsWith(filters.activeDate) ? 'bg-[rgba(196,30,58,0.02)]' : ''
                  }`}>
                    <TableCell className="font-mono text-[11px] text-[rgba(0,0,0,0.95)] py-3">{o.order_no}</TableCell>
                    <TableCell className="text-sm font-medium text-[rgba(0,0,0,0.95)] py-3">{o.parts_name}</TableCell>
                    <TableCell className="text-sm text-[rgba(0,0,0,0.95)] py-3">
                      {o.master_name}
                      {filters.activeMasterId === o.master_id && (
                        <Badge className="ml-1.5 bg-[rgba(57,28,87,0.08)] text-[#391c57] text-[9px] px-1.5 py-0">选中</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-[rgba(0,0,0,0.95)] py-3">{o.amount ? `¥${Number(o.amount).toLocaleString()}` : '-'}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 transition-all ${
                        filters.status && (['待审核','审核通过','审核驳回','已入库','已处置','待重传','已关闭','积分已发放'][o.status]) === filters.status
                          ? 'ring-2 ring-primary-red/30'
                          : ''
                      } ${
                        o.status === 0 ? 'bg-[rgba(221,91,0,0.06)] text-[#dd5b00] border-[rgba(221,91,0,0.15)]' :
                        o.status === 1 ? 'bg-[rgba(0,117,222,0.06)] text-[#0075de] border-[rgba(0,117,222,0.15)]' :
                        o.status === 3 ? 'bg-[rgba(26,174,57,0.06)] text-[#1aae39] border-[rgba(26,174,57,0.15)]' :
                        'bg-[rgba(0,0,0,0.04)] text-[#615d59] border-[rgba(0,0,0,0.1)]'
                      }`}>
                        {['待审核','通过','驳回','已入库','已处置','待重传','已关闭','已发放'][o.status] || o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#a39e98] text-right py-3">{o.create_time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Status + Masters sidebar */}
        <div className="space-y-6">

          {/* Status Distribution - Clickable pie for cross-linking */}
          <Card className="border-[rgba(0,0,0,0.08)]">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[rgba(0,0,0,0.95)]">状态分布</CardTitle>
                <p className="text-xs text-[#a39e98] mt-0.5">点击扇区联动表格筛选</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <div className="w-[110px] h-[110px] cursor-pointer">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={statusDist} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value"
                        strokeWidth={0} paddingAngle={2} onClick={handlePieClick}>
                        {statusDist.map((s, i) => (
                          <Cell key={i} fill={s.color}
                            opacity={filters.status ? (filters.status === s.name ? 1 : 0.35) : 1}
                            style={{
                              filter: filters.status === s.name ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' : undefined,
                              transform: filters.status === s.name ? 'scale(1.05)' : undefined,
                              transformOrigin: 'center',
                              transition: 'all 0.3s',
                            }}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {statusDist.slice(0, 4).map((s) => (
                    <button key={s.name}
                      onClick={() => setFilters(prev => ({...prev, status: prev.status === s.name ? null : s.name, activeDate: null, activeMasterId: null}))}
                      className={`w-full flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-all duration-200 ${
                        filters.status === s.name
                          ? 'bg-[rgba(196,30,58,0.06)] ring-1 ring-[rgba(196,30,58,0.15)]'
                          : 'hover:bg-[rgba(0,0,0,0.02)]'
                      }`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform ${filters.status === s.name ? 'scale-125' : ''}`}
                          style={{backgroundColor: s.color}} />
                        <span className={`${filters.status === s.name ? 'text-primary-red font-semibold' : 'text-[#615d59]'}`}>{s.name}</span>
                      </div>
                      <span className={`font-semibold ${filters.status === s.name ? 'text-primary-red' : 'text-[rgba(0,0,0,0.95)]'}`}>{s.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Master Ranking - Clickable to filter */}
          <Card className="border-[rgba(0,0,0,0.08)]">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[rgba(0,0,0,0.95)]">师傅排行</CardTitle>
                <p className="text-xs text-[#a39e98] mt-0.5">点击筛选师傅订单</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {topMasters.length === 0 ? (
                <p className="text-xs text-[#a39e98] text-center py-6">暂无数据</p>
              ) : topMasters.map((m, i) => (
                <button key={m.master_id}
                  onClick={() => handleMasterClick(m)}
                  className={`w-full flex items-center gap-3 py-2.5 px-2 rounded-lg transition-all duration-200 cursor-pointer text-left ${
                    filters.activeMasterId === m.master_id
                      ? 'bg-[rgba(57,28,87,0.05)] ring-1 ring-[rgba(57,28,87,0.12)]'
                      : 'hover:bg-[rgba(0,0,0,0.015)]'
                  }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-[#f5a623] text-white' :
                    i === 1 ? 'bg-[#a39e98] text-white' :
                    i === 2 ? 'bg-[#cd7f32] text-white' :
                    'bg-[rgba(0,0,0,0.05)] text-[#615d59]'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${filters.activeMasterId === m.master_id ? 'text-[#391c57]' : 'text-[rgba(0,0,0,0.95)]'}`}>
                      {m.name}
                      {filters.activeMasterId === m.master_id && (
                        <span className="ml-1 text-[#391c57] text-[10px]">已筛选</span>
                      )}
                    </p>
                    <p className="text-[10px] text-[#a39e98]">{m.level} · {m.recycle_count}次回收</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-[#0075de]">+{m.total_points.toLocaleString()}</p>
                    <p className="text-[10px] text-[#a39e98]">积分</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
