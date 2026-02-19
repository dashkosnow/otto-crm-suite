import CrmLayout from "@/components/CrmLayout";
import KpiCard from "@/components/KpiCard";
import { ShoppingCart, Users, Wallet, Package, TrendingUp, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const recentOrders = [
  { id: "OZ-2024-1847", client: "Коваленко Олег", date: "19.02.2026", sum: "12 450 ₴", status: "Новый", statusColor: "primary" as const },
  { id: "OZ-2024-1846", client: "Петренко Ірина", date: "19.02.2026", sum: "8 230 ₴", status: "В обработке", statusColor: "warning" as const },
  { id: "OZ-2024-1845", client: "Бондаренко Дмитро", date: "18.02.2026", sum: "24 800 ₴", status: "Отправлен", statusColor: "success" as const },
  { id: "OZ-2024-1844", client: "Шевченко Андрій", date: "18.02.2026", sum: "5 100 ₴", status: "Выполнен", statusColor: "success" as const },
  { id: "OZ-2024-1843", client: "Мельник Тарас", date: "17.02.2026", sum: "31 200 ₴", status: "Ожидает оплату", statusColor: "destructive" as const },
];

const statusBadgeVariant = (color: string) => {
  switch (color) {
    case "success": return "default";
    case "warning": return "secondary";
    case "destructive": return "destructive";
    default: return "outline";
  }
};

const Dashboard = () => {
  return (
    <CrmLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Дашборд</h1>
          <p className="text-sm text-muted-foreground">Обзор показателей за сегодня</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Заказы сегодня"
            value="23"
            change="+12% vs вчера"
            changeType="positive"
            icon={ShoppingCart}
          />
          <KpiCard
            title="Выручка (день)"
            value="84 500 ₴"
            change="+8.3% vs вчера"
            changeType="positive"
            icon={TrendingUp}
          />
          <KpiCard
            title="Активные клиенты"
            value="1 247"
            change="+3 новых"
            changeType="positive"
            icon={Users}
          />
          <KpiCard
            title="Ожидают оплату"
            value="15"
            change="на сумму 127 400 ₴"
            changeType="negative"
            icon={Wallet}
            subtitle="дебиторская задолженность"
          />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border animate-fade-in">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-card-foreground">Последние заказы</h2>
              <a href="/orders" className="text-sm text-primary hover:underline">Все заказы →</a>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-card-foreground">{order.sum}</span>
                    <Badge variant={statusBadgeVariant(order.statusColor)} className="text-xs">
                      {order.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
              <h2 className="font-semibold text-card-foreground mb-4">Статусы заказов</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    <span className="text-sm text-muted-foreground">Новые</span>
                  </div>
                  <span className="text-sm font-semibold text-card-foreground">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-warning" />
                    <span className="text-sm text-muted-foreground">В обработке</span>
                  </div>
                  <span className="text-sm font-semibold text-card-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span className="text-sm text-muted-foreground">Выполнены</span>
                  </div>
                  <span className="text-sm font-semibold text-card-foreground">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-destructive" />
                    <span className="text-sm text-muted-foreground">Проблемные</span>
                  </div>
                  <span className="text-sm font-semibold text-card-foreground">3</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
              <h2 className="font-semibold text-card-foreground mb-4">Склад</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Позиций на складе</span>
                  <span className="text-sm font-semibold text-card-foreground">3 482</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ожидают поступления</span>
                  <span className="text-sm font-semibold text-card-foreground">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Под заказ</span>
                  <span className="text-sm font-semibold text-card-foreground">89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CrmLayout>
  );
};

export default Dashboard;
