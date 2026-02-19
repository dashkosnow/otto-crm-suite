import CrmLayout from "@/components/CrmLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const ordersData = [
  { id: "OZ-2024-1847", client: "Коваленко Олег", phone: "+380 67 123 4567", date: "19.02.2026", items: 3, sum: "12 450 ₴", status: "Новый" },
  { id: "OZ-2024-1846", client: "Петренко Ірина", phone: "+380 50 987 6543", date: "19.02.2026", items: 1, sum: "8 230 ₴", status: "В обработке" },
  { id: "OZ-2024-1845", client: "Бондаренко Дмитро", phone: "+380 93 555 1234", date: "18.02.2026", items: 5, sum: "24 800 ₴", status: "Отправлен" },
  { id: "OZ-2024-1844", client: "Шевченко Андрій", phone: "+380 66 222 3344", date: "18.02.2026", items: 2, sum: "5 100 ₴", status: "Выполнен" },
  { id: "OZ-2024-1843", client: "Мельник Тарас", phone: "+380 97 111 2233", date: "17.02.2026", items: 8, sum: "31 200 ₴", status: "Ожидает оплату" },
  { id: "OZ-2024-1842", client: "Ткаченко Віталій", phone: "+380 63 444 5566", date: "17.02.2026", items: 2, sum: "6 750 ₴", status: "Выполнен" },
  { id: "OZ-2024-1841", client: "Кравченко Наталія", phone: "+380 68 777 8899", date: "16.02.2026", items: 4, sum: "18 900 ₴", status: "Отправлен" },
  { id: "OZ-2024-1840", client: "Литвиненко Сергій", phone: "+380 95 333 4455", date: "16.02.2026", items: 1, sum: "3 200 ₴", status: "Новый" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Новый": return "outline";
    case "В обработке": return "secondary";
    case "Отправлен": return "default";
    case "Выполнен": return "default";
    case "Ожидает оплату": return "destructive";
    default: return "outline";
  }
};

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ordersData.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CrmLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Заказы</h1>
            <p className="text-sm text-muted-foreground">{ordersData.length} заказов</p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus size={16} />
            Новый заказ
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по номеру или клиенту..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter size={14} />
            Фильтры
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Номер</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Клиент</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Телефон</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Дата</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Позиции</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Сумма</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Статус</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 text-sm font-medium text-primary">{order.id}</td>
                  <td className="px-5 py-3.5 text-sm text-card-foreground">{order.client}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{order.phone}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-5 py-3.5 text-sm text-center text-card-foreground">{order.items}</td>
                  <td className="px-5 py-3.5 text-sm text-right font-medium text-card-foreground">{order.sum}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusColor(order.status) as any} className="text-xs">{order.status}</Badge>
                  </td>
                  <td className="px-3 py-3.5">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CrmLayout>
  );
};

export default OrdersPage;
