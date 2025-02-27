import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  HomeIcon, 
  CheckCircleIcon, 
  CreditCardIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  ChatBubbleLeftIcon, 
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

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
        header.style.background = 'linear-gradient(90deg, #8b5cf6, #6366f1)';
      } else if (currentScroll > lastScroll) {
        header.classList.add('sticky-blend');
      } else {
        header.classList.remove('sticky-blend');
      }
      lastScroll = currentScroll;
    };

    console.log('Landing mounted');
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <Layout title="Welcome to POS SaaS">
      <style>{`
        header.sticky-blend {
          background: linear-gradient(90deg, #7c3aed, #4f46e5);
        }
        @media (prefers-reduced-motion: no-preference) {
          header {
            transition: background 0.3s ease;
          }
          section {
            transition: opacity 0.6s ease, transform 0.6s ease;
          }
        }
      `}</style>
      <main className="flex-1 w-full">
        {/* Hero */}
        <motion.section
          className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-32 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            >
              <HomeIcon className="h-20 w-20 mx-auto text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Streamline Your Business with POS SaaS
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Fast, touch-friendly point of sale for retail, restaurants, and more.
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              className="bg-pink-600 text-white py-4 px-10 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-all duration-300 flex items-center space-x-3"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <CheckCircleIcon className="h-6 w-6" />
              <span>Try FREE DEMO</span>
              <ArrowRightIcon className="h-6 w-6" />
            </motion.button>
          </div>
        </motion.section>

        {/* Why Us? */}
        <motion.section
          id="why-us"
          className="py-24 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">Why Choose Us?</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-14 max-w-4xl mx-auto">
              We deliver a seamless, affordable POS solution tailored for speed and ease, trusted by businesses worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CheckCircleIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Fast Transactions</h3>
                <p className="text-gray-600 mt-4">Serve customers quickly with our touch-friendly design.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <UserGroupIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Multi-Industry</h3>
                <p className="text-gray-600 mt-4">Works for retail, restaurants, and more.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CreditCardIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Affordable</h3>
                <p className="text-gray-600 mt-4">Plans to fit any budget, starting free.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChatBubbleLeftIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Exceptional Support</h3>
                <p className="text-gray-600 mt-4">Incredible customer service with 24/7 email and phone support.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CogIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">AI-Powered Team</h3>
                <p className="text-gray-600 mt-4">The best technical team, enhanced by AI GROK, for cutting-edge solutions.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ShieldCheckIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Secure & Robust</h3>
                <p className="text-gray-600 mt-4">Advanced security and reliable performance for your business.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Pricing */}
        <motion.section
          id="pricing"
          className="py-24 bg-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CheckCircleIcon className="h-14 w-14 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Free Demo</h3>
                <p className="text-3xl font-bold mt-4 text-green-600">$0 <span className="text-base text-gray-600">/7 days</span></p>
                <p className="text-gray-600 mt-4">Explore our features with a 7-day trial</p>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-lg font-semibold"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Start Now
                </motion.button>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow border-4 border-purple-600 relative"
                variants={buttonVariants}
                whileHover="hover"
              >
                <span className="absolute top-4 right-4 bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded">Recommended</span>
                <CheckCircleIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Monthly</h3>
                <p className="text-3xl font-bold mt-4 text-purple-600">$19.99 <span className="text-base text-gray-600">/30 days</span></p>
                <p className="text-gray-600 mt-4">Full access, billed monthly</p>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-lg font-semibold"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Start Now
                </motion.button>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <span className="bg-yellow-400 text-black text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">Save 50% Off</span>
                <CheckCircleIcon className="h-14 w-14 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Yearly</h3>
                <p className="text-3xl font-bold mt-2 text-yellow-600">$9.99 <span className="text-base text-gray-600">/month</span></p>
                <p className="text-sm text-gray-500 mt-1">Billed annually as $119.99</p>
                <p className="text-gray-600 mt-2">Regular Price: $239.88</p>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="mt-6 w-full py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all text-lg font-semibold"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Start Now
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section
          className="py-24 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChartBarIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Fast Transactions</h3>
                <p className="text-gray-600 mt-4">Serve customers quickly with our touch-friendly design.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <UserGroupIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Multi-Industry</h3>
                <p className="text-gray-600 mt-4">Works for retail, restaurants, and more.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CreditCardIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Affordable</h3>
                <p className="text-gray-600 mt-4">Plans to fit any budget, starting free.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChartBarIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Advanced Reporting</h3>
                <p className="text-gray-600 mt-4">Detailed insights to optimize your business performance.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CreditCardIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Seamless Payments</h3>
                <p className="text-gray-600 mt-4">Integrate multiple payment methods with ease.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <UserGroupIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">User-Friendly Setup</h3>
                <p className="text-gray-600 mt-4">Quick and intuitive setup for all business sizes.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          className="py-24 bg-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChartBarIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Inventory Management</h3>
                <p className="text-gray-600 mt-4">Track stock easily with real-time updates.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CreditCardIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Quick Payments</h3>
                <p className="text-gray-600 mt-4">Process sales in seconds with secure payments.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChartBarIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Reporting</h3>
                <p className="text-gray-600 mt-4">Get actionable insights with detailed reports.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChartBarIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Custom Discounts</h3>
                <p className="text-gray-600 mt-4">Create weekly promos, BOGOs, and more.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <CreditCardIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Label Printing</h3>
                <p className="text-gray-600 mt-4">Generate barcodes and price tags effortlessly.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <UserGroupIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800">Multi-Store Sync</h3>
                <p className="text-gray-600 mt-4">Manage multiple locations from one platform.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          className="py-24 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                className="p-8 bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChatBubbleLeftIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <p className="text-gray-600 italic text-lg">"Sped up our checkout by 50%!"</p>
                <p className="text-gray-800 font-semibold mt-4">- Retail Owner</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChatBubbleLeftIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <p className="text-gray-600 italic text-lg">"Perfect for my restaurant."</p>
                <p className="text-gray-800 font-semibold mt-4">- Restaurant Manager</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChatBubbleLeftIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <p className="text-gray-600 italic text-lg">"Transformed our inventory management!"</p>
                <p className="text-gray-800 font-semibold mt-4">- Small Business Owner</p>
              </motion.div>
              <motion.div
                className="p-8 bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <ChatBubbleLeftIcon className="h-14 w-14 text-indigo-600 mx-auto mb-6" />
                <p className="text-gray-600 italic text-lg">"Excellent support for my clothing store."</p>
                <p className="text-gray-800 font-semibold mt-4">- Clothing Store Manager</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* FAQs */}
        <motion.section
          id="faq"
          className="py-24 bg-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="space-y-10 text-left max-w-3xl mx-auto">
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Is it free to try?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Yes, our 7-day demo is free with no credit card required.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>What devices are supported?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Works on any touchscreen device—tablets, laptops, or POS terminals.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Are there additional fees?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">No additional fees; includes a full license with updates.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Is training available?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Yes, we provide a guide, online tutorials, and 24/7 email/phone support.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Can I manage inventory and discounts?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Yes, track inventory, process sales/returns, and create custom discounts.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Does it include software?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Yes, the software is included with a full license.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>How often are updates released?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Updates are released approximately once a year with new features.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Is there a warranty?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Yes, we offer a 3-month warranty with free exchanges for faulty items.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Can I import/export data?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Yes, import/export inventory data using Excel files.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Is it compatible with QuickBooks?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Currently not compatible, but we offer robust in-house reporting.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </Layout>
  );
};

export default Landing;