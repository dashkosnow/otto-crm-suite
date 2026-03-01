import CrmLayout from "@/components/CrmLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MoreHorizontal, Phone, Mail, Building2, User, FileText, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractorsData, Contractor, balanceClass } from "@/data/contractors";

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
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Контактна особа</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Місто</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">ЄДРПОУ</th>
            <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Договори</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Баланс</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Теги</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Активність</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/contractors/${c.id}`)}>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    {c.type === "supplier" ? <Building2 size={14} className="text-primary" /> : <User size={14} className="text-primary" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{c.name}</p>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Phone size={9} /> {c.phone}
                    </span>
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
                    <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{c.lastActivity}</td>
              <td className="px-3 py-3.5">
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground"><p className="text-sm">Нічого не знайдено</p></div>
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

  return (
    <CrmLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Контрагенти</h1>
            <p className="text-sm text-muted-foreground">
              {contractorsData.length} контрагентів · {suppliers.length} постачальників · {buyers.length} покупців
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus size={16} />
            Додати контрагента
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="all">Всі ({contractorsData.length})</TabsTrigger>
              <TabsTrigger value="suppliers">Постачальники ({suppliers.length})</TabsTrigger>
              <TabsTrigger value="buyers">Покупці ({buyers.length})</TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Пошук по назві, місту, ЄДРПОУ..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <TabsContent value="all" className="mt-4"><ContractorTable data={contractorsData} searchQuery={searchQuery} /></TabsContent>
          <TabsContent value="suppliers" className="mt-4"><ContractorTable data={suppliers} searchQuery={searchQuery} /></TabsContent>
          <TabsContent value="buyers" className="mt-4"><ContractorTable data={buyers} searchQuery={searchQuery} /></TabsContent>
        </Tabs>
      </div>
    </CrmLayout>
  );
};

export default ContractorsPage;
