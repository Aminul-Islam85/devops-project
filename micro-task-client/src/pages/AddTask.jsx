import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please log in again.");
    navigate("/login");
    return null; // or return a loader
  }


  const handleAddTask = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const required_workers = parseInt(form.required_workers.value);
    const payable_amount = parseFloat(form.payable_amount.value);
    const totalPay = required_workers * payable_amount;

    const task = {
      task_title: form.task_title.value,
      task_detail: form.task_detail.value,
      required_workers,
      payable_amount,
      completion_date: form.completion_date.value,
      submission_info: form.submission_info.value,
      task_image_url: form.task_image_url.value,
      buyer_email: user.email,
    };

    try {
      const res = await fetch("http://localhost:5000/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.redirect) {
          alert(data.message);
          navigate(data.redirect);
        } else {
          setError(data.message || "Failed to add task.");
        }
        return;
      }


      const updatedUser = { ...user, coins: user.coins - totalPay };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Task added successfully!");
      form.reset();
      navigate("/dashboard/my-tasks");
    } catch {
      setError("Something went wrong. Please try again later.");
    }
  };


  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Add New Task</h2>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={handleAddTask} className="space-y-4">
        <input type="text" name="task_title" placeholder="Task Title" className="input input-bordered w-full" required />
        <textarea name="task_detail" placeholder="Task Description" className="textarea textarea-bordered w-full" required />

        <input type="number" name="required_workers" placeholder="Required Workers" className="input input-bordered w-full" required />
        <input type="number" name="payable_amount" placeholder="Payable Amount (per worker)" className="input input-bordered w-full" required />

        <input type="date" name="completion_date" className="input input-bordered w-full" required />
        <input type="text" name="submission_info" placeholder="Submission Info (e.g. Screenshot)" className="input input-bordered w-full" required />
        <input type="text" name="task_image_url" placeholder="Image URL (optional)" className="input input-bordered w-full" />

        <button type="submit" className="btn btn-primary w-full">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
