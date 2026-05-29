import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Eye, CheckCircle, XCircle, Package, Award, Plus, Download, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import FilterBar, { type FilterField } from "@/components/FilterBar";
import TableActions, { type TableAction } from "@/components/TableActions";
import { useBatchSelect } from "@/hooks/useBatchSelect";
import { exportCSV } from "@/lib/export";
import { STATUS_MAP } from "@/data/mock";
import { api } from "@/lib/api";
import { FileUpload } from "@/components/FileUpload";
import type { RecycleOrder, PaginatedData } from "@/types";

const filterFields: FilterField[] = [
  { key: "status", label: "订单状态", type: "select", options: [
    { label: "待审核", value: "0" }, { label: "审核通过", value: "1" },
    { label: "审核驳回", value: "2" }, { label: "已入库", value: "3" },
    { label: "已处置", value: "4" }, { label: "待重传", value: "5" },
    { label: "积分已发放", value: "7" },
  ]},
  { key: "device_type", label: "设备类型", type: "select", options: [
    { label: "空调", value: "空调" }, { label: "洗衣机", value: "洗衣机" },
    { label: "冰箱", value: "冰箱" }, { label: "电视", value: "电视" },
    { label: "热水器", value: "热水器" },
  ]},
  { key: "create_time", label: "提交时间", type: "date-range" },
];

export default function RecycleListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RecycleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [batchLoading, setBatchLoading] = useState(false);

  const { selectedIds, isAllSelected, isIndeterminate, toggleItem, toggleAll, clearSelection } =
    useBatchSelect({ items: orders, idKey: "id" });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    master_id: "", parts_name: "", parts_type: "", device_type: "",
    fault_desc: "", old_parts_img: "", new_parts_img: "", user_keep: 0,
  });
  const [auditOpen, setAuditOpen] = useState(false);
  const [awardOpen, setAwardOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RecycleOrder | null>(null);
  const [auditAction, setAuditAction] = useState("");
  const [auditComment, setAuditComment] = useState("");
  const [awardPoints, setAwardPoints] = useState("");

  const buildParams = useCallback(() => {
    const params: Record<string, any> = { page, page_size: pageSize, keyword };
    if (filters.status) params.status = Number(filters.status);
    if (filters.device_type) params.device_type = filters.device_type;
    if (filters.create_time_start) params.start_date = filters.create_time_start;
    if (filters.create_time_end) params.end_date = filters.create_time_end;
    return params;
  }, [page, keyword, filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedData<RecycleOrder>>("/recycle", buildParams());
      setOrders(data.list || []);
      setTotal(data.total || 0);
      clearSelection();
    } catch (err: any) {
      console.error("获取回收列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, keyword, filters]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSingleAudit = (order: RecycleOrder, action: string) => {
    setSelectedOrder(order);
    setAuditAction(action);
    setAuditComment("");
    setAuditOpen(true);
  };

  const confirmAudit = async () => {
    if (!selectedOrder) return;
    try {
      await api.put(`/recycle/${selectedOrder.id}/audit`, { action: auditAction, comment: auditComment });
      setAuditOpen(false);
      fetchOrders();
    } catch (err: any) {
      console.error("审核操作失败:", err);
    }
  };

  const handleBatchAudit = async (action: string) => {
    setBatchLoading(true);
    try {
      await api.put("/recycle/batch-audit", {
        ids: Array.from(selectedIds),
        action,
      });
      fetchOrders();
    } catch (err: any) {
      console.error("批量审核失败:", err);
    } finally {
      setBatchLoading(false);
    }
  };

  const handleAward = (order: RecycleOrder) => {
    setSelectedOrder(order);
    setAwardPoints(String(order.points));
    setAwardOpen(true);
  };

  const confirmAward = async () => {
    if (!selectedOrder) return;
    try {
      await api.put(`/recycle/${selectedOrder.id}/points/award`, { points: Number(awardPoints) });
      setAwardOpen(false);
      fetchOrders();
    } catch (err: any) {
      console.error("发放积分失败:", err);
    }
  };

  const handleConfirm = async (order: RecycleOrder) => {
    try {
      await api.put(`/recycle/${order.id}/confirm`, {});
      fetchOrders();
    } catch (err: any) {
      console.error("确认入库失败:", err);
    }
  };

  const handleCreate = async () => {
    if (!createForm.master_id || !createForm.parts_name) return;
    try {
      await api.post("/recycle", {
        ...createForm,
        master_id: Number(createForm.master_id),
        old_parts_img: createForm.old_parts_img || undefined,
        new_parts_img: createForm.new_parts_img || undefined,
      });
      setCreateOpen(false);
      setCreateForm({ master_id: "", parts_name: "", parts_type: "", device_type: "", fault_desc: "", old_parts_img: "", new_parts_img: "", user_keep: 0 });
      fetchOrders();
    } catch (err: any) {
      console.error("创建回收单失败:", err);
    }
  };

  const handleExport = () => {
    exportCSV(
      orders,
      [
        { key: "order_no", title: "订单号" },
        { key: "parts_name", title: "配件名称" },
        { key: "device_type", title: "设备类型" },
        { key: "master_name", title: "师傅" },
        { key: "points", title: "积分" },
        { key: "amount", title: "金额" },
        { key: "create_time", title: "提交时间" },
      ],
      `回收订单_${Math.random().toString(36).slice(2, 8)}`
    );
  };

  const getRowActions = (o: RecycleOrder): TableAction[] => {
    const actions: TableAction[] = [
      { label: "查看详情", icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/recycle/${o.id}`) },
    ];
    if (o.status === 0) {
      actions.push(
        { label: "审核通过", icon: <CheckCircle className="w-4 h-4" />, onClick: () => handleSingleAudit(o, "pass") },
        { label: "审核驳回", icon: <XCircle className="w-4 h-4" />, onClick: () => handleSingleAudit(o, "reject"), variant: "danger" },
      );
    }
    if (o.status === 1) {
      actions.push({ label: "确认入库", icon: <Package className="w-4 h-4" />, onClick: () => handleConfirm(o) });
    }
    if (o.status === 3) {
      actions.push({ label: "发放积分", icon: <Award className="w-4 h-4" />, onClick: () => handleAward(o) });
    }
    return actions;
  };

  const pendingIds = orders.filter((o) => o.status === 0).map((o) => o.id);
  const canBatchApprove = Array.from(selectedIds).some((id) => pendingIds.includes(id));

  return (
    <div className="space-y-4">
      <Card className="border-[rgba(0,0,0,0.1)] shadow-notion-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[rgba(0,0,0,0.95)]">旧件回收管理</CardTitle>
            <div className="flex gap-2 items-center">
              <Badge className="bg-[rgba(221,91,0,0.08)] text-[#dd5b00]">待审核: {orders.filter((o) => o.status === 0).length}</Badge>
              <Badge className="bg-[rgba(0,117,222,0.08)] text-[#0075de]">已入库: {orders.filter((o) => o.status === 3).length}</Badge>
              <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                <Download size={14} /> 导出
              </Button>
              <Button size="sm" className="bg-primary-red hover:bg-primary-red-dark" onClick={() => setCreateOpen(true)}>
                <Plus size={14} className="mr-1" />新建回收单
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
              searchPlaceholder="搜索订单号/配件/师傅"
            />
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 mb-3 px-4 py-2 bg-[rgba(196,30,58,0.04)] rounded-xl border border-[rgba(196,30,58,0.15)]">
              <span className="text-sm text-primary-red font-medium">已选 {selectedIds.size} 项</span>
              <div className="flex gap-2 ml-auto">
                {canBatchApprove && (
                  <>
                    <Button size="sm" className="bg-[#1aae39] hover:bg-[#158a2d] h-8" disabled={batchLoading} onClick={() => handleBatchAudit("pass")}>
                      <CheckCircle size={14} className="mr-1" />
                      {batchLoading ? "处理中..." : "批量通过"}
                    </Button>
                    <Button size="sm" className="bg-primary-red hover:bg-primary-red-dark h-8" disabled={batchLoading} onClick={() => handleBatchAudit("reject")}>
                      <XCircle size={14} className="mr-1" />
                      批量驳回
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" className="h-8" onClick={clearSelection}>
                  <RotateCcw size={14} className="mr-1" />取消选择
                </Button>
              </div>
            </div>
          )}

          <div className="border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-warm-white">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={isAllSelected}
                      ref={(el) => { if (el) (el as any).indeterminate = isIndeterminate; }}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="w-32 text-[#615d59]">订单号</TableHead>
                  <TableHead className="text-[#615d59]">配件名称</TableHead>
                  <TableHead className="text-[#615d59]">设备类型</TableHead>
                  <TableHead className="text-[#615d59]">师傅</TableHead>
                  <TableHead className="text-[#615d59]">状态</TableHead>
                  <TableHead className="text-[#615d59]">积分</TableHead>
                  <TableHead className="text-[#615d59]">金额</TableHead>
                  <TableHead className="text-[#615d59]">提交时间</TableHead>
                  <TableHead className="w-12 text-right text-[#615d59]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12 text-[#a39e98]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary-red/20 border-t-primary-red rounded-full animate-spin" />
                      加载中...
                    </div>
                  </TableCell></TableRow>
                ) : orders.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12 text-[#a39e98]">暂无数据</TableCell></TableRow>
                ) : orders.map((o, idx) => (
                  <TableRow key={o.id} className={`hover:bg-[rgba(0,0,0,0.02)] ${selectedIds.has(o.id) ? "bg-[rgba(196,30,58,0.02)]" : ""}`}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(o.id)} onCheckedChange={() => toggleItem(o.id, idx, false)} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[rgba(0,0,0,0.95)] cursor-pointer hover:text-primary-red" onClick={() => navigate(`/recycle/${o.id}`)}>{o.order_no}</TableCell>
                    <TableCell className="font-medium text-[rgba(0,0,0,0.95)]">{o.parts_name}</TableCell>
                    <TableCell className="text-xs text-[#615d59]">{o.device_type}</TableCell>
                    <TableCell className="text-[rgba(0,0,0,0.95)]">{o.master_name}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_MAP[o.status]?.className || "bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.95)]"}>
                        {o.status_label || STATUS_MAP[o.status]?.label || String(o.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[rgba(0,0,0,0.95)]">{o.points || "-"}</TableCell>
                    <TableCell className="text-[rgba(0,0,0,0.95)]">{o.amount ? `¥${o.amount}` : "-"}</TableCell>
                    <TableCell className="text-xs text-[#a39e98]">{o.create_time}</TableCell>
                    <TableCell>
                      <TableActions actions={getRowActions(o)} />
                    </TableCell>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg border-[rgba(0,0,0,0.1)]">
          <DialogHeader><DialogTitle className="text-[rgba(0,0,0,0.95)]">新建回收单</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#615d59]">师傅ID *</label>
                <Input type="number" value={createForm.master_id} onChange={(e) => setCreateForm({ ...createForm, master_id: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" />
              </div>
              <div>
                <label className="text-sm text-[#615d59]">配件名称 *</label>
                <Input value={createForm.parts_name} onChange={(e) => setCreateForm({ ...createForm, parts_name: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" />
              </div>
              <div>
                <label className="text-sm text-[#615d59]">配件类型</label>
                <Input value={createForm.parts_type} onChange={(e) => setCreateForm({ ...createForm, parts_type: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" />
              </div>
              <div>
                <label className="text-sm text-[#615d59]">设备类型</label>
                <Input value={createForm.device_type} onChange={(e) => setCreateForm({ ...createForm, device_type: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" />
              </div>
            </div>
            <div>
              <label className="text-sm text-[#615d59]">故障描述</label>
              <Textarea value={createForm.fault_desc} onChange={(e) => setCreateForm({ ...createForm, fault_desc: e.target.value })} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" />
            </div>
            <FileUpload label="旧件照片" value={createForm.old_parts_img ? [createForm.old_parts_img] : []} onChange={(urls) => setCreateForm({ ...createForm, old_parts_img: urls[0] || "" })} maxFiles={1} />
            <FileUpload label="新件照片" value={createForm.new_parts_img ? [createForm.new_parts_img] : []} onChange={(urls) => setCreateForm({ ...createForm, new_parts_img: urls[0] || "" })} maxFiles={1} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button className="bg-primary-red hover:bg-primary-red-dark" onClick={handleCreate}>提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent className="border-[rgba(0,0,0,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[rgba(0,0,0,0.95)]">{auditAction === "pass" ? "审核通过" : auditAction === "reject" ? "审核驳回" : "退回重传"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-[#615d59]">订单: {selectedOrder?.order_no}</p>
            <Textarea placeholder="备注/原因" value={auditComment} onChange={(e) => setAuditComment(e.target.value)} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditOpen(false)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button onClick={confirmAudit} className={auditAction === "pass" ? "bg-[#1aae39] hover:bg-[#1aae39]/90" : "bg-primary-red hover:bg-primary-red-dark"}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={awardOpen} onOpenChange={setAwardOpen}>
        <DialogContent className="border-[rgba(0,0,0,0.1)]">
          <DialogHeader><DialogTitle className="text-[rgba(0,0,0,0.95)]">发放积分</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-[#615d59]">订单: {selectedOrder?.order_no}</p>
            <Input type="number" placeholder="积分数" value={awardPoints} onChange={(e) => setAwardPoints(e.target.value)} className="border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAwardOpen(false)} className="border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.95)]">取消</Button>
            <Button onClick={confirmAward} className="bg-[#391c57] hover:bg-[#391c57]/90">确认发放</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
