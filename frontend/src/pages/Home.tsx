import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 font-inter">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-20 transition-all duration-300 ${
          isScrolled ? 'bg-primary shadow-lg' : 'bg-transparent'
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">HR Analytics</h1>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="hover:text-secondary transition-colors">Home</a>
              <a href="#features" className="hover:text-secondary transition-colors">Features</a>
              <a href="#dashboard" className="hover:text-secondary transition-colors">Dashboard</a>
              <a href="#contact" className="hover:text-secondary transition-colors">Contact</a>
              <Link
                to="/login"
                className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button className="text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-20 bg-cover bg-center text-white relative"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('https://plus.unsplash.com/premium_photo-1661497675847-2075003562fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Empower Your HR with Data-Driven Insights
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Track KPIs, manage OKRs, collect 360 feedback, and visualize performance trends with our comprehensive HR analytics platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md text-lg font-medium transition-transform transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition-transform transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fadeIn">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: KPI Tracking */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow transform hover:scale-105 animate-fadeIn">
              <div className="text-primary text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">KPI Tracking</h3>
              <p className="text-gray-600">
                Monitor key performance indicators in real-time to drive employee and organizational success.
              </p>
            </div>

            {/* Feature 2: OKR Management */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow transform hover:scale-105 animate-fadeIn">
              <div className="text-primary text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">OKR Management</h3>
              <p className="text-gray-600">
                Set, track, and achieve Objectives and Key Results with our intuitive management system.
              </p>
            </div>

            {/* Feature 3: 360° Feedback */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow transform hover:scale-105 animate-fadeIn">
              <div className="text-primary text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">360° Feedback</h3>
              <p className="text-gray-600">
                Collect comprehensive feedback from peers, managers, and direct reports for holistic evaluations.
              </p>
            </div>

            {/* Feature 4: HR Dashboard */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow transform hover:scale-105 animate-fadeIn">
              <div className="text-primary text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">HR Dashboard</h3>
              <p className="text-gray-600">
                Visualize analytics and goal trends with an intuitive, data-driven dashboard.
              </p>
            </div>

            {/* Feature 5: Performance Reports */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow transform hover:scale-105 animate-fadeIn">
              <div className="text-primary text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Performance Reports</h3>
              <p className="text-gray-600">
                Export monthly performance summaries in PDF or Excel for seamless reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-20 bg-accent text-white animate-fadeIn"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your HR Processes?</h2>
          <p className="text-xl mb-8">
            Join thousands of companies that trust our platform to drive HR analytics and performance management.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium inline-block transition-transform transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">© 2025 HR Analytics. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-secondary transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;