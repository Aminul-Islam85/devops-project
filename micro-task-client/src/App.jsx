import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // this is now the inner content
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";
import AddTask from "./pages/AddTask";
import MyTasks from "./pages/MyTasks";
import AvailableTasks from "./pages/AvailableTasks";
import MySubmissions from "./pages/MySubmissions";
import Withdraw from "./pages/Withdraw";
import PurchaseCoins from "./pages/PurchaseCoins";
import ManageUsers from "./pages/admin/ManageUsers";
import WithdrawRequests from "./pages/admin/WithdrawRequests";
import ModerateSubmissions from "./pages/admin/ModerateSubmissions";
import ManageTasks from "./pages/admin/ManageTasks";
import AdminStats from "./pages/admin/AdminStats";
import NotificationsPage from "./pages/NotificationsPage";
import AddTestimonial from "./pages/AddTestimonial";


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} /> {/* /dashboard */}
          <Route path="add-task" element={<AddTask />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="available-tasks" element={<AvailableTasks />} />
          <Route path="my-submissions" element={<MySubmissions />} />
          <Route path="*" element={<p>404 Not Found</p>} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="purchase-coins" element={<PurchaseCoins />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="withdraw-requests" element={<WithdrawRequests />} />
          <Route path="moderate-submissions" element={<ModerateSubmissions />} />
          <Route path="manage-tasks" element={<ManageTasks />} />
          <Route path="admin-stats" element={<AdminStats />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="submit-testimonial" element={<AddTestimonial />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
