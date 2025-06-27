import { useEffect, useState } from "react";

const AvailableTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));



  useEffect(() => {
    const fetchAvailableTasks = async () => {
      const res = await fetch("http://localhost:5000/api/tasks/available");
      const data = await res.json();
      setTasks(data);
    };
    fetchAvailableTasks();
  }, []);

  if (user?.role !== "worker") {
    return <p className="text-center text-red-500 mt-10">Access Denied: Workers only.</p>;
  }

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    const form = e.target;

    const proof = form.proof.value.trim();

    if (!proof.startsWith("http://") && !proof.startsWith("https://")) {
      alert("Please enter a valid proof link starting with http:// or https://");
      return;
    }

    const submission = {
      task_id: selectedTask._id,
      worker_email: user.email,
      worker_name: user.name,
      proof,
    };

    const res = await fetch("http://localhost:5000/api/tasks/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Task submitted successfully!");
      setSelectedTask(null);
    } else {
      alert(data.message || "Submission failed.");
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Tasks</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Workers</th>
              <th>Pay</th>
              <th>Deadline</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.task_title}</td>
                <td>{task.required_workers}</td>
                <td>{task.payable_amount}</td>
                <td>{task.completion_date}</td>
                <td>
                  {user?.role === "worker" && (
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => setSelectedTask(task)}
                    >
                      Submit Task
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {selectedTask && (
        <dialog id="proof_modal" className="modal modal-open">
          <form onSubmit={handleSubmitProof} method="dialog" className="modal-box space-y-4">
            <h3 className="font-bold text-lg">Submit Task Proof</h3>
            <p className="text-sm">Task: <strong>{selectedTask.task_title}</strong></p>
            <textarea
              name="proof"
              className="textarea textarea-bordered w-full"
              placeholder="Enter your proof link or comment"
              required
            ></textarea>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button onClick={() => setSelectedTask(null)} className="btn">Cancel</button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AvailableTasks;
