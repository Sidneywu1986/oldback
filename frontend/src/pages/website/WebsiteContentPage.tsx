import { useState } from "react";
import { Save, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ContentItem {
  id: string;
  type: "banner" | "service" | "about" | "testimonial";
  title: string;
  content: string;
  status: "published" | "draft";
  createdAt: string;
}

const mockContents: ContentItem[] = [
  { id: "1", type: "banner", title: "首页横幅", content: "让回收更简单、透明、高效", status: "published", createdAt: "2024-01-15" },
  { id: "2", type: "service", title: "配件回收服务", content: "覆盖各类电子配件、机械零件的专业回收服务", status: "published", createdAt: "2024-01-16" },
  { id: "3", type: "service", title: "环保处理服务", content: "绿色环保处理方案，实现资源循环再利用", status: "published", createdAt: "2024-01-17" },
  { id: "4", type: "about", title: "公司简介", content: "飞玖回收成立于2020年，专注于维修行业旧件回收", status: "draft", createdAt: "2024-01-18" },
  { id: "5", type: "testimonial", title: "客户评价-张经理", content: "飞玖回收让我们的旧件处理变得简单高效", status: "published", createdAt: "2024-01-19" },
];

const TYPE_MAP: Record<string, string> = {
  banner: "横幅",
  service: "服务",
  about: "关于我们",
  testimonial: "客户评价",
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  published: { label: "已发布", className: "bg-[rgba(26,174,57,0.08)] text-[#1aae39]" },
  draft: { label: "草稿", className: "bg-[rgba(163,158,152,0.2)] text-[#a39e98]" },
};

export default function WebsiteContentPage() {
  const [contents, setContents] = useState<ContentItem[]>(mockContents);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [detailItem, setDetailItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState({
    type: "banner" as ContentItem["type"],
    title: "",
    content: "",
    status: "draft" as "published" | "draft",
  });

  const filteredContents = contents.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "all" || item.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleOpenCreate = () => {
    setFormData({ type: "banner", title: "", content: "", status: "draft" });
    setShowCreateDialog(true);
  };

  const handleOpenEdit = (item: ContentItem) => {
    setEditItem(item);
    setFormData({ type: item.type, title: item.title, content: item.content, status: item.status });
    setShowEditDialog(true);
  };

  const handleOpenDetail = (item: ContentItem) => {
    setDetailItem(item);
    setShowDetailDialog(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      setContents((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? { ...item, ...formData, createdAt: "" }
            : item
        )
      );
      setShowEditDialog(false);
    } else {
      const newItem: ContentItem = {
        ...formData,
        id: Math.random().toString(36).slice(2),
        createdAt: "",
      };
      setContents((prev) => [newItem, ...prev]);
      setShowCreateDialog(false);
    }
  };

  const handleDelete = (id: string) => {
    setContents((prev) => prev.filter((item) => item.id !== id));
    setShowDeleteDialog(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">官网内容管理</h1>
          <p className="text-[#615d59] mt-1">管理企业官网的内容和展示</p>
        </div>
        <Button className="bg-primary-red hover:bg-primary-red-dark text-white" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          添加内容
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Input
            placeholder="搜索内容..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value: string) => setTypeFilter(value)}>
          <SelectTrigger className="w-36 border-[rgba(0,0,0,0.1)]">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="banner">横幅</SelectItem>
            <SelectItem value="service">服务</SelectItem>
            <SelectItem value="about">关于我们</SelectItem>
            <SelectItem value="testimonial">客户评价</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-[rgba(0,0,0,0.1)] shadow-notion-card">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-warm-white">
                <th className="text-left px-6 py-4 text-sm font-medium text-[#615d59]">标题</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#615d59]">类型</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#615d59]">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#615d59]">创建时间</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-[#615d59]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map((item) => (
                <tr key={item.id} className="border-t border-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.02)]">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[rgba(0,0,0,0.95)]">{item.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-[#f2f9ff] text-[#097fe8]">{TYPE_MAP[item.type]}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={STATUS_MAP[item.status].className}>
                      {STATUS_MAP[item.status].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#a39e98]">{item.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#a39e98] hover:text-[rgba(0,0,0,0.95)]" onClick={() => handleOpenDetail(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#a39e98] hover:text-[rgba(0,0,0,0.95)]" onClick={() => handleOpenEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-red hover:text-primary-red-dark" onClick={() => setShowDeleteDialog(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#a39e98]">暂无内容</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={() => { setShowCreateDialog(false); setShowEditDialog(false); }}>
        <DialogContent className="sm:max-w-lg border-[rgba(0,0,0,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[rgba(0,0,0,0.95)]">{editItem ? "编辑内容" : "添加内容"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">类型 *</label>
              <Select value={formData.type} onValueChange={(value: string) => setFormData((prev) => ({ ...prev, type: value as ContentItem["type"] }))}>
                <SelectTrigger className="border-[rgba(0,0,0,0.1)]">
                  <SelectValue placeholder="请选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">横幅</SelectItem>
                  <SelectItem value="service">服务</SelectItem>
                  <SelectItem value="about">关于我们</SelectItem>
                  <SelectItem value="testimonial">客户评价</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">标题 *</label>
              <Input
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="请输入标题"
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">内容 *</label>
              <Textarea
                value={formData.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="请输入内容"
                rows={4}
                className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-2">状态</label>
              <Select value={formData.status} onValueChange={(value: string) => setFormData((prev) => ({ ...prev, status: value as "published" | "draft" }))}>
                <SelectTrigger className="border-[rgba(0,0,0,0.1)]">
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); setShowEditDialog(false); }} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button className="bg-primary-red hover:bg-primary-red-dark" onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              {editItem ? "保存" : "添加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailDialog} onOpenChange={() => setShowDetailDialog(false)}>
        <DialogContent className="sm:max-w-lg border-[rgba(0,0,0,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[rgba(0,0,0,0.95)]">{detailItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-[#f2f9ff] text-[#097fe8]">{TYPE_MAP[detailItem?.type || ""]}</Badge>
              <Badge className={STATUS_MAP[detailItem?.status || "draft"].className}>
                {STATUS_MAP[detailItem?.status || "draft"].label}
              </Badge>
            </div>
            <p className="text-[#615d59] leading-relaxed">{detailItem?.content}</p>
            <p className="text-xs text-[#a39e98] mt-4">创建时间: {detailItem?.createdAt}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDetailDialog(false)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent className="border-[rgba(0,0,0,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[rgba(0,0,0,0.95)]">确认删除</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-[#615d59]">确定要删除该内容吗？此操作不可撤销。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button className="bg-primary-red hover:bg-primary-red-dark" onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
