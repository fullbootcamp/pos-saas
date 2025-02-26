// File: src/pages/Landing.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector('header');
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (!header) return;
      if (currentScroll <= 0) {
        header.classList.remove('sticky-blend');
        header.style.background = 'linear-gradient(90deg, #8b5cf6, #6366f1)'; // Match hero at top
      } else if (currentScroll > lastScroll) {
        header.classList.add('sticky-blend');
      } else {
        header.classList.remove('sticky-blend');
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout title="Welcome to POS SaaS">
      <style>{`
        header.sticky-blend {
          background: linear-gradient(90deg, #7c3aed, #4f46e5); /* Slightly darker on scroll */
        }
        @media (prefers-reduced-motion: no-preference) {
          header {
            transition: background 0.3s ease;
          }
        }
      `}</style>
      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-20 text-center w-full">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Streamline Your Business with POS SaaS
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Fast, touch-friendly point of sale for retail, restaurants, and more.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-vintage-rose-vibrant-pink text-white py-4 px-8 rounded-md text-xl font-semibold hover:bg-vintage-rose-medium-purple transition-all duration-300"
            >
              Try FREE DEMO
            </button>
          </div>
        </section>

        {/* Why Us? */}
        <section id="why-us" className="py-16 bg-white w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Us?</h2>
            <p className="text-lg text-gray-600">
              We deliver a seamless, affordable POS solution tailored for speed and ease, trusted by businesses worldwide.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 bg-gray-100 w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative p-8 bg-white rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105">
                <h3 className="text-2xl font-semibold text-vintage-rose-deep-purple">Free Demo</h3>
                <p className="text-3xl font-bold mt-4 text-vintage-rose-deep-purple">
                  $0 <span className="text-base text-gray-600">/7 days</span>
                </p>
                <p className="text-gray-600 mt-4">Explore our features and try out for 7 days</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-4 bg-vintage-rose-deep-purple text-white rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 text-lg font-semibold"
                >
                  Start Now
                </button>
              </div>
              <div className="relative p-8 bg-white rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105 border-4 border-vintage-rose-deep-purple">
                <div className="absolute top-0 right-0 bg-vintage-rose-deep-purple text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                  Recommended
                </div>
                <h3 className="text-2xl font-semibold text-vintage-rose-deep-purple">Monthly</h3>
                <p className="text-3xl font-bold mt-4 text-vintage-rose-vibrant-pink">
                  $19.99 <span className="text-base text-gray-600">/30 days</span>
                </p>
                <p className="text-gray-600 mt-4">Full access, billed monthly</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-4 bg-vintage-rose-vibrant-pink text-white rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 text-lg font-semibold"
                >
                  Start Now
                </button>
              </div>
              <div className="relative p-8 bg-white rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-sm font-bold px-4 py-1 rounded-full">
                  Save 50% Off
                </div>
                <h3 className="text-2xl font-semibold text-vintage-rose-deep-purple">Yearly</h3>
                <p className="text-3xl font-bold mt-6 text-vintage-rose-deep-purple">
                  $9.99 <span className="text-base text-gray-600">/month</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">billed annually as $119.99</p>
                <p className="text-gray-600 mt-4">Regular Price: $239.88</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-4 bg-vintage-rose-deep-purple text-white rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 text-lg font-semibold"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-vintage-rose-soft-pink w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Fast Transactions</h3>
                <p className="text-gray-600 mt-2">Serve customers quickly with touch-friendly design.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Multi-Industry</h3>
                <p className="text-gray-600 mt-2">Works for retail, restaurants, and more.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Affordable</h3>
                <p className="text-gray-600 mt-2">Plans to fit any budget, starting free.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-vintage-rose-soft-pink w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Inventory Management</h3>
                <p className="text-gray-600 mt-2">Track stock easily.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Quick Payments</h3>
                <p className="text-gray-600 mt-2">Process sales in seconds.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Reporting</h3>
                <p className="text-gray-600 mt-2">Insights at your fingertips.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-vintage-rose-light-pink w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600 italic">"Sped up our checkout by 50%!"</p>
                <p className="text-gray-800 font-semibold mt-2">- Retail Owner</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600 italic">"Perfect for my restaurant."</p>
                <p className="text-gray-800 font-semibold mt-2">- Restaurant Manager</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-vintage-rose-light-pink w-full">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Is it really free to try?</h3>
                <p className="text-gray-600">Yes, our 7-day demo is completely free—no credit card needed!</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">What devices does it work on?</h3>
                <p className="text-gray-600">Any touchscreen device—tablets, laptops, or POS terminals.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Landing;