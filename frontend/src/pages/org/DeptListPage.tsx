import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Building2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { DepartmentInfo } from "@/types";

export default function DeptListPage() {
  const [depts, setDepts] = useState<DepartmentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentInfo | null>(null);
  const [formData, setFormData] = useState({ dept_name: "", parent_id: "", sort_order: "1" });

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const data = await api.get<DepartmentInfo[]>("/departments/tree");
      setDepts(data || []);
    } catch (err: any) {
      console.error("获取部门列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const flattenDepts = (items: DepartmentInfo[], depth = 0): { item: DepartmentInfo; depth: number }[] => {
    const result: { item: DepartmentInfo; depth: number }[] = [];
    for (const item of items) {
      result.push({ item, depth });
      if (item.children && item.children.length > 0) {
        result.push(...flattenDepts(item.children, depth + 1));
      }
    }
    return result;
  };

  const handleCreate = async () => {
    try {
      await api.post("/departments", { ...formData, parent_id: formData.parent_id ? Number(formData.parent_id) : undefined, sort_order: Number(formData.sort_order) });
      setCreateOpen(false);
      setFormData({ dept_name: "", parent_id: "", sort_order: "1" });
      fetchDepts();
    } catch (err: any) {
      console.error("创建部门失败:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDept) return;
    try {
      await api.put(`/departments/${selectedDept.id}`, formData);
      setEditOpen(false);
      fetchDepts();
    } catch (err: any) {
      console.error("更新部门失败:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该部门吗？")) return;
    try {
      await api.del(`/departments/${id}`);
      fetchDepts();
    } catch (err: any) {
      console.error("删除部门失败:", err);
    }
  };

  const flatDepts = flattenDepts(depts);

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">部门管理</CardTitle>
            <Button size="sm" className="bg-blue-600" onClick={() => { setFormData({ dept_name: "", parent_id: "", sort_order: "1" }); setCreateOpen(true); }}><Plus size={16} className="mr-1" />新增部门</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-slate-400">加载中...</p>
          ) : flatDepts.length === 0 ? (
            <p className="text-center py-8 text-slate-400">暂无数据</p>
          ) : (
            <div className="space-y-2">
              {flatDepts.map(({ item, depth }) => (
                <div key={item.id} style={{ marginLeft: depth > 0 ? `${depth * 2}rem` : 0 }}>
                  <div className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Building2 size={18} className="text-blue-600" /></div>
                      <div>
                        <div className="font-medium">{item.dept_name}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedDept(item); setFormData({ dept_name: item.dept_name, parent_id: String(item.parent_id || ""), sort_order: String(item.sort_order || 1) }); setEditOpen(true); }}><Edit size={14} /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新增部门</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm text-slate-500">部门名称</label><Input value={formData.dept_name} onChange={(e) => setFormData({ ...formData, dept_name: e.target.value })} /></div>
            <div><label className="text-sm text-slate-500">父级部门ID</label><Input type="number" value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })} /></div>
            <div><label className="text-sm text-slate-500">排序</label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button className="bg-blue-600" onClick={handleCreate}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>编辑部门</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm text-slate-500">部门名称</label><Input value={formData.dept_name} onChange={(e) => setFormData({ ...formData, dept_name: e.target.value })} /></div>
            <div><label className="text-sm text-slate-500">父级部门ID</label><Input type="number" value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })} /></div>
            <div><label className="text-sm text-slate-500">排序</label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button className="bg-blue-600" onClick={handleUpdate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
