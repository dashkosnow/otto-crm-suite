import { useParams, useNavigate } from "react-router-dom";
import CrmLayout from "@/components/CrmLayout";
import DocumentDetail from "@/components/DocumentDetail";
import { clientOrders, supplierOrders, salesInvoices, invoices } from "@/data/documents";
import { toast } from "sonner";

const ClientOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const doc = clientOrders.find((d) => d.id === id);

  if (!doc) {
    return (
      <CrmLayout>
        <div className="text-center py-20 text-muted-foreground">Документ не знайдено</div>
      </CrmLayout>
    );
  }

  const linkedDocs = [
    ...doc.linkedSupplierOrders.map((soId) => {
      const so = supplierOrders.find((s) => s.id === soId);
      return { label: `Заявка пост. ${so?.number || soId}`, path: `/supplier-orders` };
    }),
    ...(doc.linkedSalesInvoice
      ? [{ label: `Расх. накл. ${salesInvoices.find((s) => s.id === doc.linkedSalesInvoice)?.number || doc.linkedSalesInvoice}`, path: `/sales-invoices/${doc.linkedSalesInvoice}` }]
      : []),
    ...(doc.linkedInvoice
      ? [{ label: `Рахунок ${invoices.find((i) => i.id === doc.linkedInvoice)?.number || doc.linkedInvoice}`, path: `/invoices/${doc.linkedInvoice}` }]
      : []),
  ];

  const createActions = [
    ...(!doc.linkedSupplierOrders.length ? [{
      label: "Заявку постачальнику",
      onClick: () => toast.success("Заявку постачальнику створено", { description: `На основі ${doc.number}` }),
    }] : []),
    ...(!doc.linkedSalesInvoice ? [{
      label: "Видаткову накладну",
      onClick: () => toast.success("Видаткову накладну створено", { description: `На основі ${doc.number}` }),
    }] : []),
    ...(!doc.linkedInvoice ? [{
      label: "Рахунок клієнту",
      onClick: () => toast.success("Рахунок створено", { description: `На основі ${doc.number}` }),
    }] : []),
  ];

  return (
    <CrmLayout>
      <DocumentDetail
        title="Заявка клієнта"
        number={doc.number}
        date={doc.date}
        status={doc.status}
        backPath="/client-orders"
        backLabel="Заявки клієнтів"
        fields={[
          { label: "Клієнт", value: doc.client },
          { label: "Телефон", value: doc.phone },
          { label: "VIN", value: doc.vin || "—" },
          { label: "Валюта", value: doc.currency },
          ...(doc.note ? [{ label: "Примітка", value: doc.note }] : []),
        ]}
        items={doc.items}
        total={doc.total}
        currency={doc.currency}
        linkedDocs={linkedDocs}
        createActions={createActions}
      />
    </CrmLayout>
  );
};

export default ClientOrderDetailPage;
