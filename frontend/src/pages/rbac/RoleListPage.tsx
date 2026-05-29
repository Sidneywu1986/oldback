import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { DATA_SCOPES } from "@/data/mock";
import type { RoleInfo, PermissionInfo } from "@/types";

interface RoleItem {
  id: number;
  role_name: string;
  role_code: string;
  data_scope: string;
  description?: string;
  status: number;
  user_count?: number;
}

export default function RoleListPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [permOpen, setPermOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionInfo[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({ role_name: "", role_code: "", data_scope: "dept", description: "" });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await api.get<RoleItem[]>("/roles", { page: 1, page_size: 100 });
      setRoles(data || []);
    } catch (err: any) {
      console.error("获取角色列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchPermissions = async (roleId: number) => {
    try {
      const perms = await api.get<PermissionInfo[]>(`/roles/${roleId}/permissions`);
      setSelectedPerms(perms.map((p) => p.id));
    } catch (err: any) {
      console.error("获取权限失败:", err);
      setSelectedPerms([]);
    }
  };

  const openPerm = (role: RoleItem) => {
    setSelectedRole(role);
    setSelectedPerms([]);
    setPermOpen(true);
    fetchPermissions(role.id);
  };

  const handleCreate = async () => {
    try {
      await api.post("/roles", formData);
      setCreateOpen(false);
      setFormData({ role_name: "", role_code: "", data_scope: "dept", description: "" });
      fetchRoles();
    } catch (err: any) {
      console.error("创建角色失败:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedRole) return;
    try {
      await api.put(`/roles/${selectedRole.id}`, { role_name: formData.role_name, data_scope: formData.data_scope, description: formData.description });
      setEditOpen(false);
      fetchRoles();
    } catch (err: any) {
      console.error("更新角色失败:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该角色吗？")) return;
    try {
      await api.del(`/roles/${id}`);
      fetchRoles();
    } catch (err: any) {
      console.error("删除角色失败:", err);
    }
  };

  const handleSavePerms = async () => {
    if (!selectedRole) return;
    try {
      await api.post(`/roles/${selectedRole.id}/permissions`, selectedPerms);
      setPermOpen(false);
    } catch (err: any) {
      console.error("保存权限失败:", err);
    }
  };

  const togglePerm = (id: number) => {
    setSelectedPerms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">角色管理</CardTitle>
            <Button size="sm" className="bg-blue-600" onClick={() => { setFormData({ role_name: "", role_code: "", data_scope: "dept", description: "" }); setCreateOpen(true); }}><Plus size={16} className="mr-1" />新增角色</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-slate-50">
                <TableHead>角色名称</TableHead><TableHead>角色编码</TableHead><TableHead>数据范围</TableHead>
                <TableHead>描述</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">加载中...</TableCell></TableRow>
                ) : roles.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">暂无数据</TableCell></TableRow>
                ) : roles.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{r.role_name}</TableCell>
                    <TableCell><code className="bg-slate-100 px-2 py-0.5 rounded text-xs">{r.role_code}</code></TableCell>
                    <TableCell>{DATA_SCOPES.find((s) => s.value === r.data_scope)?.label || r.data_scope}</TableCell>
                    <TableCell className="text-sm text-slate-500">{r.description}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700">启用</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => openPerm(r)}><KeyRound size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedRole(r); setFormData({ role_name: r.role_name, role_code: r.role_code, data_scope: r.data_scope, description: r.description || "" }); setEditOpen(true); }}><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Permission Dialog */}
      <Dialog open={permOpen} onOpenChange={setPermOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>分配权限 - {selectedRole?.role_name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {allPermissions.map((perm) => (
              <div key={perm.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox checked={selectedPerms.includes(perm.id)} onCheckedChange={() => togglePerm(perm.id)} />
                  <span className="font-medium text-sm">{perm.perm_name}</span>
                </div>
              </div>
            ))}
            {allPermissions.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">暂无可分配权限或加载中...</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermOpen(false)}>取消</Button>
            <Button className="bg-blue-600" onClick={handleSavePerms}>保存权限</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新增角色</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm text-slate-500">角色名称</label><Input value={formData.role_name} onChange={(e) => setFormData({ ...formData, role_name: e.target.value })} /></div>
            <div><label className="text-sm text-slate-500">角色编码</label><Input value={formData.role_code} onChange={(e) => setFormData({ ...formData, role_code: e.target.value })} /></div>
            <div><label className="text-sm text-slate-500">数据范围</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm" value={formData.data_scope} onChange={(e) => setFormData({ ...formData, data_scope: e.target.value })}>
                {DATA_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-slate-500">描述</label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
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
          <DialogHeader><DialogTitle>编辑角色</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm text-slate-500">角色名称</label><Input value={formData.role_name} onChange={(e) => setFormData({ ...formData, role_name: e.target.value })} /></div>
            <div><label className="text-sm text-slate-500">角色编码</label><Input value={formData.role_code} disabled /></div>
            <div><label className="text-sm text-slate-500">数据范围</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm" value={formData.data_scope} onChange={(e) => setFormData({ ...formData, data_scope: e.target.value })}>
                {DATA_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-slate-500">描述</label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
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
