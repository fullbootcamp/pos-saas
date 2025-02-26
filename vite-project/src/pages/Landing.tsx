import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { HomeIcon, CheckCircleIcon, CreditCardIcon, UserGroupIcon, ChartBarIcon, ChatBubbleLeftIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector('header');
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (!header) {
        console.error('Header element not found');
        return;
      }
      if (currentScroll <= 0) {
        header.classList.remove('sticky-blend');
        header.style.background = 'linear-gradient(90deg, #8b5cf6, #6366f1)'; // Match hero
      } else if (currentScroll > lastScroll) {
        header.classList.add('sticky-blend');
      } else {
        header.classList.remove('sticky-blend');
      }
      lastScroll = currentScroll;
    };

    console.log('Landing mounted'); // Debug log
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout title="Welcome to POS SaaS">
      <style>{`
        header.sticky-blend {
          background: linear-gradient(90deg, #7c3aed, #4f46e5); /* Darker on scroll */
        }
        @media (prefers-reduced-motion: no-preference) {
          header {
            transition: background 0.3s ease;
          }
        }
      `}</style>
      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-28 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <HomeIcon className="h-16 w-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Streamline Your Business with POS SaaS
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Fast, touch-friendly point of sale for retail, restaurants, and more.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-pink-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-all duration-300 flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>Try FREE DEMO</span>
            </button>
          </div>
        </section>

        {/* Why Us? */}
        <section id="why-us" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              We deliver a seamless, affordable POS solution tailored for speed and ease, trusted by businesses worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CheckCircleIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Fast Transactions</h3>
                <p className="text-gray-600 mt-2">Serve customers quickly with our touch-friendly design.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <UserGroupIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Multi-Industry</h3>
                <p className="text-gray-600 mt-2">Works for retail, restaurants, and more.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CreditCardIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Affordable</h3>
                <p className="text-gray-600 mt-2">Plans to fit any budget, starting free.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Free Demo</h3>
                <p className="text-3xl font-bold mt-4 text-green-600">$0 <span className="text-base text-gray-600">/7 days</span></p>
                <p className="text-gray-600 mt-2">Explore our features with a 7-day trial</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-lg font-semibold"
                >
                  Start Now
                </button>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-4 border-purple-600 relative">
                <span className="absolute top-4 right-4 bg-purple-600 text-white text-sm font-bold px-2 py-1 rounded">Recommended</span>
                <CheckCircleIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Monthly</h3>
                <p className="text-3xl font-bold mt-4 text-purple-600">$19.99 <span className="text-base text-gray-600">/30 days</span></p>
                <p className="text-gray-600 mt-2">Full access, billed monthly</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-lg font-semibold"
                >
                  Start Now
                </button>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <span className="bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">Save 50% Off</span>
                <CheckCircleIcon className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                <h3 className="text-2xl font-semibold text-gray-800">Yearly</h3>
                <p className="text-3xl font-bold mt-2 text-yellow-600">$9.99 <span className="text-base text-gray-600">/month</span></p>
                <p className="text-sm text-gray-500 mt-1">Billed annually as $119.99</p>
                <p className="text-gray-600 mt-2">Regular Price: $239.88</p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all text-lg font-semibold"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <ChartBarIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Fast Transactions</h3>
                <p className="text-gray-600 mt-2">Serve customers quickly with our touch-friendly design.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <UserGroupIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Multi-Industry</h3>
                <p className="text-gray-600 mt-2">Works for retail, restaurants, and more.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CreditCardIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Affordable</h3>
                <p className="text-gray-600 mt-2">Plans to fit any budget, starting free.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <ChartBarIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Inventory Management</h3>
                <p className="text-gray-600 mt-2">Track stock easily with real-time updates.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CreditCardIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Quick Payments</h3>
                <p className="text-gray-600 mt-2">Process sales in seconds with secure payments.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <ChartBarIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Reporting</h3>
                <p className="text-gray-600 mt-2">Get actionable insights with detailed reports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-6 bg-gray-100 rounded-xl shadow-lg">
                <ChatBubbleLeftIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600 italic text-lg">"Sped up our checkout by 50%!"</p>
                <p className="text-gray-800 font-semibold mt-2">- Retail Owner</p>
              </div>
              <div className="p-6 bg-gray-100 rounded-xl shadow-lg">
                <ChatBubbleLeftIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600 italic text-lg">"Perfect for my restaurant."</p>
                <p className="text-gray-800 font-semibold mt-2">- Restaurant Manager</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faq" className="py-24 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10">Frequently Asked Questions</h2>
            <div className="space-y-8 text-left max-w-3xl mx-auto">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3">
                  <QuestionMarkCircleIcon className="h-8 w-8 text-purple-600" />
                  <span>Is it really free to try?</span>
                </h3>
                <p className="text-gray-600 mt-2 text-lg">Yes, our 7-day demo is completely free—no credit card needed!</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3">
                  <QuestionMarkCircleIcon className="h-8 w-8 text-purple-600" />
                  <span>What devices does it work on?</span>
                </h3>
                <p className="text-gray-600 mt-2 text-lg">Any touchscreen device—tablets, laptops, or POS terminals.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Landing;