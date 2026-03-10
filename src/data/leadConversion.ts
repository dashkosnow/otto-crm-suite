// Lead → Client + Client Order conversion logic
import { Lead } from "./leads";
import { Contractor, contractorsData } from "./contractors";
import { ClientOrder, clientOrders } from "./documents";

let nextContractorId = Math.max(...contractorsData.map(c => c.id)) + 1;

export interface ConversionResult {
  contractor: Contractor;
  clientOrder: ClientOrder;
}

export const convertLeadToClient = (lead: Lead): ConversionResult => {
  const id = nextContractorId++;
  const today = new Date();
  const dateStr = today.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");

  // Create contractor (buyer)
  const contractor: Contractor = {
    id,
    name: lead.company || lead.name,
    type: "buyer",
    contactPerson: lead.name,
    phone: lead.phone,
    email: lead.email || "",
    city: "",
    edrpou: "",
    contracts: 0,
    balance: "0 ₴",
    balanceType: "zero",
    tags: ["Новий"],
    lastActivity: dateStr,
    source: lead.source,
    manager: lead.manager,
    notes: lead.note ? `З ліда: ${lead.note}` : `Конвертовано з ліда ${lead.id}`,
  };

  // Create first client order
  const orderNumber = `ЗК-2026-${String(clientOrders.length + 1).padStart(4, "0")}`;
  const orderId = `co-${Date.now()}`;

  const clientOrder: ClientOrder = {
    id: orderId,
    number: orderNumber,
    date: dateStr,
    client: contractor.name,
    phone: contractor.phone,
    vin: "",
    note: lead.note || "",
    items: [],
    total: lead.amount || 0,
    currency: "UAH",
    status: "draft",
    linkedSupplierOrders: [],
  };

  // Add to global arrays (mock persistence)
  contractorsData.push(contractor);
  clientOrders.push(clientOrder);

  return { contractor, clientOrder };
};
