import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ClientOrdersPage from "./pages/ClientOrdersPage";
import ClientOrderDetailPage from "./pages/ClientOrderDetailPage";
import SupplierOrdersPage from "./pages/SupplierOrdersPage";
import PurchaseInvoicesPage from "./pages/PurchaseInvoicesPage";
import PurchaseInvoiceDetailPage from "./pages/PurchaseInvoiceDetailPage";
import SalesInvoicesPage from "./pages/SalesInvoicesPage";
import SalesInvoiceDetailPage from "./pages/SalesInvoiceDetailPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import ClientsPage from "./pages/ClientsPage";
import SearchPage from "./pages/SearchPage";
import ContractorsPage from "./pages/ContractorsPage";
import ContractorDetailPage from "./pages/ContractorDetailPage";
import FinancePage from "./pages/FinancePage";
import SettlementsPage from "./pages/SettlementsPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import LeadsPage from "./pages/LeadsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/client-orders" element={<ClientOrdersPage />} />
          <Route path="/client-orders/:id" element={<ClientOrderDetailPage />} />
          <Route path="/supplier-orders" element={<SupplierOrdersPage />} />
          <Route path="/purchase-invoices" element={<PurchaseInvoicesPage />} />
          <Route path="/purchase-invoices/:id" element={<PurchaseInvoiceDetailPage />} />
          <Route path="/sales-invoices" element={<SalesInvoicesPage />} />
          <Route path="/sales-invoices/:id" element={<SalesInvoiceDetailPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/orders" element={<ClientOrdersPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/contractors/:id" element={<ContractorDetailPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/settlements" element={<SettlementsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<PlaceholderPage title="Налаштування" description="Ролі та права, адміністрування користувачів, аудит дій." />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
