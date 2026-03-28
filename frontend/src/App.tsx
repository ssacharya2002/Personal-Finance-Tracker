import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Overview from "./components/Overview";
import Transactions from "./components/Transactions";
import Income from "./components/Income";
import Budgets from "./components/Budgets";
import Expense from "./components/Expense";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Default */}
        <Route index element={<Overview />} />

        <Route path="overview" element={<Overview />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="expenses" element={<Expense />} />
        <Route path="income" element={<Income />} />
        <Route path="budgets" element={<Budgets />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
