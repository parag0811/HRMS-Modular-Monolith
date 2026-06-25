import Navbar from "@/components/layout/NavBar";
import Sidebar from "@/components/layout/SideBar";
import { RoleProvider } from "@/context/RoleContext";

export default function HRMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}