import { useState } from "react";
import CrmLayout from "@/components/CrmLayout";
import DocumentTable, { StatusBadge, LinkedDocLink, type Column } from "@/components/DocumentTable";
import { supplierOrders, formatAmount, type SupplierOrder } from "@/data/documents";

const columns: Column<SupplierOrder>[] = [
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
    key: "supplier",
    label: "Постачальник",
    render: (r) => <span className="text-card-foreground">{r.supplier}</span>,
  },
  { key: "expected", label: "Очікується", render: (r) => <span className="text-xs text-muted-foreground">{r.expectedDate}</span> },
  { key: "items", label: "Позицій", align: "center", render: (r) => r.items.length },
  { key: "total", label: "Сума", align: "right", render: (r) => <span className="font-medium">{formatAmount(r.total, r.currency)}</span> },
  { key: "status", label: "Статус", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "links",
    label: "Пов'язані",
    render: (r) => (
      <div className="flex flex-col gap-0.5">
        {r.linkedClientOrder && <LinkedDocLink docId={r.linkedClientOrder} prefix="Заявка кл." basePath="/client-orders" />}
        {r.linkedPurchaseInvoice && <LinkedDocLink docId={r.linkedPurchaseInvoice} prefix="Прих. накл." basePath="/purchase-invoices" />}
      </div>
    ),
  },
];

const SupplierOrdersPage = () => {
  const [search, setSearch] = useState("");
  const filtered = supplierOrders.filter(
    (o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CrmLayout>
      <DocumentTable
        title="Заявки постачальникам"
        subtitle={`${supplierOrders.length} заявок`}
        columns={columns}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Пошук за номером або постачальником..."
        createLabel="Нова заявка"
      />
    </CrmLayout>
  );
};

export default SupplierOrdersPage;
