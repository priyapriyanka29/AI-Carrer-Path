import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Calendar, ExternalLink, TrendingUp, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Updates() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const updates = [
    {
      id: 1,
      title: "SBI Asha Scholarship 2025-26 Applications Open Now!",
      category: "Scholarship",
      date: new Date("2025-01-10"),
      description: "State Bank of India has launched the Asha Scholarship Programme for 2025-26. Students from rural areas studying from Class 9 to Post Graduation can apply now!",
      link: "https://www.buddy4study.com",
      priority: "high"
    },
    {
      id: 2,
      title: "UOW India Women in FinTech Scholarship Announced",
      category: "Scholarship",
      date: new Date("2025-01-08"),
      description: "Female students pursuing B.Tech in CS/IT or MBA in Finance can now apply for this prestigious scholarship worth ₹3,00,000.",
      link: "https://buddy4study.com",
      priority: "high"
    },
    {
      id: 3,
      title: "JEE Main 2025 Registration Extended Till January 20",
      category: "Exam",
      date: new Date("2025-01-05"),
      description: "National Testing Agency has extended the JEE Main 2025 registration deadline. Students can now apply till January 20, 2025.",
      link: "https://jeemain.nta.nic.in",
      priority: "medium"
    },
    {
      id: 4,
      title: "New AI and Data Science Courses Launched by IITs",
      category: "Education",
      date: new Date("2025-01-03"),
      description: "IIT Bombay, IIT Delhi, and IIT Madras have introduced new BTech programs in Artificial Intelligence and Data Science starting from 2025-26 academic session.",
      link: "https://www.iitb.ac.in",
      priority: "medium"
    },
    {
      id: 5,
      title: "NEET UG 2025 Exam Pattern Changes Announced",
      category: "Exam",
      date: new Date("2024-12-28"),
      description: "NTA has announced changes in NEET UG 2025 exam pattern. New format includes more application-based questions to test practical knowledge.",
      link: "https://neet.nta.nic.in",
      priority: "high"
    },
    {
      id: 6,
      title: "Free Digital Library Access for Rural Students",
      category: "Education",
      date: new Date("2024-12-25"),
      description: "Ministry of Education launches free access to digital library with 10,000+ books and study materials for students in rural areas.",
      link: "https://diksha.gov.in",
      priority: "low"
    },
    {
      id: 7,
      title: "Central Sector Scholarship Application Deadline Extended",
      category: "Scholarship",
      date: new Date("2024-12-20"),
      description: "The application deadline for Central Sector Scheme of Scholarship has been extended to December 31, 2025. Don't miss this opportunity!",
      link: "https://scholarships.gov.in",
      priority: "medium"
    },
    {
      id: 8,
      title: "New Career Counseling Centers in 100+ Districts",
      category: "Education",
      date: new Date("2024-12-15"),
      description: "Government announces opening of career counseling centers in 100+ districts across India to provide free guidance to rural students.",
      link: "#",
      priority: "low"
    }
  ];

  const filteredUpdates = selectedCategory === "all" 
    ? updates 
    : updates.filter(update => update.category === selectedCategory);

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-green-100 text-green-800 border-green-300"
  };

  const categoryIcons = {
    Scholarship: "💰",
    Exam: "📝",
    Education: "📚"
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mb-4 animate-pulse">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">Latest Updates</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Education News & Updates 📰
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest scholarships, exams, and education news!
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-white border-2 w-full sm:w-auto">
              <TabsTrigger value="all">All Updates</TabsTrigger>
              <TabsTrigger value="Scholarship">💰 Scholarships</TabsTrigger>
              <TabsTrigger value="Exam">📝 Exams</TabsTrigger>
              <TabsTrigger value="Education">📚 Education</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Featured/High Priority Updates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-red-500" />
            Important Announcements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {updates
              .filter(u => u.priority === "high")
              .slice(0, 2)
              .map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-red-500 text-white">
                          🔥 Urgent
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(update.date, "MMM d, yyyy")}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-snug">{update.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4 text-sm">{update.description}</p>
                      <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 w-full"
                      >
                        <a href={update.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read More
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>

        {/* All Updates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-blue-500" />
            All Updates
          </h2>
          <div className="space-y-4">
            {filteredUpdates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Icon */}
                      <div className="text-5xl shrink-0">
                        {categoryIcons[update.category]}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary">{update.category}</Badge>
                          <Badge variant="outline" className={priorityColors[update.priority]}>
                            {update.priority === "high" && "⚡ "}
                            {update.priority.charAt(0).toUpperCase() + update.priority.slice(1)} Priority
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(update.date, "MMM d, yyyy")}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{update.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{update.description}</p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50"
                        >
                          <a href={update.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Learn More
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredUpdates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No updates found</h3>
            <p className="text-gray-500">Check back soon for more news!</p>
          </div>
        )}

        {/* Subscribe Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-center text-white"
        >
          <Bell className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Never Miss an Update! 🔔</h3>
          <p className="text-lg text-blue-50 mb-4">
            Stay informed about the latest scholarships, exam dates, and education news
          </p>
          <p className="text-blue-100 text-sm">
            Bookmark this page and check back regularly for new updates!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
