import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { FundTransaction, PaginatedData } from "@/types";

interface WithdrawItem {
  id: number;
  master_id: number;
  master_name: string;
  amount: number;
  remark?: string;
  status: number;
  related_order_no?: string;
  auditor_comment?: string;
  create_time: string;
}

export default function WithdrawAuditPage() {
  const [withdraws, setWithdraws] = useState<WithdrawItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selected, setSelected] = useState<WithdrawItem | null>(null);
  const [auditAction, setAuditAction] = useState("");
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchWithdraws = async () => {
    setLoading(true);
    try {
      // Fetch withdraw-type transactions with pending status (status=2 is "processing/auditing")
      const data = await api.get<PaginatedData<FundTransaction>>("/fund/transactions", { page, page_size: 100, txn_type: "withdraw" });
      const items = (data.list || []).map((t) => ({
        id: t.id,
        master_id: t.master_id,
        master_name: t.master_name || "",
        amount: Math.abs(Number(t.amount)),
        remark: t.remark,
        status: t.status,
        related_order_no: t.related_order_no,
        auditor_comment: "",
        create_time: t.create_time,
      }));
      setWithdraws(items);
    } catch (err: any) {
      console.error("获取提现列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, [page]);

  const pendingList = withdraws.filter((w) => w.status === 2);
  const paginated = pendingList.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(pendingList.length / pageSize);

  const openAudit = (w: WithdrawItem, action: string) => { setSelected(w); setAuditAction(action); setComment(""); setAuditOpen(true); };

  const confirmAudit = async () => {
    if (!selected) return;
    try {
      await api.put(`/fund/withdraw/${selected.id}/audit`, { action: auditAction, remark: comment });
      setAuditOpen(false);
      fetchWithdraws();
    } catch (err: any) {
      console.error("提现审核失败:", err);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">提现审核</CardTitle>
            <Badge variant="outline" className="bg-yellow-50">待审核: {pendingList.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-slate-50">
                <TableHead>师傅</TableHead><TableHead>金额</TableHead><TableHead>申请时间</TableHead>
                <TableHead>备注</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">加载中...</TableCell></TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">暂无待审核记录</TableCell></TableRow>
                ) : paginated.map((w) => (
                  <TableRow key={w.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{w.master_name}</TableCell>
                    <TableCell className="font-mono text-red-600">-¥{w.amount}</TableCell>
                    <TableCell className="text-xs">{w.create_time}</TableCell>
                    <TableCell className="text-sm text-slate-500">{w.remark || "-"}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock size={12} className="mr-1" />待审核</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="text-green-600" onClick={() => openAudit(w, "pass")}><CheckCircle size={14} /></Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => openAudit(w, "reject")}><XCircle size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-slate-400">共 {pendingList.length} 条</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>上一页</Button>
              <span className="px-3 py-1 text-sm">{page} / {totalPages || 1}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0}>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{auditAction === "pass" ? "通过提现" : "驳回提现"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-500">师傅: {selected?.master_name} | 金额: {selected?.amount}</p>
            <Textarea placeholder="审核备注" value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditOpen(false)}>取消</Button>
            <Button onClick={confirmAudit} className={auditAction === "pass" ? "bg-green-600" : "bg-red-600"}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
