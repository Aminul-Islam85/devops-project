const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12 rounded-lg shadow-inner">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-xl font-semibold">MicroTasks</h3>
        <p className="text-sm text-gray-300">
          Empowering micro-entrepreneurs worldwide. Join us and start earning today.
        </p>
        <div className="flex justify-center space-x-6 text-gray-400">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">
            {/* Facebook Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.876v-6.988H7.898v-2.888h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">
            {/* Twitter Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6.003c-.77.342-1.6.572-2.47.676a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4a4.28 4.28 0 0 0-4.28 4.28c0 .34.04.68.12 1A12.13 12.13 0 0 1 3.1 5.14a4.28 4.28 0 0 0 1.33 5.71 4.26 4.26 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.94.073 4.28 4.28 0 0 0 4 2.97A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.67 8.67 0 0 0 22.46 6z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
            {/* LinkedIn Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14C2.239 0 0 2.238 0 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.762-2.238-5-5-5zM7.58 20H4.42V9h3.16v11zM6 7.657a1.83 1.83 0 1 1 0-3.658 1.83 1.83 0 0 1 0 3.658zM20 20h-3.16v-5.604c0-1.337-.027-3.06-1.866-3.06-1.867 0-2.153 1.459-2.153 2.963V20H9.66V9h3.037v1.508h.043c.423-.8 1.456-1.646 2.998-1.646 3.205 0 3.795 2.109 3.795 4.849V20z"/>
            </svg>
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">&copy; {new Date().getFullYear()} MicroTasks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
