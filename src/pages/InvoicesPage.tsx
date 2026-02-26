import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrmLayout from "@/components/CrmLayout";
import DocumentTable, { StatusBadge, LinkedDocLink, type Column } from "@/components/DocumentTable";
import { Badge } from "@/components/ui/badge";
import { invoices, formatAmount, type Invoice } from "@/data/documents";

const columns: Column<Invoice>[] = [
  {
    key: "number",
    label: "Номер",
    render: (r) => (
      <div>
        <p className="font-medium text-primary">{r.number}</p>
        <p className="text-[10px] text-muted-foreground">{r.date}</p>
      </div>
    ),
  },
  {
    key: "direction",
    label: "Тип",
    render: (r) => (
      <Badge variant={r.direction === "outgoing" ? "default" : "secondary"} className="text-[10px]">
        {r.direction === "outgoing" ? "Вихідний" : "Вхідний"}
      </Badge>
    ),
  },
  { key: "counterparty", label: "Контрагент", render: (r) => <span className="text-card-foreground">{r.counterparty}</span> },
  { key: "dueDate", label: "Термін", render: (r) => <span className="text-xs text-muted-foreground">{r.dueDate}</span> },
  { key: "total", label: "Сума", align: "right", render: (r) => <span className="font-medium">{formatAmount(r.total, r.currency)}</span> },
  {
    key: "paid",
    label: "Оплачено",
    align: "right",
    render: (r) => (
      <span className={r.paid >= r.total ? "text-success font-medium" : r.paid > 0 ? "text-warning font-medium" : "text-destructive"}>
        {formatAmount(r.paid, r.currency)}
      </span>
    ),
  },
  { key: "status", label: "Статус", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "links",
    label: "Документ",
    render: (r) => {
      if (!r.linkedDoc) return <span className="text-muted-foreground">—</span>;
      const isIncoming = r.direction === "incoming";
      return (
        <LinkedDocLink
          docId={r.linkedDoc}
          prefix={isIncoming ? "Прих. накл." : "Расх. накл."}
          basePath={isIncoming ? "/purchase-invoices" : "/sales-invoices"}
        />
      );
    },
  },
];

const InvoicesPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = invoices.filter(
    (o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.counterparty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CrmLayout>
      <DocumentTable
        title="Рахунки"
        subtitle={`${invoices.length} рахунків`}
        columns={columns}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Пошук за номером або контрагентом..."
        createLabel="Новий рахунок"
        onRowClick={(row) => navigate(`/invoices/${row.id}`)}
      />
    </CrmLayout>
  );
};

export default InvoicesPage;
