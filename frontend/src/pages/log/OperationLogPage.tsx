import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

interface OperationLog {
  id: number;
  user_id: number | null;
  username: string;
  module: string | null;
  operation: string | null;
  target_id: number | null;
  target_name: string | null;
  before_data: string | null;
  after_data: string | null;
  ip_address: string | null;
  user_agent: string | null;
  operation_time: string;
  status: number;
  error_msg: string | null;
}

interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  list: T[];
}

const moduleMap: Record<string, string> = {
  recycle: "回收管理",
  user: "用户管理",
  role: "角色管理",
  fund: "资金管理",
  master: "师傅管理",
  workflow: "流程管理",
  system: "系统设置",
  form: "表单管理",
  ticket: "工单管理",
};

const operationMap: Record<string, string> = {
  add: "新增",
  edit: "编辑",
  delete: "删除",
  audit: "审核",
  view: "查看",
  award: "发放奖励",
  confirm: "确认",
  dispose: "处置",
};

export default function OperationLogPage() {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({
    username: "",
    module: "",
    operation: "",
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: pagination.page,
        page_size: pagination.pageSize,
      };
      if (filters.username) params.username = filters.username;
      if (filters.module) params.module = filters.module;
      if (filters.operation) params.operation = filters.operation;
      
      const data = await api.get<PaginatedResponse<OperationLog>>("/operation-logs", params);
      setLogs(data.list);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error("获取操作日志失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, pagination.pageSize, filters]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getModuleName = (module: string | null) => {
    if (!module) return "未知";
    return moduleMap[module] || module;
  };

  const getOperationName = (operation: string | null) => {
    if (!operation) return "未知";
    return operationMap[operation] || operation;
  };

  const getDetail = (log: OperationLog) => {
    if (log.target_name) return log.target_name;
    if (log.target_id) return `ID: ${log.target_id}`;
    return "-";
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">操作日志</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="搜索操作人"
                value={filters.username}
                onChange={(e) => handleFilterChange("username", e.target.value)}
                className="max-w-xs"
              />
            </div>
            <Select
              value={filters.module}
              onValueChange={(value) => handleFilterChange("module", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="操作模块" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                {Object.entries(moduleMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.operation}
              onValueChange={(value) => handleFilterChange("operation", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="操作类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                {Object.entries(operationMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>模块</TableHead>
                  <TableHead>操作类型</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>操作对象</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>操作时间</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-slate-500">加载中...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50">
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {getModuleName(log.module)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{getOperationName(log.operation)}</TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell className="text-sm text-slate-500 truncate max-w-[200px]" title={getDetail(log)}>
                        {getDetail(log)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.ip_address || "-"}</TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {new Date(log.operation_time).toLocaleString("zh-CN")}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={log.status === 1 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                        >
                          {log.status === 1 ? "成功" : "失败"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && logs.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-slate-500">
                共 {pagination.total} 条记录
              </span>
              <div className="flex items-center gap-2">
                <Select
                  value={String(pagination.pageSize)}
                  onValueChange={(value) => handlePageSizeChange(parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10条/页</SelectItem>
                    <SelectItem value="20">20条/页</SelectItem>
                    <SelectItem value="50">50条/页</SelectItem>
                    <SelectItem value="100">100条/页</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  上一页
                </Button>
                <span className="text-sm text-slate-500 min-w-[60px] text-center">
                  {pagination.page} / {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}