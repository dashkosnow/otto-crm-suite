import { Lead, leadStages, LeadStage } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, FunnelChart, Funnel, LabelList } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, TrendingDown, Users } from "lucide-react";

interface Props {
  leads: Lead[];
}

const stageOrder: LeadStage[] = ["new", "contact", "negotiation", "proposal", "won", "lost"];

const FUNNEL_COLORS = [
  "hsl(217, 71%, 45%)",
  "hsl(38, 92%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(190, 70%, 45%)",
  "hsl(152, 60%, 40%)",
  "hsl(0, 72%, 51%)",
];

// Mock avg days per stage
const avgDaysOnStage: Record<LeadStage, number> = {
  new: 2.1,
  contact: 3.5,
  negotiation: 5.2,
  proposal: 4.0,
  won: 0,
  lost: 0,
};

const LeadsFunnelAnalytics = ({ leads }: Props) => {
  const activeStages = stageOrder.filter(s => s !== "lost");

  // Funnel data
  const funnelData = activeStages.map((stage, i) => {
    const count = leads.filter(l => {
      const idx = stageOrder.indexOf(l.stage);
      return idx >= i && l.stage !== "lost";
    }).length;
    const label = leadStages.find(s => s.key === stage)?.label || stage;
    return { name: label, value: count, stage, fill: FUNNEL_COLORS[i] };
  });

  // Conversion rates between stages
  const conversionData = activeStages.slice(0, -1).map((stage, i) => {
    const current = funnelData[i].value;
    const next = funnelData[i + 1]?.value || 0;
    const rate = current > 0 ? Math.round((next / current) * 100) : 0;
    const label = leadStages.find(s => s.key === stage)?.label || stage;
    const nextLabel = leadStages.find(s => s.key === activeStages[i + 1])?.label || "";
    return { name: `${label} → ${nextLabel}`, rate, fill: FUNNEL_COLORS[i] };
  });

  // Stage distribution for bar chart
  const stageDistribution = stageOrder.map((stage, i) => ({
    name: leadStages.find(s => s.key === stage)?.label || stage,
    count: leads.filter(l => l.stage === stage).length,
    amount: leads.filter(l => l.stage === stage).reduce((s, l) => s + (l.amount || 0), 0),
    fill: FUNNEL_COLORS[i],
  }));

  // Manager stats
  const managers = [...new Set(leads.map(l => l.manager))];
  const managerStats = managers.map(m => {
    const mLeads = leads.filter(l => l.manager === m);
    const won = mLeads.filter(l => l.stage === "won");
    const wonAmount = won.reduce((s, l) => s + (l.amount || 0), 0);
    const convRate = mLeads.length > 0 ? Math.round((won.length / mLeads.length) * 100) : 0;
    return { name: m, total: mLeads.length, won: won.length, wonAmount, convRate };
  }).sort((a, b) => b.wonAmount - a.wonAmount);

  // Overall metrics
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === "won").length;
  const lostLeads = leads.filter(l => l.stage === "lost").length;
  const overallConversion = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const avgDeal = wonLeads > 0 ? Math.round(leads.filter(l => l.stage === "won").reduce((s, l) => s + (l.amount || 0), 0) / wonLeads) : 0;

  const chartConfig = {
    count: { label: "Кількість", color: "hsl(217, 71%, 45%)" },
    amount: { label: "Сума", color: "hsl(38, 92%, 55%)" },
  };

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Всього лідів" value={totalLeads.toString()} />
        <MetricCard icon={Trophy} label="Конверсія" value={`${overallConversion}%`} sub={`${wonLeads} виграно / ${lostLeads} втрачено`} />
        <MetricCard icon={TrendingDown} label="Середній чек" value={`${avgDeal.toLocaleString("uk-UA")} ₴`} />
        <MetricCard icon={Clock} label="Сер. час воронки" value="14.8 днів" sub="від нового до угоди" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stage distribution chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Розподіл по етапах</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart data={stageDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Кількість">
                  {stageDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Conversion rates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Конверсія між етапами</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {conversionData.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold text-foreground">{item.rate}%</span>
                </div>
                <Progress value={item.rate} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Avg time per stage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Середній час на етапі</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {stageOrder.filter(s => s !== "won" && s !== "lost").map((stage, i) => {
              const label = leadStages.find(s => s.key === stage)?.label || stage;
              const days = avgDaysOnStage[stage];
              const maxDays = 7;
              return (
                <div key={stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock size={10} /> {label}
                    </span>
                    <span className="font-semibold text-foreground">{days} днів</span>
                  </div>
                  <Progress value={(days / maxDays) * 100} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top managers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Топ менеджерів</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {managerStats.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.total} лідів · {m.won} виграно · {m.wonAmount.toLocaleString("uk-UA")} ₴
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{m.convRate}%</p>
                    <p className="text-[10px] text-muted-foreground">конверсія</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) => (
  <div className="bg-card rounded-lg border border-border p-4">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={16} className="text-primary" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="text-xl font-bold text-foreground">{value}</p>
    {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

export default LeadsFunnelAnalytics;
