import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

interface Tag {
  id: number;
  name: string;
  tag_type: string;
  tag_type_label: string;
  value: string;
  description: string;
  created_at: string;
}

const TAG_TYPES = [
  { value: 'level', label: '等级' },
  { value: 'region', label: '地域' },
  { value: 'activity', label: '活跃度' },
  { value: 'register_time', label: '注册时间' },
];

const TYPE_MAP: Record<string, string> = {
  level: '等级',
  region: '地域',
  activity: '活跃度',
  register_time: '注册时间',
};

export default function TagListPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tag_type: '',
    value: '',
    description: '',
  });

  useEffect(() => {
    loadTags();
  }, [typeFilter]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const tag_type = typeFilter === 'all' ? undefined : typeFilter;
      const res = await api.get<Tag[]>('/promotions/tags', { tag_type });
      setTags(res);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await api.del(`/promotions/tags/${deleteDialog}`);
      setTags(tags.filter((t) => t.id !== deleteDialog));
      setDeleteDialog(null);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ name: '', tag_type: '', value: '', description: '' });
    setEditTag(null);
    setShowCreateDialog(true);
  };

  const handleOpenEdit = (tag: Tag) => {
    setFormData({
      name: tag.name,
      tag_type: tag.tag_type,
      value: tag.value || '',
      description: tag.description || '',
    });
    setEditTag(tag);
    setShowCreateDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editTag) {
        await api.put(`/promotions/tags/${editTag.id}`, formData);
      } else {
        await api.post('/promotions/tags', formData);
      }
      setShowCreateDialog(false);
      loadTags();
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">用户标签管理</h1>
          <p className="text-[#615d59] mt-1">管理用户标签，用于精准活动推送</p>
        </div>
        <Button className="bg-primary-red hover:bg-primary-red-dark text-white">
          <Plus className="w-4 h-4 mr-2" />
          创建标签
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
          <Input
            placeholder="搜索标签名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 border-[rgba(0,0,0,0.1)]">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {TAG_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-notion-card border-[rgba(0,0,0,0.1)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>标签名称</TableHead>
              <TableHead className="w-24">标签类型</TableHead>
              <TableHead className="w-24">标签值</TableHead>
              <TableHead>描述</TableHead>
              <TableHead className="w-32">创建时间</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-red border-t-transparent mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : filteredTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-[#a39e98]">
                  暂无标签数据
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-mono text-sm">{tag.id}</TableCell>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell>
                    <Badge className="bg-[rgba(57,28,87,0.08)] text-[#391c57]">
                      {TYPE_MAP[tag.tag_type] || tag.tag_type_label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[rgba(0,0,0,0.95)]">{tag.value || '-'}</TableCell>
                  <TableCell className="text-sm text-[#615d59] line-clamp-1">
                    {tag.description || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-[#a39e98]">
                    {new Date(tag.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#a39e98] hover:text-[rgba(0,0,0,0.95)]"
                        onClick={() => handleOpenEdit(tag)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary-red hover:text-primary-red-dark"
                        onClick={() => setDeleteDialog(tag.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="border-[rgba(0,0,0,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[rgba(0,0,0,0.95)]">确认删除</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-[#615d59]">确定要删除该标签吗？此操作不可撤销。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button className="bg-primary-red hover:bg-primary-red-dark" onClick={handleDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={() => setShowCreateDialog(false)}>
        <DialogContent className="sm:max-w-md border-[rgba(0,0,0,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[rgba(0,0,0,0.95)]">{editTag ? '编辑标签' : '创建标签'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">标签名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="请输入标签名称"
                required
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
            <div>
              <Label htmlFor="tag_type" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">标签类型 *</Label>
              <Select value={formData.tag_type} onValueChange={(value) => setFormData((prev) => ({ ...prev, tag_type: value }))}>
                <SelectTrigger className="border-[rgba(0,0,0,0.1)]">
                  <SelectValue placeholder="请选择标签类型" />
                </SelectTrigger>
                <SelectContent>
                  {TAG_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">标签值</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                placeholder="标签的具体值"
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="标签描述"
                rows={3}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">
                取消
              </Button>
              <Button type="submit" className="bg-primary-red hover:bg-primary-red-dark">{editTag ? '保存' : '创建'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}