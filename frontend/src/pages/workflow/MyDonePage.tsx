import { useState, useEffect } from "react";
import { CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import type { WorkflowDoneItem } from "@/types";

export default function MyDonePage() {
  const [done, setDone] = useState<WorkflowDoneItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDone = async () => {
      setLoading(true);
      try {
        const data = await api.get<WorkflowDoneItem[]>("/workflow/tasks/my-done");
        setDone(data || []);
      } catch (err: any) {
        console.error("获取已办失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDone();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">我的已办</CardTitle>
            <Badge variant="outline" className="bg-green-50">共 {loading ? "..." : done.length} 条</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-slate-50">
                <TableHead>节点</TableHead><TableHead>操作</TableHead><TableHead>意见</TableHead>
                <TableHead>业务编号</TableHead><TableHead>处理时间</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">加载中...</TableCell></TableRow>
                ) : done.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">暂无数据</TableCell></TableRow>
                ) : done.map((d) => (
                  <TableRow key={d.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{d.task_type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={d.result === "pass" || d.result === "approve" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                        {d.result === "pass" || d.result === "approve" ? "通过" : d.result === "reject" ? "驳回" : d.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{d.comment || "-"}</TableCell>
                    <TableCell className="font-mono text-xs">{d.business_no}</TableCell>
                    <TableCell className="text-xs text-slate-400">{d.process_time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
