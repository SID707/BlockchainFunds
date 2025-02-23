import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Coins, Users, Rocket, ChevronRight, Shield, Zap, Globe, ArrowRight, ArrowUpRight, Lock, Heart, Star } from 'lucide-react';

function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorX.set(clientX - window.innerWidth / 2);
      cursorY.set(clientY - window.innerHeight / 2);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const rotateX = useTransform(cursorYSpring, [-300, 300], [10, -10]);
  const rotateY = useTransform(cursorXSpring, [-300, 300], [-10, 10]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 2 }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-1 from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative container mx-auto px-6 lg:px-8">
        <nav className="flex justify-between items-center py-6">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4 }}
          >
            <Coins className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold">FusionFunds</span>
          </motion.div>
          <motion.div 
            className="flex space-x-8 items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.6 }}
          >
            <a href="#" className="hover:text-purple-400 transition-colors">How it Works</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Projects</a>
            <a href="#" className="hover:text-purple-400 transition-colors">About</a>
            <button className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-full transition-colors shine">
              Connect Wallet
            </button>
          </motion.div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
          <div className="space-y-8">
            <motion.h1 {...fadeInUp} className="text-6xl font-bold leading-tight">
              Revolutionizing
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Crowdfunding </span>
              with Blockchain
            </motion.h1>
            <motion.p 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300"
            >
              Secure, transparent, and decentralized fundraising platform powered by smart contracts
            </motion.p>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.6 }}
              className="flex space-x-4"
            >
              <button className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-full flex items-center space-x-2 transition-all transform hover:scale-105 shine">
                <span>Connect Wallet</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="border border-purple-500 hover:bg-purple-500/10 px-8 py-3 rounded-full transition-all transform hover:scale-105">
                Learn More
              </button>
            </motion.div>
          </div>

          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
            className="relative"
          >
            <div className="relative w-full h-[500px] rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 p-8 transform-gpu gradient-border">
              <div className="absolute inset-0 bg-grid-white/10 rounded-2xl" />
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Active Projects</h3>
                    <p className="text-4xl font-bold text-purple-400">10+</p>
                  </div>
                  <Users className="w-12 h-12 text-purple-400" />
                </div>
                <div className="space-y-4">
                  <motion.div 
                    className="bg-white/5 p-4 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span>Green Energy Initiative</span>
                      <span className="text-purple-400">85% Funded</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-purple-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.8, delay: 0.7 }}
                      />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 p-4 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span>Tech Startup </span>
                      <span className="text-purple-400">65% Funded</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-purple-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1.8, delay: 0.7 }}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white/5 p-4 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span>Tech Innovation Hub</span>
                      <span className="text-purple-400">62% Funded</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-purple-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "62%" }}
                        transition={{ duration: 2, delay: 0.9 }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center gradient-border"
          >
            <Coins className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">$2500+</h3>
            <p className="text-gray-400">Total Funds Raised</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center gradient-border"
          >
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">50+</h3>
            <p className="text-gray-400">Active Backers</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center gradient-border"
          >
            <Rocket className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">15+</h3>
            <p className="text-gray-400">Successful Projects</p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.9 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose FusionFunds?</h2>
          <p className="text-xl text-gray-400">The future of crowdfunding, powered by blockchain technology</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: Shield,
              title: "Secure & Transparent",
              description: "Smart contracts ensure complete transparency and security of funds"
            },
            {
              icon: Zap,
              title: "Instant Transactions",
              description: "Lightning-fast fund transfers with minimal fees"
            },
            {
              icon: Globe,
              title: "Global Access",
              description: "Connect with backers and projects worldwide"
            },
            {
              icon: Lock,
              title: "Privacy Protection",
              description: "Your data is protected with the highest security standards"
            },
            {
              icon: Heart,
              title: "Community Support",
              description: "Join a community of like-minded individuals supporting innovative projects"
            },
            {
              icon: Star,
              title: "Top-rated Platform",
              description: "Rated as the best crowdfunding platform by industry experts"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center gradient-border"
            >
              <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.9 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-400">Hear from our satisfied backers and project creators</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              name: "John Doe",
              feedback: "FusionFunds made it incredibly easy to raise funds for my project. The platform is user-friendly and secure.",
              image: "https://images.gofundme.com/bBsUNmIMuNqYeyyGKxKxgnyPW18=/720x405/https://d2g8igdw686xgo.cloudfront.net/88154771_1740020370337664_r.png"
            },
            {
              name: "Jane Smith",
              feedback: "I love the transparency and security that FusionFunds offers. It's the best crowdfunding platform I've used.",
              image: "https://images.gofundme.com/y668zJzk9COFZvmCS5UHN0arDxY=/720x405/https://d2g8igdw686xgo.cloudfront.net/85623019_1736798731536185_r.jpeg"
            },
            {
              name: "Michael Johnson",
              feedback: "The community support on FusionFunds is amazing. I was able to connect with backers from all over the world.",
              image: "https://images.gofundme.com/vmHIsiisHY1Ame0FOBrqwtstBB4=/720x405/https://d2g8igdw686xgo.cloudfront.net/87565629_1738819871740602_r.png"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center gradient-border"
            >
              <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{testimonial.name}</h3>
              <p className="text-gray-400">{testimonial.feedback}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden gradient-border"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of successful projects and bring your ideas to life</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-full inline-flex items-center space-x-2 shine"
            >
              <span>Connect Your Wallet</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="absolute inset-0 bg-grid-white/10" />
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 p-3 rounded-full text-white shadow-lg transition-transform transform hover:scale-110"
        whileHover={{ scale: 1.1 }}
      >
        <ArrowUpRight className="w-6 h-6" />
      </motion.button>

      <footer className="bg-slate-900 py-10 mt-20 text-center text-gray-400">
        <div className="container mx-auto px-6 lg:px-8 space-y-4">
          <div className="flex justify-center space-x-8">
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a>
          </div>
          <div className="mt-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} FusionFunds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;