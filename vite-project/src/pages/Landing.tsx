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
                  <span>Is it compatible with my iPhone, iPad, tablet, Windows, or Android?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Absolutely! Our cloud-based POS solution is accessible via any modern web browser on iPhone, iPad, tablets, Windows, or Android devices, offering a seamless experience on any touch-enabled platform.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Which hardware or equipment do I need for your POS cloud software?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Your current equipment may already work if you’re an established business—visit our <a href="/resources" className="text-purple-600 underline">Resources page</a> for equipment demos and tutorials. For new stores or upgrades, explore our <a href="/shop" className="text-purple-600 underline">Shop</a> for compatible hardware, guaranteed to boost sales and enhance customer experience.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>How often are updates released, powered by AI GROK?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Our AI, powered by GROK, delivers timely updates based on valuable client feedback, ensuring you benefit from the latest technology and an optimized experience.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Is there a contract if I sign up for one of your plans?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">No contracts, no gimmicks! Enjoy the flexibility to cancel anytime. Try our 7-day FREE demo, test it for 30 days at just $19.99, or save 50% with our Yearly plan—whichever you choose, you’re set to win!</p>
              </motion.div>
              <motion.div
  className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
  variants={buttonVariants}
  whileHover="hover"
>
  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
    <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
    <span>What kind of support and training do you offer?</span>
  </h3>
  <p className="text-gray-600 mt-4 text-lg">Our top-tier customer service team provides robust support through an efficient ticketing system, with prompt responses. Stay connected via our active social media channels for tutorials, tips, and tricks you won’t want to miss—follow us today! 
    <div className="flex space-x-4 mt-2">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.621h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0z"/>
        </svg>
      </a>
      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </a>
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.255-2.453-1.763-2.453-1.612 0-2.237 1.208-2.237 2.541v5.516h-3v-11h2.881v1.581h.041c.395-.746 1.273-1.763 2.765-1.763 2.766 0 3.257 1.851 3.257 4.266v6.117z"/>
        </svg>
      </a>
      <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.233.308 2.686.644.52.354.972.783 1.39 1.201.419.418.847.869 1.201 1.39.336.453.582 1.32.644 2.686.058 1.265.069 1.646.069 4.85s-.012 3.584-.069 4.85c-.062 1.366-.308 2.233-.644 2.686-.354.52-.783.972-1.201 1.39-.418.419-.869.847-1.39 1.201-.453.336-1.32.582-2.686.644-1.265.058-1.646.069-4.85.069s-3.584-.012-4.85-.069c-1.366-.062-2.233-.308-2.686-.644-.52-.354-.972-.783-1.39-1.201-.418-.419-.847-.869-1.201-1.39-.336-.453-.582-1.32-.644-2.686-.058-1.265-.069-1.646-.069-4.85s.012-3.584.069-4.85c.062-1.366.308-2.233.644-2.686.354-.52.783-.972 1.201-1.39.419-.418.869-.847 1.39-1.201.453-.336 1.32-.582 2.686-.644 1.265-.058 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.67.014-4.947.072-1.254.057-2.08.203-2.812.434-.734.231-1.352.53-1.977 1.165-.625.635-.934 1.243-1.165 1.977-.231.732-.377 1.558-.434 2.812-.058 1.277-.072 1.687-.072 4.947s.014 3.67.072 4.947c.057 1.254.203 2.08.434 2.812.231.734.53 1.352 1.165 1.977.635.625 1.243.934 1.977 1.165.732.231 1.558.377 2.812.434 1.277.058 1.687.072 4.947.072s3.67-.014 4.947-.072c1.254-.057 2.08-.203 2.812-.434.734-.231 1.352-.53 1.977-1.165.625-.635.934-1.243 1.165-1.977.231-.732.377-1.558.434-2.812.058-1.277.072-1.687.072-4.947s-.014-3.67-.072-4.947c-.057-1.254-.203-2.08-.434-2.812-.231-.734-.53-1.352-1.165-1.977-.635-.625-1.243-.934-1.977-1.165-.732-.231-1.558-.377-2.812-.434-1.277-.058-1.687-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.792-4-4s1.791-4 4-4 4 1.792 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441-.645-1.441-1.44s.645-1.44 1.441-1.44c.796 0 1.441.645 1.441 1.44s-.645 1.44-1.441 1.44z"/>
        </svg>
      </a>
      <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.5303 2.66669C12.882 2.66669 13.2172 2.73777 13.5303 2.87502V6.37502C13.2172 6.23777 12.882 6.16669 12.5303 6.16669C10.2921 6.16669 8.36363 8.09517 8.36363 10.3334V13.4167H11.2727L10.9091 17H8.36363V21H5.45455V10.3334C5.45455 7.02161 8.21849 4.25767 11.5303 4.25767V2.66669Z"/>
          <path d="M18.1818 8.58331V10.9999H15.2727V8.58331C15.2727 7.2451 16.5179 6.16669 17.9091 6.16669V4.25767C15.5973 4.25767 13.6364 6.21849 13.6364 8.58331V17C13.6364 18.5919 14.6503 19.9167 16 20.4167V18.4167C15.1924 18.1333 14.5455 17.4333 14.5455 16.5833V13.4167H17.9091V15.8333C17.9091 17.1715 16.6636 18.25 15.2727 18.25V20.25C17.5845 20.25 19.5455 18.2892 19.5455 15.9167V8.58331H18.1818Z"/>
        </svg>
      </a>
    </div>
  </p>
</motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>What about additional costs or optional features?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">We pride ourselves on being among the most affordable in the industry without compromising quality. Enhance your experience with optional features, modules, and add-ons tailored to your store’s unique needs.</p>
              </motion.div>
              <motion.div
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
              >
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="h-10 w-10 text-purple-600" />
                  <span>Can this be installed on my computer, or do I require internet?</span>
                </h3>
                <p className="text-gray-600 mt-4 text-lg">Our innovative cloud solution empowers your business with remote access from anywhere—whether you’re in-store or visiting clients—delivering a flexible, internet-based POS system tailored to your needs.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </Layout>
  );
};

export default Landing;