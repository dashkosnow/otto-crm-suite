import CrmLayout from "@/components/CrmLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MoreHorizontal, Phone, Mail, Building2, User, FileText, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const balanceClass = (type: string) => {
  if (type === "positive") return "text-success";
  if (type === "negative") return "text-destructive";
  return "text-muted-foreground";
};

const ContractorTable = ({ data, searchQuery }: { data: Contractor[]; searchQuery: string }) => {
  const navigate = useNavigate();
  const filtered = data.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.edrpou.includes(searchQuery)
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Контрагент</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Контактное лицо</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Город</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">ЄДРПОУ</th>
            <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Договоры</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Баланс</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Теги</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Активность</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/contractors/${c.id}`)}>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    {c.type === "supplier" ? (
                      <Building2 size={14} className="text-primary" />
                    ) : (
                      <User size={14} className="text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{c.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Phone size={9} /> {c.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm text-card-foreground">{c.contactPerson}</td>
              <td className="px-5 py-3.5">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin size={12} /> {c.city}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm font-mono text-muted-foreground">{c.edrpou}</td>
              <td className="px-5 py-3.5 text-sm text-center text-card-foreground">
                {c.contracts > 0 ? (
                  <span className="flex items-center justify-center gap-1">
                    <FileText size={12} className="text-muted-foreground" /> {c.contracts}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className={`px-5 py-3.5 text-sm text-right font-semibold ${balanceClass(c.balanceType)}`}>
                {c.balance}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{c.lastActivity}</td>
              <td className="px-3 py-3.5">
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
};

const ContractorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");

  const suppliers = contractorsData.filter((c) => c.type === "supplier");
  const buyers = contractorsData.filter((c) => c.type === "buyer");
  const currentData = tab === "suppliers" ? suppliers : tab === "buyers" ? buyers : contractorsData;

  const totalDebt = "193 600 ₴";
  const totalReceivable = "120 500 ₴";

  return (
    <CrmLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Контрагенты</h1>
            <p className="text-sm text-muted-foreground">
              {contractorsData.length} контрагентов · {suppliers.length} поставщиков · {buyers.length} покупателей
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus size={16} />
            Добавить контрагента
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1">Всего контрагентов</p>
            <p className="text-xl font-bold text-card-foreground">{contractorsData.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1">Наш долг поставщикам</p>
            <p className="text-xl font-bold text-destructive">{totalDebt}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1">Долг покупателей нам</p>
            <p className="text-xl font-bold text-success">{totalReceivable}</p>
          </div>
        </div>

        {/* Tabs + Search */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="all">Все ({contractorsData.length})</TabsTrigger>
              <TabsTrigger value="suppliers">Поставщики ({suppliers.length})</TabsTrigger>
              <TabsTrigger value="buyers">Покупатели ({buyers.length})</TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, городу, ЄДРПОУ..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <ContractorTable data={contractorsData} searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="suppliers" className="mt-4">
            <ContractorTable data={suppliers} searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="buyers" className="mt-4">
            <ContractorTable data={buyers} searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </CrmLayout>
  );
};

export default ContractorsPage;
