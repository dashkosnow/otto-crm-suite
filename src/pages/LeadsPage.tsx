import CrmLayout from "@/components/CrmLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Phone, Mail, Building2, User, Calendar, DollarSign,
  MessageSquare, ArrowRight, UserPlus, MoreHorizontal, Zap,
} from "lucide-react";
import { useState } from "react";
import { leadsData, leadStages, Lead, LeadStage } from "@/data/leads";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>(leadsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const activeStages = leadStages.filter(s => s.key !== "won" && s.key !== "lost");
  const closedStages = leadStages.filter(s => s.key === "won" || s.key === "lost");

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery)
  );

  const getLeadsByStage = (stage: LeadStage) =>
    filteredLeads.filter((l) => l.stage === stage);

  const moveLeadToStage = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage, updatedAt: "01.03.2026" } : l))
    );
    const lead = leads.find((l) => l.id === leadId);
    const stageLabel = leadStages.find((s) => s.key === newStage)?.label;
    if (newStage === "won") {
      toast.success(`${lead?.name} — Угода!`, { description: "Лід конвертовано. Створіть клієнта та замовлення." });
    } else {
      toast.info(`${lead?.name} → ${stageLabel}`);
    }
  };

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (stage: LeadStage) => {
    if (draggedId) {
      moveLeadToStage(draggedId, stage);
      setDraggedId(null);
    }
  };

  const totalAmount = leads.filter(l => l.stage !== "lost").reduce((sum, l) => sum + (l.amount || 0), 0);
  const wonAmount = leads.filter(l => l.stage === "won").reduce((sum, l) => sum + (l.amount || 0), 0);

  return (
    <CrmLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Воронка лідів</h1>
            <p className="text-sm text-muted-foreground">
              {leads.length} лідів · Потенціал {totalAmount.toLocaleString("uk-UA")} ₴ · Виграно {wonAmount.toLocaleString("uk-UA")} ₴
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus size={16} />
            Новий лід
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Пошук лідів..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Kanban board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {activeStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key);
            const stageTotal = stageLeads.reduce((s, l) => s + (l.amount || 0), 0);
            return (
              <div
                key={stage.key}
                className="min-w-[280px] w-[280px] shrink-0"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${stage.color}`}>
                      {stage.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {stageTotal > 0 ? `${stageTotal.toLocaleString("uk-UA")} ₴` : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onDragStart={() => handleDragStart(lead.id)}
                      onMoveToStage={(s) => moveLeadToStage(lead.id, s)}
                    />
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      Перетягніть лід сюди
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Closed leads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {closedStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key);
            return (
              <div
                key={stage.key}
                className="bg-card rounded-lg border border-border p-4"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`text-xs ${stage.color}`}>
                    {stage.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                </div>
                {stageLeads.length > 0 ? (
                  <div className="space-y-2">
                    {stageLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{lead.name}</p>
                          {lead.company && <p className="text-xs text-muted-foreground">{lead.company}</p>}
                        </div>
                        <div className="text-right">
                          {lead.amount && <p className="text-sm font-semibold text-card-foreground">{lead.amount.toLocaleString("uk-UA")} ₴</p>}
                          <p className="text-[10px] text-muted-foreground">{lead.updatedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Немає лідів</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CrmLayout>
  );
};

const LeadCard = ({
  lead,
  onDragStart,
  onMoveToStage,
}: {
  lead: Lead;
  onDragStart: () => void;
  onMoveToStage: (stage: LeadStage) => void;
}) => {
  const nextStages = leadStages.filter(s => s.key !== lead.stage);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-card rounded-lg border border-border p-3.5 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing animate-fade-in"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{lead.name}</p>
          {lead.company && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2 size={10} /> {lead.company}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {nextStages.map((s) => (
              <DropdownMenuItem key={s.key} onClick={() => onMoveToStage(s.key)} className="text-xs">
                <ArrowRight size={12} className="mr-2" /> {s.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="text-xs" onClick={() => onMoveToStage("won")}>
              <UserPlus size={12} className="mr-2" /> Конвертувати в клієнта
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Phone size={10} /> {lead.phone}
        </p>
        {lead.email && (
          <p className="flex items-center gap-1.5">
            <Mail size={10} /> {lead.email}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            <Zap size={8} className="mr-0.5" /> {lead.source}
          </Badge>
        </div>
        {lead.amount && (
          <span className="text-xs font-semibold text-card-foreground">
            {lead.amount.toLocaleString("uk-UA")} ₴
          </span>
        )}
      </div>

      {lead.note && (
        <p className="text-[11px] text-muted-foreground mt-2 flex items-start gap-1">
          <MessageSquare size={10} className="shrink-0 mt-0.5" /> {lead.note}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <User size={9} /> {lead.manager}
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Calendar size={9} /> {lead.updatedAt}
        </span>
      </div>
    </div>
  );
};

export default LeadsPage;
