import { useState, useEffect } from "react";
import { Search, Wallet, TrendingUp, TrendingDown, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import type { FundAccount, PaginatedData } from "@/types";

export default function FundAccountPage() {
  const [accounts, setAccounts] = useState<FundAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [awardOpen, setAwardOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<FundAccount | null>(null);
  const [awardAmount, setAwardAmount] = useState("");
  const [awardRemark, setAwardRemark] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedData<FundAccount>>("/fund/accounts", { page, page_size: pageSize, keyword: search });
      setAccounts(data.list || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error("获取资金账户失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [page, search]);

  const totalPages = Math.ceil(total / pageSize);

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const totalFrozen = accounts.reduce((sum, a) => sum + Number(a.frozen_amount), 0);

  const openAward = (a: FundAccount) => { setSelectedAccount(a); setAwardAmount(""); setAwardRemark(""); setAwardOpen(true); };

  const confirmAward = async () => {
    if (!selectedAccount || !awardAmount) return;
    try {
      await api.post("/fund/award", { master_id: selectedAccount.master_id, amount: Number(awardAmount), remark: awardRemark });
      setAwardOpen(false);
      fetchAccounts();
    } catch (err: any) {
      console.error("手动发放失败:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">账户总余额</p>
              <p className="text-2xl font-bold text-slate-800">¥{totalBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center"><Wallet className="text-blue-600" size={24} /></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">冻结金额</p>
              <p className="text-2xl font-bold text-orange-600">¥{totalFrozen.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center"><TrendingUp className="text-orange-600" size={24} /></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">账户数量</p>
              <p className="text-2xl font-bold text-green-600">{accounts.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center"><TrendingDown className="text-green-600" size={24} /></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">资金账户</CardTitle>
            <div className="relative max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="搜索师傅" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-slate-50">
                <TableHead>师傅</TableHead><TableHead>余额</TableHead><TableHead>冻结</TableHead>
                <TableHead>总收入</TableHead><TableHead>总支出</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">加载中...</TableCell></TableRow>
                ) : accounts.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">暂无数据</TableCell></TableRow>
                ) : accounts.map((a) => (
                  <TableRow key={a.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{a.master_name}</TableCell>
                    <TableCell className="font-mono text-blue-600">¥{Number(a.balance).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-orange-600">¥{Number(a.frozen_amount).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-green-600">¥{Number(a.total_income).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-red-600">¥{Number(a.total_outcome).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700">正常</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="text-purple-600" onClick={() => openAward(a)}><Award size={14} /></Button>
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

      <Dialog open={awardOpen} onOpenChange={setAwardOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>手动发放奖励</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-500">师傅: {selectedAccount?.master_name}</p>
            <p className="text-sm text-slate-500">当前余额: ¥{selectedAccount?.balance?.toLocaleString()}</p>
            <Input type="number" placeholder="金额（元）" value={awardAmount} onChange={(e) => setAwardAmount(e.target.value)} />
            <Input placeholder="备注" value={awardRemark} onChange={(e) => setAwardRemark(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAwardOpen(false)}>取消</Button>
            <Button onClick={confirmAward} className="bg-purple-600">确认发放</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
