import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FilterBar, { type FilterField } from "@/components/FilterBar";
import { exportCSV } from "@/lib/export";
import { TXN_TYPE_MAP } from "@/data/mock";
import { api } from "@/lib/api";
import type { FundTransaction, PaginatedData } from "@/types";

const filterFields: FilterField[] = [
  { key: "txn_type", label: "交易类型", type: "select", options: Object.entries(TXN_TYPE_MAP).map(([k, v]) => ({ label: v as string, value: k })) },
  { key: "status", label: "交易状态", type: "select", options: [
    { label: "成功", value: "1" }, { label: "处理中", value: "2" }, { label: "失败", value: "3" },
  ]},
  { key: "create_time", label: "交易时间", type: "date-range" },
];

export default function FundTransactionPage() {
  const [txns, setTxns] = useState<FundTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const buildParams = () => {
    const params: Record<string, any> = { page, page_size: pageSize, keyword };
    if (filters.txn_type) params.txn_type = filters.txn_type;
    if (filters.status) params.status = Number(filters.status);
    if (filters.create_time_start) params.start_date = filters.create_time_start;
    if (filters.create_time_end) params.end_date = filters.create_time_end;
    return params;
  };

  const fetchTxns = async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedData<FundTransaction>>("/fund/transactions", buildParams());
      setTxns(data.list || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error("获取交易流水失败:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTxns(); }, [page, keyword, filters]);

  const totalPages = Math.ceil(total / pageSize);

  const totalIncome = txns.filter((t) => Number(t.amount) >= 0).reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalExpense = txns.filter((t) => Number(t.amount) < 0).reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);

  const handleExport = () => {
    exportCSV(txns, [
      { key: "master_name", title: "师傅" },
      { key: "txn_type_label", title: "类型" },
      { key: "amount", title: "金额" },
      { key: "balance_after", title: "余额" },
      { key: "related_order_no", title: "关联订单" },
      { key: "create_time", title: "时间" },
    ], `交易流水_${Math.random().toString(36).slice(2, 8)}`);
  };

  return (
    <div className="space-y-4">
      <Card className="border-[rgba(0,0,0,0.1)] shadow-notion-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[rgba(0,0,0,0.95)]">交易流水</CardTitle>
            <div className="flex gap-3 items-center">
              <Badge variant="outline" className="bg-[rgba(26,174,57,0.06)] text-[#1aae39] border-[rgba(26,174,57,0.2)]">总收入: ¥{totalIncome.toLocaleString()}</Badge>
              <Badge variant="outline" className="bg-[rgba(196,30,58,0.06)] text-primary-red border-[rgba(196,30,58,0.2)]">总支出: ¥{totalExpense.toLocaleString()}</Badge>
              <Button size="sm" variant="outline" className="gap-1 border-[rgba(0,0,0,0.1)]" onClick={handleExport}>
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
              searchPlaceholder="搜索师傅/订单号"
            />
          </div>

          <div className="border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-warm-white">
                <TableHead className="text-[#615d59]">师傅</TableHead>
                <TableHead className="text-[#615d59]">类型</TableHead>
                <TableHead className="text-[#615d59]">金额</TableHead>
                <TableHead className="text-[#615d59]">余额</TableHead>
                <TableHead className="text-[#615d59]">关联订单</TableHead>
                <TableHead className="text-[#615d59]">状态</TableHead>
                <TableHead className="text-[#615d59]">时间</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-[#a39e98]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary-red/20 border-t-primary-red rounded-full animate-spin" />
                      加载中...
                    </div>
                  </TableCell></TableRow>
                ) : txns.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-[#a39e98]">暂无数据</TableCell></TableRow>
                ) : txns.map((t) => (
                  <TableRow key={t.id} className="hover:bg-[rgba(0,0,0,0.02)]">
                    <TableCell className="font-medium text-[rgba(0,0,0,0.95)]">{t.master_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.95)] border-[rgba(0,0,0,0.1)]">
                        {TXN_TYPE_MAP[t.txn_type] || t.txn_type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-mono text-sm ${Number(t.amount) >= 0 ? "text-[#1aae39]" : "text-primary-red"}`}>
                      {Number(t.amount) >= 0 ? "+" : ""}¥{t.amount}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-[rgba(0,0,0,0.95)]">¥{Number(t.balance_after).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs text-[rgba(0,0,0,0.95)]">{t.related_order_no || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        t.status === 1 ? "bg-[rgba(26,174,57,0.06)] text-[#1aae39] border-[rgba(26,174,57,0.2)]" :
                        t.status === 2 ? "bg-[rgba(221,91,0,0.06)] text-[#dd5b00] border-[rgba(221,91,0,0.2)]" :
                        "bg-[rgba(196,30,58,0.06)] text-primary-red border-[rgba(196,30,58,0.2)]"
                      }>{t.status === 1 ? "成功" : t.status === 2 ? "处理中" : "失败"}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#a39e98]">{t.create_time}</TableCell>
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
    </div>
  );
}
