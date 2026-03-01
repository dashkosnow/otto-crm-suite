import CrmLayout from "@/components/CrmLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Building2, User, Phone, Mail, MapPin, FileText, Edit,
  ShoppingCart, ArrowUpRight, ArrowDownRight, Calendar, Hash, CreditCard,
  TrendingUp, TrendingDown, Minus, Car, MessageSquare, Zap, UserCheck,
} from "lucide-react";
import { contractorsData, balanceClass, getOrdersForContractor, getSettlementsForContractor } from "@/data/contractors";

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Завершено", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "В обробці", className: "bg-warning/10 text-warning border-warning/20" },
  shipped: { label: "Відвантажено", className: "bg-primary/10 text-primary border-primary/20" },
  cancelled: { label: "Скасовано", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const ContractorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contractor = contractorsData.find(c => c.id === Number(id));

  if (!contractor) {
    return (
      <CrmLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">Контрагента не знайдено</p>
          <Button variant="outline" onClick={() => navigate("/contractors")}>
            <ArrowLeft size={16} className="mr-2" /> Назад до списку
          </Button>
        </div>
      </CrmLayout>
    );
  }

  const orders = getOrdersForContractor(contractor.id);
  const settlements = getSettlementsForContractor(contractor.id);
  const isBuyer = contractor.type === "buyer";

  return (
    <CrmLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mt-0.5 shrink-0">
              <ArrowLeft size={18} />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {contractor.type === "supplier" ? <Building2 size={18} className="text-primary" /> : <User size={18} className="text-primary" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{contractor.name}</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">
                      {contractor.type === "supplier" ? "Постачальник" : "Покупець"}
                    </Badge>
                    {contractor.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Edit size={14} /> Редагувати
          </Button>
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={<Phone size={14} />} label="Телефон" value={contractor.phone} />
          <InfoCard icon={<Mail size={14} />} label="Email" value={contractor.email} />
          <InfoCard icon={<MapPin size={14} />} label="Місто" value={contractor.city} />
          <InfoCard icon={<Hash size={14} />} label="ЄДРПОУ" value={contractor.edrpou} mono />
        </div>

        {/* Summary stats */}
        <div className={`grid grid-cols-1 gap-4 ${isBuyer ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Контактна особа</p>
            <p className="text-sm font-semibold text-card-foreground">{contractor.contactPerson}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Договорів</p>
            <p className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
              <FileText size={14} className="text-muted-foreground" /> {contractor.contracts}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Баланс</p>
            <p className={`text-lg font-bold ${balanceClass(contractor.balanceType)}`}>{contractor.balance}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Остання активність</p>
            <p className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
              <Calendar size={14} className="text-muted-foreground" /> {contractor.lastActivity}
            </p>
          </div>
          {isBuyer && contractor.manager && (
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Менеджер</p>
              <p className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
                <UserCheck size={14} className="text-muted-foreground" /> {contractor.manager}
              </p>
            </div>
          )}
        </div>

        {/* CRM info for buyers */}
        {isBuyer && (contractor.source || contractor.notes || (contractor.vehicles && contractor.vehicles.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(contractor.source || contractor.notes) && (
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <MessageSquare size={14} /> CRM-дані
                </h3>
                <div className="space-y-3">
                  {contractor.source && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Джерело</p>
                      <p className="text-sm text-card-foreground flex items-center gap-1.5">
                        <Zap size={12} className="text-muted-foreground" /> {contractor.source}
                      </p>
                    </div>
                  )}
                  {contractor.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Нотатки</p>
                      <p className="text-sm text-card-foreground">{contractor.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {contractor.vehicles && contractor.vehicles.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <Car size={14} /> Автомобілі ({contractor.vehicles.length})
                </h3>
                <div className="space-y-3">
                  {contractor.vehicles.map((v) => (
                    <div key={v.vin} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {v.make} {v.model} ({v.year})
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">{v.vin}</p>
                      </div>
                      {v.plate && (
                        <Badge variant="outline" className="text-xs font-mono">{v.plate}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs: Orders + Settlements */}
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders" className="gap-1.5">
              <ShoppingCart size={14} /> Замовлення ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="settlements" className="gap-1.5">
              <CreditCard size={14} /> Взаєморозрахунки ({settlements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">№ Замовлення</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Дата</th>
                    <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Позицій</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сума</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5 text-sm font-medium text-primary">{order.id}</td>
                      <td className="px-5 py-3.5 text-sm text-card-foreground">{order.date}</td>
                      <td className="px-5 py-3.5 text-sm text-center text-card-foreground">{order.items}</td>
                      <td className="px-5 py-3.5 text-sm text-right font-semibold text-card-foreground">{order.total}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant="outline" className={`text-[10px] ${statusConfig[order.status]?.className || ""}`}>
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Замовлень немає</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settlements" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Приходи</p>
                  <p className="text-sm font-bold text-card-foreground">{settlements.filter(s => s.type === "income").length} операцій</p>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown size={16} className="text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Витрати</p>
                  <p className="text-sm font-bold text-card-foreground">{settlements.filter(s => s.type === "expense").length} операцій</p>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Minus size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Поточний баланс</p>
                  <p className={`text-sm font-bold ${balanceClass(contractor.balanceType)}`}>{contractor.balance}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Дата</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Тип</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Опис</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Документ</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сума</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {settlements.map(s => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-card-foreground">{s.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${s.type === "income" ? "text-success" : "text-destructive"}`}>
                          {s.type === "income" ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                          {s.type === "income" ? "Прихід" : "Витрата"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-card-foreground">{s.description}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.document}</td>
                      <td className={`px-5 py-3.5 text-sm text-right font-semibold ${s.type === "income" ? "text-success" : "text-destructive"}`}>
                        {s.type === "income" ? "+" : "−"}{s.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CrmLayout>
  );
};

const InfoCard = ({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) => (
  <div className="bg-card rounded-lg border border-border p-4">
    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">{icon} {label}</p>
    <p className={`text-sm font-medium text-card-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
  </div>
);

export default ContractorDetailPage;
