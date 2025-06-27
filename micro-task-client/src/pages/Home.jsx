import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";


const Home = () => {
  const [topWorkers, setTopWorkers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTopWorkers = async () => {
      const res = await fetch("http://localhost:5000/api/tasks/top-workers");
      const data = await res.json();
      setTopWorkers(data);
    };

    const fetchTestimonials = async () => {
      const res = await fetch("http://localhost:5000/api/tasks/testimonials");
      const data = await res.json();
      setTestimonials(data);
    };

    fetchTopWorkers();
    fetchTestimonials();
  }, []);

  return (
    <div className="space-y-16 p-6">

      <section className="text-center py-20 bg-blue-100 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Micro-Task Platform</h1>
        <p className="text-lg mb-6">Complete simple tasks and earn rewards instantly.</p>
        <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
      </section>


      <section>
        <h2 className="text-3xl font-semibold text-center mb-6">Top Workers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topWorkers.map((worker, i) => (
            <div key={i} className="p-4 bg-white rounded shadow text-center">
              <img
                src={worker.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}`}
                alt="Worker"
                className="w-24 h-24 mx-auto rounded-full mb-3"
              />
              <h3 className="font-semibold">{worker.name}</h3>
              <p className="text-sm text-gray-500">Coins: {worker.coins}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="bg-gray-100 py-10 px-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-center mb-6">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded shadow-md">
              <p className="italic text-gray-700">"{t.text}"</p>
              <div className="mt-4 text-right font-bold">- {t.user}</div>
            </div>
          ))}
        </div>
      </section>


      <section className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <p className="max-w-xl mx-auto text-gray-600">
          MicroTasks connects buyers with a workforce of micro-taskers worldwide. Earn securely, pay efficiently, and grow your productivity.
        </p>
      </section>

      <Footer />

    </div>
  );
};

export default Home;
