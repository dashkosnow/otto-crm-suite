import { useNavigate } from "react-router-dom";
import CrmLayout from "@/components/CrmLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Download,
  ArrowLeftRight,
  Building2,
  User,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreHorizontal,
  Calendar,
  Filter,
} from "lucide-react";
import { useState } from "react";

// ── Types ──
type ContractorType = "supplier" | "buyer";

interface Settlement {
  id: number;
  name: string;
  type: ContractorType;
  city: string;
  edrpou: string;
  currency: "UAH" | "EUR" | "USD";
  openingBalance: number;
  debit: number;   // мы должны (поставщику) / нам должны (покупатель)
  credit: number;  // мы оплатили / покупатель оплатил
  closingBalance: number;
  lastOperation: string;
  overdueAmount: number;
  overdueDays: number;
}

const settlements: Settlement[] = [
  { id: 1, name: "АвтоТрейд Груп ТОВ", type: "supplier", city: "Київ", edrpou: "40123456", currency: "UAH", openingBalance: -32_000, debit: 18_200, credit: 12_000, closingBalance: -38_200, lastOperation: "19.02.2026", overdueAmount: 14_500, overdueDays: 7 },
  { id: 2, name: "EuroParts Distribution", type: "supplier", city: "Варшава", edrpou: "PL7281", currency: "EUR", openingBalance: -8_400, debit: 5_200, credit: 8_400, closingBalance: -5_200, lastOperation: "15.02.2026", overdueAmount: 0, overdueDays: 0 },
  { id: 3, name: "Zimmermann GmbH", type: "supplier", city: "Дюссельдорф", edrpou: "DE9812", currency: "EUR", openingBalance: 0, debit: 12_400, credit: 0, closingBalance: -12_400, lastOperation: "18.02.2026", overdueAmount: 12_400, overdueDays: 3 },
  { id: 4, name: "СТО «Автомайстер»", type: "buyer", city: "Львів", edrpou: "38765432", currency: "UAH", openingBalance: 18_600, debit: 0, credit: 24_800, closingBalance: -6_200, lastOperation: "19.02.2026", overdueAmount: 0, overdueDays: 0 },
  { id: 5, name: "Мельник Тарас (ФОП)", type: "buyer", city: "Одеса", edrpou: "2934501234", currency: "UAH", openingBalance: 31_200, debit: 0, credit: 15_000, closingBalance: 16_200, lastOperation: "18.02.2026", overdueAmount: 16_200, overdueDays: 4 },
  { id: 6, name: "CarFix Мережа", type: "buyer", city: "Харків", edrpou: "41234567", currency: "UAH", openingBalance: 56_100, debit: 0, credit: 56_100, closingBalance: 0, lastOperation: "17.02.2026", overdueAmount: 0, overdueDays: 0 },
  { id: 7, name: "РемЗона ТОВ", type: "buyer", city: "Дніпро", edrpou: "39876543", currency: "UAH", openingBalance: 8_400, debit: 0, credit: 8_400, closingBalance: 0, lastOperation: "14.02.2026", overdueAmount: 0, overdueDays: 0 },
  { id: 8, name: "АвтоХаус Дніпро", type: "buyer", city: "Дніпро", edrpou: "43210987", currency: "UAH", openingBalance: 19_300, debit: 0, credit: 0, closingBalance: 19_300, lastOperation: "08.02.2026", overdueAmount: 19_300, overdueDays: 13 },
  { id: 9, name: "БрейкСервіс ТОВ", type: "buyer", city: "Запоріжжя", edrpou: "40987654", currency: "UAH", openingBalance: -3_700, debit: 0, credit: 3_700, closingBalance: -7_400, lastOperation: "12.02.2026", overdueAmount: 0, overdueDays: 0 },
  { id: 10, name: "TRW Aftermarket", type: "supplier", city: "Кобленц", edrpou: "DE4455", currency: "EUR", openingBalance: -3_100, debit: 0, credit: 3_100, closingBalance: 0, lastOperation: "05.02.2026", overdueAmount: 0, overdueDays: 0 },
];

const currencySymbol: Record<string, string> = { UAH: "₴", EUR: "€", USD: "$" };

const formatBalance = (amount: number, currency: string) => {
  const formatted = Math.abs(amount).toLocaleString("uk-UA");
  const sym = currencySymbol[currency] || currency;
  return `${amount < 0 ? "−" : ""}${formatted} ${sym}`;
};

// ── Aggregates ──
const supplierDebt = settlements
  .filter(s => s.type === "supplier" && s.closingBalance < 0)
  .reduce((sum, s) => sum + Math.abs(s.closingBalance), 0);

const buyerDebt = settlements
  .filter(s => s.type === "buyer" && s.closingBalance > 0)
  .reduce((sum, s) => sum + s.closingBalance, 0);

const overdueTotal = settlements
  .filter(s => s.overdueAmount > 0)
  .reduce((sum, s) => sum + s.overdueAmount, 0);

const overdueCount = settlements.filter(s => s.overdueAmount > 0).length;

const SettlementsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = settlements.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.edrpou.toLowerCase().includes(searchQuery.toLowerCase());
    if (tab === "suppliers") return matchesSearch && s.type === "supplier";
    if (tab === "buyers") return matchesSearch && s.type === "buyer";
    if (tab === "overdue") return matchesSearch && s.overdueAmount > 0;
    return matchesSearch;
  });

  return (
    <CrmLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Взаиморасчёты</h1>
            <p className="text-sm text-muted-foreground">
              {settlements.length} контрагентів · період: лютий 2026
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Calendar size={14} /> Період
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Download size={14} /> Експорт
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingDown size={12} className="text-destructive" /> Наш борг поставщикам
            </p>
            <p className="text-xl font-bold text-destructive">{formatBalance(-supplierDebt, "UAH")}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-success" /> Борг покупців нам
            </p>
            <p className="text-xl font-bold text-success">{formatBalance(buyerDebt, "UAH")}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <AlertTriangle size={12} className="text-warning" /> Прострочені
            </p>
            <p className="text-xl font-bold text-warning">{overdueCount} контрагентів</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <AlertTriangle size={12} className="text-destructive" /> Сума прострочених
            </p>
            <p className="text-xl font-bold text-destructive">{formatBalance(overdueTotal, "UAH")}</p>
          </div>
        </div>

        {/* Tabs + search */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="all" className="gap-1.5">
                <ArrowLeftRight size={14} /> Всі ({settlements.length})
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="gap-1.5">
                <Building2 size={14} /> Поставщики ({settlements.filter(s => s.type === "supplier").length})
              </TabsTrigger>
              <TabsTrigger value="buyers" className="gap-1.5">
                <User size={14} /> Покупці ({settlements.filter(s => s.type === "buyer").length})
              </TabsTrigger>
              <TabsTrigger value="overdue" className="gap-1.5">
                <AlertTriangle size={14} /> Прострочені ({overdueCount})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Пошук контрагента..."
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table (shared across all tabs via filtering) */}
          <TabsContent value={tab} className="mt-4" forceMount>
            <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Контрагент</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Тип</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Поч. сальдо</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Дебет</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Кредит</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Кінц. сальдо</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Прострочка</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Остання операція</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(s => {
                    const balanceColor = s.closingBalance > 0 ? "text-success" : s.closingBalance < 0 ? "text-destructive" : "text-muted-foreground";
                    return (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/contractors/${s.id}`)}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                              {s.type === "supplier" ? (
                                <Building2 size={14} className="text-primary" />
                              ) : (
                                <User size={14} className="text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-card-foreground">{s.name}</p>
                              <p className="text-[11px] text-muted-foreground">{s.city} · {s.edrpou}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="outline" className="text-[10px]">
                            {s.type === "supplier" ? "Поставщик" : "Покупець"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {formatBalance(s.openingBalance, s.currency)}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-right text-destructive font-medium whitespace-nowrap">
                          {s.debit > 0 ? formatBalance(s.debit, s.currency) : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-right text-success font-medium whitespace-nowrap">
                          {s.credit > 0 ? formatBalance(s.credit, s.currency) : "—"}
                        </td>
                        <td className={`px-5 py-3.5 text-sm text-right font-bold whitespace-nowrap ${balanceColor}`}>
                          {formatBalance(s.closingBalance, s.currency)}
                        </td>
                        <td className="px-5 py-3.5">
                          {s.overdueAmount > 0 ? (
                            <div>
                              <p className="text-xs font-medium text-destructive">{formatBalance(s.overdueAmount, s.currency)}</p>
                              <p className="text-[10px] text-muted-foreground">{s.overdueDays} днів</p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{s.lastOperation}</td>
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
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Нічого не знайдено</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CrmLayout>
  );
};

export default SettlementsPage;
