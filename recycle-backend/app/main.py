from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import os
import traceback

from app.core.database import engine, Base
from app.core.config import settings
import pkgutil
import importlib
from pathlib import Path

# Ensure all models are registered before creating tables
import app.models
# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="废旧回收管理系统 API",
    description="维修透明工具平台 - 旧件回收闭环管理",
    version="2.0.0",
)


# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.status_code, "message": exc.detail, "data": None},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    field = " → ".join(str(loc) for loc in first_error.get("loc", []))
    msg = f"数据验证失败: {first_error.get('msg', '未知错误')} ({field})" if field else first_error.get("msg", "数据验证失败")
    return JSONResponse(
        status_code=422,
        content={"code": 422, "message": msg, "data": None},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"code": 500, "message": "服务器繁忙，请稍后重试", "data": None},
    )


# CORS
origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Auto-discover routers from modules/
modules_dir = Path(__file__).parent.parent / "modules"
if modules_dir.exists():
    for _, module_name, _ in pkgutil.iter_modules([str(modules_dir)]):
        try:
            module = importlib.import_module(f"modules.{module_name}.router")
            if hasattr(module, "router"):
                app.include_router(module.router)
                print(f"[AutoRouter] ✓ 加载模块: {module_name}")
        except Exception as e:
            print(f"[AutoRouter] ✗ 加载模块 {module_name} 失败: {e}")

@app.get("/api/v1/health")
def health_check():
    return {"code": 200, "message": "ok", "version": "2.0.0"}

@app.get("/")
def root():
    return {"message": "废旧回收管理系统 API", "docs": "/docs"}

# Seed data
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
from app.core.database import SessionLocal

def seed_data():
    import random
    from datetime import datetime, timedelta
    from app.models.user import User
    from app.models.department import Department
    from app.models.role import Role
    from app.models.permission import Permission
    from app.models.menu import Menu
    from app.models.master import Master
    from app.models.fund_account import FundAccount
    from app.models.fund_transaction import FundTransaction
    from app.models.recycle_order import RecycleOrder
    from app.models.parts_category import PartsCategory
    from app.models.workflow_def import WorkflowDef
    from app.models.form_definition import FormDefinition
    from app.models.ticket_template import TicketTemplate
    from app.models.ticket import Ticket
    from app.models.miniapp_config import MiniappConfig
    db = SessionLocal()
    try:
        if db.query(User).first():
            return

        print("Inserting seed data...")

        # 1. Departments
        depts = [
            Department(dept_name="总经办", sort_order=1),
            Department(dept_name="运营中心", parent_id=None, sort_order=2),
            Department(dept_name="审核部", parent_id=2, sort_order=1),
            Department(dept_name="回收管理部", parent_id=2, sort_order=2),
            Department(dept_name="财务部", sort_order=3),
            Department(dept_name="技术部", sort_order=4),
        ]
        for d in depts:
            db.add(d)
        db.commit()
        for d in depts:
            db.refresh(d)
        
        # 2. Permissions
        perms = [
            Permission(perm_name="系统管理", perm_code="system", perm_type="menu", sort_order=1),
            Permission(perm_name="用户管理", perm_code="user:list", perm_type="menu", parent_id=1, sort_order=1),
            Permission(perm_name="用户新增", perm_code="user:add", perm_type="button", parent_id=1),
            Permission(perm_name="用户编辑", perm_code="user:edit", perm_type="button", parent_id=1),
            Permission(perm_name="用户删除", perm_code="user:del", perm_type="button", parent_id=1),
            Permission(perm_name="角色管理", perm_code="role:list", perm_type="menu", parent_id=1, sort_order=2),
            Permission(perm_name="角色权限", perm_code="role:perm", perm_type="button", parent_id=1),
            Permission(perm_name="菜单管理", perm_code="menu:list", perm_type="menu", parent_id=1, sort_order=3),
            Permission(perm_name="部门管理", perm_code="dept:list", perm_type="menu", parent_id=1, sort_order=4),
            Permission(perm_name="业务管理", perm_code="business", perm_type="menu", sort_order=2),
            Permission(perm_name="回收管理", perm_code="recycle:list", perm_type="menu", parent_id=10, sort_order=1),
            Permission(perm_name="回收审核", perm_code="recycle:audit", perm_type="button", parent_id=10),
            Permission(perm_name="回收入库", perm_code="recycle:confirm", perm_type="button", parent_id=10),
            Permission(perm_name="回收处置", perm_code="recycle:dispose", perm_type="button", parent_id=10),
            Permission(perm_name="积分发放", perm_code="recycle:award", perm_type="button", parent_id=10),
            Permission(perm_name="师傅管理", perm_code="master:list", perm_type="menu", parent_id=10, sort_order=2),
            Permission(perm_name="资金管理", perm_code="fund:list", perm_type="menu", parent_id=10, sort_order=3),
            Permission(perm_name="提现审核", perm_code="fund:withdraw:audit", perm_type="button", parent_id=10),
            Permission(perm_name="流程中心", perm_code="workflow", perm_type="menu", sort_order=3),
            Permission(perm_name="流程定义", perm_code="workflow:def", perm_type="menu", parent_id=19, sort_order=1),
            Permission(perm_name="我的待办", perm_code="workflow:todo", perm_type="menu", parent_id=19, sort_order=2),
            Permission(perm_name="我的已办", perm_code="workflow:done", perm_type="menu", parent_id=19, sort_order=3),
            Permission(perm_name="配置中心", perm_code="config", perm_type="menu", sort_order=4),
            Permission(perm_name="自定义表单", perm_code="form:list", perm_type="menu", parent_id=23, sort_order=1),
            Permission(perm_name="自定义工单", perm_code="ticket:list", perm_type="menu", parent_id=23, sort_order=2),
            Permission(perm_name="小程序管理", perm_code="miniapp:list", perm_type="menu", parent_id=23, sort_order=3),
            Permission(perm_name="系统设置", perm_code="settings:list", perm_type="menu", parent_id=23, sort_order=4),
            Permission(perm_name="日志审计", perm_code="log", perm_type="menu", sort_order=5),
            Permission(perm_name="登录日志", perm_code="log:login", perm_type="menu", parent_id=28, sort_order=1),
            Permission(perm_name="操作日志", perm_code="log:operation", perm_type="menu", parent_id=28, sort_order=2),
        ]
        for p in perms:
            db.add(p)
        db.commit()
        for p in perms:
            db.refresh(p)
        
        # 3. Roles
        admin_role = Role(role_name="超级管理员", role_code="admin", data_scope="all", description="全部权限")
        auditor_role = Role(role_name="审核员", role_code="auditor", data_scope="dept", description="审核权限")
        finance_role = Role(role_name="财务", role_code="finance", data_scope="dept", description="资金管理权限")
        ops_role = Role(role_name="运营", role_code="ops", data_scope="dept", description="运营管理权限")
        db.add_all([admin_role, auditor_role, finance_role, ops_role])
        db.commit()
        for r in [admin_role, auditor_role, finance_role, ops_role]:
            db.refresh(r)
        
        # Assign all permissions to admin
        all_perms = db.query(Permission).all()
        admin_role.permissions = all_perms
        db.commit()
        
        # 4. Users
        admin = User(username="admin", password_hash=get_password_hash("admin123"), real_name="系统管理员", is_super=1, dept_id=1, status=1)
        auditor1 = User(username="auditor1", password_hash=get_password_hash("123456"), real_name="审核员A", dept_id=3, status=1)
        auditor2 = User(username="auditor2", password_hash=get_password_hash("123456"), real_name="审核员B", dept_id=3, status=1)
        finance1 = User(username="finance1", password_hash=get_password_hash("123456"), real_name="财务A", dept_id=5, status=1)
        ops1 = User(username="ops1", password_hash=get_password_hash("123456"), real_name="运营A", dept_id=2, status=1)
        db.add_all([admin, auditor1, auditor2, finance1, ops1])
        db.commit()
        
        # Assign roles
        admin.roles = [admin_role]
        auditor1.roles = [auditor_role]
        auditor2.roles = [auditor_role]
        finance1.roles = [finance_role]
        ops1.roles = [ops_role]
        db.commit()
        
        # 5. Menus
        # Menu model already imported above
        menus = [
            Menu(menu_name="数据看板", menu_code="dashboard", icon="LayoutDashboard", path="/dashboard", component="DashboardPage", sort_order=1),
            Menu(menu_name="权限中心", menu_code="rbac", icon="Shield", sort_order=2),
            Menu(menu_name="用户管理", menu_code="user", icon="Users", path="/rbac/users", component="UserListPage", parent_id=2, sort_order=1, permission_code="user:list"),
            Menu(menu_name="角色管理", menu_code="role", icon="UserCog", path="/rbac/roles", component="RoleListPage", parent_id=2, sort_order=2, permission_code="role:list"),
            Menu(menu_name="菜单管理", menu_code="menu", icon="Menu", path="/rbac/menus", component="MenuListPage", parent_id=2, sort_order=3, permission_code="menu:list"),
            Menu(menu_name="部门管理", menu_code="dept", icon="Building2", path="/org/depts", component="DeptListPage", parent_id=2, sort_order=4, permission_code="dept:list"),
            Menu(menu_name="业务管理", menu_code="business", icon="Briefcase", sort_order=3),
            Menu(menu_name="回收管理", menu_code="recycle", icon="Recycle", path="/recycle", component="RecycleListPage", parent_id=7, sort_order=1, permission_code="recycle:list"),
            Menu(menu_name="师傅管理", menu_code="master", icon="Wrench", path="/masters", component="MasterListPage", parent_id=7, sort_order=2, permission_code="master:list"),
            Menu(menu_name="资金管理", menu_code="fund", icon="Wallet", path="/fund/accounts", component="FundAccountPage", parent_id=7, sort_order=3, permission_code="fund:list"),
            Menu(menu_name="流程中心", menu_code="workflow", icon="GitBranch", sort_order=4),
            Menu(menu_name="流程定义", menu_code="workflow-def", icon="Workflow", path="/workflow/defs", parent_id=11, sort_order=1, permission_code="workflow:def"),
            Menu(menu_name="我的待办", menu_code="todo", icon="Inbox", path="/workflow/todo", component="MyTodoPage", parent_id=11, sort_order=2, permission_code="workflow:todo"),
            Menu(menu_name="我的已办", menu_code="done", icon="CheckSquare", path="/workflow/done", component="MyDonePage", parent_id=11, sort_order=3, permission_code="workflow:done"),
            Menu(menu_name="配置中心", menu_code="config", icon="Settings", sort_order=5),
            Menu(menu_name="自定义表单", menu_code="form", icon="FormInput", path="/forms/builder", component="FormBuilderPage", parent_id=15, sort_order=1, permission_code="form:list"),
            Menu(menu_name="自定义工单", menu_code="ticket", icon="Ticket", path="/tickets", component="TicketListPage", parent_id=15, sort_order=2, permission_code="ticket:list"),
            Menu(menu_name="小程序管理", menu_code="miniapp", icon="Smartphone", path="/miniapp", component="MiniappConfigPage", parent_id=15, sort_order=3, permission_code="miniapp:list"),
            Menu(menu_name="系统设置", menu_code="settings", icon="Sliders", path="/settings", component="SystemSettingsPage", parent_id=15, sort_order=4, permission_code="settings:list"),
            Menu(menu_name="日志审计", menu_code="log", icon="FileText", sort_order=6),
            Menu(menu_name="登录日志", menu_code="login-log", icon="LogIn", path="/logs/login", component="LoginLogPage", parent_id=20, sort_order=1, permission_code="log:login"),
            Menu(menu_name="操作日志", menu_code="op-log", icon="Activity", path="/logs/operation", component="OperationLogPage", parent_id=20, sort_order=2, permission_code="log:operation"),
        ]
        for m in menus:
            db.add(m)
        db.commit()
        
        # 6. Masters
        # Master model already imported above
        masters_data = [
            ("张师傅", "13800138001", "110101199001011234", 4, "高级", "[\"空调\",\"冰箱\"]", "朝阳区", 1),
            ("李师傅", "13800138002", "110101199002021234", 4, "专家", "[\"洗衣机\",\"热水器\"]", "海淀区", 1),
            ("王师傅", "13800138003", "110101199003031234", 4, "中级", "[\"电视\",\"空调\"]", "东城区", 1),
            ("赵师傅", "13800138004", "110101199004041234", 4, "初级", "[\"冰箱\"]", "西城区", 1),
            ("刘师傅", "13800138005", "110101199005051234", 4, "高级", "[\"热水器\",\"油烟机\"]", "丰台区", 1),
            ("陈师傅", "13800138006", "110101199006061234", 4, "中级", "[\"空调\",\"洗衣机\"]", "石景山区", 1),
            ("杨师傅", "13800138007", "110101199007071234", 4, "初级", "[\"电视\"]", "通州区", 1),
            ("黄师傅", "13800138008", "110101199008081234", 4, "专家", "[\"中央空调\",\"地暖\"]", "昌平区", 1),
            ("周师傅", "13800138009", "110101199009091234", 4, "高级", "[\"冰箱\",\"洗衣机\",\"空调\"]", "大兴区", 1),
            ("吴师傅", "13800138010", "110101199010101234", 4, "中级", "[\"热水器\"]", "顺义区", 1),
            ("徐师傅", "13800138011", "110101199011111234", 4, "初级", "[\"油烟机\"]", "房山区", 0),
            ("孙师傅", "13800138012", "110101199012121234", 4, "高级", "[\"空调\",\"电视\"]", "门头沟区", 2),
        ]
        for idx, (name, phone, id_card, dept_id, level, skills, area, status) in enumerate(masters_data):
            from datetime import datetime
            m = Master(name=name, phone=phone, id_card=id_card, dept_id=dept_id, level=level,
                      skill_tags=skills, service_area=area, status=status,
                      credit_score=random.randint(60, 100), recycle_count=random.randint(0, 50),
                      points_balance=random.randint(0, 5000), join_date=datetime.utcnow())
            # 关联第一个师傅到 admin 用户，方便小程序 /masters/me 调试
            if idx == 0:
                m.user_id = admin.id
            db.add(m)
        db.commit()
        
        # 7. Fund Accounts
        from app.models.fund_account import FundAccount
        all_masters = db.query(Master).all()
        for m in all_masters:
            fa = FundAccount(master_id=m.id, balance=random.randint(0, 10000),
                           frozen_amount=0, total_income=random.randint(1000, 20000),
                           total_outcome=random.randint(0, 10000))
            db.add(fa)
        db.commit()
        
        # 8. Recycle Orders
        import math
        parts_names = ["压缩机", "主板", "电容", "电机", "风扇", "换热器", "传感器", "控制面板", "电源模块", "显示屏"]
        device_types = ["空调", "冰箱", "洗衣机", "热水器", "电视", "油烟机"]
        areas = ["朝阳区", "海淀区", "东城区", "西城区", "丰台区", "石景山区", "通州区", "昌平区"]
        # Beijing center ~39.9, 116.4, generate random offset within ~20km
        for i in range(50):
            m = random.choice(all_masters)
            status = random.choices([0,1,2,3,4,5,6,7], weights=[15,20,5,15,10,5,5,25])[0]
            # Random lat/lng around Beijing (±0.15 deg ≈ ±15km)
            lat = 39.9042 + random.uniform(-0.15, 0.15)
            lng = 116.4074 + random.uniform(-0.15, 0.15)
            order = RecycleOrder(
                order_no=f"R{datetime.now().strftime('%Y%m%d%H%M%S')}{i+1000}",
                master_id=m.id,
                parts_name=random.choice(parts_names),
                device_type=random.choice(device_types),
                fault_desc=f"故障描述{i+1}",
                old_parts_img=f"/uploads/sample/old_{i}.jpg",
                status=status,
                user_keep=random.choice([0, 1]),
                points=random.randint(10, 200),
                point_status=1 if status == 7 else 0,
                amount=random.randint(50, 500),
                lat=round(lat, 6),
                lng=round(lng, 6),
                address=f"北京市{random.choice(areas)}回收点{i+1}号",
                create_time=datetime.utcnow() - timedelta(days=random.randint(0, 60))
            )
            db.add(order)
        db.commit()
        
        # 9. Parts Categories
        from app.models.parts_category import PartsCategory
        categories = [
            ("压缩机", "台", 100, "翻新"),
            ("主板", "块", 150, "拆解"),
            ("电容", "个", 20, "环保处理"),
            ("电机", "台", 80, "翻新"),
            ("风扇", "个", 30, "翻新"),
            ("换热器", "套", 120, "拆解"),
            ("传感器", "个", 40, "环保处理"),
            ("控制面板", "块", 90, "翻新"),
        ]
        for name, unit, points, disposal in categories:
            cat = PartsCategory(category_name=name, unit=unit, default_points=points, disposal_type=disposal)
            db.add(cat)
        db.commit()
        
        # 10. Fund Transactions
        from app.models.fund_transaction import FundTransaction
        txn_types = ["recycle_reward", "award", "withdraw"]
        for i in range(30):
            m = random.choice(all_masters)
            fa = db.query(FundAccount).filter(FundAccount.master_id == m.id).first()
            txn_type = random.choice(txn_types)
            amount = random.randint(50, 500) if txn_type != "withdraw" else -random.randint(100, 1000)
            txn = FundTransaction(
                account_id=fa.id if fa else None,
                master_id=m.id,
                txn_type=txn_type,
                amount=amount,
                balance_after=random.randint(0, 10000),
                related_order_no=f"R{random.randint(100000, 999999)}",
                remark=f"交易备注{i+1}",
                status=random.choice([0, 1, 2]),
                create_time=datetime.utcnow() - timedelta(days=random.randint(0, 60))
            )
            db.add(txn)
        db.commit()
        
        # 11. Workflow Defs
        from app.models.workflow_def import WorkflowDef
        wf = WorkflowDef(
            workflow_name="回收审批流程",
            workflow_key="recycle_approval",
            version=1,
            status=1,
            config_json='{"nodes":[{"id":"start","name":"提交","type":"start"},{"id":"audit","name":"审核","type":"audit"},{"id":"confirm","name":"入库确认","type":"task"},{"id":"dispose","name":"处置","type":"task"},{"id":"end","name":"完成","type":"end"}],"edges":[{"from":"start","to":"audit"},{"from":"audit","to":"confirm"},{"from":"confirm","to":"dispose"},{"from":"dispose","to":"end"}]}'
        )
        db.add(wf)
        db.commit()
        
        # 12. Form Definitions
        from app.models.form_definition import FormDefinition
        form = FormDefinition(
            form_name="师傅入职申请表",
            form_key="master_onboard",
            description="新师傅入职信息收集",
            fields_json='[{"label":"姓名","type":"text","required":true},{"label":"手机号","type":"text","required":true},{"label":"服务区域","type":"select","options":["朝阳区","海淀区","东城区","西城区"],"required":true},{"label":"技能特长","type":"checkbox","options":["空调","冰箱","洗衣机","热水器","电视"]},{"label":"身份证照片","type":"upload"},{"label":"备注","type":"textarea"}]',
            status=1
        )
        db.add(form)
        db.commit()
        
        # 13. Ticket Templates
        from app.models.ticket_template import TicketTemplate
        tpl = TicketTemplate(
            template_name="设备维修工单",
            template_key="repair_ticket",
            fields_json='[{"label":"设备类型","type":"select","options":["空调","冰箱","洗衣机"]},{"label":"故障描述","type":"textarea","required":true},{"label":"客户地址","type":"text","required":true},{"label":"预约时间","type":"datetime","required":true},{"label":"优先级","type":"radio","options":["紧急","普通","低"]}]',
            workflow_id=wf.id,
            status=1
        )
        db.add(tpl)
        db.commit()
        
        # 14. Miniapp Configs
        from app.models.miniapp_config import MiniappConfig
        configs = [
            ("app_name", "维修透明工具", "文案", "小程序名称"),
            ("app_logo", "/images/logo.png", "首页", "小程序Logo"),
            ("primary_color", "#1677FF", "配色", "主题色"),
            ("secondary_color", "#52C41A", "配色", "辅助色"),
            ("home_banner", "/images/banner.jpg", "首页", "首页Banner图"),
            ("home_title", "透明维修 放心服务", "首页", "首页标题"),
            ("recycle_enabled", "1", "功能", "旧件回收功能开关"),
            ("points_enabled", "1", "功能", "积分功能开关"),
            ("contact_phone", "400-888-8888", "文案", "客服电话"),
            ("about_us", "我们是一家专业的维修服务平台", "文案", "关于我们"),
        ]
        for key, value, group, desc in configs:
            cfg = MiniappConfig(config_key=key, config_value=value, config_group=group, description=desc)
            db.add(cfg)
        db.commit()
        
        # 15. Tickets
        for i in range(10):
            ticket = Ticket(
                template_id=1,
                ticket_no=f"T{datetime.now().strftime('%Y%m%d')}{i+1000}",
                title=f"维修工单-{i+1}",
                data_json='{"device_type":"空调","fault":"不制冷","address":"北京市朝阳区xxx","appointment":"2026-05-01 09:00","priority":"普通"}',
                status=random.choice([0, 1, 2, 3]),
                creator_id=1,
                creator_name="admin"
            )
            db.add(ticket)
        db.commit()
        
        print("Seed data inserted successfully!")
        
    finally:
        db.close()

# Run seed on startup
seed_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
