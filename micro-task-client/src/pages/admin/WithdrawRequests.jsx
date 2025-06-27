import { useEffect, useState } from "react";

const WithdrawRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch("http://localhost:5000/api/tasks/withdraw-requests");
    const data = await res.json();
    setRequests(data);
  };

  const handleApprove = async (req) => {
    const confirm = window.confirm(`Approve withdrawal of ${req.amount} coins for ${req.email}?`);
    if (!confirm) return;

    const res = await fetch("http://localhost:5000/api/tasks/withdraw-requests/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Withdrawal approved.");
      fetchRequests();
    } else {
      alert(data.message || "Failed to approve.");
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure to remove this request?")) return;
    await fetch(`http://localhost:5000/api/tasks/withdraw-requests/${id}`, { method: "DELETE" });
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Withdraw Requests</h2>
      <div className="overflow-x-auto">
        <table className="table text-sm">
          <thead>
            <tr>
              <th>Email</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.email}</td>
                <td>{req.method}</td>
                <td>{req.amount}</td>
                <td>{new Date(req.requested_at).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleApprove(req)}
                    className="btn btn-xs btn-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRemove(req._id)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawRequests;
