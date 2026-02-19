import CrmLayout from "@/components/CrmLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Phone, Mail } from "lucide-react";
import { useState } from "react";

const clientsData = [
  { id: 1, name: "Коваленко Олег", phone: "+380 67 123 4567", email: "kovalenko@gmail.com", orders: 12, totalSpent: "87 400 ₴", lastOrder: "19.02.2026", tags: ["VIP", "Опт"] },
  { id: 2, name: "Петренко Ірина", phone: "+380 50 987 6543", email: "petrenko@ukr.net", orders: 5, totalSpent: "23 100 ₴", lastOrder: "19.02.2026", tags: ["Розница"] },
  { id: 3, name: "Бондаренко Дмитро", phone: "+380 93 555 1234", email: "bondarenko.d@gmail.com", orders: 28, totalSpent: "214 800 ₴", lastOrder: "18.02.2026", tags: ["VIP", "СТО"] },
  { id: 4, name: "Шевченко Андрій", phone: "+380 66 222 3344", email: "shevchenko.a@i.ua", orders: 3, totalSpent: "15 600 ₴", lastOrder: "18.02.2026", tags: ["Розница"] },
  { id: 5, name: "Мельник Тарас", phone: "+380 97 111 2233", email: "melnyk.t@gmail.com", orders: 41, totalSpent: "356 200 ₴", lastOrder: "17.02.2026", tags: ["VIP", "Опт", "СТО"] },
  { id: 6, name: "Ткаченко Віталій", phone: "+380 63 444 5566", email: "tkachenko@auto.ua", orders: 7, totalSpent: "42 300 ₴", lastOrder: "17.02.2026", tags: ["СТО"] },
];

const tagColor = (tag: string) => {
  switch (tag) {
    case "VIP": return "default";
    case "Опт": return "secondary";
    case "СТО": return "outline";
    case "Розница": return "outline";
    default: return "outline";
  }
};

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = clientsData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CrmLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Клиенты</h1>
            <p className="text-sm text-muted-foreground">{clientsData.length} клиентов в базе</p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus size={16} />
            Новый клиент
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, телефону, email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="bg-card rounded-lg border border-border p-5 hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-card-foreground">{client.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone size={11} /> {client.phone}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Mail size={11} /> {client.email}
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {client.tags.map((tag) => (
                  <Badge key={tag} variant={tagColor(tag) as any} className="text-[10px] px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground">Заказов</p>
                  <p className="text-sm font-semibold text-card-foreground">{client.orders}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Всего</p>
                  <p className="text-sm font-semibold text-card-foreground">{client.totalSpent}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Посл. заказ</p>
                  <p className="text-sm font-semibold text-card-foreground">{client.lastOrder}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CrmLayout>
  );
};

export default ClientsPage;
