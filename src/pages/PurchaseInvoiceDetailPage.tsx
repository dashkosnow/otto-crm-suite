import { useParams } from "react-router-dom";
import CrmLayout from "@/components/CrmLayout";
import DocumentDetail from "@/components/DocumentDetail";
import { purchaseInvoices, supplierOrders } from "@/data/documents";
import { toast } from "sonner";

const PurchaseInvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const doc = purchaseInvoices.find((d) => d.id === id);

  if (!doc) {
    return (
      <CrmLayout>
        <div className="text-center py-20 text-muted-foreground">Документ не знайдено</div>
      </CrmLayout>
    );
  }

  const linkedDocs = doc.linkedSupplierOrder
    ? [{ label: `Заявка пост. ${supplierOrders.find((s) => s.id === doc.linkedSupplierOrder)?.number || doc.linkedSupplierOrder}`, path: `/supplier-orders` }]
    : [];

  const createActions = [{
    label: "Рахунок постачальнику (вхідний)",
    onClick: () => toast.success("Вхідний рахунок створено", { description: `На основі ${doc.number}` }),
  }];

  return (
    <CrmLayout>
      <DocumentDetail
        title="Приходна накладна"
        number={doc.number}
        date={doc.date}
        status={doc.status}
        backPath="/purchase-invoices"
        backLabel="Приходні накладні"
        fields={[
          { label: "Постачальник", value: doc.supplier },
          { label: "Склад", value: doc.warehouse },
          { label: "Валюта", value: doc.currency },
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

export default PurchaseInvoiceDetailPage;
