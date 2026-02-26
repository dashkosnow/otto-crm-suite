import { useParams } from "react-router-dom";
import CrmLayout from "@/components/CrmLayout";
import DocumentDetail from "@/components/DocumentDetail";
import { salesInvoices, clientOrders, invoices } from "@/data/documents";

const SalesInvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const doc = salesInvoices.find((d) => d.id === id);

  if (!doc) {
    return (
      <CrmLayout>
        <div className="text-center py-20 text-muted-foreground">Документ не знайдено</div>
      </CrmLayout>
    );
  }

  const linkedDocs = [
    ...(doc.linkedClientOrder
      ? [{ label: `Заявка кл. ${clientOrders.find((c) => c.id === doc.linkedClientOrder)?.number || doc.linkedClientOrder}`, path: `/client-orders/${doc.linkedClientOrder}` }]
      : []),
    ...(doc.linkedInvoice
      ? [{ label: `Рахунок ${invoices.find((i) => i.id === doc.linkedInvoice)?.number || doc.linkedInvoice}`, path: `/invoices/${doc.linkedInvoice}` }]
      : []),
  ];

  return (
    <CrmLayout>
      <DocumentDetail
        title="Видаткова накладна"
        number={doc.number}
        date={doc.date}
        status={doc.status}
        backPath="/sales-invoices"
        backLabel="Видаткові накладні"
        fields={[
          { label: "Клієнт", value: doc.client },
          { label: "Склад", value: doc.warehouse },
          { label: "Валюта", value: doc.currency },
        ]}
        items={doc.items}
        total={doc.total}
        currency={doc.currency}
        linkedDocs={linkedDocs}
      />
    </CrmLayout>
  );
};

export default SalesInvoiceDetailPage;
