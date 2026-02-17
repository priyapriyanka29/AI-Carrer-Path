import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, DollarSign, Calendar, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Scholarships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const states = ["All India", "Karnataka"];

  const scholarships = [
    // ALL INDIA SCHOLARSHIPS
    {
      id: 1,
      name: "SBI Asha Scholarship Programme",
      amount: "Up to ₹50,000/year",
      eligibility: "Students from rural areas studying in Class 9 to Post Graduation",
      category: "General",
      state: "All India",
      deadline: "November 15, 2025",
      applyLink: "https://www.buddy4study.com/page/sbi-asha-scholarship-programme",
      description: "Supporting dreams of rural students across India"
    },
    {
      id: 2,
      name: "Central Sector Scheme of Scholarship",
      amount: "₹10,000-20,000/year",
      eligibility: "Students who passed 12th with 80%+ marks and family income less than ₹4.5 LPA",
      category: "Merit-based",
      state: "All India",
      deadline: "December 10, 2025",
      applyLink: "https://scholarships.gov.in",
      description: "Government scholarship for meritorious students"
    },
    {
      id: 3,
      name: "UOW India Women in FinTech Scholarship",
      amount: "₹3,00,000",
      eligibility: "Female students pursuing B.Tech in CS/IT or MBA in Finance",
      category: "Women",
      state: "All India",
      deadline: "January 20, 2025",
      applyLink: "https://buddy4study.com",
      description: "Empowering women in technology and finance"
    },
    {
      id: 4,
      name: "Post Matric Scholarship for SC Students",
      amount: "₹2,000-10,000/year",
      eligibility: "SC category students studying post-matriculation",
      category: "SC/ST",
      state: "All India",
      deadline: "December 31, 2025",
      applyLink: "https://scholarships.gov.in",
      description: "Supporting SC students in higher education"
    },
    {
      id: 5,
      name: "National Means cum Merit Scholarship",
      amount: "₹12,000/year",
      eligibility: "Students studying in Class 9-12 with parental income below ₹1.5 LPA",
      category: "Merit-based",
      state: "All India",
      deadline: "October 30, 2025",
      applyLink: "https://scholarships.gov.in",
      description: "Merit-based support for economically weaker sections"
    },
    {
      id: 6,
      name: "INSPIRE Scholarship",
      amount: "₹80,000/year + Mentorship",
      eligibility: "Students in top 1% of Class 12 (Science stream) pursuing BSc/MSc",
      category: "Science",
      state: "All India",
      deadline: "January 15, 2025",
      applyLink: "https://online-inspire.gov.in",
      description: "Innovation in Science Pursuit for Inspired Research"
    },
    {
      id: 7,
      name: "Sitaram Jindal Foundation Scholarship",
      amount: "Up to ₹50,000",
      eligibility: "Students from economically weaker sections studying in professional courses",
      category: "General",
      state: "All India",
      deadline: "November 25, 2025",
      applyLink: "https://www.sitaramjindalfoundation.org",
      description: "Supporting underprivileged talented students"
    },
    {
      id: 8,
      name: "Dr. Ambedkar Post Matric Scholarship",
      amount: "₹5,000-20,000/year",
      eligibility: "Scheduled Caste students pursuing post-matric courses",
      category: "SC/ST",
      state: "All India",
      deadline: "December 20, 2025",
      applyLink: "https://scholarships.gov.in",
      description: "Empowering SC students through education"
    },
    // KARNATAKA STATE SCHOLARSHIPS
    {
      id: 9,
      name: "Karnataka Post Matric Scholarship for SC/ST",
      amount: "Full tuition + ₹1,500-2,000/month",
      eligibility: "SC/ST students of Karnataka, family income below ₹2.5 LPA",
      category: "SC/ST",
      state: "Karnataka",
      deadline: "December 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Karnataka government scholarship for SC/ST students"
    },
    {
      id: 10,
      name: "Karnataka Post Matric Scholarship for OBC",
      amount: "Full tuition + maintenance allowance",
      eligibility: "OBC students of Karnataka, family income below ₹1 LPA",
      category: "OBC",
      state: "Karnataka",
      deadline: "December 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Supporting OBC students in Karnataka"
    },
    {
      id: 11,
      name: "Karnataka Vidyasiri Scholarship",
      amount: "₹2,000-10,000/year",
      eligibility: "Students from Category-1, 2A, 2B, 3A, 3B with income below ₹1 LPA",
      category: "OBC",
      state: "Karnataka",
      deadline: "October 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Vidyasiri scheme for backward classes"
    },
    {
      id: 12,
      name: "Karnataka Fee Reimbursement for SC/ST",
      amount: "100% fee reimbursement",
      eligibility: "SC/ST students pursuing professional courses in Karnataka",
      category: "SC/ST",
      state: "Karnataka",
      deadline: "November 30, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Complete fee waiver for professional courses"
    },
    {
      id: 13,
      name: "Karnataka Sanchi Honnamma Scholarship",
      amount: "₹2,000/year",
      eligibility: "Girl students from rural Karnataka studying in Class 9-10",
      category: "Women",
      state: "Karnataka",
      deadline: "September 30, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Encouraging girl child education in rural areas"
    },
    {
      id: 14,
      name: "Karnataka Arivu Scholarship",
      amount: "₹10,000-50,000/year",
      eligibility: "Minority students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) with income below ₹2 LPA",
      category: "Minority",
      state: "Karnataka",
      deadline: "December 15, 2025",
      applyLink: "https://kms.kar.nic.in",
      description: "Educational support for minority communities"
    },
    {
      id: 15,
      name: "Karnataka SSLC/PUC Topper Award",
      amount: "₹25,000-50,000",
      eligibility: "Top rankers in Karnataka SSLC and PUC exams",
      category: "Merit-based",
      state: "Karnataka",
      deadline: "August 31, 2025",
      applyLink: "https://schooleducation.kar.nic.in",
      description: "Rewarding academic excellence"
    },
    {
      id: 16,
      name: "Karnataka Devraj Urs Backward Classes Scholarship",
      amount: "₹1,500-3,000/year + hostel",
      eligibility: "Backward class students from Karnataka",
      category: "OBC",
      state: "Karnataka",
      deadline: "November 30, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Supporting backward class students"
    },
    {
      id: 17,
      name: "Karnataka Food & Accommodation for SC/ST",
      amount: "Free hostel + ₹1,500/month food",
      eligibility: "SC/ST students in government hostels",
      category: "SC/ST",
      state: "Karnataka",
      deadline: "July 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Free boarding and lodging for SC/ST students"
    },
    {
      id: 18,
      name: "Karnataka CM Higher Education Scholarship",
      amount: "Up to ₹50,000/year",
      eligibility: "Meritorious students from Karnataka pursuing higher education",
      category: "Merit-based",
      state: "Karnataka",
      deadline: "October 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Chief Minister's scholarship for higher education"
    },
    {
      id: 19,
      name: "Karnataka Pratibha Puraskar",
      amount: "₹10,000-25,000",
      eligibility: "Students who scored 90%+ in SSLC/PUC from government schools",
      category: "Merit-based",
      state: "Karnataka",
      deadline: "September 30, 2025",
      applyLink: "https://schooleducation.kar.nic.in",
      description: "Recognizing exceptional academic performance"
    },
    {
      id: 20,
      name: "Karnataka Medical/Engineering Scholarship",
      amount: "Full tuition fee",
      eligibility: "SC/ST students admitted to medical or engineering colleges in Karnataka",
      category: "SC/ST",
      state: "Karnataka",
      deadline: "December 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Supporting SC/ST students in professional education"
    },
    {
      id: 21,
      name: "Karnataka Minority Girls Scholarship",
      amount: "₹5,000-15,000/year",
      eligibility: "Girl students from minority communities in Karnataka",
      category: "Minority",
      state: "Karnataka",
      deadline: "November 30, 2025",
      applyLink: "https://kms.kar.nic.in",
      description: "Empowering minority girl students"
    },
    {
      id: 22,
      name: "Karnataka Pre-Matric Scholarship for SC/ST",
      amount: "₹1,000-2,000/year + books",
      eligibility: "SC/ST students from Class 1 to 10 in Karnataka",
      category: "SC/ST",
      state: "Karnataka",
      deadline: "October 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Early education support for SC/ST children"
    },
    {
      id: 23,
      name: "Karnataka ITI/Polytechnic Scholarship",
      amount: "₹5,000-15,000/year",
      eligibility: "SC/ST/OBC students in ITI or Polytechnic courses",
      category: "SC/ST",
      state: "Karnataka",
      deadline: "November 30, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Skill development scholarship"
    },
    {
      id: 24,
      name: "Karnataka Overseas Scholarship",
      amount: "Up to ₹20 Lakhs",
      eligibility: "SC/ST students pursuing Masters/PhD abroad",
      category: "SC/ST",
      state: "Karnataka",
      deadline: "March 31, 2025",
      applyLink: "https://sw.kar.nic.in",
      description: "Study abroad support for SC/ST students"
    }
  ];

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = 
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.eligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || scholarship.category === filterCategory;
    const matchesState = filterState === "all" || scholarship.state === filterState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const categories = ["General", "Merit-based", "Women", "SC/ST", "Science", "OBC", "Minority"];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full mb-4">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Financial Support Available!</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scholarships for Your Dreams 💰
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't let money stop your education! Find scholarships perfect for you.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search scholarships by name, eligibility..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base rounded-xl border-2"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* State Filter */}
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(filterCategory !== "all" || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filterCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterCategory("all")}>
                  {filterCategory} ✕
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                  Search: "{searchTerm}" ✕
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{scholarships.length}+</p>
                  <p className="text-sm text-blue-700">Scholarships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">₹50L+</p>
                  <p className="text-sm text-green-700">Total Worth</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">10K+</p>
                  <p className="text-sm text-purple-700">Students Helped</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scholarship Cards */}
        <div className="space-y-6">
          {filteredScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Left Side - Colored Banner */}
                  <div className="md:w-2 bg-gradient-to-b from-blue-500 to-green-500"></div>

                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl mb-1">{scholarship.name}</CardTitle>
                              <p className="text-sm text-gray-600">{scholarship.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="secondary">{scholarship.category}</Badge>
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                              {scholarship.state}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {scholarship.amount}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {scholarship.deadline}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Eligibility</p>
                          <p className="text-sm text-gray-700">{scholarship.eligibility}</p>
                        </div>

                        <Button
                          asChild
                          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                        >
                          <a href={scholarship.applyLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Apply Now
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredScholarships.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No scholarships found</h3>
            <p className="text-gray-500">Try adjusting your search or filters!</p>
          </div>
        )}

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-3">Money Should Never Stop Your Dreams! 💪</h3>
          <p className="text-lg text-yellow-50 mb-4">
            Apply to multiple scholarships - you deserve financial support for your education!
          </p>
          <p className="text-yellow-100">
            "Education is the most powerful tool which you can use to change the world." - Nelson Mandela
          </p>
        </motion.div>
      </div>
    </div>
  );
}
