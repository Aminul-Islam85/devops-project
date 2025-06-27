import { useEffect, useState } from "react";

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("http://localhost:5000/api/tasks/admin/stats");
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-200 p-4 shadow">
          <h3 className="font-bold">Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="card bg-base-200 p-4 shadow">
          <h3 className="font-bold">Total Tasks</h3>
          <p>{stats.tasks}</p>
        </div>
        <div className="card bg-base-200 p-4 shadow">
          <h3 className="font-bold">Total Submissions</h3>
          <p>{stats.submissions}</p>
        </div>
        <div className="card bg-base-200 p-4 shadow">
          <h3 className="font-bold">Pending Withdrawals</h3>
          <p>{stats.pendingWithdraws}</p>
        </div>
        <div className="card bg-base-200 p-4 shadow">
          <h3 className="font-bold">Pending Submissions</h3>
          <p>{stats.pendingSubmissions}</p>
        </div>
        <div className="card bg-base-200 p-4 shadow">
          <h3 className="font-bold">Total Coins in Circulation</h3>
          <p>{stats.totalCoins}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
