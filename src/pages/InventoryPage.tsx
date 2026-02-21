import CrmLayout from "@/components/CrmLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Download,
  Package,
  Warehouse,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  MoreHorizontal,
  Filter,
  AlertTriangle,
  Box,
} from "lucide-react";
import { useState } from "react";

// ── Types ──
interface Product {
  id: string;
  article: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  purchasePrice: number;
  sellPrice: number;
  currency: "UAH" | "EUR";
  stockMain: number;
  stockReserve: number;
  minStock: number;
  supplier: string;
  lastReceived: string;
}

const products: Product[] = [
  { id: "SKU-001", article: "09.C875.11", name: "Гальмівний диск передній Brembo", brand: "Brembo", category: "Гальмівна система", unit: "шт", purchasePrice: 2_450, sellPrice: 3_200, currency: "UAH", stockMain: 12, stockReserve: 4, minStock: 5, supplier: "АвтоТрейд Груп ТОВ", lastReceived: "15.02.2026" },
  { id: "SKU-002", article: "600.3241.20", name: "Диск гальмівний задній Zimmermann", brand: "Zimmermann", category: "Гальмівна система", unit: "шт", purchasePrice: 89, sellPrice: 128, currency: "EUR", stockMain: 24, stockReserve: 8, minStock: 10, supplier: "Zimmermann GmbH", lastReceived: "18.02.2026" },
  { id: "SKU-003", article: "GDB1550", name: "Колодки гальмівні передні TRW", brand: "TRW", category: "Гальмівна система", unit: "комплект", purchasePrice: 1_180, sellPrice: 1_650, currency: "UAH", stockMain: 30, stockReserve: 10, minStock: 15, supplier: "EuroParts Distribution", lastReceived: "12.02.2026" },
  { id: "SKU-004", article: "DF4764", name: "Диск гальмівний TRW передній", brand: "TRW", category: "Гальмівна система", unit: "шт", purchasePrice: 62, sellPrice: 95, currency: "EUR", stockMain: 8, stockReserve: 0, minStock: 6, supplier: "TRW Aftermarket", lastReceived: "05.02.2026" },
  { id: "SKU-005", article: "23916", name: "Амортизатор передній Bilstein B4", brand: "Bilstein", category: "Підвіска", unit: "шт", purchasePrice: 3_800, sellPrice: 4_950, currency: "UAH", stockMain: 6, stockReserve: 2, minStock: 4, supplier: "АвтоТрейд Груп ТОВ", lastReceived: "10.02.2026" },
  { id: "SKU-006", article: "1K0407366C", name: "Важіль підвіски лівий Lemförder", brand: "Lemförder", category: "Підвіска", unit: "шт", purchasePrice: 2_100, sellPrice: 2_900, currency: "UAH", stockMain: 3, stockReserve: 0, minStock: 4, supplier: "EuroParts Distribution", lastReceived: "08.02.2026" },
  { id: "SKU-007", article: "OC456", name: "Фільтр масляний Mahle", brand: "Mahle", category: "Фільтри", unit: "шт", purchasePrice: 185, sellPrice: 290, currency: "UAH", stockMain: 50, stockReserve: 20, minStock: 25, supplier: "АвтоТрейд Груп ТОВ", lastReceived: "17.02.2026" },
  { id: "SKU-008", article: "LX1566", name: "Фільтр повітряний Mahle", brand: "Mahle", category: "Фільтри", unit: "шт", purchasePrice: 320, sellPrice: 480, currency: "UAH", stockMain: 18, stockReserve: 5, minStock: 10, supplier: "АвтоТрейд Груп ТОВ", lastReceived: "17.02.2026" },
  { id: "SKU-009", article: "VKBA3660", name: "Підшипник маточини SKF", brand: "SKF", category: "Підвіска", unit: "шт", purchasePrice: 1_450, sellPrice: 2_050, currency: "UAH", stockMain: 2, stockReserve: 0, minStock: 3, supplier: "EuroParts Distribution", lastReceived: "01.02.2026" },
  { id: "SKU-010", article: "K035606", name: "Ремінь ГРМ Gates", brand: "Gates", category: "Двигун", unit: "комплект", purchasePrice: 4_200, sellPrice: 5_800, currency: "UAH", stockMain: 5, stockReserve: 2, minStock: 3, supplier: "АвтоТрейд Груп ТОВ", lastReceived: "14.02.2026" },
];

// ── Stock documents ──
type DocType = "receipt" | "shipment" | "return" | "writeoff";

interface StockDocument {
  id: string;
  date: string;
  type: DocType;
  description: string;
  items: number;
  totalAmount: number;
  currency: "UAH" | "EUR";
  warehouse: string;
  contractor?: string;
  orderId?: string;
  status: "completed" | "draft" | "cancelled";
}

const stockDocuments: StockDocument[] = [
  { id: "DOC-301", date: "19.02.2026", type: "receipt", description: "Прихід від Zimmermann GmbH — диски", items: 16, totalAmount: 1_424, currency: "EUR", warehouse: "Основний склад", contractor: "Zimmermann GmbH", status: "completed" },
  { id: "DOC-300", date: "18.02.2026", type: "shipment", description: "Відвантаження для ORD-1038", items: 4, totalAmount: 9_800, currency: "UAH", warehouse: "Основний склад", contractor: "СТО «Автомайстер»", orderId: "ORD-1038", status: "completed" },
  { id: "DOC-299", date: "17.02.2026", type: "receipt", description: "Прихід від АвтоТрейд — фільтри, колодки", items: 45, totalAmount: 28_350, currency: "UAH", warehouse: "Основний склад", contractor: "АвтоТрейд Груп ТОВ", status: "completed" },
  { id: "DOC-298", date: "17.02.2026", type: "shipment", description: "Відвантаження для ORD-1035", items: 2, totalAmount: 6_400, currency: "UAH", warehouse: "Основний склад", contractor: "Мельник Тарас (ФОП)", orderId: "ORD-1035", status: "completed" },
  { id: "DOC-297", date: "16.02.2026", type: "return", description: "Повернення від БрейкСервіс — бракований диск", items: 1, totalAmount: 3_200, currency: "UAH", warehouse: "Основний склад", contractor: "БрейкСервіс ТОВ", status: "completed" },
  { id: "DOC-296", date: "15.02.2026", type: "shipment", description: "Відвантаження для ORD-1042", items: 8, totalAmount: 18_200, currency: "UAH", warehouse: "Основний склад", contractor: "АвтоТрейд Груп ТОВ", orderId: "ORD-1042", status: "completed" },
  { id: "DOC-295", date: "14.02.2026", type: "receipt", description: "Прихід від EuroParts — підшипники, важелі", items: 12, totalAmount: 1_890, currency: "EUR", warehouse: "Основний склад", contractor: "EuroParts Distribution", status: "completed" },
  { id: "DOC-294", date: "13.02.2026", type: "writeoff", description: "Списання пошкоджених фільтрів", items: 3, totalAmount: 960, currency: "UAH", warehouse: "Резервний склад", status: "completed" },
  { id: "DOC-293", date: "12.02.2026", type: "shipment", description: "Відвантаження для ORD-1030", items: 6, totalAmount: 56_100, currency: "UAH", warehouse: "Основний склад", contractor: "CarFix Мережа", orderId: "ORD-1030", status: "completed" },
  { id: "DOC-292", date: "10.02.2026", type: "receipt", description: "Прихід від TRW — диски, колодки", items: 20, totalAmount: 2_480, currency: "EUR", warehouse: "Основний склад", contractor: "TRW Aftermarket", status: "draft" },
];

const currencySymbol: Record<string, string> = { UAH: "₴", EUR: "€", USD: "$" };

const formatBalance = (amount: number, currency: string) => {
  const formatted = amount.toLocaleString("uk-UA");
  return `${formatted} ${currencySymbol[currency] || currency}`;
};

const docTypeConfig: Record<DocType, { label: string; icon: typeof ArrowDownRight; className: string }> = {
  receipt: { label: "Прихід", icon: ArrowDownRight, className: "text-success" },
  shipment: { label: "Відвантаження", icon: ArrowUpRight, className: "text-primary" },
  return: { label: "Повернення", icon: ArrowDownRight, className: "text-warning" },
  writeoff: { label: "Списання", icon: AlertTriangle, className: "text-destructive" },
};

const docStatusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Проведено", className: "bg-success/10 text-success border-success/20" },
  draft: { label: "Чернетка", className: "bg-muted text-muted-foreground border-border" },
  cancelled: { label: "Скасовано", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

// ── Aggregates ──
const totalSKU = products.length;
const totalStock = products.reduce((s, p) => s + p.stockMain + p.stockReserve, 0);
const lowStockCount = products.filter(p => (p.stockMain + p.stockReserve) <= p.minStock).length;
const categories = [...new Set(products.map(p => p.category))];

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("products");

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = stockDocuments.filter(d =>
    d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.contractor?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (d.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <CrmLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Товари та Склад</h1>
            <p className="text-sm text-muted-foreground">
              {totalSKU} позицій · {totalStock} одиниць на складах
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Download size={14} /> Експорт
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus size={16} /> Новий товар
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Package size={12} className="text-primary" /> Артикулів
            </p>
            <p className="text-xl font-bold text-card-foreground">{totalSKU}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{categories.length} категорій</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Box size={12} className="text-primary" /> Загальний залишок
            </p>
            <p className="text-xl font-bold text-card-foreground">{totalStock} од.</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <AlertTriangle size={12} className="text-warning" /> Мінімальний залишок
            </p>
            <p className="text-xl font-bold text-warning">{lowStockCount} позицій</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <FileText size={12} className="text-primary" /> Документів за лютий
            </p>
            <p className="text-xl font-bold text-card-foreground">{stockDocuments.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="products" className="gap-1.5">
                <Package size={14} /> Номенклатура ({products.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-1.5">
                <FileText size={14} /> Документи ({stockDocuments.length})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Пошук товарів або документів..."
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Products table */}
          <TabsContent value="products" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Артикул</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Назва</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Категорія</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Закуп.</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Продаж</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Осн. склад</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Резерв</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Поставщик</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Ост. прихід</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.map(p => {
                      const totalQty = p.stockMain + p.stockReserve;
                      const isLow = totalQty <= p.minStock;
                      return (
                        <tr key={p.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-medium text-primary">{p.article}</p>
                            <p className="text-[10px] text-muted-foreground">{p.id}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm text-card-foreground">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground">{p.brand} · {p.unit}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-right text-muted-foreground whitespace-nowrap">
                            {formatBalance(p.purchasePrice, p.currency)}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-right font-medium text-card-foreground whitespace-nowrap">
                            {formatBalance(p.sellPrice, p.currency)}
                          </td>
                          <td className={`px-5 py-3.5 text-sm text-center font-semibold ${isLow ? "text-warning" : "text-card-foreground"}`}>
                            {p.stockMain}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-center text-muted-foreground">
                            {p.stockReserve}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-[160px] truncate">
                            {p.supplier}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{p.lastReceived}</td>
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
              </div>
              {filteredProducts.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Нічого не знайдено</div>
              )}
            </div>
          </TabsContent>

          {/* Documents table */}
          <TabsContent value="documents" className="mt-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Дата</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Тип</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Опис</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Склад</th>
                    <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Позицій</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сума</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Статус</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocs.map(d => {
                    const tc = docTypeConfig[d.type];
                    const Icon = tc.icon;
                    const sc = docStatusConfig[d.status];
                    return (
                      <tr key={d.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="px-5 py-3.5 text-sm text-card-foreground whitespace-nowrap">{d.date}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${tc.className}`}>
                            <Icon size={12} /> {tc.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-card-foreground max-w-[300px]">
                          <p className="truncate">{d.description}</p>
                          {d.contractor && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">{d.contractor}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{d.warehouse}</td>
                        <td className="px-5 py-3.5 text-sm text-center text-card-foreground">{d.items}</td>
                        <td className={`px-5 py-3.5 text-sm text-right font-semibold whitespace-nowrap ${tc.className}`}>
                          {formatBalance(d.totalAmount, d.currency)}
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
              {filteredDocs.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">Нічого не знайдено</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CrmLayout>
  );
};

export default InventoryPage;
