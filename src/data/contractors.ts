// Unified contractor data — both suppliers and buyers (clients)

export interface Vehicle {
  vin: string;
  make: string;
  model: string;
  year: number;
  plate?: string;
}

export interface Contractor {
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
  // CRM fields (primarily for buyers)
  source?: string;
  manager?: string;
  notes?: string;
  vehicles?: Vehicle[];
}

export const contractorsData: Contractor[] = [
  { id: 1, name: "АвтоТрейд Груп ТОВ", type: "supplier", contactPerson: "Іванов Максим", phone: "+380 44 555 1234", email: "trade@autotrade.ua", city: "Київ", edrpou: "12345678", contracts: 3, balance: "-42 300 ₴", balanceType: "negative", tags: ["Диски", "Колодки"], lastActivity: "19.02.2026", manager: "Адмін" },
  { id: 2, name: "Zimmermann GmbH", type: "supplier", contactPerson: "Hans Mueller", phone: "+49 611 123 456", email: "orders@zimmermann.de", city: "Wiesbaden", edrpou: "DE123456", contracts: 1, balance: "-128 500 €", balanceType: "negative", tags: ["Основной"], lastActivity: "18.02.2026", manager: "Адмін" },
  { id: 3, name: "БрейкСервіс ТОВ", type: "supplier", contactPerson: "Кравчук Олена", phone: "+380 57 333 4455", email: "info@brakeservice.ua", city: "Харків", edrpou: "87654321", contracts: 2, balance: "0 ₴", balanceType: "zero", tags: ["Суппорты"], lastActivity: "15.02.2026" },
  { id: 4, name: "EuroParts Distribution", type: "supplier", contactPerson: "Jakub Nowak", phone: "+48 22 555 6677", email: "supply@europarts.pl", city: "Warszawa", edrpou: "PL987654", contracts: 1, balance: "-15 200 €", balanceType: "negative", tags: ["Колодки", "Барабаны"], lastActivity: "12.02.2026" },
  {
    id: 5, name: "СТО «Автомайстер»", type: "buyer", contactPerson: "Бондаренко Дмитро", phone: "+380 93 555 1234", email: "sto@automaster.ua", city: "Київ", edrpou: "11223344", contracts: 1, balance: "+24 800 ₴", balanceType: "positive", tags: ["СТО", "Опт"], lastActivity: "18.02.2026",
    source: "Рекомендація", manager: "Олена К.", notes: "Постійний клієнт, замовляє гальмівні системи оптом",
    vehicles: [
      { vin: "WVWZZZ3CZWE123456", make: "Volkswagen", model: "Passat B8", year: 2021, plate: "АА 1234 ВВ" },
      { vin: "WBAPH5C55BA123789", make: "BMW", model: "520d F10", year: 2019, plate: "АА 5678 СС" },
    ],
  },
  {
    id: 6, name: "Мельник Тарас (ФОП)", type: "buyer", contactPerson: "Мельник Тарас", phone: "+380 97 111 2233", email: "melnyk.t@gmail.com", city: "Львів", edrpou: "1234567890", contracts: 0, balance: "+31 200 ₴", balanceType: "positive", tags: ["VIP", "Опт"], lastActivity: "17.02.2026",
    source: "Instagram", manager: "Максим І.", notes: "VIP клієнт, великі обсяги. Працює з преміум брендами.",
    vehicles: [
      { vin: "WAUZZZ8K0BA098765", make: "Audi", model: "A4 B9", year: 2022, plate: "ВС 9012 АА" },
    ],
  },
  {
    id: 7, name: "АвтоХаус Дніпро", type: "buyer", contactPerson: "Ткаченко Віталій", phone: "+380 56 777 8899", email: "autohaus@dn.ua", city: "Дніпро", edrpou: "55667788", contracts: 2, balance: "0 ₴", balanceType: "zero", tags: ["СТО"], lastActivity: "16.02.2026",
    source: "Google Ads", manager: "Олена К.",
    vehicles: [
      { vin: "TMBJJ7NE1G0123456", make: "Skoda", model: "Octavia A7", year: 2020 },
    ],
  },
  {
    id: 8, name: "РемЗона ТОВ", type: "buyer", contactPerson: "Литвиненко Сергій", phone: "+380 48 222 3344", email: "remzona@od.ua", city: "Одеса", edrpou: "99887766", contracts: 1, balance: "+8 400 ₴", balanceType: "positive", tags: ["Розница"], lastActivity: "14.02.2026",
    source: "Виставка AutoExpo 2025", manager: "Максим І.",
  },
  { id: 9, name: "PartsPro Ukraine", type: "supplier", contactPerson: "Степаненко Роман", phone: "+380 44 888 9900", email: "rom@partspro.ua", city: "Київ", edrpou: "33445566", contracts: 2, balance: "-7 600 ₴", balanceType: "negative", tags: ["Диски", "Суппорты"], lastActivity: "10.02.2026" },
  {
    id: 10, name: "CarFix Мережа", type: "buyer", contactPerson: "Козлова Анна", phone: "+380 67 444 5566", email: "anna@carfix.ua", city: "Запоріжжя", edrpou: "77889900", contracts: 1, balance: "+56 100 ₴", balanceType: "positive", tags: ["СТО", "Опт", "VIP"], lastActivity: "13.02.2026",
    source: "Холодний дзвінок", manager: "Олена К.", notes: "Мережа СТО, 5 точок. Потенціал для росту.",
    vehicles: [
      { vin: "WF0XXXGCDX1234567", make: "Ford", model: "Focus MK3", year: 2018, plate: "АР 3456 ЕЕ" },
      { vin: "WMEEJ3BA4DK654321", make: "Smart", model: "ForTwo", year: 2020 },
    ],
  },
];

export const balanceClass = (type: string) => {
  if (type === "positive") return "text-success";
  if (type === "negative") return "text-destructive";
  return "text-muted-foreground";
};

// Mock order history
export interface ContractorOrder {
  id: string;
  date: string;
  items: number;
  total: string;
  status: "completed" | "pending" | "shipped" | "cancelled";
}

export const getOrdersForContractor = (id: number): ContractorOrder[] => {
  const orderSets: Record<number, ContractorOrder[]> = {
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
export interface Settlement {
  id: string;
  date: string;
  type: "income" | "expense";
  description: string;
  amount: string;
  document: string;
}

export const getSettlementsForContractor = (id: number): Settlement[] => {
  const isSupplier = contractorsData.find(c => c.id === id)?.type === "supplier";
  if (isSupplier) {
    return [
      { id: "SET-301", date: "19.02.2026", type: "expense", description: "Оплата по накладній №1042", amount: "18 200 ₴", document: "Платіжка №301" },
      { id: "SET-287", date: "14.02.2026", type: "expense", description: "Часткова оплата замовлення ORD-1028", amount: "20 000 ₴", document: "Платіжка №287" },
      { id: "SET-265", date: "01.02.2026", type: "expense", description: "Оплата замовлення ORD-0997", amount: "7 800 ₴", document: "Платіжка №265" },
      { id: "SET-250", date: "20.01.2026", type: "income", description: "Повернення за брак (2 позиції)", amount: "3 700 ₴", document: "Повернення №12" },
    ];
  }
  return [
    { id: "SET-310", date: "18.02.2026", type: "income", description: "Часткова оплата замовлення", amount: "15 000 ₴", document: "Прихід №310" },
    { id: "SET-295", date: "10.02.2026", type: "income", description: "Оплата попереднього замовлення", amount: "12 400 ₴", document: "Прихід №295" },
    { id: "SET-280", date: "28.01.2026", type: "expense", description: "Повернення коштів за товар", amount: "2 200 ₴", document: "Витрата №45" },
  ];
};
