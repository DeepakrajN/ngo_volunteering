import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeatureCard = ({ to, title, desc, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group"
  >
    <Link to={to} className="block bg-primary-600 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-primary-500 hover:border-primary-400">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 group-hover:bg-primary-100 transition-colors duration-300">
          <span className="text-3xl text-primary-600">{icon}</span>
        </div>
        <h3 className="font-bold text-xl text-white mb-2 group-hover:text-primary-200 transition-colors duration-300">{title}</h3>
        <p className="text-primary-100 leading-relaxed">{desc}</p>
      </div>
    </Link>
  </motion.div>
);

const StatCard = ({ value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="text-center p-6 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg"
  >
    <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{value}</div>
    <div className="text-sm font-medium text-white uppercase tracking-wide drop-shadow-md">{label}</div>
  </motion.div>
);

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [heroRef] = useInView({ threshold: 0.1 });

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Here you can add actual subscription logic, like sending to an API
    setIsSubscribed(true);
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
  };

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((j) => setAnnouncements(j.slice(0, 3)))
      .catch(() => {});

    fetch('/api/events')
      .then((r) => r.json())
      .then((j) => setEvents(j.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <header ref={heroRef} className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm hidden lg:block"
        >
          <div className="w-full h-full flex items-center justify-center text-white text-2xl">🌟</div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm hidden lg:block"
        >
          <div className="w-full h-full flex items-center justify-center text-white text-xl">💝</div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-20 w-14 h-14 bg-white/10 rounded-full backdrop-blur-sm hidden lg:block"
        >
          <div className="w-full h-full flex items-center justify-center text-white text-xl">🤝</div>
        </motion.div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Making a Difference
                <motion.span
                  className="block text-primary-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Together
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-xl text-primary-100 mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Join our community of volunteers creating positive change through meaningful projects, events, and initiatives that impact lives.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link
                  to="/register"
                  className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Become a Volunteer
                </Link>
                <Link
                  to="/events"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Explore Events
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="grid grid-cols-3 gap-6"
              >
                <StatCard value="120+" label="Volunteers" delay={0.4} />
                <StatCard value="45" label="Events" delay={0.5} />
                <StatCard value="30+" label="Communities" delay={0.6} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=800&fit=crop"
                  alt="Volunteers working together"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                />
                <motion.div
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 min-w-[200px]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">👥</span>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-neutral-900">500+</div>
                      <div className="text-sm text-neutral-600">Lives Impacted</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How You Can Help
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Choose your path to make a meaningful impact in our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              to="/register"
              title="Join as Volunteer"
              desc="Create your profile and connect with opportunities that match your skills and interests."
              icon="🤝"
              delay={0.1}
            />
            <FeatureCard
              to="/events"
              title="Participate in Events"
              desc="Join community events, workshops, and initiatives that create lasting change."
              icon="📅"
              delay={0.2}
            />
            <FeatureCard
              to="/donate"
              title="Support Our Mission"
              desc="Make a donation or sponsor an event to help us reach more people in need."
              icon="💝"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              What Our Volunteers Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Hear from volunteers who are making a real difference in their communities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-primary-600 font-bold">S</span>
                </motion.div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Sarah Johnson</h4>
                  <p className="text-sm text-neutral-600">Community Volunteer</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                "Volunteering here has been incredibly rewarding. I've met amazing people and contributed to causes that truly matter."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-primary-600 font-bold">M</span>
                </motion.div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Michael Chen</h4>
                  <p className="text-sm text-neutral-600">Event Coordinator</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                "The organization is well-structured and supportive. Every volunteer feels valued and their contributions appreciated."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-primary-600 font-bold">A</span>
                </motion.div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Anna Rodriguez</h4>
                  <p className="text-sm text-neutral-600">Youth Mentor</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                "Working with this NGO has opened my eyes to the power of community action. Together, we can create lasting change."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/30"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-300/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Stay Connected
            </motion.h2>
            <motion.p
              className="text-xl text-neutral-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Get the latest updates on our events, volunteer opportunities, and community impact stories delivered to your inbox.
            </motion.p>

            {!isSubscribed ? (
              <motion.form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                className="fixed bottom-4 right-4 z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={handleUnsubscribe}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Unsubscribe
                </button>
              </motion.div>
            )}

            <motion.p
              className="text-sm text-neutral-500 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Our Partners
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We collaborate with amazing organizations to amplify our impact
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:border-primary-200 transition-all duration-300 flex items-center justify-center min-h-[120px]"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary-600 opacity-60">
                  🏢
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-24 h-24 bg-white/5 rounded-full"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Real results from our community's collective efforts
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                viewport={{ once: true }}
              >
                500+
              </motion.div>
              <div className="text-lg font-medium text-neutral-300">Lives Impacted</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                viewport={{ once: true }}
              >
                120+
              </motion.div>
              <div className="text-lg font-medium text-neutral-300">Active Volunteers</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                viewport={{ once: true }}
              >
                45
              </motion.div>
              <div className="text-lg font-medium text-neutral-300">Events Hosted</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                viewport={{ once: true }}
              >
                30+
              </motion.div>
              <div className="text-lg font-medium text-neutral-300">Communities Served</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events & Announcements Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">Upcoming Events</h2>
                  <Link to="/events" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300">
                    View All →
                  </Link>
                </div>

                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-neutral-600">No events scheduled at the moment.</p>
                    <p className="text-sm text-neutral-500 mt-2">Check back soon for upcoming opportunities!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event, i) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600">📅</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{event.title}</h3>
                            <p className="text-sm text-neutral-600">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <Link
                          to="/events"
                          className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
                        >
                          Learn More →
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">Announcements</h2>
                  <Link to="/announcements" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300">
                    View All →
                  </Link>
                </div>

                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📢</div>
                    <p className="text-neutral-600">No announcements at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement, i) => (
                      <motion.div
                        key={announcement._id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="p-4 bg-neutral-50 rounded-lg"
                      >
                        <Link to="/announcements" className="block">
                          <h3 className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors duration-300 mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {announcement.content?.slice(0, 100)}...
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of volunteers who are creating positive change in their communities every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Today
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
