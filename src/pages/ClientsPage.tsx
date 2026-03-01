import CrmLayout from "@/components/CrmLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Phone, Mail, MapPin, Building2, User, Car } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractorsData } from "@/data/contractors";

const buyers = contractorsData.filter((c) => c.type === "buyer");

const tagColor = (tag: string) => {
  switch (tag) {
    case "VIP": return "default";
    case "Опт": return "secondary";
    default: return "outline";
  }
};

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filtered = buyers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CrmLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Клієнти</h1>
            <p className="text-sm text-muted-foreground">
              {buyers.length} клієнтів · Це покупці з довідника контрагентів
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus size={16} />
            Новий клієнт
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Пошук по імені, телефону, email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate(`/contractors/${client.id}`)}
              className="bg-card rounded-lg border border-border p-5 hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-card-foreground">{client.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{client.contactPerson}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone size={11} /> {client.phone}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Mail size={11} /> {client.email}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin size={11} /> {client.city}
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
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

              {client.vehicles && client.vehicles.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Car size={11} />
                  <span>{client.vehicles.map(v => `${v.make} ${v.model}`).join(", ")}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground">Баланс</p>
                  <p className={`text-sm font-semibold ${client.balanceType === "positive" ? "text-success" : client.balanceType === "negative" ? "text-destructive" : "text-muted-foreground"}`}>
                    {client.balance}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Джерело</p>
                  <p className="text-sm font-semibold text-card-foreground">{client.source || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Менеджер</p>
                  <p className="text-sm font-semibold text-card-foreground">{client.manager || "—"}</p>
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
