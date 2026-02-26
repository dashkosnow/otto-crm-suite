import CrmLayout from "@/components/CrmLayout";
import KpiCard from "@/components/KpiCard";
import { ShoppingCart, Users, Wallet, TrendingUp, Clock, CheckCircle2, AlertTriangle, Package, FileText, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  clientOrders, supplierOrders, purchaseInvoices, salesInvoices, invoices,
  formatAmount, statusConfig, type DocStatus
} from "@/data/documents";

const statusBadgeVariant = (status: DocStatus) => {
  switch (statusConfig[status]?.variant) {
    case "default": return "default" as const;
    case "secondary": return "secondary" as const;
    case "destructive": return "destructive" as const;
    default: return "outline" as const;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  // KPI calculations
  const activeClientOrders = clientOrders.filter(o => o.status === "in_progress" || o.status === "confirmed").length;
  const completedClientOrders = clientOrders.filter(o => o.status === "completed").length;
  const totalRevenue = salesInvoices.filter(s => s.status === "completed").reduce((s, i) => s + i.total, 0);
  const unpaidInvoices = invoices.filter(i => i.status !== "completed" && i.direction === "outgoing");
  const unpaidTotal = unpaidInvoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const pendingSupplierOrders = supplierOrders.filter(o => o.status === "in_progress" || o.status === "confirmed").length;
  const draftPurchaseInvoices = purchaseInvoices.filter(p => p.status === "draft").length;

  return (
    <CrmLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Дашборд</h1>
          <p className="text-sm text-muted-foreground">Обзор документообігу</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Заявки клієнтів" value={String(clientOrders.length)} change={`${activeClientOrders} в роботі`} changeType="neutral" icon={ShoppingCart} />
          <KpiCard title="Виручка (відвантажено)" value={formatAmount(totalRevenue, "UAH")} change={`${completedClientOrders} виконаних замовлень`} changeType="positive" icon={TrendingUp} />
          <KpiCard title="Очікують оплату" value={String(unpaidInvoices.length)} change={`борг ${formatAmount(unpaidTotal, "UAH")}`} changeType="negative" icon={Wallet} />
          <KpiCard title="Заявки постачальникам" value={String(supplierOrders.length)} change={`${pendingSupplierOrders} очікують поставку`} changeType="neutral" icon={Package} />
        </div>

        {/* Document workflow pipeline */}
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <h2 className="font-semibold text-card-foreground mb-4">Ланцюжок документів</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Заявки клієнтів", count: clientOrders.length, active: activeClientOrders, icon: FileText, path: "/client-orders", color: "text-primary" },
              { label: "Заявки постач.", count: supplierOrders.length, active: pendingSupplierOrders, icon: ArrowUpFromLine, path: "/supplier-orders", color: "text-chart-2" },
              { label: "Прихідні накл.", count: purchaseInvoices.length, active: draftPurchaseInvoices, icon: ArrowDownToLine, path: "/purchase-invoices", color: "text-chart-3" },
              { label: "Видаткові накл.", count: salesInvoices.length, active: salesInvoices.filter(s => s.status === "draft").length, icon: ArrowUpFromLine, path: "/sales-invoices", color: "text-chart-4" },
              { label: "Рахунки", count: invoices.length, active: unpaidInvoices.length, icon: Wallet, path: "/invoices", color: "text-chart-5" },
            ].map((step, i) => (
              <button key={i} onClick={() => navigate(step.path)} className="text-left p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                <step.icon size={20} className={step.color + " mb-2"} />
                <p className="text-xs text-muted-foreground">{step.label}</p>
                <p className="text-xl font-bold text-card-foreground">{step.count}</p>
                {step.active > 0 && <p className="text-xs text-muted-foreground mt-1">{step.active} потребують уваги</p>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent client orders */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border animate-fade-in">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-card-foreground">Останні заявки клієнтів</h2>
              <button onClick={() => navigate("/client-orders")} className="text-sm text-primary hover:underline">Усі →</button>
            </div>
            <div className="divide-y divide-border">
              {clientOrders.slice(0, 5).map((order) => (
                <button key={order.id} onClick={() => navigate(`/client-orders/${order.id}`)} className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{order.number}</p>
                    <p className="text-xs text-muted-foreground">{order.client}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-card-foreground">{formatAmount(order.total, order.currency)}</span>
                    <Badge variant={statusBadgeVariant(order.status)} className="text-xs">{statusConfig[order.status].label}</Badge>
                    <span className="text-xs text-muted-foreground">{order.date}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar stats */}
          <div className="space-y-4">
            {/* Unpaid invoices */}
            <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
              <h2 className="font-semibold text-card-foreground mb-4">Неоплачені рахунки</h2>
              {unpaidInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">Усі рахунки оплачені ✓</p>
              ) : (
                <div className="space-y-3">
                  {unpaidInvoices.map(inv => {
                    const pct = inv.total > 0 ? Math.round((inv.paid / inv.total) * 100) : 0;
                    return (
                      <button key={inv.id} onClick={() => navigate(`/invoices/${inv.id}`)} className="w-full text-left space-y-1 hover:bg-muted/50 rounded p-1.5 -m-1.5 transition-colors">
                        <div className="flex justify-between text-sm">
                          <span className="text-card-foreground font-medium">{inv.counterparty}</span>
                          <span className="text-destructive font-medium">{formatAmount(inv.total - inv.paid, inv.currency)}</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">до {inv.dueDate}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order statuses */}
            <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
              <h2 className="font-semibold text-card-foreground mb-4">Статуси замовлень</h2>
              <div className="space-y-3">
                {[
                  { icon: Clock, label: "Чернетки", count: clientOrders.filter(o => o.status === "draft").length, cls: "text-muted-foreground" },
                  { icon: CheckCircle2, label: "Підтверджені", count: clientOrders.filter(o => o.status === "confirmed").length, cls: "text-primary" },
                  { icon: Package, label: "В роботі", count: clientOrders.filter(o => o.status === "in_progress").length, cls: "text-chart-2" },
                  { icon: CheckCircle2, label: "Виконані", count: clientOrders.filter(o => o.status === "completed").length, cls: "text-success" },
                  { icon: AlertTriangle, label: "Скасовані", count: clientOrders.filter(o => o.status === "cancelled").length, cls: "text-destructive" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.icon size={14} className={s.cls} />
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CrmLayout>
  );
};

export default Dashboard;
