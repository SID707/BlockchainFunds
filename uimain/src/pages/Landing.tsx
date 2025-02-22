import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Coins, Users, Rocket, ChevronRight, Shield, Zap, Globe, ArrowRight } from 'lucide-react';

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
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative container mx-auto px-6 lg:px-8 pt-8 lg:pt-12">
      <nav className="flex justify-between items-center py-6">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Coins className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold">CryptoFund</span>
          </motion.div>
          <motion.div 
            className="flex space-x-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a href="#" className="hover:text-purple-400 transition-colors">How it Works</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Projects</a>
            <a href="#" className="hover:text-purple-400 transition-colors">About</a>
            <button className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-full transition-colors shine">
              Launch App
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
              transition={{ delay: 0.4 }}
              className="flex space-x-4"
            >
              <button className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-full flex items-center space-x-2 transition-all transform hover:scale-105 shine">
                <span>Start Project</span>
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
                    <p className="text-4xl font-bold text-purple-400">2,547</p>
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
                        transition={{ duration: 1, delay: 0.5 }}
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
                        transition={{ duration: 1, delay: 0.7 }}
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
            <h3 className="text-3xl font-bold mb-2">$25M+</h3>
            <p className="text-gray-400">Total Funds Raised</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center gradient-border"
          >
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">50K+</h3>
            <p className="text-gray-400">Active Backers</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center gradient-border"
          >
            <Rocket className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">1.5K+</h3>
            <p className="text-gray-400">Successful Projects</p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 lg:mb-16"
      >
          <h2 className="text-4xl font-bold mb-4">Why Choose CryptoFund?</h2>
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
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
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
              <span>Launch Your Project</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="absolute inset-0 bg-grid-white/10" />
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;