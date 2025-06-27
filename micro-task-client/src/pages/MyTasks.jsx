import { useEffect, useState, useCallback } from "react";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = useCallback(async () => {
    const res = await fetch(`http://localhost:5000/api/tasks/my?email=${user.email}`);
    const data = await res.json();
    setTasks(data);
  }, [user.email]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, user.email]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      alert("Task deleted.");
      const userRes = await fetch(`http://localhost:5000/api/auth/user/${user.email}`);
      const refreshedUser = await userRes.json();

      localStorage.setItem("user", JSON.stringify(refreshedUser));

      await fetchTasks(); // Refresh task list
      window.location.reload(); // Or trigger a coin display refresh manually
    } else {
      alert(data.message || "Delete failed.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updated = {
      task_title: form.task_title.value,
      task_detail: form.task_detail.value,
      required_workers: parseInt(form.required_workers.value),
      payable_amount: parseFloat(form.payable_amount.value),
      completion_date: form.completion_date.value,
      submission_info: form.submission_info.value,
      task_image_url: form.task_image_url.value,
    };

    const res = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Task updated successfully!");
      await fetchTasks();
      setEditingTask(null);
    } else {
      alert(data.message || "Update failed.");
    }
  };

  const handleStatusUpdate = async (submissionId, status) => {
    const confirmMsg = `Are you sure you want to ${status} this submission?`;
    if (!window.confirm(confirmMsg)) return;

    const res = await fetch(`http://localhost:5000/api/tasks/submissions/${submissionId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Submission marked as ${status}`);
      const updated = submissions.map(sub =>
        sub._id === submissionId ? { ...sub, status } : sub
      );
      setSubmissions(updated);
    } else {
      alert(data.message || "Failed to update status.");
    }
  };

  const loadSubmissions = async (taskId) => {
    const res = await fetch(`http://localhost:5000/api/tasks/submissions/task/${taskId}`);
    const data = await res.json();
    setSubmissions(data);

    setTimeout(() => {
      const modal = document.getElementById("submissions_modal");
      if (modal) modal.showModal();
    }, 0);
  };


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      <div className="overflow-x-auto w-full">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Workers</th>
              <th>Pay / Worker</th>
              <th>Total</th>
              <th>Deadline</th>
              <th className="min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.task_title}</td>
                <td>{task.required_workers}</td>
                <td>{task.payable_amount}</td>
                <td>{task.total_payable}</td>
                <td>{task.completion_date}</td>
                <td className="flex flex-wrap gap-2">
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(task._id)}>Delete</button>
                  <button className="btn btn-xs btn-info" onClick={() => setEditingTask(task)}>Edit</button>
                  <button className="btn btn-xs btn-secondary" onClick={() => loadSubmissions(task._id)}>View Submissions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {editingTask && (
        <dialog id="edit_modal" className="modal modal-open">
          <form onSubmit={handleEditSubmit} method="dialog" className="modal-box space-y-4">
            <h3 className="font-bold text-lg">Edit Task</h3>
            <input name="task_title" defaultValue={editingTask.task_title} className="input input-bordered w-full" />
            <textarea name="task_detail" defaultValue={editingTask.task_detail} className="textarea textarea-bordered w-full" />
            <input type="number" name="required_workers" defaultValue={editingTask.required_workers} className="input input-bordered w-full" />
            <input type="number" name="payable_amount" defaultValue={editingTask.payable_amount} className="input input-bordered w-full" />
            <input type="date" name="completion_date" defaultValue={editingTask.completion_date} className="input input-bordered w-full" />
            <input name="submission_info" defaultValue={editingTask.submission_info} className="input input-bordered w-full" />
            <input name="task_image_url" defaultValue={editingTask.task_image_url} className="input input-bordered w-full" />
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Save</button>
              <button onClick={() => setEditingTask(null)} className="btn">Cancel</button>
            </div>
          </form>
        </dialog>
      )}


      <dialog id="submissions_modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">Worker Submissions</h3>

          {submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table text-sm">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Email</th>
                    <th>Proof</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.worker_name}</td>
                      <td>{sub.worker_email}</td>
                      <td>
                        <a href={sub.proof} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a>
                      </td>
                      <td>
                        <span className={`badge ${sub.status === "approved" ? "badge-success" :
                            sub.status === "rejected" ? "badge-error" : "badge-warning"
                          }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td className="flex gap-1">
                        <button
                          onClick={() => handleStatusUpdate(sub._id, "approved")}
                          className="btn btn-xs btn-success"
                          disabled={sub.status === "approved"}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(sub._id, "rejected")}
                          className="btn btn-xs btn-error"
                          disabled={sub.status === "rejected"}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setSubmissions([])}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyTasks;