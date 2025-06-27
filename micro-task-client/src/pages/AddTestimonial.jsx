import { useState } from "react";

const AddTestimonial = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const testimonial = {
      name: user.name,
      message,
      avatar: user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
      role: user.role,
    };

    const res = await fetch("http://localhost:5000/api/tasks/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonial),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Testimonial submitted successfully!");
      setMessage("");
    } else {
      alert(data.message || "Failed to submit testimonial");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Write a Testimonial</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea textarea-bordered w-full mb-4"
          placeholder="Share your experience..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button className="btn btn-primary w-full" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddTestimonial;
