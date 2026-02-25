import { useState } from "react";
import CrmLayout from "@/components/CrmLayout";
import DocumentTable, { StatusBadge, LinkedDocLink, type Column } from "@/components/DocumentTable";
import { purchaseInvoices, formatAmount, type PurchaseInvoice } from "@/data/documents";

const columns: Column<PurchaseInvoice>[] = [
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
  { key: "supplier", label: "Постачальник", render: (r) => <span className="text-card-foreground">{r.supplier}</span> },
  { key: "warehouse", label: "Склад", render: (r) => <span className="text-xs text-muted-foreground">{r.warehouse}</span> },
  { key: "items", label: "Позицій", align: "center", render: (r) => r.items.length },
  { key: "total", label: "Сума", align: "right", render: (r) => <span className="font-medium">{formatAmount(r.total, r.currency)}</span> },
  { key: "status", label: "Статус", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "links",
    label: "Заявка",
    render: (r) => <LinkedDocLink docId={r.linkedSupplierOrder} prefix="Заявка пост." basePath="/supplier-orders" />,
  },
];

const PurchaseInvoicesPage = () => {
  const [search, setSearch] = useState("");
  const filtered = purchaseInvoices.filter(
    (o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CrmLayout>
      <DocumentTable
        title="Приходні накладні"
        subtitle={`${purchaseInvoices.length} документів`}
        columns={columns}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Пошук за номером або постачальником..."
        createLabel="Новий прихід"
      />
    </CrmLayout>
  );
};

export default PurchaseInvoicesPage;
