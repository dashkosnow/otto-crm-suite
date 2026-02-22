import { useState } from "react";
import CrmLayout from "@/components/CrmLayout";
import KpiCard from "@/components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import {
  TrendingUp, DollarSign, Package, Wallet,
  Download, FileSpreadsheet, BarChart3,
} from "lucide-react";
import * as XLSX from "xlsx";

// --- Mock Data ---

const monthlySales = [
  { month: "Січ", revenue: 820000, orders: 124, profit: 164000 },
  { month: "Лют", revenue: 950000, orders: 142, profit: 190000 },
  { month: "Бер", revenue: 1120000, orders: 168, profit: 224000 },
  { month: "Кві", revenue: 980000, orders: 147, profit: 196000 },
  { month: "Тра", revenue: 1250000, orders: 188, profit: 250000 },
  { month: "Чер", revenue: 1180000, orders: 177, profit: 236000 },
  { month: "Лип", revenue: 1340000, orders: 201, profit: 268000 },
  { month: "Сер", revenue: 1420000, orders: 213, profit: 284000 },
  { month: "Вер", revenue: 1560000, orders: 234, profit: 312000 },
  { month: "Жов", revenue: 1380000, orders: 207, profit: 276000 },
  { month: "Лис", revenue: 1490000, orders: 224, profit: 298000 },
  { month: "Гру", revenue: 1680000, orders: 252, profit: 336000 },
];

const cashFlowData = [
  { month: "Січ", income: 780000, expense: 620000 },
  { month: "Лют", income: 910000, expense: 705000 },
  { month: "Бер", income: 1050000, expense: 830000 },
  { month: "Кві", income: 940000, expense: 760000 },
  { month: "Тра", income: 1200000, expense: 920000 },
  { month: "Чер", income: 1130000, expense: 880000 },
  { month: "Лип", income: 1290000, expense: 1010000 },
  { month: "Сер", income: 1370000, expense: 1050000 },
  { month: "Вер", income: 1510000, expense: 1180000 },
  { month: "Жов", income: 1340000, expense: 1060000 },
  { month: "Лис", income: 1450000, expense: 1120000 },
  { month: "Гру", income: 1620000, expense: 1250000 },
];

const warehouseData = [
  { name: "Основний", value: 4250000, items: 1840 },
  { name: "Резервний", value: 1820000, items: 620 },
  { name: "Транзит", value: 680000, items: 180 },
  { name: "Брак", value: 95000, items: 45 },
];

const topProducts = [
  { name: "Фільтр масляний OE 688", qty: 342, revenue: 478800 },
  { name: "Колодки гальмівні TRW", qty: 285, revenue: 541500 },
  { name: "Амортизатор KYB Excel-G", qty: 198, revenue: 693000 },
  { name: "Ремінь ГРМ Gates", qty: 176, revenue: 316800 },
  { name: "Свічки NGK Iridium", qty: 420, revenue: 252000 },
  { name: "Радіатор NRF", qty: 87, revenue: 435000 },
  { name: "Підшипник SKF", qty: 264, revenue: 290400 },
  { name: "Стійка стабілізатора", qty: 312, revenue: 187200 },
];

const categoryBreakdown = [
  { name: "Фільтри", value: 28 },
  { name: "Гальма", value: 22 },
  { name: "Підвіска", value: 18 },
  { name: "Двигун", value: 15 },
  { name: "Електрика", value: 10 },
  { name: "Інше", value: 7 },
];

const PIE_COLORS = [
  "hsl(217, 71%, 25%)",
  "hsl(38, 92%, 55%)",
  "hsl(152, 60%, 40%)",
  "hsl(0, 72%, 51%)",
  "hsl(220, 10%, 50%)",
  "hsl(217, 71%, 45%)",
];

// --- Chart Configs ---

const salesChartConfig: ChartConfig = {
  revenue: { label: "Виручка", color: "hsl(217, 71%, 25%)" },
  profit: { label: "Прибуток", color: "hsl(152, 60%, 40%)" },
};

const cashChartConfig: ChartConfig = {
  income: { label: "Надходження", color: "hsl(152, 60%, 40%)" },
  expense: { label: "Витрати", color: "hsl(0, 72%, 51%)" },
};

const ordersChartConfig: ChartConfig = {
  orders: { label: "Замовлення", color: "hsl(38, 92%, 55%)" },
};

// --- Helpers ---

const fmt = (n: number) =>
  new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 0 }).format(n) + " ₴";

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "М";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "К";
  return String(n);
};

// --- Export ---

function exportToExcel(sheetName: string, data: Record<string, unknown>[]) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${sheetName}.xlsx`);
}

// --- Component ---

const ReportsPage = () => {
  const [period, setPeriod] = useState("year");

  const totalRevenue = monthlySales.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = monthlySales.reduce((s, m) => s + m.profit, 0);
  const totalOrders = monthlySales.reduce((s, m) => s + m.orders, 0);
  const totalStock = warehouseData.reduce((s, w) => s + w.value, 0);

  return (
    <CrmLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Звіти</h1>
            <p className="text-sm text-muted-foreground">
              Продажі, каси, склади, взаєморозрахунки
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Поточний місяць</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="year">Рік</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Виручка"
            value={fmt(totalRevenue)}
            change="+18.4% до попереднього"
            changeType="positive"
            icon={DollarSign}
          />
          <KpiCard
            title="Прибуток"
            value={fmt(totalProfit)}
            change="+21.2% до попереднього"
            changeType="positive"
            icon={TrendingUp}
          />
          <KpiCard
            title="Замовлення"
            value={totalOrders.toLocaleString("uk-UA")}
            change="+15.6% до попереднього"
            changeType="positive"
            icon={Package}
          />
          <KpiCard
            title="Залишки на складах"
            value={fmt(totalStock)}
            subtitle={`${warehouseData.reduce((s, w) => s + w.items, 0)} позицій`}
            icon={Wallet}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Продажі</TabsTrigger>
            <TabsTrigger value="cashflow">Каси</TabsTrigger>
            <TabsTrigger value="warehouse">Склади</TabsTrigger>
          </TabsList>

          {/* ===== SALES TAB ===== */}
          <TabsContent value="sales" className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportToExcel("Продажі", monthlySales.map((m) => ({
                    Місяць: m.month,
                    Виручка: m.revenue,
                    Прибуток: m.profit,
                    Замовлення: m.orders,
                  })))
                }
              >
                <FileSpreadsheet size={16} />
                Експорт в Excel
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue & Profit */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Виручка та прибуток</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
                    <AreaChart data={monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis tickFormatter={fmtShort} className="text-xs" />
                      <ChartTooltip
                        content={<ChartTooltipContent formatter={(v) => fmt(v as number)} />}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stackId="1"
                        stroke="var(--color-revenue)"
                        fill="var(--color-revenue)"
                        fillOpacity={0.15}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stackId="2"
                        stroke="var(--color-profit)"
                        fill="var(--color-profit)"
                        fillOpacity={0.25}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Orders */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Замовлення по місяцях</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={ordersChartConfig} className="h-[300px] w-full">
                    <BarChart data={monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Топ товарів</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    exportToExcel("Топ товарів", topProducts.map((p) => ({
                      Назва: p.name,
                      Кількість: p.qty,
                      Виручка: p.revenue,
                    })))
                  }
                >
                  <Download size={14} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5 text-right">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.qty} шт</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{fmt(p.revenue)}</p>
                      </div>
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(p.revenue / topProducts[0].revenue) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== CASHFLOW TAB ===== */}
          <TabsContent value="cashflow" className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportToExcel("Каси", cashFlowData.map((m) => ({
                    Місяць: m.month,
                    Надходження: m.income,
                    Витрати: m.expense,
                    Сальдо: m.income - m.expense,
                  })))
                }
              >
                <FileSpreadsheet size={16} />
                Експорт в Excel
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Грошовий потік</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={cashChartConfig} className="h-[350px] w-full">
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis tickFormatter={fmtShort} className="text-xs" />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(v) => fmt(v as number)} />}
                    />
                    <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Balance line */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Сальдо по місяцях</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ balance: { label: "Сальдо", color: "hsl(217, 71%, 25%)" } }} className="h-[250px] w-full">
                  <LineChart data={cashFlowData.map((m) => ({ month: m.month, balance: m.income - m.expense }))}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis tickFormatter={fmtShort} className="text-xs" />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(v) => fmt(v as number)} />}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="var(--color-balance)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== WAREHOUSE TAB ===== */}
          <TabsContent value="warehouse" className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportToExcel("Склади", warehouseData.map((w) => ({
                    Склад: w.name,
                    Сума: w.value,
                    Позицій: w.items,
                  })))
                }
              >
                <FileSpreadsheet size={16} />
                Експорт в Excel
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Warehouse breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Залишки по складах</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={warehouseData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={55}
                          paddingAngle={3}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {warehouseData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={<ChartTooltipContent formatter={(v) => fmt(v as number)} />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Структура по категоріях</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryBreakdown.map((cat, i) => (
                      <div key={cat.name} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="text-sm flex-1">{cat.name}</span>
                        <span className="text-sm font-semibold">{cat.value}%</span>
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${cat.value}%`,
                              backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Warehouse cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {warehouseData.map((w) => (
                <Card key={w.name}>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">{w.name}</p>
                    <p className="text-xl font-bold mt-1">{fmt(w.value)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {w.items} позицій
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CrmLayout>
  );
};

export default ReportsPage;
