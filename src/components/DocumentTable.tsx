import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, ExternalLink } from "lucide-react";
import { statusConfig, formatAmount, type DocStatus } from "@/data/documents";
import { Link } from "react-router-dom";

export interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render: (row: T) => React.ReactNode;
}

interface DocumentTableProps<T> {
  title: string;
  subtitle: string;
  columns: Column<T>[];
  data: T[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  createLabel?: string;
  onRowClick?: (row: T) => void;
}

export function StatusBadge({ status }: { status: DocStatus }) {
  const cfg = statusConfig[status];
  return <Badge variant={cfg.variant as any} className="text-xs">{cfg.label}</Badge>;
}

export function LinkedDocLink({ docId, prefix, basePath }: { docId?: string; prefix: string; basePath: string }) {
  if (!docId) return <span className="text-muted-foreground">—</span>;
  return (
    <Link
      to={basePath}
      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLink size={10} />
      {prefix}
    </Link>
  );
}

export default function DocumentTable<T>({
  title,
  subtitle,
  columns,
  data,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Пошук...",
  createLabel = "Створити",
  onRowClick,
}: DocumentTableProps<T>) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus size={16} />
          {createLabel}
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter size={14} />
          Фільтри
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-xs font-medium text-muted-foreground px-5 py-3 ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3.5 text-sm ${
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">Нічого не знайдено</div>
        )}
      </div>
    </div>
  );
}
