import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Bell } from "lucide-react"; // You can install lucide-react or use any icon lib

const DashboardLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.email) return;
      const res = await fetch(`http://localhost:5000/api/tasks/notifications/${user.email}`);
      const data = await res.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, [user?.email]);

  const unreadCount = notifications.length;
  // ✅ Clear notifications when dropdown is opened
  const clearNotifications = async () => {
    if (!user?.email) return;
    try {
      await fetch(`http://localhost:5000/api/tasks/notifications/clear/${user.email}`, {
        method: "POST",
      });
      setNotifications([]); // clear from UI
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // ✅ Toggle dropdown and clear when opened
  const handleBellClick = () => {
    setShowDropdown((prev) => {
      const next = !prev;
      if (next) clearNotifications(); // only clear when opening
      return next;
    });
  };


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-200 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md p-4 space-y-4">
        <h2 className="text-xl font-bold text-primary mb-6">Dashboard</h2>
        <ul className="space-y-2">
          <li><Link to="/dashboard">Dashboard Home</Link></li>
          <li><Link to="/">Back to Home</Link></li>
          <li><Link to="/dashboard/notifications">Notifications</Link></li>


          {user?.role === "worker" && (
            <>
              <li><Link to="/dashboard/available-tasks">Available Tasks</Link></li>
              <li><Link to="/dashboard/my-submissions">My Submissions</Link></li>
              <li><Link to="/dashboard/withdraw">Withdraw</Link></li>
            </>
          )}

          {user?.role === "buyer" && (
            <>
              <li><Link to="/dashboard/add-task">Add Task</Link></li>
              <li><Link to="/dashboard/my-tasks">My Tasks</Link></li>
              <li><Link to="/dashboard/purchase-coins">Purchase Coins</Link></li>
              <li><Link to="/dashboard/submit-testimonial">Testimonial</Link></li>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <li><Link to="/dashboard/manage-users">Manage Users</Link></li>
              <li><Link to="/dashboard/withdraw-requests">Withdrawals</Link></li>
              <li><Link to="/dashboard/moderate-submissions">Moderate Submissions</Link></li>
              <li><Link to="/dashboard/manage-tasks">Manage Tasks</Link></li>
              <li><Link to="/dashboard/admin-stats">Admin Stats</Link></li>
            </>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <div className="flex items-center gap-6 relative">
            {/* 🔔 Bell icon */}
            <button
              className="relative"
              onClick={handleBellClick}
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 🔽 Notification Dropdown */}
            {showDropdown && (
              <div className="absolute top-10 right-0 w-80 bg-white shadow-lg rounded-lg p-3 z-10">
                <h3 className="font-bold mb-2 text-sm">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No new notifications</p>
                ) : (
                  <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
                    {notifications.map((n) => (
                      <li key={n._id} className="border-b py-1">{n.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* User Info */}
            {user && (
              <div className="text-right text-sm">
                <div className="font-bold">{user.name}</div>
                <div className="text-xs capitalize text-gray-500">{user.role}</div>
                <div className="text-xs text-success">{user.coins} coins</div>
              </div>
            )}
            <img
              src={
                user.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0D8ABC&color=fff`
              }
              alt="User"
              className="w-10 h-10 rounded-full object-cover border border-primary"
            />
          </div>
        </header>

        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
