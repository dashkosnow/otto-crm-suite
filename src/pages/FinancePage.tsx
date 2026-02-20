import CrmLayout from "@/components/CrmLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Download,
  CreditCard,
  Banknote,
  Building2,
  ShoppingCart,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

// ── Cash Registers ──
interface CashRegister {
  id: number;
  name: string;
  currency: "UAH" | "EUR" | "USD";
  balance: number;
  type: "cash" | "bank";
  lastOperation: string;
}

const cashRegisters: CashRegister[] = [
  { id: 1, name: "Основна каса (готівка)", currency: "UAH", balance: 184_320, type: "cash", lastOperation: "19.02.2026" },
  { id: 2, name: "ПриватБанк ФОП", currency: "UAH", balance: 512_750, type: "bank", lastOperation: "19.02.2026" },
  { id: 3, name: "Європейська каса", currency: "EUR", balance: 28_430, type: "cash", lastOperation: "18.02.2026" },
  { id: 4, name: "Wise EUR", currency: "EUR", balance: 15_680, type: "bank", lastOperation: "17.02.2026" },
  { id: 5, name: "Wise USD", currency: "USD", balance: 4_210, type: "bank", lastOperation: "10.02.2026" },
];

const currencySymbol: Record<string, string> = { UAH: "₴", EUR: "€", USD: "$" };

const formatMoney = (amount: number, currency: string) => {
  const formatted = Math.abs(amount).toLocaleString("uk-UA");
  const sym = currencySymbol[currency] || currency;
  const sign = amount < 0 ? "−" : amount > 0 ? "+" : "";
  return `${sign}${formatted} ${sym}`;
};

const formatBalance = (amount: number, currency: string) => {
  const formatted = amount.toLocaleString("uk-UA");
  return `${formatted} ${currencySymbol[currency] || currency}`;
};

// ── Operations ──
type OperationType = "income" | "expense" | "transfer";

interface FinanceOperation {
  id: string;
  date: string;
  type: OperationType;
  category: string;
  description: string;
  amount: number;
  currency: "UAH" | "EUR" | "USD";
  cashRegister: string;
  contractor?: string;
  orderId?: string;
  document?: string;
}

const operations: FinanceOperation[] = [
  { id: "FIN-1051", date: "19.02.2026", type: "income", category: "Оплата заказа", description: "Оплата от СТО «Автомайстер» за ORD-1038", amount: 24_800, currency: "UAH", cashRegister: "ПриватБанк ФОП", contractor: "СТО «Автомайстер»", orderId: "ORD-1038", document: "Прихід №1051" },
  { id: "FIN-1050", date: "19.02.2026", type: "expense", category: "Оплата поставщику", description: "Оплата АвтоТрейд Груп за диски", amount: 18_200, currency: "UAH", cashRegister: "ПриватБанк ФОП", contractor: "АвтоТрейд Груп ТОВ", orderId: "ORD-1042", document: "Платіжка №287" },
  { id: "FIN-1049", date: "18.02.2026", type: "income", category: "Оплата заказа", description: "Часткова оплата від Мельник Тарас (ФОП)", amount: 15_000, currency: "UAH", cashRegister: "Основна каса (готівка)", contractor: "Мельник Тарас (ФОП)", orderId: "ORD-1035", document: "Прихід №1049" },
  { id: "FIN-1048", date: "18.02.2026", type: "expense", category: "Оплата поставщику", description: "Оплата Zimmermann GmbH — накладна #ZM-2026-18", amount: 12_400, currency: "EUR", cashRegister: "Wise EUR", contractor: "Zimmermann GmbH", orderId: "ORD-1045", document: "Платіжка №W-412" },
  { id: "FIN-1047", date: "17.02.2026", type: "transfer", category: "Переміщення", description: "Переміщення з каси на рахунок ПриватБанк", amount: 50_000, currency: "UAH", cashRegister: "Основна каса → ПриватБанк", document: "Внутр. №47" },
  { id: "FIN-1046", date: "17.02.2026", type: "income", category: "Оплата заказа", description: "Оплата від CarFix Мережа", amount: 56_100, currency: "UAH", cashRegister: "ПриватБанк ФОП", contractor: "CarFix Мережа", orderId: "ORD-1030", document: "Прихід №1046" },
  { id: "FIN-1045", date: "16.02.2026", type: "expense", category: "Адміністративні", description: "Оренда складу за лютий", amount: 22_000, currency: "UAH", cashRegister: "ПриватБанк ФОП", document: "Акт №АС-02" },
  { id: "FIN-1044", date: "15.02.2026", type: "expense", category: "Оплата поставщику", description: "Оплата EuroParts Distribution", amount: 5_200, currency: "EUR", cashRegister: "Європейська каса", contractor: "EuroParts Distribution", document: "Платіжка №EP-88" },
  { id: "FIN-1043", date: "14.02.2026", type: "income", category: "Оплата заказа", description: "Оплата від РемЗона ТОВ", amount: 8_400, currency: "UAH", cashRegister: "Основна каса (готівка)", contractor: "РемЗона ТОВ", orderId: "ORD-1025", document: "Прихід №1043" },
  { id: "FIN-1042", date: "13.02.2026", type: "expense", category: "Логістика", description: "Доставка Нова Пошта — 3 відправлення", amount: 1_850, currency: "UAH", cashRegister: "Основна каса (готівка)", document: "ТТН №2000..." },
  { id: "FIN-1041", date: "12.02.2026", type: "transfer", category: "Переміщення", description: "Купівля EUR на Wise", amount: 10_000, currency: "EUR", cashRegister: "ПриватБанк → Wise EUR", document: "Внутр. №46" },
  { id: "FIN-1040", date: "11.02.2026", type: "income", category: "Повернення", description: "Повернення від БрейкСервіс за брак", amount: 3_700, currency: "UAH", cashRegister: "ПриватБанк ФОП", contractor: "БрейкСервіс ТОВ", document: "Повернення №12" },
];

// ── Order Payments ──
interface OrderPayment {
  orderId: string;
  date: string;
  client: string;
  orderTotal: string;
  paid: string;
  remaining: string;
  status: "paid" | "partial" | "unpaid";
  currency: "UAH" | "EUR";
}

const orderPayments: OrderPayment[] = [
  { orderId: "ORD-1045", date: "18.02.2026", client: "Zimmermann GmbH", orderTotal: "128 500 €", paid: "12 400 €", remaining: "116 100 €", status: "partial", currency: "EUR" },
  { orderId: "ORD-1042", date: "19.02.2026", client: "АвтоТрейд Груп ТОВ", orderTotal: "18 200 ₴", paid: "18 200 ₴", remaining: "0 ₴", status: "paid", currency: "UAH" },
  { orderId: "ORD-1038", date: "18.02.2026", client: "СТО «Автомайстер»", orderTotal: "24 800 ₴", paid: "24 800 ₴", remaining: "0 ₴", status: "paid", currency: "UAH" },
  { orderId: "ORD-1035", date: "17.02.2026", client: "Мельник Тарас (ФОП)", orderTotal: "31 200 ₴", paid: "15 000 ₴", remaining: "16 200 ₴", status: "partial", currency: "UAH" },
  { orderId: "ORD-1030", date: "13.02.2026", client: "CarFix Мережа", orderTotal: "56 100 ₴", paid: "56 100 ₴", remaining: "0 ₴", status: "paid", currency: "UAH" },
  { orderId: "ORD-1028", date: "12.02.2026", client: "АвтоТрейд Груп ТОВ", orderTotal: "34 500 ₴", paid: "20 000 ₴", remaining: "14 500 ₴", status: "partial", currency: "UAH" },
  { orderId: "ORD-1025", date: "14.02.2026", client: "РемЗона ТОВ", orderTotal: "8 400 ₴", paid: "8 400 ₴", remaining: "0 ₴", status: "paid", currency: "UAH" },
  { orderId: "ORD-1020", date: "08.02.2026", client: "АвтоХаус Дніпро", orderTotal: "19 300 ₴", paid: "0 ₴", remaining: "19 300 ₴", status: "unpaid", currency: "UAH" },
];

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Оплачено", className: "bg-success/10 text-success border-success/20" },
  partial: { label: "Часткова", className: "bg-warning/10 text-warning border-warning/20" },
  unpaid: { label: "Не оплачено", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const typeConfig: Record<OperationType, { label: string; icon: typeof ArrowUpRight; className: string }> = {
  income: { label: "Прихід", icon: ArrowDownRight, className: "text-success" },
  expense: { label: "Витрата", icon: ArrowUpRight, className: "text-destructive" },
  transfer: { label: "Переміщення", icon: RefreshCw, className: "text-primary" },
};

// ── Aggregate stats ──
const totalUAH = cashRegisters.filter(c => c.currency === "UAH").reduce((s, c) => s + c.balance, 0);
const totalEUR = cashRegisters.filter(c => c.currency === "EUR").reduce((s, c) => s + c.balance, 0);
const totalUSD = cashRegisters.filter(c => c.currency === "USD").reduce((s, c) => s + c.balance, 0);

const todayIncome = operations.filter(o => o.date === "19.02.2026" && o.type === "income").reduce((s, o) => s + o.amount, 0);
const todayExpense = operations.filter(o => o.date === "19.02.2026" && o.type === "expense").reduce((s, o) => s + o.amount, 0);

const FinancePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("operations");

  const filteredOps = operations.filter(o =>
    o.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.contractor?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const filteredPayments = orderPayments.filter(p =>
    p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CrmLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Фінанси</h1>
            <p className="text-sm text-muted-foreground">
              {cashRegisters.length} кас · {operations.length} операцій сьогодні
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Download size={14} /> Експорт
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus size={16} /> Нова операція
            </Button>
          </div>
        </div>

        {/* Cash register cards */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wallet size={16} className="text-primary" /> Каси та рахунки
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {cashRegisters.map(cr => (
              <div key={cr.id} className="bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    {cr.type === "cash" ? <Banknote size={14} className="text-primary" /> : <Building2 size={14} className="text-primary" />}
                  </div>
                  <Badge variant="outline" className="text-[10px]">{cr.currency}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mb-1">{cr.name}</p>
                <p className="text-lg font-bold text-card-foreground">{formatBalance(cr.balance, cr.currency)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Остання: {cr.lastOperation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1">Загалом (UAH)</p>
            <p className="text-xl font-bold text-card-foreground">{formatBalance(totalUAH, "UAH")}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1">Загалом (EUR)</p>
            <p className="text-xl font-bold text-card-foreground">{formatBalance(totalEUR, "EUR")}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><TrendingUp size={12} className="text-success" /> Прихід сьогодні</p>
            <p className="text-xl font-bold text-success">{formatMoney(todayIncome, "UAH")}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><TrendingDown size={12} className="text-destructive" /> Витрати сьогодні</p>
            <p className="text-xl font-bold text-destructive">−{todayIncome > 0 ? formatBalance(todayExpense, "UAH") : "0 ₴"}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="operations" className="gap-1.5">
                <CreditCard size={14} /> Операції ({operations.length})
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-1.5">
                <ShoppingCart size={14} /> Оплати заказів ({orderPayments.length})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Пошук операцій..."
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Operations table */}
          <TabsContent value="operations" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Дата</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Тип</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Категорія</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Опис</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Каса</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Документ</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сума</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOps.map(op => {
                    const tc = typeConfig[op.type];
                    const Icon = tc.icon;
                    return (
                      <tr key={op.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-card-foreground whitespace-nowrap">{op.date}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${tc.className}`}>
                            <Icon size={12} /> {tc.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="outline" className="text-[10px]">{op.category}</Badge>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-card-foreground max-w-[280px]">
                          <p className="truncate">{op.description}</p>
                          {op.contractor && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">{op.contractor}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{op.cashRegister}</td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{op.document}</td>
                        <td className={`px-5 py-3.5 text-sm text-right font-semibold whitespace-nowrap ${tc.className}`}>
                          {op.type === "income" ? "+" : op.type === "expense" ? "−" : ""}{formatBalance(op.amount, op.currency)}
                        </td>
                        <td className="px-3 py-3.5">
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredOps.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Нічого не знайдено</div>
              )}
            </div>
          </TabsContent>

          {/* Order payments table */}
          <TabsContent value="payments" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">№ Заказу</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Дата</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Контрагент</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сума заказу</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Оплачено</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Залишок</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Статус</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPayments.map(p => {
                    const sc = paymentStatusConfig[p.status];
                    return (
                      <tr key={p.orderId} className="hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="px-5 py-3.5 text-sm font-medium text-primary">{p.orderId}</td>
                        <td className="px-5 py-3.5 text-sm text-card-foreground">{p.date}</td>
                        <td className="px-5 py-3.5 text-sm text-card-foreground">{p.client}</td>
                        <td className="px-5 py-3.5 text-sm text-right font-semibold text-card-foreground">{p.orderTotal}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-success font-medium">{p.paid}</td>
                        <td className={`px-5 py-3.5 text-sm text-right font-medium ${p.status === "paid" ? "text-muted-foreground" : "text-destructive"}`}>
                          {p.remaining}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="outline" className={`text-[10px] ${sc.className}`}>{sc.label}</Badge>
                        </td>
                        <td className="px-3 py-3.5">
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredPayments.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Нічого не знайдено</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CrmLayout>
  );
};

export default FinancePage;
