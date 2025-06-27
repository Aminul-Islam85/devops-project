import { useEffect, useState } from "react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`http://localhost:5000/api/tasks/notifications/${user.email}`);
      const data = await res.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, [user.email]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n._id} className="p-3 bg-base-100 border rounded">
              {n.message}
              <span className="block text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
