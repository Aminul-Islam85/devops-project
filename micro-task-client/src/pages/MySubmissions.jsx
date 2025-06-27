import { useEffect, useState } from "react";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await fetch(`http://localhost:5000/api/tasks/submissions/worker/${user.email}`);
      const data = await res.json();
      setSubmissions(data);
    };

    fetchSubmissions();
  }, [user.email]);

  if (user?.role !== "worker") {
    return <p className="text-center text-red-500 mt-10">Access Denied: Workers only.</p>;
  }

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = submissions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(submissions.length / itemsPerPage);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Submissions</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Proof</th>
              <th>Submitted At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.task_title || "Untitled Task"}</td>
                <td>
                  {sub.proof && (sub.proof.startsWith("http://") || sub.proof.startsWith("https://")) ? (
                    <a href={sub.proof} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      View Proof
                    </a>
                  ) : (
                    <span className="italic text-gray-400">No proof</span>
                  )}
                </td>
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
                <td>
                  <span className={`badge ${sub.status === "approved" ? "badge-success" :
                      sub.status === "rejected" ? "badge-error" :
                        "badge-warning"
                    }`}>
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {submissions.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
