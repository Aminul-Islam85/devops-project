import { useEffect, useState } from "react";

const ModerateSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  const fetchAllSubmissions = async () => {
    const res = await fetch("http://localhost:5000/api/tasks/all-submissions");
    const data = await res.json();
    setSubmissions(data);
  };

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  const updateStatus = async (id, status) => {
    const confirm = window.confirm(`Mark this submission as ${status}?`);
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/tasks/submissions/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Submission status updated.");
      fetchAllSubmissions();
    } else {
      alert(data.message || "Failed to update submission.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Submissions</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Email</th>
              <th>Proof</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id}>
                <td>{s.worker_name}</td>
                <td>{s.worker_email}</td>
                <td>
                  {s.proof && (s.proof.startsWith("http://") || s.proof.startsWith("https://")) ? (
                    <a
                      href={s.proof}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="italic text-gray-400">No proof</span>
                  )}
                </td>

                <td>
                  <span
                    className={`badge ${s.status === "approved"
                        ? "badge-success"
                        : s.status === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    disabled={s.status !== "pending"}
                    onClick={() => updateStatus(s._id, "approved")}
                    className="btn btn-xs btn-success"
                  >
                    Approve
                  </button>
                  <button
                    disabled={s.status !== "pending"}
                    onClick={() => updateStatus(s._id, "rejected")}
                    className="btn btn-xs btn-error"
                  >
                    Reject
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

export default ModerateSubmissions;
