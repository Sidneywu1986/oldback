import { useState, useEffect } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    recycle_auto_audit: false,
    points_per_recycle: "100",
    min_withdraw: "100",
    max_upload_size: "5",
    audit_timeout: "24",
    notify_email: true,
    notify_sms: false,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get<any>("/miniapp-configs");
        if (data && Array.isArray(data)) {
          const configMap: Record<string, string> = {};
          data.forEach((item: any) => { configMap[item.config_key] = item.config_value; });
          setSettings({
            recycle_auto_audit: configMap.recycle_auto_audit === "1",
            points_per_recycle: configMap.points_per_recycle || "100",
            min_withdraw: configMap.min_withdraw || "100",
            max_upload_size: configMap.max_upload_size || "5",
            audit_timeout: configMap.audit_timeout || "24",
            notify_email: configMap.notify_email === "1",
            notify_sms: configMap.notify_sms === "1",
          });
        }
      } catch (err: any) {
        console.error("获取系统设置失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const update = (k: string, v: any) => setSettings({ ...settings, [k]: v });

  const handleSave = async () => {
    try {
      await api.post("/miniapp-configs/batch", {
        recycle_auto_audit: settings.recycle_auto_audit ? "1" : "0",
        points_per_recycle: settings.points_per_recycle,
        min_withdraw: settings.min_withdraw,
        max_upload_size: settings.max_upload_size,
        audit_timeout: settings.audit_timeout,
        notify_email: settings.notify_email ? "1" : "0",
        notify_sms: settings.notify_sms ? "1" : "0",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("保存设置失败:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-400">加载中...</div>;
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">系统设置</h2>
        <div className="flex gap-2">
          {saved && <span className="text-sm text-green-600 flex items-center">保存成功!</span>}
          <Button variant="outline" onClick={() => window.location.reload()}><RotateCcw size={14} className="mr-1" />重置</Button>
          <Button className="bg-blue-600" onClick={handleSave}><Save size={14} className="mr-1" />保存</Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">回收规则</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">自动审核</label>
            <div className="flex items-center gap-2">
              <Switch checked={settings.recycle_auto_audit} onCheckedChange={(v) => update("recycle_auto_audit", v)} />
              <span className="text-sm text-slate-500">{settings.recycle_auto_audit ? "已启用" : "已禁用"}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">单次回收积分</label>
            <Input className="w-40" value={settings.points_per_recycle} onChange={(e) => update("points_per_recycle", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">资金规则</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">最低提现金额（元）</label>
            <Input className="w-40" value={settings.min_withdraw} onChange={(e) => update("min_withdraw", e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">审核超时（小时）</label>
            <Input className="w-40" value={settings.audit_timeout} onChange={(e) => update("audit_timeout", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">上传设置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">最大上传大小（MB）</label>
            <Input className="w-40" value={settings.max_upload_size} onChange={(e) => update("max_upload_size", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">通知设置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">邮件通知</label>
            <div className="flex items-center gap-2">
              <Switch checked={settings.notify_email} onCheckedChange={(v) => update("notify_email", v)} />
              <span className="text-sm text-slate-500">{settings.notify_email ? "已启用" : "已禁用"}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-600">短信通知</label>
            <div className="flex items-center gap-2">
              <Switch checked={settings.notify_sms} onCheckedChange={(v) => update("notify_sms", v)} />
              <span className="text-sm text-slate-500">{settings.notify_sms ? "已启用" : "已禁用"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
