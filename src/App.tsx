import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import ClientsPage from "./pages/ClientsPage";
import SearchPage from "./pages/SearchPage";
import ContractorsPage from "./pages/ContractorsPage";
import ContractorDetailPage from "./pages/ContractorDetailPage";
import FinancePage from "./pages/FinancePage";
import SettlementsPage from "./pages/SettlementsPage";
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
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/contractors/:id" element={<ContractorDetailPage />} />
          <Route path="/inventory" element={<PlaceholderPage title="Товары и Склад" description="Номенклатура, остатки по складам/поставщикам, приходы/расходы, документы прихода." />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/settlements" element={<SettlementsPage />} />
          <Route path="/reports" element={<PlaceholderPage title="Отчёты" description="Продажи, кассы, склады, взаиморасчёты. Экспорт в Excel и PDF." />} />
          <Route path="/settings" element={<PlaceholderPage title="Настройки" description="Роли и права, администрирование пользователей, аудит действий." />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
