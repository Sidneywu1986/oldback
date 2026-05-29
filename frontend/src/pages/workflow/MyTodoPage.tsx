import { useState, useEffect } from "react";
import { Inbox, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { WorkflowTodoItem } from "@/types";

export default function MyTodoPage() {
  const [todos, setTodos] = useState<WorkflowTodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selected, setSelected] = useState<WorkflowTodoItem | null>(null);
  const [action, setAction] = useState("");
  const [comment, setComment] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await api.get<WorkflowTodoItem[]>("/workflow/tasks/my");
      setTodos(data || []);
    } catch (err: any) {
      console.error("获取待办失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const openAudit = (t: WorkflowTodoItem, act: string) => {
    setSelected(t);
    setAction(act);
    setComment("");
    setAuditOpen(true);
  };

  const confirm = async () => {
    if (!selected) return;
    try {
      await api.post(`/workflow/tasks/${selected.id}/complete`, { action, comment });
      setAuditOpen(false);
      fetchTodos();
    } catch (err: any) {
      console.error("审批失败:", err);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">我的待办</CardTitle>
            <Badge variant="outline" className="bg-blue-50">{loading ? "加载中..." : `${todos.length} 条待处理`}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-slate-400">加载中...</p>
          ) : todos.length === 0 ? (
            <p className="text-center py-8 text-slate-400">暂无待办事项</p>
          ) : (
            <div className="space-y-3">
              {todos.map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Inbox size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{t.task_type}</span>
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">待处理</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{t.title} - {t.business_no}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>申请人: {t.creator_name || "-"}</span>
                      <span>{t.create_time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openAudit(t, "approve")}>
                      <CheckCircle size={14} className="mr-1" />通过
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => openAudit(t, "reject")}>
                      <XCircle size={14} className="mr-1" />驳回
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{action === "approve" ? "审批通过" : "审批驳回"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-500">{selected?.title}</p>
            <Textarea placeholder="审批意见（可选）" value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditOpen(false)}>取消</Button>
            <Button onClick={confirm} className={action === "approve" ? "bg-green-600" : "bg-red-600"}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
