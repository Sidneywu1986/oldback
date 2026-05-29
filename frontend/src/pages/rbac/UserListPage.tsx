import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, UserPlus, Download, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import FilterBar, { type FilterField } from "@/components/FilterBar";
import TableActions, { type TableAction } from "@/components/TableActions";
import { useBatchSelect } from "@/hooks/useBatchSelect";
import { exportCSV } from "@/lib/export";
import { api } from "@/lib/api";
import type { UserItem, PaginatedData, RoleInfo } from "@/types";

const filterFields: FilterField[] = [
  { key: "status", label: "用户状态", type: "select", options: [
    { label: "启用", value: "1" }, { label: "禁用", value: "0" },
  ]},
  { key: "is_super", label: "用户类型", type: "select", options: [
    { label: "超级管理员", value: "1" }, { label: "普通用户", value: "0" },
  ]},
];

export default function UserListPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [batchLoading, setBatchLoading] = useState(false);
  const pageSize = 10;

  const { selectedIds, isAllSelected, isIndeterminate, toggleItem, toggleAll, clearSelection } =
    useBatchSelect({ items: users, idKey: "id" });

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "", real_name: "", phone: "", dept_id: "", status: 1, password: "" });

  const buildParams = () => {
    const params: Record<string, any> = { page, page_size: pageSize, keyword };
    if (filters.status) params.status = Number(filters.status);
    if (filters.is_super) params.is_super = Number(filters.is_super);
    return params;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedData<UserItem>>("/users", buildParams());
      setUsers(data.list || []);
      setTotal(data.total || 0);
      clearSelection();
    } catch (err: any) {
      console.error("获取用户列表失败:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, keyword, filters]);

  const handleCreate = async () => {
    try {
      await api.post("/users", { ...formData, dept_id: formData.dept_id ? Number(formData.dept_id) : undefined, status: Number(formData.status) });
      setCreateOpen(false);
      setFormData({ username: "", real_name: "", phone: "", dept_id: "", status: 1, password: "" });
      fetchUsers();
    } catch (err: any) { console.error("创建用户失败:", err); }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/users/${selectedUser.id}`, { real_name: selectedUser.real_name, phone: selectedUser.phone, dept_id: selectedUser.dept_id, status: selectedUser.status });
      setEditOpen(false);
      fetchUsers();
    } catch (err: any) { console.error("更新用户失败:", err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该用户吗？")) return;
    try { await api.del(`/users/${id}`); fetchUsers(); }
    catch (err: any) { console.error("删除用户失败:", err); }
  };

  const handleBatchDelete = async () => {
    if (!confirm(`确定删除选中的 ${selectedIds.size} 个用户吗？此操作不可恢复！`)) return;
    setBatchLoading(true);
    try {
      await api.post("/users/batch-delete", { ids: Array.from(selectedIds) });
      fetchUsers();
    } catch (err: any) { console.error("批量删除失败:", err); }
    finally { setBatchLoading(false); }
  };

  const handleExport = () => {
    exportCSV(users, [
      { key: "username", title: "用户名" },
      { key: "real_name", title: "姓名" },
      { key: "phone", title: "手机号" },
      { key: "dept_name", title: "部门" },
    ], `用户列表_${Math.random().toString(36).slice(2, 8)}`);
  };

  const getRowActions = (u: UserItem): TableAction[] => [
    { label: "编辑", icon: <Edit className="w-4 h-4" />, onClick: () => { setSelectedUser(u); setEditOpen(true); } },
    { label: "删除", icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDelete(u.id), variant: "danger" },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <Card className="border-[rgba(0,0,0,0.1)] shadow-notion-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[rgba(0,0,0,0.95)]">用户管理</CardTitle>
            <div className="flex gap-2 items-center">
              <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                <Download size={14} /> 导出
              </Button>
              <Button size="sm" className="bg-primary-red hover:bg-primary-red-dark" onClick={() => setCreateOpen(true)}>
                <Plus size={14} className="mr-1" />新增用户
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <FilterBar
              fields={filterFields}
              onFilter={setFilters}
              onSearch={(v) => { setKeyword(v); setPage(1); }}
              searchPlaceholder="搜索用户名/姓名/手机号"
            />
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 mb-3 px-4 py-2 bg-[rgba(196,30,58,0.04)] rounded-xl border border-[rgba(196,30,58,0.15)]">
              <span className="text-sm text-primary-red font-medium">已选 {selectedIds.size} 项</span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" className="bg-primary-red hover:bg-primary-red-dark h-8" disabled={batchLoading} onClick={handleBatchDelete}>
                  <Trash2 size={14} className="mr-1" />
                  {batchLoading ? "删除中..." : "批量删除"}
                </Button>
                <Button size="sm" variant="ghost" className="h-8" onClick={clearSelection}>
                  <RotateCcw size={14} className="mr-1" />取消选择
                </Button>
              </div>
            </div>
          )}

          <div className="border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-warm-white">
                <TableHead className="w-10">
                  <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="text-[#615d59]">用户名</TableHead>
                <TableHead className="text-[#615d59]">姓名</TableHead>
                <TableHead className="text-[#615d59]">手机号</TableHead>
                <TableHead className="text-[#615d59]">部门</TableHead>
                <TableHead className="text-[#615d59]">角色</TableHead>
                <TableHead className="text-[#615d59]">状态</TableHead>
                <TableHead className="w-12 text-right text-[#615d59]"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-[#a39e98]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary-red/20 border-t-primary-red rounded-full animate-spin" />
                      加载中...
                    </div>
                  </TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-[#a39e98]">暂无数据</TableCell></TableRow>
                ) : users.map((u, idx) => (
                  <TableRow key={u.id} className={`hover:bg-[rgba(0,0,0,0.02)] ${selectedIds.has(u.id) ? "bg-[rgba(196,30,58,0.02)]" : ""}`}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(u.id)} onCheckedChange={() => toggleItem(u.id, idx, false)} />
                    </TableCell>
                    <TableCell className="font-medium text-[rgba(0,0,0,0.95)]">{u.username}</TableCell>
                    <TableCell className="text-[rgba(0,0,0,0.95)]">{u.real_name}</TableCell>
                    <TableCell className="font-mono text-xs text-[rgba(0,0,0,0.95)]">{u.phone || "-"}</TableCell>
                    <TableCell className="text-[rgba(0,0,0,0.95)]">{u.dept_name || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {u.roles?.map((r: RoleInfo) => (
                          <Badge key={r.id} className="text-xs bg-[#f2f9ff] text-[#097fe8]">{r.name}</Badge>
                        )) || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={u.status === 1 ? "bg-[rgba(26,174,57,0.08)] text-[#1aae39]" : "bg-[rgba(196,30,58,0.08)] text-primary-red"}>
                        {u.status === 1 ? "启用" : "禁用"}
                      </Badge>
                    </TableCell>
                    <TableCell><TableActions actions={getRowActions(u)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-[#a39e98]">共 {total} 条记录</span>
            <div className="flex gap-1 items-center">
              <Button variant="outline" size="sm" className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>上一页</Button>
              <span className="px-3 py-1 text-sm text-[#615d59]">{page} / {totalPages || 1}</span>
              <Button variant="outline" size="sm" className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0}>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg border-[rgba(0,0,0,0.1)]">
          <DialogHeader><DialogTitle className="text-[rgba(0,0,0,0.95)]">编辑用户</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-[#615d59]">用户名</label><Input value={selectedUser.username} disabled className="border-[rgba(0,0,0,0.1)] rounded-xs" /></div>
                <div><label className="text-sm text-[#615d59]">姓名</label><Input value={selectedUser.real_name || ""} onChange={(e) => setSelectedUser({ ...selectedUser, real_name: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
                <div><label className="text-sm text-[#615d59]">手机号</label><Input value={selectedUser.phone || ""} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
                <div><label className="text-sm text-[#615d59]">部门ID</label><Input type="number" value={selectedUser.dept_id || ""} onChange={(e) => setSelectedUser({ ...selectedUser, dept_id: Number(e.target.value) })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button className="bg-primary-red hover:bg-primary-red-dark" onClick={handleUpdate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg border-[rgba(0,0,0,0.1)]">
          <DialogHeader><DialogTitle className="text-[rgba(0,0,0,0.95)]">新增用户</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-[#615d59]">用户名</label><Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
              <div><label className="text-sm text-[#615d59]">密码</label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
              <div><label className="text-sm text-[#615d59]">姓名</label><Input value={formData.real_name} onChange={(e) => setFormData({ ...formData, real_name: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
              <div><label className="text-sm text-[#615d59]">手机号</label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
              <div><label className="text-sm text-[#615d59]">部门ID</label><Input type="number" value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button className="bg-primary-red hover:bg-primary-red-dark" onClick={handleCreate}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
