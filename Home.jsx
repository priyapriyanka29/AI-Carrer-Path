import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { MessageCircle, GraduationCap, DollarSign, Globe, Sparkles, Heart, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: MessageCircle,
      title: "Friendly AI Chatbot",
      description: "Talk to our caring AI buddy in your language - get personalized career advice instantly!",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: GraduationCap,
      title: "Career Guidance",
      description: "Discover amazing careers that match your interests and dreams - from doctor to engineer to artist!",
      color: "from-green-400 to-green-600"
    },
    {
      icon: DollarSign,
      title: "Scholarship Finder",
      description: "Find scholarships perfect for you - we'll help you get financial support for your education!",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      icon: Globe,
      title: "Multiple Languages",
      description: "Feel at home! Chat in Hindi, Kannada, Tamil, Telugu, Marathi, Bengali and more!",
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-8">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Career Guidance</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Perfect
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                Career Path with AI 🌟
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              An AI-powered chatbot that helps rural students discover careers, courses, and scholarships — 
              <span className="font-semibold text-gray-800"> in their own language</span>, with friendly guidance.
            </p>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-lg p-6 max-w-2xl mx-auto mb-10">
              <p className="text-xl font-medium text-gray-800 italic">
                "Your future begins with one small conversation 🌱"
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={createPageUrl("Chatbot")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chatting Now
                </Button>
              </Link>
              <Link to={createPageUrl("Careers")}>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-gray-50">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Explore Careers
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Career Paths</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">100+</div>
                <div className="text-sm text-gray-600">Scholarships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">7</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan Your Future 📚
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've made it super simple and friendly - just like talking to your favorite teacher!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple as 1-2-3! 🎯
            </h2>
            <p className="text-lg text-gray-600">
              Getting career guidance has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Start Chatting",
                description: "Click 'Start Chatting' and say hi to our friendly AI buddy! Tell us about yourself.",
                emoji: "💬"
              },
              {
                step: "2",
                title: "Share Your Dreams",
                description: "Tell us what subjects you love, what makes you happy, and what you want to become!",
                emoji: "✨"
              },
              {
                step: "3",
                title: "Get Guidance",
                description: "Receive personalized career suggestions, course details, and scholarship opportunities!",
                emoji: "🎓"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="text-6xl mb-2">{item.emoji}</div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey? 🚀
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already planning their bright future!
          </p>
          <Link to={createPageUrl("Chatbot")}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Heart className="w-5 h-5 mr-2" />
              Let's Get Started!
            </Button>
          </Link>
        </div>
      </section>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
