import { useEffect, useState } from "react";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks/available");
    const data = await res.json();
    setTasks(data);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      alert("Task deleted.");
      fetchTasks();
    } else {
      alert(data.message || "Delete failed.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Buyer</th>
              <th>Pay</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.task_title}</td>
                <td>{task.buyer_email}</td>
                <td>{task.payable_amount}</td>
                <td>{task.completion_date}</td>
                <td>
                  <button onClick={() => handleDelete(task._id)} className="btn btn-xs btn-error">
                    Delete
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

export default ManageTasks;
