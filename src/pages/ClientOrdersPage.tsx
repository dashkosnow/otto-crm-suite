import { useState } from "react";
import CrmLayout from "@/components/CrmLayout";
import DocumentTable, { StatusBadge, LinkedDocLink, type Column } from "@/components/DocumentTable";
import { clientOrders, formatAmount, type ClientOrder } from "@/data/documents";

const columns: Column<ClientOrder>[] = [
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
    key: "client",
    label: "Клієнт",
    render: (r) => (
      <div>
        <p className="text-card-foreground">{r.client}</p>
        <p className="text-xs text-muted-foreground">{r.phone}</p>
      </div>
    ),
  },
  { key: "vin", label: "VIN", render: (r) => <span className="text-xs text-muted-foreground font-mono">{r.vin || "—"}</span> },
  { key: "items", label: "Позицій", align: "center", render: (r) => r.items.length },
  { key: "total", label: "Сума", align: "right", render: (r) => <span className="font-medium">{formatAmount(r.total, r.currency)}</span> },
  { key: "status", label: "Статус", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "links",
    label: "Пов'язані",
    render: (r) => (
      <div className="flex flex-col gap-0.5">
        {r.linkedSupplierOrders.length > 0 && <LinkedDocLink docId={r.linkedSupplierOrders[0]} prefix="Заявка пост." basePath="/supplier-orders" />}
        {r.linkedSalesInvoice && <LinkedDocLink docId={r.linkedSalesInvoice} prefix="Расх. накл." basePath="/sales-invoices" />}
        {r.linkedInvoice && <LinkedDocLink docId={r.linkedInvoice} prefix="Рахунок" basePath="/invoices" />}
      </div>
    ),
  },
];

const ClientOrdersPage = () => {
  const [search, setSearch] = useState("");
  const filtered = clientOrders.filter(
    (o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      (o.vin?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <CrmLayout>
      <DocumentTable
        title="Заявки клієнтів"
        subtitle={`${clientOrders.length} заявок`}
        columns={columns}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Пошук за номером, клієнтом, VIN..."
        createLabel="Нова заявка"
      />
    </CrmLayout>
  );
};

export default ClientOrdersPage;
