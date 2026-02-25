// ── Document workflow types & mock data ──
// Flow: Заявка клиента → Заявка поставщику → Приходная накладная → Расходная накладная → Счёт

export type DocStatus = "draft" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface DocItem {
  article: string;
  name: string;
  brand: string;
  qty: number;
  price: number;
  currency: "UAH" | "EUR" | "USD";
  total: number;
}

// ── Client Order (Заявка клиента) ──
export interface ClientOrder {
  id: string;
  number: string;
  date: string;
  client: string;
  phone: string;
  vin?: string;
  note?: string;
  items: DocItem[];
  total: number;
  currency: "UAH" | "EUR";
  status: DocStatus;
  linkedSupplierOrders: string[];
  linkedSalesInvoice?: string;
  linkedInvoice?: string;
}

// ── Supplier Order (Заявка поставщику) ──
export interface SupplierOrder {
  id: string;
  number: string;
  date: string;
  supplier: string;
  expectedDate: string;
  items: DocItem[];
  total: number;
  currency: "UAH" | "EUR";
  status: DocStatus;
  linkedClientOrder?: string;
  linkedPurchaseInvoice?: string;
}

// ── Purchase Invoice (Приходная накладная) ──
export interface PurchaseInvoice {
  id: string;
  number: string;
  date: string;
  supplier: string;
  warehouse: string;
  items: DocItem[];
  total: number;
  currency: "UAH" | "EUR";
  status: DocStatus;
  linkedSupplierOrder?: string;
}

// ── Sales Invoice (Расходная накладная) ──
export interface SalesInvoice {
  id: string;
  number: string;
  date: string;
  client: string;
  warehouse: string;
  items: DocItem[];
  total: number;
  currency: "UAH" | "EUR";
  status: DocStatus;
  linkedClientOrder?: string;
  linkedInvoice?: string;
}

// ── Invoice / Счёт ──
export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  counterparty: string;
  direction: "incoming" | "outgoing"; // incoming = от поставщика, outgoing = клиенту
  items: DocItem[];
  total: number;
  currency: "UAH" | "EUR";
  status: DocStatus;
  paid: number;
  linkedDoc?: string;
}

// ── Shared helpers ──
export const currencySymbol: Record<string, string> = { UAH: "₴", EUR: "€", USD: "$" };

export const formatAmount = (amount: number, currency: string) =>
  `${amount.toLocaleString("uk-UA")} ${currencySymbol[currency] || currency}`;

export const statusConfig: Record<DocStatus, { label: string; variant: string }> = {
  draft: { label: "Чернетка", variant: "outline" },
  confirmed: { label: "Підтверджено", variant: "secondary" },
  in_progress: { label: "В роботі", variant: "default" },
  completed: { label: "Виконано", variant: "default" },
  cancelled: { label: "Скасовано", variant: "destructive" },
};

// ── Mock items ──
const items1: DocItem[] = [
  { article: "09.C875.11", name: "Гальмівний диск передній Brembo", brand: "Brembo", qty: 2, price: 3200, currency: "UAH", total: 6400 },
  { article: "GDB1550", name: "Колодки гальмівні передні TRW", brand: "TRW", qty: 1, price: 1650, currency: "UAH", total: 1650 },
];

const items2: DocItem[] = [
  { article: "OC456", name: "Фільтр масляний Mahle", brand: "Mahle", qty: 10, price: 185, currency: "UAH", total: 1850 },
  { article: "LX1566", name: "Фільтр повітряний Mahle", brand: "Mahle", qty: 5, price: 320, currency: "UAH", total: 1600 },
];

const items3: DocItem[] = [
  { article: "23916", name: "Амортизатор передній Bilstein B4", brand: "Bilstein", qty: 2, price: 4950, currency: "UAH", total: 9900 },
];

const items4: DocItem[] = [
  { article: "600.3241.20", name: "Диск гальмівний задній Zimmermann", brand: "Zimmermann", qty: 4, price: 128, currency: "EUR", total: 512 },
];

const items5: DocItem[] = [
  { article: "K035606", name: "Ремінь ГРМ Gates", brand: "Gates", qty: 3, price: 5800, currency: "UAH", total: 17400 },
  { article: "VKBA3660", name: "Підшипник маточини SKF", brand: "SKF", qty: 2, price: 2050, currency: "UAH", total: 4100 },
];

// ── Client Orders ──
export const clientOrders: ClientOrder[] = [
  { id: "co-1", number: "ЗК-2026-0047", date: "19.02.2026", client: "Коваленко Олег", phone: "+380 67 123 4567", vin: "WVWZZZ3CZWE123456", items: items1, total: 8050, currency: "UAH", status: "in_progress", linkedSupplierOrders: ["so-1"], linkedSalesInvoice: "si-1", linkedInvoice: "inv-3" },
  { id: "co-2", number: "ЗК-2026-0046", date: "18.02.2026", client: "Бондаренко Дмитро", phone: "+380 93 555 1234", items: items3, total: 9900, currency: "UAH", status: "confirmed", linkedSupplierOrders: ["so-3"], note: "Терміново, клієнт чекає" },
  { id: "co-3", number: "ЗК-2026-0045", date: "17.02.2026", client: "Мельник Тарас", phone: "+380 97 111 2233", items: items5, total: 21500, currency: "UAH", status: "completed", linkedSupplierOrders: ["so-2"], linkedSalesInvoice: "si-2", linkedInvoice: "inv-4" },
  { id: "co-4", number: "ЗК-2026-0044", date: "16.02.2026", client: "Петренко Ірина", phone: "+380 50 987 6543", vin: "WAUZZZ8K0BA098765", items: items4, total: 512, currency: "EUR", status: "draft", linkedSupplierOrders: [] },
  { id: "co-5", number: "ЗК-2026-0043", date: "15.02.2026", client: "Шевченко Андрій", phone: "+380 66 222 3344", items: items2, total: 3450, currency: "UAH", status: "completed", linkedSupplierOrders: [], linkedSalesInvoice: "si-3", linkedInvoice: "inv-5" },
];

// ── Supplier Orders ──
export const supplierOrders: SupplierOrder[] = [
  { id: "so-1", number: "ЗП-2026-0031", date: "18.02.2026", supplier: "АвтоТрейд Груп ТОВ", expectedDate: "22.02.2026", items: items1.map(i => ({ ...i, price: i.price * 0.75, total: i.qty * i.price * 0.75 })), total: 6037, currency: "UAH", status: "in_progress", linkedClientOrder: "co-1", linkedPurchaseInvoice: "pi-1" },
  { id: "so-2", number: "ЗП-2026-0030", date: "16.02.2026", supplier: "EuroParts Distribution", expectedDate: "20.02.2026", items: items5.map(i => ({ ...i, price: i.price * 0.72, total: Math.round(i.qty * i.price * 0.72) })), total: 15480, currency: "UAH", status: "completed", linkedClientOrder: "co-3", linkedPurchaseInvoice: "pi-2" },
  { id: "so-3", number: "ЗП-2026-0029", date: "17.02.2026", supplier: "АвтоТрейд Груп ТОВ", expectedDate: "21.02.2026", items: items3.map(i => ({ ...i, price: 3800, total: i.qty * 3800 })), total: 7600, currency: "UAH", status: "confirmed", linkedClientOrder: "co-2" },
  { id: "so-4", number: "ЗП-2026-0028", date: "14.02.2026", supplier: "Zimmermann GmbH", expectedDate: "19.02.2026", items: items4.map(i => ({ ...i, price: 89, total: i.qty * 89 })), total: 356, currency: "EUR", status: "completed", linkedPurchaseInvoice: "pi-3" },
  { id: "so-5", number: "ЗП-2026-0027", date: "12.02.2026", supplier: "АвтоТрейд Груп ТОВ", expectedDate: "16.02.2026", items: items2.map(i => ({ ...i, price: i.price * 0.64, total: Math.round(i.qty * i.price * 0.64) })), total: 2208, currency: "UAH", status: "completed", linkedPurchaseInvoice: "pi-4" },
];

// ── Purchase Invoices ──
export const purchaseInvoices: PurchaseInvoice[] = [
  { id: "pi-1", number: "ПН-2026-0055", date: "20.02.2026", supplier: "АвтоТрейд Груп ТОВ", warehouse: "Основний склад", items: items1.map(i => ({ ...i, price: i.price * 0.75, total: i.qty * i.price * 0.75 })), total: 6037, currency: "UAH", status: "draft", linkedSupplierOrder: "so-1" },
  { id: "pi-2", number: "ПН-2026-0054", date: "19.02.2026", supplier: "EuroParts Distribution", warehouse: "Основний склад", items: items5.map(i => ({ ...i, price: i.price * 0.72, total: Math.round(i.qty * i.price * 0.72) })), total: 15480, currency: "UAH", status: "completed", linkedSupplierOrder: "so-2" },
  { id: "pi-3", number: "ПН-2026-0053", date: "19.02.2026", supplier: "Zimmermann GmbH", warehouse: "Основний склад", items: items4.map(i => ({ ...i, price: 89, total: i.qty * 89 })), total: 356, currency: "EUR", status: "completed", linkedSupplierOrder: "so-4" },
  { id: "pi-4", number: "ПН-2026-0052", date: "16.02.2026", supplier: "АвтоТрейд Груп ТОВ", warehouse: "Основний склад", items: items2.map(i => ({ ...i, price: i.price * 0.64, total: Math.round(i.qty * i.price * 0.64) })), total: 2208, currency: "UAH", status: "completed", linkedSupplierOrder: "so-5" },
];

// ── Sales Invoices ──
export const salesInvoices: SalesInvoice[] = [
  { id: "si-1", number: "РН-2026-0041", date: "20.02.2026", client: "Коваленко Олег", warehouse: "Основний склад", items: items1, total: 8050, currency: "UAH", status: "draft", linkedClientOrder: "co-1", linkedInvoice: "inv-3" },
  { id: "si-2", number: "РН-2026-0040", date: "19.02.2026", client: "Мельник Тарас", warehouse: "Основний склад", items: items5, total: 21500, currency: "UAH", status: "completed", linkedClientOrder: "co-3", linkedInvoice: "inv-4" },
  { id: "si-3", number: "РН-2026-0039", date: "18.02.2026", client: "Шевченко Андрій", warehouse: "Основний склад", items: items2, total: 3450, currency: "UAH", status: "completed", linkedClientOrder: "co-5", linkedInvoice: "inv-5" },
];

// ── Invoices ──
export const invoices: Invoice[] = [
  { id: "inv-1", number: "РАХ-2026-0018", date: "20.02.2026", dueDate: "05.03.2026", counterparty: "АвтоТрейд Груп ТОВ", direction: "incoming", items: items1.map(i => ({ ...i, price: i.price * 0.75, total: i.qty * i.price * 0.75 })), total: 6037, currency: "UAH", status: "confirmed", paid: 0, linkedDoc: "pi-1" },
  { id: "inv-2", number: "РАХ-2026-0017", date: "19.02.2026", dueDate: "04.03.2026", counterparty: "Zimmermann GmbH", direction: "incoming", items: items4.map(i => ({ ...i, price: 89, total: i.qty * 89 })), total: 356, currency: "EUR", status: "completed", paid: 356, linkedDoc: "pi-3" },
  { id: "inv-3", number: "РАХ-2026-0016", date: "20.02.2026", dueDate: "27.02.2026", counterparty: "Коваленко Олег", direction: "outgoing", items: items1, total: 8050, currency: "UAH", status: "confirmed", paid: 0, linkedDoc: "si-1" },
  { id: "inv-4", number: "РАХ-2026-0015", date: "19.02.2026", dueDate: "26.02.2026", counterparty: "Мельник Тарас", direction: "outgoing", items: items5, total: 21500, currency: "UAH", status: "completed", paid: 21500, linkedDoc: "si-2" },
  { id: "inv-5", number: "РАХ-2026-0014", date: "18.02.2026", dueDate: "25.02.2026", counterparty: "Шевченко Андрій", direction: "outgoing", items: items2, total: 3450, currency: "UAH", status: "completed", paid: 3450, linkedDoc: "si-3" },
];
