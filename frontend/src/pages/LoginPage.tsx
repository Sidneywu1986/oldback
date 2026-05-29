import { useState } from "react";
import { useNavigate } from "react-router";
import { Recycle, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("请输入账号和密码");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const data = await api.post<{ token: string; user: any }>("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "登录失败，请检查账号密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-full max-w-md shadow-notion-card border-[rgba(0,0,0,0.1)] rounded-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 bg-primary-red rounded-xl flex items-center justify-center mb-3">
            <Recycle size={28} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">飞玖回收管理系统</CardTitle>
          <CardDescription className="text-[#615d59]">维修透明工具平台 · 旧件回收闭环管理</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {error && (
            <div className="bg-[rgba(196,30,58,0.08)] text-primary-red text-sm px-4 py-2 rounded-xs">{error}</div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[rgba(0,0,0,0.95)]">账号</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a39e98]" />
              <Input className="pl-10 border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" placeholder="请输入账号" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[rgba(0,0,0,0.95)]">密码</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a39e98]" />
              <Input className="pl-10 border-[rgba(0,0,0,0.1)] rounded-xs focus:border-primary-red focus:ring-primary-red/20" type="password" placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <Button className="w-full h-11 bg-primary-red hover:bg-primary-red-dark text-base rounded-xs font-medium" onClick={handleLogin} disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>
          <div className="text-center text-xs text-[#a39e98] pt-2">
            默认账号: admin / 密码: admin123
          </div>
        </CardContent>
      </Card>
    </div>
  );
}