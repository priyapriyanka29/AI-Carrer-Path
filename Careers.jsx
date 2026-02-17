import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Stethoscope, Laptop, Calculator, Palette, Scale, FlaskConical, GraduationCap, Heart, ArrowRight, BookOpen, Clock, Building, Utensils, Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Careers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me().catch(() => null)
  });

  const { data: profiles } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.UserProfile.filter({ created_by: user.email });
    },
    enabled: !!user?.email
  });

  const profile = profiles?.[0];

  const saveMutation = useMutation({
    mutationFn: async (careerId) => {
      if (!profile) {
        await base44.entities.UserProfile.create({ saved_careers: [careerId], saved_scholarships: [], roadmap_progress: {} });
      } else {
        const updated = [...(profile.saved_careers || [])];
        if (!updated.includes(careerId)) updated.push(careerId);
        await base44.entities.UserProfile.update(profile.id, { saved_careers: updated });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] })
  });

  const unsaveMutation = useMutation({
    mutationFn: async (careerId) => {
      if (!profile) return;
      const updated = (profile.saved_careers || []).filter(id => id !== careerId);
      await base44.entities.UserProfile.update(profile.id, { saved_careers: updated });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] })
  });

  const isCareerSaved = (careerId) => profile?.saved_careers?.includes(careerId);

  const toggleSaveCareer = (careerId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Please login to save careers!");
      return;
    }
    if (isCareerSaved(careerId)) {
      unsaveMutation.mutate(careerId);
    } else {
      saveMutation.mutate(careerId);
    }
  };

  const careers = [
    // MEDICAL
    {
      id: 1,
      name: "Doctor (MBBS)",
      icon: Stethoscope,
      category: "Medical",
      description: "Save lives and serve humanity as a medical professional",
      subjects: ["Biology", "Chemistry", "Physics"],
      duration: "5.5 Years + Internship",
      salary: "₹6-50 LPA",
      color: "from-red-400 to-pink-500"
    },
    {
      id: 10,
      name: "B.Sc Nursing",
      icon: Heart,
      category: "Medical",
      description: "Care for patients with kindness and medical expertise",
      subjects: ["Biology", "Chemistry"],
      duration: "4 Years",
      salary: "₹3-8 LPA (India) | ₹15-40 LPA (Abroad)",
      color: "from-pink-400 to-rose-500"
    },
    {
      id: 11,
      name: "B.Pharma (Pharmacy)",
      icon: FlaskConical,
      category: "Medical",
      description: "Work with medicines, drug development, and healthcare",
      subjects: ["Chemistry", "Biology"],
      duration: "4 Years",
      salary: "₹3-12 LPA",
      color: "from-green-400 to-teal-500"
    },
    
    // ENGINEERING
    {
      id: 2,
      name: "Computer Science (B.Tech CSE)",
      icon: Laptop,
      category: "Engineering",
      description: "Build software, apps, AI systems - highest paying field!",
      subjects: ["Mathematics", "Physics"],
      duration: "4 Years",
      salary: "₹4-25 LPA",
      color: "from-blue-400 to-indigo-500"
    },
    {
      id: 3,
      name: "Mechanical Engineering",
      icon: Laptop,
      category: "Engineering",
      description: "Design machines, vehicles, robots, and mechanical systems",
      subjects: ["Mathematics", "Physics"],
      duration: "4 Years",
      salary: "₹3-15 LPA",
      color: "from-gray-400 to-slate-500"
    },
    {
      id: 4,
      name: "Civil Engineering",
      icon: Building,
      category: "Engineering",
      description: "Build bridges, roads, buildings - shape the infrastructure",
      subjects: ["Mathematics", "Physics"],
      duration: "4 Years",
      salary: "₹3-12 LPA",
      color: "from-orange-400 to-red-500"
    },
    {
      id: 5,
      name: "Electrical Engineering",
      icon: Laptop,
      category: "Engineering",
      description: "Work with power systems, EVs, renewable energy - Great PSU jobs!",
      subjects: ["Mathematics", "Physics"],
      duration: "4 Years",
      salary: "₹3-15 LPA (PSU: ₹8-15 LPA)",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 6,
      name: "Electronics & Communication (ECE)",
      icon: Laptop,
      category: "Engineering",
      description: "Design circuits, semiconductors, IoT devices, communication systems",
      subjects: ["Mathematics", "Physics"],
      duration: "4 Years",
      salary: "₹4-20 LPA",
      color: "from-purple-400 to-pink-500"
    },
    
    // COMMERCE
    {
      id: 7,
      name: "Chartered Accountancy (CA)",
      icon: Calculator,
      category: "Commerce",
      description: "Most prestigious commerce qualification - Finance expert!",
      subjects: ["Accountancy", "Economics", "Maths"],
      duration: "4-5 Years",
      salary: "₹8-50 LPA",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 8,
      name: "B.Com (Bachelor of Commerce)",
      icon: Calculator,
      category: "Commerce",
      description: "Foundation for CA, CS, MBA, Banking careers",
      subjects: ["Accountancy", "Economics"],
      duration: "3 Years",
      salary: "₹2-10 LPA",
      color: "from-teal-400 to-cyan-500"
    },
    {
      id: 9,
      name: "BBA (Business Administration)",
      icon: Calculator,
      category: "Commerce",
      description: "Develop management and leadership skills - Gateway to MBA",
      subjects: ["Business Studies", "Economics"],
      duration: "3 Years",
      salary: "₹3-10 LPA (After MBA: ₹8-25 LPA)",
      color: "from-indigo-400 to-blue-500"
    },
    
    // ARTS & HUMANITIES
    {
      id: 12,
      name: "BA (Bachelor of Arts)",
      icon: Palette,
      category: "Arts",
      description: "Gateway to Civil Services, Teaching, Journalism, NGOs",
      subjects: ["History", "Political Science", "English"],
      duration: "3 Years",
      salary: "₹2-15 LPA (IAS: ₹8-15 LPA + perks)",
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 13,
      name: "LLB (Bachelor of Laws)",
      icon: Scale,
      category: "Arts",
      description: "Fight for justice - Become a lawyer or judge",
      subjects: ["Any Stream"],
      duration: "3-5 Years",
      salary: "₹3-50 LPA",
      color: "from-indigo-400 to-blue-500"
    },
    {
      id: 14,
      name: "Mass Communication & Journalism",
      icon: Palette,
      category: "Arts",
      description: "TV news, digital content, advertising, PR - Media careers!",
      subjects: ["English", "Any Stream"],
      duration: "3 Years",
      salary: "₹3-15 LPA",
      color: "from-blue-400 to-indigo-500"
    },
    
    // SCIENCE
    {
      id: 15,
      name: "B.Sc (Bachelor of Science)",
      icon: FlaskConical,
      category: "Science",
      description: "Foundation for research, teaching, and M.Sc/PhD",
      subjects: ["Physics/Chemistry/Biology/Maths"],
      duration: "3 Years",
      salary: "₹3-15 LPA (After PhD: ₹8-25 LPA)",
      color: "from-cyan-400 to-blue-500"
    },
    {
      id: 16,
      name: "Data Science & AI",
      icon: Laptop,
      category: "Technology",
      description: "Hottest career! ML, AI, Analytics - Highest salaries!",
      subjects: ["Mathematics", "Programming"],
      duration: "3-4 Years",
      salary: "₹6-35 LPA",
      color: "from-violet-400 to-purple-500"
    },
    {
      id: 17,
      name: "Biotechnology",
      icon: FlaskConical,
      category: "Science",
      description: "Medicines, vaccines, genetic engineering - Future of healthcare!",
      subjects: ["Biology", "Chemistry"],
      duration: "4 Years",
      salary: "₹4-15 LPA (After PhD: ₹8-25 LPA)",
      color: "from-emerald-400 to-green-500"
    },
    
    // DESIGN
    {
      id: 18,
      name: "Architecture (B.Arch)",
      icon: Building,
      category: "Design",
      description: "Design buildings, homes, cities - Creative + Technical!",
      subjects: ["Mathematics", "Drawing"],
      duration: "5 Years",
      salary: "₹3-15 LPA (Own Practice: ₹10-50 LPA)",
      color: "from-amber-400 to-orange-500"
    },
    {
      id: 20,
      name: "Fashion Design",
      icon: Scissors,
      category: "Design",
      description: "Create trendy clothing and accessories - India's fashion industry!",
      subjects: ["Arts", "Design"],
      duration: "4 Years",
      salary: "₹3-15 LPA (Own Brand: Unlimited)",
      color: "from-rose-400 to-pink-500"
    },
    
    // MANAGEMENT
    {
      id: 19,
      name: "Hotel Management (BHM)",
      icon: Utensils,
      category: "Management",
      description: "Hotels, restaurants, cruise ships - Hospitality industry!",
      subjects: ["Any Stream"],
      duration: "4 Years",
      salary: "₹3-15 LPA (International: ₹15-40 LPA)",
      color: "from-orange-400 to-red-500"
    }
  ];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Engineering", "Medical", "Commerce", "Arts", "Science", "Technology", "Design", "Management"];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Dream Career 🎯
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            20+ career paths with complete learning roadmaps - Choose wisely, learn smartly!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by career, subject, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-base rounded-xl border-2"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="overflow-x-auto pb-2">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-white border-2 inline-flex">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-blue-600">20+</div>
              <div className="text-xs text-blue-700">Career Options</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-xs text-green-700">Free Roadmaps</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-purple-600">1-2</div>
              <div className="text-xs text-purple-700">Month Plans</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-orange-600">₹3-50L</div>
              <div className="text-xs text-orange-700">Salary Range</div>
            </CardContent>
          </Card>
        </div>

        {/* Career Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCareers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                {/* Card Header */}
                <div className={`h-28 bg-gradient-to-br ${career.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <career.icon className="w-14 h-14 text-white drop-shadow-lg" />
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight">{career.name}</CardTitle>
                    <button
                      onClick={(e) => toggleSaveCareer(career.id, e)}
                      className="shrink-0 p-1 hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-5 h-5 ${isCareerSaved(career.id) ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
                    </button>
                  </div>
                  <Badge variant="secondary" className="text-xs w-fit">{career.category}</Badge>
                  <p className="text-gray-600 text-sm mt-1">
                    {career.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-2 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {career.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {career.duration}
                    </span>
                    <span className="text-green-600 font-semibold">{career.salary}</span>
                  </div>

                  <Link to={createPageUrl(`CourseDetails?id=${career.id}`)}>
                    <Button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-sm">
                      <BookOpen className="w-4 h-4 mr-1" />
                      View Roadmap
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCareers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No careers found</h3>
            <p className="text-gray-500">Try different keywords!</p>
          </div>
        )}

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-3">Every Career is Special! ✨</h3>
          <p className="text-lg text-blue-50 mb-4">
            Click any career to see complete roadmap with 1-month and 2-month learning plans!
          </p>
          <p className="text-blue-100">
            "Choose what makes your heart happy - Success follows passion!" 🌟
          </p>
        </motion.div>
      </div>
    </div>
  );
}
