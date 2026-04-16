
-- Enum types
CREATE TYPE public.contractor_type AS ENUM ('supplier', 'buyer');
CREATE TYPE public.balance_type AS ENUM ('positive', 'negative', 'zero');
CREATE TYPE public.doc_status AS ENUM ('draft', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.lead_stage AS ENUM ('new', 'contact', 'negotiation', 'proposal', 'won', 'lost');
CREATE TYPE public.currency_code AS ENUM ('UAH', 'EUR', 'USD');
CREATE TYPE public.invoice_direction AS ENUM ('incoming', 'outgoing');
CREATE TYPE public.settlement_type AS ENUM ('income', 'expense');

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. CONTRACTORS
CREATE TABLE public.contractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type contractor_type NOT NULL,
  contact_person TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  edrpou TEXT NOT NULL DEFAULT '',
  contracts INTEGER NOT NULL DEFAULT 0,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  balance_type balance_type NOT NULL DEFAULT 'zero',
  tags TEXT[] NOT NULL DEFAULT '{}',
  last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT,
  manager TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage contractors" ON public.contractors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON public.contractors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_contractors_type ON public.contractors(type);
CREATE INDEX idx_contractors_phone ON public.contractors(phone);

-- 2. VEHICLES
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  vin TEXT NOT NULL DEFAULT '',
  make TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  year INTEGER NOT NULL DEFAULT 0,
  plate TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_vehicles_contractor ON public.vehicles(contractor_id);
CREATE INDEX idx_vehicles_vin ON public.vehicles(vin);

-- 3. LEADS
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL DEFAULT '',
  stage lead_stage NOT NULL DEFAULT 'new',
  manager TEXT NOT NULL DEFAULT '',
  amount NUMERIC(12,2),
  note TEXT,
  converted_contractor_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_leads_manager ON public.leads(manager);

-- 4. CLIENT ORDERS
CREATE TABLE public.client_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  client_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  vin TEXT,
  note TEXT,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_code NOT NULL DEFAULT 'UAH',
  status doc_status NOT NULL DEFAULT 'draft',
  linked_sales_invoice_id UUID,
  linked_invoice_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage client_orders" ON public.client_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_client_orders_updated_at BEFORE UPDATE ON public.client_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. SUPPLIER ORDERS
CREATE TABLE public.supplier_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
  supplier_name TEXT NOT NULL DEFAULT '',
  expected_date DATE,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_code NOT NULL DEFAULT 'UAH',
  status doc_status NOT NULL DEFAULT 'draft',
  linked_client_order_id UUID REFERENCES public.client_orders(id) ON DELETE SET NULL,
  linked_purchase_invoice_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.supplier_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage supplier_orders" ON public.supplier_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_supplier_orders_updated_at BEFORE UPDATE ON public.supplier_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. PURCHASE INVOICES
CREATE TABLE public.purchase_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
  supplier_name TEXT NOT NULL DEFAULT '',
  warehouse TEXT NOT NULL DEFAULT 'Основний склад',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_code NOT NULL DEFAULT 'UAH',
  status doc_status NOT NULL DEFAULT 'draft',
  linked_supplier_order_id UUID REFERENCES public.supplier_orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.purchase_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage purchase_invoices" ON public.purchase_invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_purchase_invoices_updated_at BEFORE UPDATE ON public.purchase_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. SALES INVOICES
CREATE TABLE public.sales_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  client_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL DEFAULT '',
  warehouse TEXT NOT NULL DEFAULT 'Основний склад',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_code NOT NULL DEFAULT 'UAH',
  status doc_status NOT NULL DEFAULT 'draft',
  linked_client_order_id UUID REFERENCES public.client_orders(id) ON DELETE SET NULL,
  linked_invoice_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sales_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage sales_invoices" ON public.sales_invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_sales_invoices_updated_at BEFORE UPDATE ON public.sales_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. INVOICES
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  counterparty_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
  counterparty_name TEXT NOT NULL DEFAULT '',
  direction invoice_direction NOT NULL,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_code NOT NULL DEFAULT 'UAH',
  status doc_status NOT NULL DEFAULT 'draft',
  paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  linked_doc_id UUID,
  linked_doc_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage invoices" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. DOC ITEMS (universal)
CREATE TABLE public.doc_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_id UUID NOT NULL,
  doc_type TEXT NOT NULL,
  article TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  brand TEXT NOT NULL DEFAULT '',
  qty NUMERIC(10,2) NOT NULL DEFAULT 0,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_code NOT NULL DEFAULT 'UAH',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doc_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage doc_items" ON public.doc_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_doc_items_doc ON public.doc_items(doc_type, doc_id);

-- 10. SETTLEMENTS
CREATE TABLE public.settlements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type settlement_type NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency currency_code NOT NULL DEFAULT 'UAH',
  document TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage settlements" ON public.settlements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_settlements_contractor ON public.settlements(contractor_id);

-- 11. CROSS-REFERENCES
CREATE TABLE public.client_order_supplier_orders (
  client_order_id UUID NOT NULL REFERENCES public.client_orders(id) ON DELETE CASCADE,
  supplier_order_id UUID NOT NULL REFERENCES public.supplier_orders(id) ON DELETE CASCADE,
  PRIMARY KEY (client_order_id, supplier_order_id)
);
ALTER TABLE public.client_order_supplier_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage links" ON public.client_order_supplier_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. Deferred FK (circular refs)
ALTER TABLE public.client_orders ADD CONSTRAINT fk_co_sales_invoice FOREIGN KEY (linked_sales_invoice_id) REFERENCES public.sales_invoices(id) ON DELETE SET NULL;
ALTER TABLE public.client_orders ADD CONSTRAINT fk_co_invoice FOREIGN KEY (linked_invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;
ALTER TABLE public.supplier_orders ADD CONSTRAINT fk_so_purchase_invoice FOREIGN KEY (linked_purchase_invoice_id) REFERENCES public.purchase_invoices(id) ON DELETE SET NULL;
ALTER TABLE public.sales_invoices ADD CONSTRAINT fk_si_invoice FOREIGN KEY (linked_invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;
