import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TICKET_STATUS } from "@/data/mock";
import { api } from "@/lib/api";
import type { TicketItem, PaginatedData } from "@/types";

export default function TicketListPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedData<TicketItem>>("/tickets", { page, page_size: pageSize, keyword: search });
      setTickets(data.list || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error("获取工单列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, search]);

  const totalPages = Math.ceil(total / pageSize);

  const handleTransfer = async (ticketId: number) => {
    const assigneeId = prompt("请输入转办人ID：");
    if (!assigneeId) return;
    try {
      await api.put(`/tickets/${ticketId}/transfer`, { assignee_id: Number(assigneeId) });
      fetchTickets();
    } catch (err: any) {
      console.error("转办失败:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该工单吗？")) return;
    try {
      await api.del(`/tickets/${id}`);
      fetchTickets();
    } catch (err: any) {
      console.error("删除工单失败:", err);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">自定义工单</CardTitle>
            <div className="flex gap-3">
              <div className="relative max-w-xs">
                <Input className="pl-3" placeholder="搜索工单" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <Button size="sm" className="bg-blue-600"><Plus size={16} className="mr-1" />新建工单</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-slate-50">
                <TableHead>工单号</TableHead><TableHead>标题</TableHead>
                <TableHead>状态</TableHead><TableHead>创建人</TableHead><TableHead>时间</TableHead><TableHead className="text-right">操作</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">加载中...</TableCell></TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">暂无数据</TableCell></TableRow>
                ) : tickets.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs">{t.ticket_no}</TableCell>
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell><Badge variant="outline" className={t.status === 0 ? "bg-yellow-50 text-yellow-700" : t.status === 1 ? "bg-blue-50 text-blue-700" : t.status === 2 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}>{TICKET_STATUS[t.status]}</Badge></TableCell>
                    <TableCell>{t.creator_name}</TableCell>
                    <TableCell className="text-xs text-slate-400">{t.create_time}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm"><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleTransfer(t.id)}><ArrowRightLeft size={14} /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(t.id)}><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-slate-400">共 {total} 条</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>上一页</Button>
              <span className="px-3 py-1 text-sm">{page} / {totalPages || 1}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0}>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
