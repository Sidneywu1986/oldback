import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";

interface ConfigItem {
  id: number;
  config_key: string;
  config_value: string;
  config_group: string;
  description?: string;
}

export default function MiniappConfigPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const data = await api.get<ConfigItem[]>("/miniapp-configs");
      setConfigs(data || []);
    } catch (err: any) {
      console.error("获取小程序配置失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfigs(); }, []);

  const updateValue = (id: number, value: string) => {
    setConfigs(configs.map((c) => c.id === id ? { ...c, config_value: value } : c));
  };

  const handleSave = async () => {
    try {
      await api.post("/miniapp-configs/batch", configs.reduce((acc, c) => ({ ...acc, [c.id]: c.config_value }), {}));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("保存配置失败:", err);
    }
  };

  const groups = [...new Set(configs.map((c) => c.config_group))];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">小程序管理</h2>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-green-600">保存成功!</span>}
          <Button className="bg-blue-600" onClick={handleSave} disabled={loading}>
            <Save size={14} className="mr-1" />保存配置
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center text-slate-400">加载中...</CardContent></Card>
      ) : groups.map((group) => (
        <Card key={group} className="border-0 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{group}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {configs.filter((c) => c.config_group === group).map((cfg) => (
                <div key={cfg.id} className="flex items-center justify-between">
                  <label className="text-sm text-slate-600 w-32">{cfg.description || cfg.config_key}</label>
                  <div className="flex-1 max-w-md">
                    {cfg.config_value === "0" || cfg.config_value === "1" ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={cfg.config_value === "1"}
                          onCheckedChange={(v) => updateValue(cfg.id, v ? "1" : "0")}
                        />
                        <span className="text-sm text-slate-500">{cfg.config_value === "1" ? "已启用" : "已禁用"}</span>
                      </div>
                    ) : cfg.config_value.startsWith("#") ? (
                      <div className="flex items-center gap-3">
                        <input type="color" value={cfg.config_value} onChange={(e) => updateValue(cfg.id, e.target.value)} className="w-10 h-10 rounded border" />
                        <Input value={cfg.config_value} onChange={(e) => updateValue(cfg.id, e.target.value)} className="w-32" />
                      </div>
                    ) : (
                      <Input value={cfg.config_value} onChange={(e) => updateValue(cfg.id, e.target.value)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
