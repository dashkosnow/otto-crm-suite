// CRM Leads pipeline

export type LeadStage = "new" | "contact" | "negotiation" | "proposal" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  source: string;
  stage: LeadStage;
  manager: string;
  amount?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const leadStages: { key: LeadStage; label: string; color: string }[] = [
  { key: "new", label: "Нові", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { key: "contact", label: "Контакт", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { key: "negotiation", label: "Переговори", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { key: "proposal", label: "Пропозиція", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { key: "won", label: "Угода", color: "bg-success/10 text-success border-success/20" },
  { key: "lost", label: "Відмова", color: "bg-destructive/10 text-destructive border-destructive/20" },
];

export const leadsData: Lead[] = [
  { id: "lead-1", name: "Гнатюк Олексій", company: "СТО «Мотор+»", phone: "+380 67 999 1122", email: "gnatyuk@motor.ua", source: "Google Ads", stage: "new", manager: "Олена К.", amount: 45000, note: "Цікавиться гальмівними дисками Brembo", createdAt: "28.02.2026", updatedAt: "28.02.2026" },
  { id: "lead-2", name: "Федоренко Ігор", phone: "+380 50 333 4455", source: "Instagram", stage: "new", manager: "Максим І.", amount: 12000, createdAt: "27.02.2026", updatedAt: "27.02.2026" },
  { id: "lead-3", name: "Кравченко Марія", company: "АвтоМарія ФОП", phone: "+380 93 777 8899", email: "maria@autoparts.ua", source: "Рекомендація", stage: "contact", manager: "Олена К.", amount: 78000, note: "Потрібні фільтри Mahle та Gates оптом", createdAt: "25.02.2026", updatedAt: "28.02.2026" },
  { id: "lead-4", name: "Савченко Роман", company: "CarService Lviv", phone: "+380 63 111 2233", source: "Виставка", stage: "contact", manager: "Максим І.", amount: 120000, createdAt: "24.02.2026", updatedAt: "27.02.2026" },
  { id: "lead-5", name: "Полтавський Денис", company: "ТОВ «Дніпро-Авто»", phone: "+380 56 444 5566", email: "poltavsky@dniproauto.ua", source: "Холодний дзвінок", stage: "negotiation", manager: "Олена К.", amount: 250000, note: "Мережа 3 СТО, великий потенціал", createdAt: "20.02.2026", updatedAt: "28.02.2026" },
  { id: "lead-6", name: "Івасюк Тарас", phone: "+380 97 222 3344", source: "Сайт", stage: "negotiation", manager: "Максим І.", amount: 35000, createdAt: "22.02.2026", updatedAt: "26.02.2026" },
  { id: "lead-7", name: "Остапенко Віктор", company: "Garage Pro", phone: "+380 66 888 9900", email: "ostapenko@garagepro.ua", source: "Google Ads", stage: "proposal", manager: "Олена К.", amount: 95000, note: "Надіслано КП на Bilstein + Brembo", createdAt: "18.02.2026", updatedAt: "27.02.2026" },
  { id: "lead-8", name: "Харченко Юлія", company: "СТО «Формула»", phone: "+380 44 555 6677", source: "Рекомендація", stage: "won", manager: "Максим І.", amount: 67000, note: "Конвертовано в клієнта, перше замовлення оформлено", createdAt: "15.02.2026", updatedAt: "25.02.2026" },
  { id: "lead-9", name: "Мороз Андрій", phone: "+380 50 111 0022", source: "Instagram", stage: "lost", manager: "Олена К.", amount: 18000, note: "Обрав іншого постачальника — ціна", createdAt: "10.02.2026", updatedAt: "20.02.2026" },
];
