import { useParams } from "react-router-dom";
import CrmLayout from "@/components/CrmLayout";
import DocumentDetail from "@/components/DocumentDetail";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { invoices, purchaseInvoices, salesInvoices, formatAmount } from "@/data/documents";

const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const doc = invoices.find((d) => d.id === id);

  if (!doc) {
    return (
      <CrmLayout>
        <div className="text-center py-20 text-muted-foreground">Документ не знайдено</div>
      </CrmLayout>
    );
  }

  const isIncoming = doc.direction === "incoming";
  const linkedDocs = doc.linkedDoc
    ? [{
        label: isIncoming
          ? `Прих. накл. ${purchaseInvoices.find((p) => p.id === doc.linkedDoc)?.number || doc.linkedDoc}`
          : `Видатк. накл. ${salesInvoices.find((s) => s.id === doc.linkedDoc)?.number || doc.linkedDoc}`,
        path: isIncoming ? `/purchase-invoices/${doc.linkedDoc}` : `/sales-invoices/${doc.linkedDoc}`,
      }]
    : [];

  const paidPct = doc.total > 0 ? Math.round((doc.paid / doc.total) * 100) : 0;
  const debt = doc.total - doc.paid;

  const paymentBlock = (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Оплата</p>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Оплачено</span>
        <span className="font-medium text-foreground">{formatAmount(doc.paid, doc.currency)}</span>
      </div>
      <Progress value={paidPct} className="h-2" />
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Борг</span>
        <span className={debt > 0 ? "font-medium text-destructive" : "font-medium text-foreground"}>
          {formatAmount(debt, doc.currency)}
        </span>
      </div>
    </div>
  );

  return (
    <CrmLayout>
      <DocumentDetail
        title="Рахунок"
        number={doc.number}
        date={doc.date}
        status={doc.status}
        backPath="/invoices"
        backLabel="Рахунки"
        fields={[
          { label: "Контрагент", value: doc.counterparty },
          {
            label: "Тип",
            value: (
              <Badge variant={isIncoming ? "secondary" : "default"} className="text-xs">
                {isIncoming ? "Вхідний" : "Вихідний"}
              </Badge>
            ),
          },
          { label: "Термін оплати", value: doc.dueDate },
          { label: "Валюта", value: doc.currency },
        ]}
        items={doc.items}
        total={doc.total}
        currency={doc.currency}
        linkedDocs={linkedDocs}
        extraContent={paymentBlock}
      />
    </CrmLayout>
  );
};

export default InvoiceDetailPage;
