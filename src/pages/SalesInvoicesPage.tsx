import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrmLayout from "@/components/CrmLayout";
import DocumentTable, { StatusBadge, LinkedDocLink, type Column } from "@/components/DocumentTable";
import { salesInvoices, formatAmount, type SalesInvoice } from "@/data/documents";

const columns: Column<SalesInvoice>[] = [
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
  { key: "client", label: "Клієнт", render: (r) => <span className="text-card-foreground">{r.client}</span> },
  { key: "warehouse", label: "Склад", render: (r) => <span className="text-xs text-muted-foreground">{r.warehouse}</span> },
  { key: "items", label: "Позицій", align: "center", render: (r) => r.items.length },
  { key: "total", label: "Сума", align: "right", render: (r) => <span className="font-medium">{formatAmount(r.total, r.currency)}</span> },
  { key: "status", label: "Статус", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "links",
    label: "Пов'язані",
    render: (r) => (
      <div className="flex flex-col gap-0.5">
        {r.linkedClientOrder && <LinkedDocLink docId={r.linkedClientOrder} prefix="Заявка кл." basePath="/client-orders" />}
        {r.linkedInvoice && <LinkedDocLink docId={r.linkedInvoice} prefix="Рахунок" basePath="/invoices" />}
      </div>
    ),
  },
];

const SalesInvoicesPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = salesInvoices.filter(
    (o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CrmLayout>
      <DocumentTable
        title="Видаткові накладні"
        subtitle={`${salesInvoices.length} документів`}
        columns={columns}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Пошук за номером або клієнтом..."
        createLabel="Нова видаткова"
        onRowClick={(row) => navigate(`/sales-invoices/${row.id}`)}
      />
    </CrmLayout>
  );
};

export default SalesInvoicesPage;
