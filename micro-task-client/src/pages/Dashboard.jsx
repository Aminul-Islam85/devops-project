import Footer from "../components/Footer";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="text-center space-y-10">
      <div className="py-20">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome to the Dashboard!
        </h1>
        <p className="text-lg">
          Hello {user?.name}, you are logged in as a{" "}
          <span className="capitalize font-semibold text-accent">{user?.role}</span>.
        </p>
        <p className="text-gray-500 mt-2">
          Use the sidebar to explore your personalized dashboard features.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
