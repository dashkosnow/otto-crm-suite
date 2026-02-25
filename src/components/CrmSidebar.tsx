import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Search,
  Building2,
  Package,
  Wallet,
  ArrowLeftRight,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  ClipboardList,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [
      { path: "/", icon: LayoutDashboard, label: "Дашборд" },
    ],
  },
  {
    title: "Документи",
    items: [
      { path: "/client-orders", icon: ClipboardList, label: "Заявки клієнтів" },
      { path: "/supplier-orders", icon: ShoppingCart, label: "Заявки постачальн." },
      { path: "/purchase-invoices", icon: ArrowDownRight, label: "Приходні накладні" },
      { path: "/sales-invoices", icon: ArrowUpRight, label: "Видаткові накладні" },
      { path: "/invoices", icon: Receipt, label: "Рахунки" },
    ],
  },
  {
    title: "Довідники",
    items: [
      { path: "/clients", icon: Users, label: "Клієнти" },
      { path: "/contractors", icon: Building2, label: "Контрагенти" },
      { path: "/search", icon: Search, label: "Пошук артикулів" },
      { path: "/inventory", icon: Package, label: "Товари/Склад" },
    ],
  },
  {
    title: "Фінанси",
    items: [
      { path: "/finance", icon: Wallet, label: "Фінанси" },
      { path: "/settlements", icon: ArrowLeftRight, label: "Взаєморозрахунки" },
      { path: "/reports", icon: BarChart3, label: "Звіти" },
    ],
  },
];

const CrmSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
          OZ
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold text-sidebar-accent-foreground truncate">
              Otto Zimmermann
            </h1>
            <p className="text-[10px] text-sidebar-muted truncate">CRM System</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.title && !collapsed && (
              <p className="text-[10px] uppercase tracking-wider text-sidebar-muted px-3 pt-3 pb-1 font-semibold">
                {group.title}
              </p>
            )}
            {collapsed && gi > 0 && (
              <div className="mx-3 my-2 border-t border-sidebar-border" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "sidebar-item-active"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="shrink-0" size={18} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings + collapse */}
      <div className="px-2 pb-3 space-y-0.5 shrink-0 border-t border-sidebar-border pt-3">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
            location.pathname === "/settings"
              ? "sidebar-item-active"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Налаштування</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Згорнути</span>}
        </button>
      </div>
    </aside>
  );
};

export default CrmSidebar;
