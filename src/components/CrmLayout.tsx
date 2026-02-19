import { ReactNode } from "react";
import CrmSidebar from "./CrmSidebar";

interface CrmLayoutProps {
  children: ReactNode;
}

const CrmLayout = ({ children }: CrmLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <CrmSidebar />
      <main className="ml-60 transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default CrmLayout;
