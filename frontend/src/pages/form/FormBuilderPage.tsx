import { useState, useEffect } from "react";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { FormDefinition, PaginatedData } from "@/types";

const fieldTypes = [
  { type: "text", label: "文本输入", icon: "T" },
  { type: "number", label: "数字输入", icon: "#" },
  { type: "select", label: "下拉选择", icon: "v" },
  { type: "radio", label: "单选", icon: "O" },
  { type: "checkbox", label: "多选", icon: "[]" },
  { type: "textarea", label: "多行文本", icon: "=" },
  { type: "date", label: "日期", icon: "D" },
  { type: "upload", label: "文件上传", icon: "^" },
];

export default function FormBuilderPage() {
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formKey, setFormKey] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [fields, setFields] = useState<any[]>([]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedData<FormDefinition>>("/form-defs", { page: 1, page_size: 100 });
      setForms(data.list || []);
    } catch (err: any) {
      console.error("获取表单列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const addField = (type: string) => {
    setFields([...fields, { id: Math.random().toString(36).slice(2), type, label: `字段${fields.length + 1}`, required: false, options: "" }]);
  };

  const handleSaveForm = async () => {
    try {
      await api.post("/form-defs", {
        form_name: formName,
        form_key: formKey,
        description: formDesc,
        fields_json: JSON.stringify(fields),
        status: 1,
      });
      setBuilderOpen(false);
      setFormName("");
      setFormKey("");
      setFormDesc("");
      setFields([]);
      fetchForms();
    } catch (err: any) {
      console.error("保存表单失败:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该表单吗？")) return;
    try {
      await api.del(`/form-defs/${id}`);
      fetchForms();
    } catch (err: any) {
      console.error("删除表单失败:", err);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">自定义表单</CardTitle>
            <Button size="sm" className="bg-blue-600" onClick={() => { setFormName(""); setFormKey(""); setFormDesc(""); setFields([]); setBuilderOpen(true); }}><Plus size={16} className="mr-1" />新建表单</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-slate-400">加载中...</p>
          ) : forms.length === 0 ? (
            <p className="text-center py-8 text-slate-400">暂无表单</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forms.map((f) => (
                <div key={f.id} onClick={() => { setFormName(f.form_name); setFormKey(f.form_key); setFormDesc(f.description || ""); setFields(f.fields_json ? JSON.parse(f.fields_json) : []); setBuilderOpen(true); }}>
                  <Card className="border hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{f.form_name}</h3>
                        <Badge variant="outline" className={f.status === 1 ? "bg-green-50 text-green-700" : "bg-gray-50"}>{f.status === 1 ? "启用" : "停用"}</Badge>
                      </div>
                      <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{f.form_key}</code>
                      <p className="text-xs text-slate-400 mt-2">创建时间: {f.create_time}</p>
                      <div className="mt-2 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}>删除</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>表单设计器</DialogTitle></DialogHeader>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-3">组件库</h4>
              <div className="space-y-1">
                {fieldTypes.map((ft) => (
                  <button key={ft.type} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" onClick={() => addField(ft.type)}>
                    <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-bold">{ft.icon}</span>
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2 border rounded-lg p-4 min-h-[400px]">
              <div className="space-y-3 mb-4">
                <Input placeholder="表单名称" value={formName} onChange={(e) => setFormName(e.target.value)} />
                <Input placeholder="表单标识（key）" value={formKey} onChange={(e) => setFormKey(e.target.value)} />
                <Input placeholder="表单描述" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              </div>
              {fields.length === 0 && <div className="flex items-center justify-center h-64 text-slate-400 text-sm">从左侧拖拽或点击组件添加到此处</div>}
              <div className="space-y-3">
                {fields.map((f, idx) => (
                  <div key={f.id} className="flex items-center gap-2 p-3 border rounded-lg bg-slate-50">
                    <GripVertical size={14} className="text-slate-300" />
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{f.type}</span>
                    <Input className="flex-1 h-8 text-sm" value={f.label} onChange={(e) => { const nf = [...fields]; nf[idx].label = e.target.value; setFields(nf); }} />
                    <Button variant="ghost" size="sm" className="text-red-500 h-8 w-8 p-0" onClick={() => setFields(fields.filter((_, i) => i !== idx))}><Trash2 size={14} /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1 border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-3">属性</h4>
              <p className="text-xs text-slate-400">选中字段以编辑属性</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setBuilderOpen(false)}>取消</Button>
            <Button className="bg-blue-600" onClick={handleSaveForm}>保存表单</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
