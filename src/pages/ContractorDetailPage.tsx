import CrmLayout from "@/components/CrmLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Hash,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

// Re-use contractor data (in real app this would come from API/DB)
interface Contractor {
  id: number;
  name: string;
  type: "supplier" | "buyer";
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  edrpou: string;
  contracts: number;
  balance: string;
  balanceType: "positive" | "negative" | "zero";
  tags: string[];
  lastActivity: string;
}

const contractorsData: Contractor[] = [
  { id: 1, name: "АвтоТрейд Груп ТОВ", type: "supplier", contactPerson: "Іванов Максим", phone: "+380 44 555 1234", email: "trade@autotrade.ua", city: "Київ", edrpou: "12345678", contracts: 3, balance: "-42 300 ₴", balanceType: "negative", tags: ["Диски", "Колодки"], lastActivity: "19.02.2026" },
  { id: 2, name: "Zimmermann GmbH", type: "supplier", contactPerson: "Hans Mueller", phone: "+49 611 123 456", email: "orders@zimmermann.de", city: "Wiesbaden", edrpou: "DE123456", contracts: 1, balance: "-128 500 €", balanceType: "negative", tags: ["Основной"], lastActivity: "18.02.2026" },
  { id: 3, name: "БрейкСервіс ТОВ", type: "supplier", contactPerson: "Кравчук Олена", phone: "+380 57 333 4455", email: "info@brakeservice.ua", city: "Харків", edrpou: "87654321", contracts: 2, balance: "0 ₴", balanceType: "zero", tags: ["Суппорты"], lastActivity: "15.02.2026" },
  { id: 4, name: "EuroParts Distribution", type: "supplier", contactPerson: "Jakub Nowak", phone: "+48 22 555 6677", email: "supply@europarts.pl", city: "Warszawa", edrpou: "PL987654", contracts: 1, balance: "-15 200 €", balanceType: "negative", tags: ["Колодки", "Барабаны"], lastActivity: "12.02.2026" },
  { id: 5, name: "СТО «Автомайстер»", type: "buyer", contactPerson: "Бондаренко Дмитро", phone: "+380 93 555 1234", email: "sto@automaster.ua", city: "Київ", edrpou: "11223344", contracts: 1, balance: "+24 800 ₴", balanceType: "positive", tags: ["СТО", "Опт"], lastActivity: "18.02.2026" },
  { id: 6, name: "Мельник Тарас (ФОП)", type: "buyer", contactPerson: "Мельник Тарас", phone: "+380 97 111 2233", email: "melnyk.t@gmail.com", city: "Львів", edrpou: "1234567890", contracts: 0, balance: "+31 200 ₴", balanceType: "positive", tags: ["VIP", "Опт"], lastActivity: "17.02.2026" },
  { id: 7, name: "АвтоХаус Дніпро", type: "buyer", contactPerson: "Ткаченко Віталій", phone: "+380 56 777 8899", email: "autohaus@dn.ua", city: "Дніпро", edrpou: "55667788", contracts: 2, balance: "0 ₴", balanceType: "zero", tags: ["СТО"], lastActivity: "16.02.2026" },
  { id: 8, name: "РемЗона ТОВ", type: "buyer", contactPerson: "Литвиненко Сергій", phone: "+380 48 222 3344", email: "remzona@od.ua", city: "Одеса", edrpou: "99887766", contracts: 1, balance: "+8 400 ₴", balanceType: "positive", tags: ["Розница"], lastActivity: "14.02.2026" },
  { id: 9, name: "PartsPro Ukraine", type: "supplier", contactPerson: "Степаненко Роман", phone: "+380 44 888 9900", email: "rom@partspro.ua", city: "Київ", edrpou: "33445566", contracts: 2, balance: "-7 600 ₴", balanceType: "negative", tags: ["Диски", "Суппорты"], lastActivity: "10.02.2026" },
  { id: 10, name: "CarFix Мережа", type: "buyer", contactPerson: "Козлова Анна", phone: "+380 67 444 5566", email: "anna@carfix.ua", city: "Запоріжжя", edrpou: "77889900", contracts: 1, balance: "+56 100 ₴", balanceType: "positive", tags: ["СТО", "Опт", "VIP"], lastActivity: "13.02.2026" },
];

// Mock order history
interface Order {
  id: string;
  date: string;
  items: number;
  total: string;
  status: "completed" | "pending" | "shipped" | "cancelled";
}

const getOrdersForContractor = (id: number): Order[] => {
  const orderSets: Record<number, Order[]> = {
    1: [
      { id: "ORD-1042", date: "19.02.2026", items: 4, total: "18 200 ₴", status: "pending" },
      { id: "ORD-1028", date: "12.02.2026", items: 8, total: "34 500 ₴", status: "completed" },
      { id: "ORD-0997", date: "28.01.2026", items: 2, total: "7 800 ₴", status: "completed" },
    ],
    2: [
      { id: "ORD-1045", date: "18.02.2026", items: 12, total: "128 500 €", status: "shipped" },
    ],
    5: [
      { id: "ORD-1038", date: "18.02.2026", items: 6, total: "24 800 ₴", status: "pending" },
      { id: "ORD-1015", date: "05.02.2026", items: 3, total: "12 400 ₴", status: "completed" },
    ],
    6: [
      { id: "ORD-1035", date: "17.02.2026", items: 10, total: "31 200 ₴", status: "pending" },
      { id: "ORD-1010", date: "01.02.2026", items: 5, total: "19 600 ₴", status: "completed" },
      { id: "ORD-0985", date: "15.01.2026", items: 7, total: "27 300 ₴", status: "completed" },
    ],
    10: [
      { id: "ORD-1030", date: "13.02.2026", items: 15, total: "56 100 ₴", status: "pending" },
    ],
  };
  return orderSets[id] || [
    { id: `ORD-${1000 + id}`, date: "10.02.2026", items: 3, total: "12 000 ₴", status: "completed" },
  ];
};

// Mock settlements
interface Settlement {
  id: string;
  date: string;
  type: "income" | "expense";
  description: string;
  amount: string;
  document: string;
}

const getSettlementsForContractor = (id: number): Settlement[] => {
  const isSupplier = contractorsData.find(c => c.id === id)?.type === "supplier";
  if (isSupplier) {
    return [
      { id: "SET-301", date: "19.02.2026", type: "expense", description: "Оплата по накладной №1042", amount: "18 200 ₴", document: "Платёжка №301" },
      { id: "SET-287", date: "14.02.2026", type: "expense", description: "Часть оплаты по заказу ORD-1028", amount: "20 000 ₴", document: "Платёжка №287" },
      { id: "SET-265", date: "01.02.2026", type: "expense", description: "Оплата по заказу ORD-0997", amount: "7 800 ₴", document: "Платёжка №265" },
      { id: "SET-250", date: "20.01.2026", type: "income", description: "Возврат за брак (2 позиции)", amount: "3 700 ₴", document: "Возвратная №12" },
    ];
  }
  return [
    { id: "SET-310", date: "18.02.2026", type: "income", description: "Частичная оплата заказа", amount: "15 000 ₴", document: "Приход №310" },
    { id: "SET-295", date: "10.02.2026", type: "income", description: "Оплата предыдущего заказа", amount: "12 400 ₴", document: "Приход №295" },
    { id: "SET-280", date: "28.01.2026", type: "expense", description: "Возврат денег за товар", amount: "2 200 ₴", document: "Расход №45" },
  ];
};

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Завершён", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "В обработке", className: "bg-warning/10 text-warning border-warning/20" },
  shipped: { label: "Отгружен", className: "bg-primary/10 text-primary border-primary/20" },
  cancelled: { label: "Отменён", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const balanceClass = (type: string) => {
  if (type === "positive") return "text-success";
  if (type === "negative") return "text-destructive";
  return "text-muted-foreground";
};

const ContractorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contractor = contractorsData.find(c => c.id === Number(id));

  if (!contractor) {
    return (
      <CrmLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">Контрагент не найден</p>
          <Button variant="outline" onClick={() => navigate("/contractors")}>
            <ArrowLeft size={16} className="mr-2" /> Назад к списку
          </Button>
        </div>
      </CrmLayout>
    );
  }

  const orders = getOrdersForContractor(contractor.id);
  const settlements = getSettlementsForContractor(contractor.id);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  const totalIncome = settlements.filter(s => s.type === "income").length;
  const totalExpense = settlements.filter(s => s.type === "expense").length;

  return (
    <CrmLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/contractors")}
              className="mt-0.5 shrink-0"
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {contractor.type === "supplier" ? (
                    <Building2 size={18} className="text-primary" />
                  ) : (
                    <User size={18} className="text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{contractor.name}</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">
                      {contractor.type === "supplier" ? "Поставщик" : "Покупатель"}
                    </Badge>
                    {contractor.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Edit size={14} /> Редактировать
          </Button>
        </div>

        {/* Info cards row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={<Phone size={14} />} label="Телефон" value={contractor.phone} />
          <InfoCard icon={<Mail size={14} />} label="Email" value={contractor.email} />
          <InfoCard icon={<MapPin size={14} />} label="Город" value={contractor.city} />
          <InfoCard icon={<Hash size={14} />} label="ЄДРПОУ" value={contractor.edrpou} mono />
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Контактное лицо</p>
            <p className="text-sm font-semibold text-card-foreground">{contractor.contactPerson}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Договоров</p>
            <p className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
              <FileText size={14} className="text-muted-foreground" />
              {contractor.contracts}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Баланс</p>
            <p className={`text-lg font-bold ${balanceClass(contractor.balanceType)}`}>
              {contractor.balance}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Последняя активность</p>
            <p className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
              <Calendar size={14} className="text-muted-foreground" />
              {contractor.lastActivity}
            </p>
          </div>
        </div>

        {/* Tabs: Orders + Settlements */}
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders" className="gap-1.5">
              <ShoppingCart size={14} /> Заказы ({totalOrders})
            </TabsTrigger>
            <TabsTrigger value="settlements" className="gap-1.5">
              <CreditCard size={14} /> Взаиморасчёты ({settlements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">№ Заказа</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Дата</th>
                    <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Позиций</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сумма</th>
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
                        <Badge variant="outline" className={`text-[10px] ${statusConfig[order.status].className}`}>
                          {statusConfig[order.status].label}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Заказов нет</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settlements" className="mt-4">
            {/* Settlement summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Приходы</p>
                  <p className="text-sm font-bold text-card-foreground">{totalIncome} операций</p>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown size={16} className="text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Расходы</p>
                  <p className="text-sm font-bold text-card-foreground">{totalExpense} операций</p>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Minus size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Текущий баланс</p>
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
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Описание</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Документ</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сумма</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {settlements.map(s => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-card-foreground">{s.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${s.type === "income" ? "text-success" : "text-destructive"}`}>
                          {s.type === "income" ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                          {s.type === "income" ? "Приход" : "Расход"}
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
