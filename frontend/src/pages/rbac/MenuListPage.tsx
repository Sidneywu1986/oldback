import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { MenuInfo } from "@/types";

export default function MenuListPage() {
  const [menus, setMenus] = useState<MenuInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuInfo | null>(null);
  const [formData, setFormData] = useState({ menu_name: "", menu_code: "", path: "", icon: "", parent_id: "", sort_order: "1", permission_code: "" });

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const data = await api.get<MenuInfo[]>("/menus/tree");
      setMenus(data || []);
    } catch (err: any) {
      console.error("获取菜单列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const flattenMenus = (items: MenuInfo[], depth = 0): { item: MenuInfo; depth: number }[] => {
    const result: { item: MenuInfo; depth: number }[] = [];
    for (const item of items) {
      result.push({ item, depth });
      if (item.children && item.children.length > 0) {
        result.push(...flattenMenus(item.children, depth + 1));
      }
    }
    return result;
  };

  const handleCreate = async () => {
    try {
      await api.post("/menus", { ...formData, parent_id: formData.parent_id ? Number(formData.parent_id) : undefined, sort_order: Number(formData.sort_order) });
      setCreateOpen(false);
      setFormData({ menu_name: "", menu_code: "", path: "", icon: "", parent_id: "", sort_order: "1", permission_code: "" });
      fetchMenus();
    } catch (err: any) {
      console.error("创建菜单失败:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedMenu) return;
    try {
      await api.put(`/menus/${selectedMenu.id}`, formData);
      setEditOpen(false);
      fetchMenus();
    } catch (err: any) {
      console.error("更新菜单失败:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该菜单吗？")) return;
    try {
      await api.del(`/menus/${id}`);
      fetchMenus();
    } catch (err: any) {
      console.error("删除菜单失败:", err);
    }
  };

  const flatMenus = flattenMenus(menus);

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">菜单管理</CardTitle>
            <Button size="sm" className="bg-blue-600" onClick={() => { setFormData({ menu_name: "", menu_code: "", path: "", icon: "", parent_id: "", sort_order: "1", permission_code: "" }); setCreateOpen(true); }}><Plus size={16} className="mr-1" />新增菜单</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-slate-50">
                <TableHead className="w-8"></TableHead><TableHead>菜单名称</TableHead><TableHead>路径</TableHead>
                <TableHead>图标</TableHead><TableHead>排序</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">加载中...</TableCell></TableRow>
                ) : flatMenus.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">暂无数据</TableCell></TableRow>
                ) : flatMenus.map(({ item, depth }) => (
                  <TableRow key={item.id} className={depth > 0 ? "bg-slate-50/50" : ""}>
                    <TableCell><GripVertical size={14} className="text-slate-300 cursor-move" /></TableCell>
                    <TableCell className={depth > 0 ? "pl-8 text-sm" : "font-medium"}>{item.menu_name}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{item.path || "-"}</TableCell>
                    <TableCell className="text-xs">{item.icon || "-"}</TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700">启用</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedMenu(item); setFormData({ menu_name: item.menu_name, menu_code: item.menu_code || "", path: item.path || "", icon: item.icon || "", parent_id: String(item.parent_id || ""), sort_order: String(item.sort_order || 1), permission_code: item.permission_code || "" }); setEditOpen(true); }}><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新增菜单</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-500">菜单名称</label><Input value={formData.menu_name} onChange={(e) => setFormData({ ...formData, menu_name: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">菜单编码</label><Input value={formData.menu_code} onChange={(e) => setFormData({ ...formData, menu_code: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">路径</label><Input value={formData.path} onChange={(e) => setFormData({ ...formData, path: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">图标</label><Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">父级菜单ID</label><Input type="number" value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">排序</label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">权限编码</label><Input value={formData.permission_code} onChange={(e) => setFormData({ ...formData, permission_code: e.target.value })} /></div>
            </div>
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
          <DialogHeader><DialogTitle>编辑菜单</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-slate-500">菜单名称</label><Input value={formData.menu_name} onChange={(e) => setFormData({ ...formData, menu_name: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">菜单编码</label><Input value={formData.menu_code} disabled /></div>
              <div><label className="text-sm text-slate-500">路径</label><Input value={formData.path} onChange={(e) => setFormData({ ...formData, path: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">图标</label><Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} /></div>
              <div><label className="text-sm text-slate-500">排序</label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} /></div>
            </div>
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
