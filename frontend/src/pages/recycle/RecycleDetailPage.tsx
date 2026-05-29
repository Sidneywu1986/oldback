import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, XCircle, Package, Award, RotateCcw, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STATUS_MAP } from "@/data/mock";
import { api } from "@/lib/api";
import type { RecycleOrder } from "@/types";

interface AuditLog {
  id: number;
  action: string;
  comment: string;
  create_time: string;
  auditor_name: string;
}

export default function RecycleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<RecycleOrder | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const orderData = await api.get<RecycleOrder>(`/recycle/${id}`);
        setOrder(orderData);
        try {
          const logs = await api.get<AuditLog[]>(`/recycle/${id}/audits`);
          setAuditLogs(logs);
        } catch {
          setAuditLogs([]);
        }
      } catch (err: any) {
        console.error("获取回收详情失败:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleAudit = async (action: string) => {
    if (!order) return;
    try {
      await api.put(`/recycle/${order.id}/audit`, { action, comment: "" });
      const orderData = await api.get<RecycleOrder>(`/recycle/${id}`);
      setOrder(orderData);
    } catch (err: any) {
      console.error("审核操作失败:", err);
    }
  };

  const handleConfirm = async () => {
    if (!order) return;
    try {
      await api.put(`/recycle/${order.id}/confirm`, {});
      const orderData = await api.get<RecycleOrder>(`/recycle/${id}`);
      setOrder(orderData);
    } catch (err: any) {
      console.error("确认入库失败:", err);
    }
  };

  const handleDispose = async () => {
    if (!order) return;
    try {
      await api.put(`/recycle/${order.id}/dispose`, {});
      const orderData = await api.get<RecycleOrder>(`/recycle/${id}`);
      setOrder(orderData);
    } catch (err: any) {
      console.error("处置操作失败:", err);
    }
  };

  const handleAwardPoints = async () => {
    if (!order) return;
    try {
      await api.put(`/recycle/${order.id}/points/award`, { points: order.points });
      const orderData = await api.get<RecycleOrder>(`/recycle/${id}`);
      setOrder(orderData);
    } catch (err: any) {
      console.error("发放积分失败:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-400">加载中...</div>;
  }

  if (!order) {
    return <div className="text-center py-8 text-slate-400">订单不存在</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate("/recycle")}>
          <ArrowLeft size={16} className="mr-1" /> 返回
        </Button>
        <h2 className="text-lg font-medium">回收详情 #{order.order_no}</h2>
        <Badge variant="outline" className={STATUS_MAP[order.status]?.className || ""}>
          {order.status_label || STATUS_MAP[order.status]?.label || String(order.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Photos */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">旧件照片</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {order.old_parts_img ? (
                <img src={order.old_parts_img} alt="旧件" className="aspect-square object-cover rounded-lg" />
              ) : (
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                  <ImageIcon size={48} className="text-slate-300" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Middle: Info */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">订单信息</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="配件名称" value={order.parts_name} />
            <InfoRow label="配件类型" value={order.parts_type} />
            <InfoRow label="设备类型" value={order.device_type} />
            <InfoRow label="故障描述" value={order.fault_desc} />
            <InfoRow label="师傅" value={order.master_name} />
            <InfoRow label="回收方式" value={order.user_keep === 1 ? "用户自留" : "平台回收"} />
            <InfoRow label="积分" value={String(order.points)} />
            <InfoRow label="金额" value={`¥${order.amount}`} />
            <Separator />
            <InfoRow label="提交时间" value={order.create_time} />
            <InfoRow label="更新时间" value={order.update_time} />
          </CardContent>
        </Card>

        {/* Right: Actions */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">操作面板</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {order.status === 0 && (
              <>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleAudit("pass")}><CheckCircle size={16} className="mr-2" /> 审核通过</Button>
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleAudit("reject")}><XCircle size={16} className="mr-2" /> 审核驳回</Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => handleAudit("return")}><RotateCcw size={16} className="mr-2" /> 退回重传</Button>
              </>
            )}
            {order.status === 1 && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleConfirm}><Package size={16} className="mr-2" /> 确认入库</Button>
            )}
            {order.status === 3 && (
              <>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleAwardPoints}><Award size={16} className="mr-2" /> 发放积分</Button>
                <Button className="w-full bg-gray-600 hover:bg-gray-700" onClick={handleDispose}><Package size={16} className="mr-2" /> 确认处置</Button>
              </>
            )}
            {order.status === 4 && (
              <div className="text-sm text-slate-500 text-center py-4">该订单已完成所有流程</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">操作记录</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">暂无操作记录</p>
            ) : auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                  {log.auditor_name?.[0] || "S"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{log.auditor_name || "系统"}</span>
                    <Badge variant="outline" className="text-xs">{log.action}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{log.comment}</p>
                  <span className="text-xs text-slate-400">{log.create_time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm text-slate-800">{value || "-"}</span>
    </div>
  );
}
