import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';

interface Activity {
  id: number;
  name: string;
  description: string;
  activity_type: string;
  activity_type_label: string;
  status: number;
  status_label: string;
  priority: number;
  start_time: string;
  end_time: string;
  created_at: string;
}

const STATUS_MAP = {
  0: { label: '待生效', className: 'bg-[rgba(221,91,0,0.08)] text-[#dd5b00]' },
  1: { label: '运行中', className: 'bg-[rgba(26,174,57,0.08)] text-[#1aae39]' },
  2: { label: '已结束', className: 'bg-[rgba(163,158,152,0.2)] text-[#a39e98]' },
  3: { label: '已禁用', className: 'bg-[rgba(196,30,58,0.08)] text-primary-red' },
};

const TYPE_MAP = {
  discount: '折扣活动',
  full_reduction: '满减活动',
  points_double: '积分加倍',
  new_user_gift: '新人礼包',
};

export default function PromotionListPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);

  useEffect(() => {
    loadActivities();
  }, [statusFilter]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const status = statusFilter === 'all' ? undefined : parseInt(statusFilter);
      const res = await api.get<Activity[]>('/promotions/activities', { status });
      setActivities(res);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await api.del(`/promotions/activities/${deleteDialog}`);
      setActivities(activities.filter((a) => a.id !== deleteDialog));
      setDeleteDialog(null);
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleStatusChange = async (id: number, status: number) => {
    try {
      await api.post(`/promotions/activities/${id}/status?status=${status}`);
      loadActivities();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredActivities = activities.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">促销活动管理</h1>
          <p className="text-[#615d59] mt-1">管理平台促销活动，支持多种活动类型</p>
        </div>
        <Button className="bg-primary-red hover:bg-primary-red-dark text-white">
          <Plus className="w-4 h-4 mr-2" />
          创建活动
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
          <Input
            placeholder="搜索活动名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#a39e98]" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 border-[rgba(0,0,0,0.1)]">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="0">待生效</SelectItem>
              <SelectItem value="1">运行中</SelectItem>
              <SelectItem value="2">已结束</SelectItem>
              <SelectItem value="3">已禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-notion-card border-[rgba(0,0,0,0.1)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>活动名称</TableHead>
              <TableHead className="w-28">活动类型</TableHead>
              <TableHead className="w-24">状态</TableHead>
              <TableHead className="w-20">优先级</TableHead>
              <TableHead className="w-48">时间范围</TableHead>
              <TableHead className="w-32">创建时间</TableHead>
              <TableHead className="w-36">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-red border-t-transparent mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-[#a39e98]">
                  暂无活动数据
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-mono text-sm">{activity.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{activity.name}</div>
                    {activity.description && (
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {activity.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#f2f9ff] text-[#097fe8]">
                      {TYPE_MAP[activity.activity_type as keyof typeof TYPE_MAP] || activity.activity_type_label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_MAP[activity.status as keyof typeof STATUS_MAP]?.className}>
                      {STATUS_MAP[activity.status as keyof typeof STATUS_MAP]?.label || activity.status_label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[rgba(0,0,0,0.95)]">{activity.priority}</TableCell>
                  <TableCell className="text-sm text-[#615d59]">
                    {activity.start_time ? new Date(activity.start_time).toLocaleDateString() : '立即'}
                    {' - '}
                    {activity.end_time ? new Date(activity.end_time).toLocaleDateString() : '长期'}
                  </TableCell>
                  <TableCell className="text-sm text-[#a39e98]">
                    {new Date(activity.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#a39e98] hover:text-[rgba(0,0,0,0.95)]">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#a39e98] hover:text-[rgba(0,0,0,0.95)]">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary-red hover:text-primary-red-dark"
                        onClick={() => setDeleteDialog(activity.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {activity.status === 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#1aae39]"
                          onClick={() => handleStatusChange(activity.id, 1)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {activity.status === 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#dd5b00]"
                          onClick={() => handleStatusChange(activity.id, 3)}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-slate-600">确定要删除该活动吗？此操作不可撤销。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>取消</Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}