import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-background p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
