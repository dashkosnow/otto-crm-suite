import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, FileText, Printer } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { statusConfig, formatAmount, type DocItem, type DocStatus } from "@/data/documents";

interface InfoField {
  label: string;
  value: React.ReactNode;
}

interface LinkedDoc {
  label: string;
  path: string;
}

interface DocumentDetailProps {
  title: string;
  number: string;
  date: string;
  status: DocStatus;
  backPath: string;
  backLabel: string;
  fields: InfoField[];
  items: DocItem[];
  total: number;
  currency: string;
  linkedDocs?: LinkedDoc[];
  extraContent?: React.ReactNode;
}

export default function DocumentDetail({
  title,
  number,
  date,
  status,
  backPath,
  backLabel,
  fields,
  items,
  total,
  currency,
  linkedDocs,
  extraContent,
}: DocumentDetailProps) {
  const navigate = useNavigate();
  const cfg = statusConfig[status];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{number}</h1>
            <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{title} від {date}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Printer size={14} />
          Друк
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Інформація</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {fields.map((f, i) => (
                <div key={i}>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Linked docs & actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Пов'язані документи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {linkedDocs && linkedDocs.length > 0 ? (
              linkedDocs.map((ld, i) => (
                <Link
                  key={i}
                  to={ld.path}
                  className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <FileText size={14} />
                  {ld.label}
                  <ExternalLink size={10} className="ml-auto text-muted-foreground" />
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Немає пов'язаних документів</p>
            )}
            {extraContent}
          </CardContent>
        </Card>
      </div>

      {/* Items table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Позиції ({items.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-xs font-medium text-muted-foreground px-5 py-2.5 text-left">№</th>
                  <th className="text-xs font-medium text-muted-foreground px-5 py-2.5 text-left">Артикул</th>
                  <th className="text-xs font-medium text-muted-foreground px-5 py-2.5 text-left">Назва</th>
                  <th className="text-xs font-medium text-muted-foreground px-5 py-2.5 text-left">Бренд</th>
                  <th className="text-xs font-medium text-muted-foreground px-5 py-2.5 text-center">К-сть</th>
                  <th className="text-xs font-medium text-muted-foreground px-5 py-2.5 text-right">Ціна</th>
                  <th className="text-xs font-medium text-muted-foreground px-5 py-2.5 text-right">Сума</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-sm text-muted-foreground">{i + 1}</td>
                    <td className="px-5 py-3 text-sm font-mono text-foreground">{item.article}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{item.name}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{item.brand}</td>
                    <td className="px-5 py-3 text-sm text-center">{item.qty}</td>
                    <td className="px-5 py-3 text-sm text-right">{formatAmount(item.price, item.currency)}</td>
                    <td className="px-5 py-3 text-sm text-right font-medium">{formatAmount(item.total, item.currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td colSpan={6} className="px-5 py-3 text-sm font-semibold text-right text-foreground">Всього:</td>
                  <td className="px-5 py-3 text-sm font-bold text-right text-foreground">{formatAmount(total, currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
