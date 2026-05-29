import { useState, useEffect } from "react";
import { Eye, Edit, Ban, Star, Download, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import FilterBar, { type FilterField } from "@/components/FilterBar";
import TableActions, { type TableAction } from "@/components/TableActions";
import { useBatchSelect } from "@/hooks/useBatchSelect";
import { exportCSV } from "@/lib/export";
import { MASTER_LEVELS, MASTER_STATUS } from "@/data/mock";
import { api } from "@/lib/api";
import type { MasterItem, PaginatedData } from "@/types";

const filterFields: FilterField[] = [
  { key: "level", label: "师傅等级", type: "select", options: MASTER_LEVELS.map((l) => ({ label: l, value: l })) },
  { key: "status", label: "师傅状态", type: "select", options: [
    { label: "待审核", value: "0" }, { label: "正常", value: "1" }, { label: "冻结", value: "2" },
  ]},
];

export default function MasterListPage() {
  const [masters, setMasters] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [batchLoading, setBatchLoading] = useState(false);
  const pageSize = 10;

  const { selectedIds, isAllSelected, isIndeterminate, toggleItem, toggleAll, clearSelection } =
    useBatchSelect({ items: masters, idKey: "id" });

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<MasterItem | null>(null);

  const buildParams = () => {
    const params: Record<string, any> = { page, page_size: pageSize, keyword };
    if (filters.level) params.level = filters.level;
    if (filters.status) params.status = Number(filters.status);
    return params;
  };

  const fetchMasters = async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedData<MasterItem>>("/masters", buildParams());
      setMasters(data.list || []);
      setTotal(data.total || 0);
      clearSelection();
    } catch (err: any) {
      console.error("获取师傅列表失败:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMasters(); }, [page, keyword, filters]);

  const totalPages = Math.ceil(total / pageSize);

  const openDetail = (m: MasterItem) => { setSelectedMaster(m); setDetailOpen(true); };

  const handleFreeze = async (id: number) => {
    if (!confirm("确定冻结该师傅吗？")) return;
    try { await api.put(`/masters/${id}/freeze`, {}); fetchMasters(); }
    catch (err: any) { console.error("冻结师傅失败:", err); }
  };

  const handleUnfreeze = async (id: number) => {
    if (!confirm("确定解冻该师傅吗？")) return;
    try { await api.put(`/masters/${id}/unfreeze`, {}); fetchMasters(); }
    catch (err: any) { console.error("解冻师傅失败:", err); }
  };

  const handleBatchFreeze = async () => {
    setBatchLoading(true);
    try {
      await api.put("/masters/batch-freeze", { ids: Array.from(selectedIds) });
      fetchMasters();
    } catch (err: any) { console.error("批量冻结失败:", err); }
    finally { setBatchLoading(false); }
  };

  const handleBatchUnfreeze = async () => {
    setBatchLoading(true);
    try {
      await api.put("/masters/batch-unfreeze", { ids: Array.from(selectedIds) });
      fetchMasters();
    } catch (err: any) { console.error("批量解冻失败:", err); }
    finally { setBatchLoading(false); }
  };

  const handleExport = () => {
    exportCSV(masters, [
      { key: "name", title: "姓名" }, { key: "phone", title: "手机号" },
      { key: "level", title: "等级" }, { key: "skill_tags", title: "技能" },
      { key: "service_area", title: "服务区域" }, { key: "recycle_count", title: "回收次数" },
      { key: "points_balance", title: "积分" },
    ], `师傅列表_${Math.random().toString(36).slice(2, 8)}`);
  };

  const getRowActions = (m: MasterItem): TableAction[] => {
    const actions: TableAction[] = [
      { label: "查看详情", icon: <Eye className="w-4 h-4" />, onClick: () => openDetail(m) },
    ];
    if (m.status === 1) {
      actions.push({ label: "冻结", icon: <Ban className="w-4 h-4" />, onClick: () => handleFreeze(m.id), variant: "danger" });
    }
    if (m.status === 2) {
      actions.push({ label: "解冻", icon: <Star className="w-4 h-4" />, onClick: () => handleUnfreeze(m.id) });
    }
    return actions;
  };

  const hasFrozen = Array.from(selectedIds).some((id) => masters.find((m) => m.id === id)?.status === 2);
  const hasNormal = Array.from(selectedIds).some((id) => masters.find((m) => m.id === id)?.status === 1);

  return (
    <div className="space-y-4">
      <Card className="border-[rgba(0,0,0,0.1)] shadow-notion-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[rgba(0,0,0,0.95)]">师傅管理</CardTitle>
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="bg-[rgba(26,174,57,0.06)] text-[#1aae39] border-[rgba(26,174,57,0.2)]">正常: {masters.filter((m) => m.status === 1).length}</Badge>
              <Badge variant="outline" className="bg-[rgba(221,91,0,0.06)] text-[#dd5b00] border-[rgba(221,91,0,0.2)]">待审核: {masters.filter((m) => m.status === 0).length}</Badge>
              <Badge variant="outline" className="bg-[rgba(196,30,58,0.06)] text-primary-red border-[rgba(196,30,58,0.2)]">冻结: {masters.filter((m) => m.status === 2).length}</Badge>
              <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                <Download size={14} /> 导出
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
              searchPlaceholder="搜索姓名/手机号"
            />
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 mb-3 px-4 py-2 bg-[rgba(196,30,58,0.04)] rounded-xl border border-[rgba(196,30,58,0.15)]">
              <span className="text-sm text-primary-red font-medium">已选 {selectedIds.size} 项</span>
              <div className="flex gap-2 ml-auto">
                {hasNormal && (
                  <Button size="sm" className="bg-[#dd5b00] hover:bg-[#b84d00] h-8" disabled={batchLoading} onClick={handleBatchFreeze}>
                    <Ban size={14} className="mr-1" />批量冻结
                  </Button>
                )}
                {hasFrozen && (
                  <Button size="sm" className="bg-[#1aae39] hover:bg-[#158a2d] h-8" disabled={batchLoading} onClick={handleBatchUnfreeze}>
                    <Star size={14} className="mr-1" />批量解冻
                  </Button>
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
                    <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead className="text-[#615d59]">姓名</TableHead>
                  <TableHead className="text-[#615d59]">手机号</TableHead>
                  <TableHead className="text-[#615d59]">等级</TableHead>
                  <TableHead className="text-[#615d59]">技能</TableHead>
                  <TableHead className="text-[#615d59]">服务区域</TableHead>
                  <TableHead className="text-[#615d59]">回收次数</TableHead>
                  <TableHead className="text-[#615d59]">积分</TableHead>
                  <TableHead className="text-[#615d59]">状态</TableHead>
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
                ) : masters.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12 text-[#a39e98]">暂无数据</TableCell></TableRow>
                ) : masters.map((m, idx) => (
                  <TableRow key={m.id} className={`hover:bg-[rgba(0,0,0,0.02)] ${selectedIds.has(m.id) ? "bg-[rgba(196,30,58,0.02)]" : ""}`}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(m.id)} onCheckedChange={() => toggleItem(m.id, idx, false)} />
                    </TableCell>
                    <TableCell className="font-medium text-[rgba(0,0,0,0.95)] cursor-pointer hover:text-primary-red" onClick={() => openDetail(m)}>{m.name}</TableCell>
                    <TableCell className="font-mono text-xs text-[rgba(0,0,0,0.95)]">{m.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        m.level === "专家" ? "bg-[rgba(57,28,87,0.08)] text-[#391c57] border-[rgba(57,28,87,0.2)]" :
                        m.level === "高级" ? "bg-[rgba(0,117,222,0.08)] text-[#0075de] border-[rgba(0,117,222,0.2)]" :
                        m.level === "中级" ? "bg-[rgba(26,174,57,0.08)] text-[#1aae39] border-[rgba(26,174,57,0.2)]" :
                        "bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.95)]"
                      }>{m.level}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#615d59] max-w-[120px] truncate">{m.skill_tags || "-"}</TableCell>
                    <TableCell className="text-xs text-[rgba(0,0,0,0.95)]">{m.service_area || "-"}</TableCell>
                    <TableCell className="text-[rgba(0,0,0,0.95)]">{m.recycle_count || 0}</TableCell>
                    <TableCell className="text-[#0075de] font-medium">{m.points_balance || 0}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        m.status === 1 ? "bg-[rgba(26,174,57,0.06)] text-[#1aae39] border-[rgba(26,174,57,0.2)]" :
                        m.status === 0 ? "bg-[rgba(221,91,0,0.06)] text-[#dd5b00] border-[rgba(221,91,0,0.2)]" :
                        "bg-[rgba(196,30,58,0.06)] text-primary-red border-[rgba(196,30,58,0.2)]"
                      }>{MASTER_STATUS[m.status] || String(m.status)}</Badge>
                    </TableCell>
                    <TableCell><TableActions actions={getRowActions(m)} /></TableCell>
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg border-[rgba(0,0,0,0.1)] rounded-xl">
          <DialogHeader><DialogTitle className="text-[rgba(0,0,0,0.95)]">师傅详情</DialogTitle></DialogHeader>
          {selectedMaster && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">姓名</span><span className="font-medium text-[rgba(0,0,0,0.95)]">{selectedMaster.name}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">手机号</span><span className="font-mono text-xs text-[rgba(0,0,0,0.95)]">{selectedMaster.phone}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">等级</span><span className="font-medium text-[rgba(0,0,0,0.95)]">{selectedMaster.level}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">状态</span><span className="font-medium text-[rgba(0,0,0,0.95)]">{MASTER_STATUS[selectedMaster.status]}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">技能</span><span className="text-[rgba(0,0,0,0.95)]">{selectedMaster.skill_tags}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">区域</span><span className="text-[rgba(0,0,0,0.95)]">{selectedMaster.service_area}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">信用分</span><span className="font-medium text-[rgba(0,0,0,0.95)]">{selectedMaster.credit_score}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">回收次数</span><span className="font-medium text-[rgba(0,0,0,0.95)]">{selectedMaster.recycle_count}</span></div>
                <div className="flex justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)]"><span className="text-[#a39e98]">积分余额</span><span className="font-medium text-[#0075de]">{selectedMaster.points_balance}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
