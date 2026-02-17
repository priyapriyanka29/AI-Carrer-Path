import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, Target, CheckCircle, Download, Video, Calendar, GraduationCap, Briefcase, IndianRupee, Circle, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function CourseDetails() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const courseId = parseInt(urlParams.get('id'));
  const [selectedTimeline, setSelectedTimeline] = useState("2months");
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

  const progressMutation = useMutation({
    mutationFn: async ({ stepIndex, timeline }) => {
      const currentProgress = profile?.roadmap_progress || {};
      const courseProgress = currentProgress[courseId] || { timeline, completed_steps: [] };
      const completedSteps = [...(courseProgress.completed_steps || [])];
      
      if (completedSteps.includes(stepIndex)) {
        const idx = completedSteps.indexOf(stepIndex);
        completedSteps.splice(idx, 1);
      } else {
        completedSteps.push(stepIndex);
      }
      
      const newProgress = { ...currentProgress, [courseId]: { timeline, completed_steps: completedSteps } };
      
      if (!profile) {
        await base44.entities.UserProfile.create({ roadmap_progress: newProgress, saved_careers: [], saved_scholarships: [] });
      } else {
        await base44.entities.UserProfile.update(profile.id, { roadmap_progress: newProgress });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] })
  });

  const isStepCompleted = (stepIndex) => {
    return profile?.roadmap_progress?.[courseId]?.completed_steps?.includes(stepIndex);
  };

  const toggleStepComplete = (stepIndex) => {
    if (!user) {
      alert("Please login to track progress!");
      return;
    }
    progressMutation.mutate({ stepIndex, timeline: selectedTimeline });
  };

  const getCompletedCount = () => {
    return profile?.roadmap_progress?.[courseId]?.completed_steps?.length || 0;
  };

  const allCourses = {
    1: {
      name: "Doctor (MBBS)",
      category: "Medical",
      duration: "5.5 Years + 1 Year Internship",
      fees: "₹50K-5 Lakhs/year (Govt) | ₹10-25 Lakhs/year (Private)",
      introduction: "MBBS (Bachelor of Medicine, Bachelor of Surgery) is the most prestigious medical degree. You'll learn human anatomy, physiology, diseases, diagnosis, and treatment. Doctors save lives and serve humanity. It's challenging but the rewards - both personal and professional - are immense!",
      prerequisites: ["Physics, Chemistry, Biology (12th - 50%+)", "NEET UG Qualification", "Age: 17-25 years", "Strong dedication"],
      career_opportunities: ["General Physician (₹6-15 LPA)", "Specialist Doctor MD/MS (₹10-30 LPA)", "Surgeon (₹15-50 LPA)", "Government Doctor (₹8-15 LPA)", "Private Practice (Unlimited)"],
      top_colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "Maulana Azad Medical College", "KGMU Lucknow"],
      entrance_exams: ["NEET UG (Only exam for MBBS)"],
      roadmap_1month: [
        { week: "Week 1", title: "Medical Foundations", topics: ["Human body overview", "Medical terminology", "Cell biology review", "Tissues and organs", "Healthcare system understanding"], resources: "Khan Academy Biology, Medical terminology apps" },
        { week: "Week 2", title: "Anatomy Basics", topics: ["Skeletal system", "Muscular system", "Cardiovascular system", "Respiratory system", "Digestive system overview"], resources: "Visible Body app, Anatomy flashcards" },
        { week: "Week 3", title: "Physiology Introduction", topics: ["How body systems work", "Blood circulation", "Breathing mechanism", "Digestion process", "Common diseases overview"], resources: "Physiology videos, Medical animations" },
        { week: "Week 4", title: "Clinical Awareness", topics: ["Patient communication", "Medical ethics", "Hospital departments", "First aid basics", "NEET preparation guidance"], resources: "Hospital virtual tours, First aid courses" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Anatomy Deep Dive", topics: ["Complete skeletal anatomy", "Muscular anatomy", "Cardiovascular anatomy", "Respiratory anatomy", "Nervous system anatomy", "3D anatomy software practice"], resources: "Gray's Anatomy for Students, Complete Anatomy app" },
        { week: "Month 1: Week 3-4", title: "Physiology & Biochemistry", topics: ["Cardiovascular physiology", "Respiratory physiology", "Renal physiology", "Digestive physiology", "Basic biochemistry", "Clinical correlations"], resources: "Guyton Physiology, Lippincott Biochemistry" },
        { week: "Month 2: Week 1-2", title: "Pathology & Pharmacology", topics: ["General pathology concepts", "Inflammation and healing", "Common diseases", "Introduction to drugs", "Drug classifications", "Disease-drug relationships"], resources: "Robbins Basic Pathology, KD Tripathi basics" },
        { week: "Month 2: Week 3-4", title: "Clinical Skills & NEET", topics: ["Patient history taking", "Physical examination overview", "Medical ethics deep dive", "NEET exam pattern", "Subject-wise preparation", "Mock test practice"], resources: "Clinical examination videos, NEET prep materials" }
      ]
    },
    2: {
      name: "Computer Science Engineering (B.Tech CSE)",
      category: "Engineering",
      duration: "4 Years",
      fees: "₹1-4 Lakhs/year (Govt) | ₹2-10 Lakhs/year (Private)",
      introduction: "Computer Science Engineering is the most in-demand field. Learn programming, software development, AI, web development, databases, and more. CSE graduates work at Google, Microsoft, Amazon with highest salary packages!",
      prerequisites: ["Mathematics (12th - 60%+)", "Physics & Chemistry (12th)", "JEE Main/Advanced or State CET", "Basic computer knowledge"],
      career_opportunities: ["Software Developer (₹4-15 LPA)", "Web Developer (₹3-12 LPA)", "Data Scientist (₹6-20 LPA)", "AI/ML Engineer (₹8-25 LPA)", "Cloud Engineer (₹6-18 LPA)", "DevOps Engineer (₹6-20 LPA)"],
      top_colleges: ["IIT Bombay", "IIT Delhi", "IIT Madras", "BITS Pilani", "NIT Trichy", "IIIT Hyderabad"],
      entrance_exams: ["JEE Main", "JEE Advanced", "BITSAT", "State CETs"],
      roadmap_1month: [
        { week: "Week 1", title: "Programming Fundamentals", topics: ["Python basics", "Variables, data types", "If-else conditions", "For & while loops", "Basic programs", "20+ coding problems"], resources: "Python.org, Codecademy, W3Schools" },
        { week: "Week 2", title: "Data Structures Basics", topics: ["Arrays and Lists", "Strings manipulation", "Dictionaries/HashMaps", "Linear & Binary search", "Bubble & Selection sort", "30+ HackerRank problems"], resources: "GeeksforGeeks, HackerRank, LeetCode Easy" },
        { week: "Week 3", title: "Web Development Intro", topics: ["HTML tags", "CSS styling", "JavaScript basics", "DOM manipulation", "2 simple webpages", "Portfolio page"], resources: "FreeCodeCamp, MDN Web Docs" },
        { week: "Week 4", title: "Projects & Career", topics: ["Calculator app", "To-do list", "GitHub setup", "Upload projects", "LinkedIn profile", "Internship platforms"], resources: "GitHub, LinkedIn, Internshala" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Programming Mastery", topics: ["Python complete", "Object-Oriented Programming", "Classes, inheritance", "Exception handling", "File handling", "5 mini projects", "50+ problems"], resources: "Python Crash Course Book, Corey Schafer YouTube" },
        { week: "Month 1: Week 3-4", title: "Data Structures & Algorithms", topics: ["Arrays, Linked Lists", "Stacks, Queues", "Trees, BST", "Sorting (Quick, Merge)", "Recursion", "Time complexity", "100+ problems"], resources: "Abdul Bari YouTube, LeetCode, InterviewBit" },
        { week: "Month 2: Week 1-2", title: "Full Stack Development", topics: ["HTML5 & CSS3 advanced", "JavaScript ES6+", "React.js framework", "Node.js & Express", "MongoDB database", "REST APIs", "3 full-stack projects"], resources: "The Odin Project, Full Stack Open" },
        { week: "Month 2: Week 3-4", title: "Advanced & Portfolio", topics: ["Git & GitHub mastery", "Deploy on Vercel/Netlify", "AWS basics", "ML introduction", "Capstone project", "Professional portfolio", "Resume preparation"], resources: "GitHub, AWS Free Tier, Kaggle" }
      ]
    },
    3: {
      name: "Mechanical Engineering (B.Tech ME)",
      category: "Engineering",
      duration: "4 Years",
      fees: "₹1-3 Lakhs/year (Govt) | ₹2-8 Lakhs/year (Private)",
      introduction: "Mechanical Engineering - the mother of all engineering. Design machines, engines, robots, automobiles, aircraft. From Tesla cars to SpaceX rockets - mechanical engineers build the physical world!",
      prerequisites: ["Mathematics (12th - 60%+)", "Physics & Chemistry (12th)", "JEE Main/Advanced or State CET", "Interest in machines"],
      career_opportunities: ["Design Engineer (₹3-10 LPA)", "Production Engineer (₹3-8 LPA)", "Automobile Engineer (₹4-12 LPA)", "Aerospace Engineer (₹5-15 LPA)", "Robotics Engineer (₹5-15 LPA)"],
      top_colleges: ["IIT Bombay", "IIT Madras", "IIT Kanpur", "NIT Trichy", "BITS Pilani"],
      entrance_exams: ["JEE Main", "JEE Advanced", "BITSAT", "State CETs"],
      roadmap_1month: [
        { week: "Week 1", title: "Engineering Fundamentals", topics: ["Engineering drawing basics", "Orthographic projections", "Isometric views", "Units and measurements", "Material science intro"], resources: "NPTEL Engineering Drawing, YouTube" },
        { week: "Week 2", title: "Mechanics & Thermo", topics: ["Force, motion, equilibrium", "Newton's laws", "Energy concepts", "Thermodynamics laws", "Heat transfer basics"], resources: "Khan Academy Physics, NPTEL" },
        { week: "Week 3", title: "CAD Software", topics: ["AutoCAD interface", "2D drawing commands", "Basic 3D modeling", "Fusion 360 intro", "Design a simple part"], resources: "AutoCAD Student Version, Fusion 360 Free" },
        { week: "Week 4", title: "Industry & Career", topics: ["Manufacturing overview", "Casting, welding, machining", "Factory tour videos", "Quality control", "Career paths"], resources: "YouTube Factory Tours, IndustryWeek" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Core Concepts", topics: ["Engineering mechanics complete", "Statics and dynamics", "Strength of materials", "Stress, strain", "Thermodynamics", "Fluid mechanics basics", "50+ numerical problems"], resources: "R.S. Khurmi books, NPTEL, MIT OCW" },
        { week: "Month 1: Week 3-4", title: "CAD & Design", topics: ["AutoCAD 2D complete", "SolidWorks introduction", "3D modeling & rendering", "Assembly design", "Engineering drawings", "Machine assembly project"], resources: "SolidWorks Student, GrabCAD" },
        { week: "Month 2: Week 1-2", title: "Manufacturing", topics: ["Manufacturing processes", "Casting and molding", "Machining operations", "Welding techniques", "CNC basics", "3D printing", "Quality control"], resources: "Manufacturing videos, Virtual labs" },
        { week: "Month 2: Week 3-4", title: "Advanced Topics", topics: ["Robotics fundamentals", "Automotive systems", "MATLAB basics", "FEA introduction", "Industry 4.0", "Capstone project", "Resume preparation"], resources: "MATLAB Student, Coursera Robotics" }
      ]
    },
    4: {
      name: "Civil Engineering (B.Tech CE)",
      category: "Engineering",
      duration: "4 Years",
      fees: "₹1-3 Lakhs/year (Govt) | ₹2-7 Lakhs/year (Private)",
      introduction: "Civil Engineering builds infrastructure - bridges, roads, buildings, dams, airports. Civil engineers shape the physical world and create structures that last centuries. Excellent government job opportunities!",
      prerequisites: ["Mathematics (12th - 60%+)", "Physics & Chemistry (12th)", "JEE Main/Advanced or State CET"],
      career_opportunities: ["Structural Engineer (₹3-10 LPA)", "Construction Manager (₹4-12 LPA)", "Government Jobs PWD (₹5-12 LPA)", "Transportation Engineer (₹3-10 LPA)", "Urban Planner (₹4-12 LPA)"],
      top_colleges: ["IIT Roorkee", "IIT Kharagpur", "IIT Delhi", "NIT Surathkal", "VNIT Nagpur"],
      entrance_exams: ["JEE Main", "JEE Advanced", "State CETs", "GATE"],
      roadmap_1month: [
        { week: "Week 1", title: "Civil Basics", topics: ["Introduction to civil", "Types of structures", "Building materials", "Properties of materials", "Construction site basics"], resources: "NPTEL Civil Engineering, YouTube" },
        { week: "Week 2", title: "Structural Fundamentals", topics: ["Force systems", "Equilibrium conditions", "Types of loads", "Beams and columns", "Simple structural analysis"], resources: "Engineering Mechanics books, NPTEL" },
        { week: "Week 3", title: "CAD for Civil", topics: ["AutoCAD for civil", "Building plan creation", "Structural drawings", "Site layout plans", "STAAD Pro intro"], resources: "AutoCAD Student, STAAD tutorials" },
        { week: "Week 4", title: "Surveying & Career", topics: ["Surveying basics", "Leveling and contouring", "Quantity estimation", "Career in civil", "Government job overview"], resources: "Surveying videos, Career guides" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Structural Analysis", topics: ["Engineering mechanics complete", "Strength of materials", "Structural analysis methods", "Bending moment & shear force", "Deflection calculations", "Truss analysis", "40+ problems"], resources: "S.S. Bhavikatti books, NPTEL" },
        { week: "Month 1: Week 3-4", title: "Construction Materials", topics: ["Concrete technology", "Steel structures basics", "Timber and masonry", "Modern materials", "Green building", "Construction methods", "Virtual labs"], resources: "Concrete Technology by Gambhir, Virtual labs" },
        { week: "Month 2: Week 1-2", title: "Design & Software", topics: ["AutoCAD complete", "STAAD Pro basics", "Revit introduction", "RCC design basics", "Steel design basics", "Building drawings project"], resources: "STAAD Pro Student, Revit tutorials" },
        { week: "Month 2: Week 3-4", title: "Specialized Topics", topics: ["Geotechnical basics", "Transportation engineering", "Water resources", "Environmental basics", "Estimation & costing", "GATE preparation intro"], resources: "NPTEL courses, GATE papers" }
      ]
    },
    5: {
      name: "Electrical Engineering (B.Tech EE)",
      category: "Engineering",
      duration: "4 Years",
      fees: "₹1-3 Lakhs/year (Govt) | ₹2-8 Lakhs/year (Private)",
      introduction: "Electrical Engineering deals with electricity, power systems, electrical machines. Work on power generation, EVs, renewable energy. Excellent PSU job opportunities with high packages!",
      prerequisites: ["Mathematics (12th - 60%+)", "Physics & Chemistry (12th)", "JEE Main/Advanced or State CET"],
      career_opportunities: ["Electrical Design Engineer (₹3-10 LPA)", "Power Systems Engineer (₹4-12 LPA)", "PSU Jobs BHEL/NTPC (₹8-15 LPA)", "Renewable Energy (₹4-12 LPA)", "Automation Engineer (₹4-12 LPA)"],
      top_colleges: ["IIT Delhi", "IIT Kanpur", "IIT Kharagpur", "NIT Trichy", "BITS Pilani"],
      entrance_exams: ["JEE Main", "JEE Advanced", "State CETs", "GATE"],
      roadmap_1month: [
        { week: "Week 1", title: "Electrical Basics", topics: ["Basic concepts", "Voltage, current, resistance", "Ohm's law, Kirchhoff's laws", "Series/parallel circuits", "AC vs DC", "Circuit practice"], resources: "All About Circuits, Khan Academy" },
        { week: "Week 2", title: "Electrical Machines", topics: ["Magnetic circuits", "Transformers basics", "DC machines intro", "AC machines intro", "Motor/generator concepts"], resources: "NPTEL Electrical Machines, YouTube" },
        { week: "Week 3", title: "Power Systems", topics: ["Power generation overview", "Transmission & distribution", "Power factor", "Single line diagrams", "Electrical safety"], resources: "NPTEL Power Systems, Videos" },
        { week: "Week 4", title: "Software & Career", topics: ["MATLAB basics", "Circuit simulation", "AutoCAD Electrical", "PSU job overview", "GATE preparation basics"], resources: "MATLAB Student, Multisim Free" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Circuit Theory", topics: ["Network theorems complete", "AC circuit analysis", "Three-phase circuits", "Resonance", "Transient analysis", "Power calculations", "50+ problems"], resources: "Network Analysis by Van Valkenburg, NPTEL" },
        { week: "Month 1: Week 3-4", title: "Electrical Machines", topics: ["Transformers complete", "DC machines detailed", "Induction motors", "Synchronous machines", "Speed control methods", "Efficiency calculations", "Virtual labs"], resources: "Electrical Machines by Bimbhra, Virtual labs" },
        { week: "Month 2: Week 1-2", title: "Power & Control", topics: ["Power system components", "Load flow analysis", "Power factor correction", "Control systems intro", "Transfer functions", "Stability basics", "Simulations"], resources: "Power Systems by Wadhwa, NPTEL Control" },
        { week: "Month 2: Week 3-4", title: "Advanced & Career", topics: ["MATLAB for electrical", "Power electronics basics", "Renewable energy", "Smart grid concepts", "PSU exam pattern", "GATE preparation", "Project work"], resources: "GATE papers, PSU guides, Made Easy" }
      ]
    },
    6: {
      name: "Electronics & Communication (B.Tech ECE)",
      category: "Engineering",
      duration: "4 Years",
      fees: "₹1-3 Lakhs/year (Govt) | ₹2-8 Lakhs/year (Private)",
      introduction: "Electronics & Communication - design circuits, communication systems, semiconductors, embedded systems. From smartphones to satellites - ECE engineers create electronic devices!",
      prerequisites: ["Mathematics (12th - 60%+)", "Physics & Chemistry (12th)", "JEE Main/Advanced or State CET"],
      career_opportunities: ["Electronics Design (₹4-12 LPA)", "Embedded Systems (₹4-15 LPA)", "VLSI Design (₹5-20 LPA)", "Telecom Engineer (₹4-12 LPA)", "IoT Developer (₹4-15 LPA)", "Semiconductor Jobs (₹6-20 LPA)"],
      top_colleges: ["IIT Bombay", "IIT Delhi", "IIIT Hyderabad", "NIT Warangal", "BITS Pilani"],
      entrance_exams: ["JEE Main", "JEE Advanced", "BITSAT", "State CETs"],
      roadmap_1month: [
        { week: "Week 1", title: "Electronics Fundamentals", topics: ["Basic electronics", "Semiconductor physics", "Diodes and applications", "Transistors (BJT basics)", "Circuit analysis"], resources: "Electronics Tutorials, All About Circuits" },
        { week: "Week 2", title: "Digital Electronics", topics: ["Number systems", "Logic gates", "Boolean algebra", "Combinational circuits", "Flip-flops basics"], resources: "NPTEL Digital Electronics, YouTube" },
        { week: "Week 3", title: "Communication Basics", topics: ["Signals & systems intro", "Analog vs digital", "Modulation basics", "Communication overview", "Wireless intro"], resources: "NPTEL Communication, Tutorials" },
        { week: "Week 4", title: "Embedded & Career", topics: ["Microcontroller intro", "Arduino basics", "Simple LED projects", "IoT overview", "Career options"], resources: "Arduino tutorials, Tinkercad" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Analog Electronics", topics: ["Semiconductor devices", "Diode circuits", "BJT amplifiers", "MOSFET basics", "Op-amps", "Oscillators", "Circuit simulation"], resources: "Electronic Devices by Boylestad, NPTEL" },
        { week: "Month 1: Week 3-4", title: "Digital & Microprocessors", topics: ["Combinational circuits", "Sequential circuits", "Counters & registers", "Memory devices", "8085 microprocessor", "Assembly language", "Digital design"], resources: "Digital Design by Morris Mano, NPTEL" },
        { week: "Month 2: Week 1-2", title: "Communication Systems", topics: ["Signals and systems", "Analog communication", "Digital communication", "Information theory", "Wireless communication", "Mobile communication", "Communication lab"], resources: "Communication Systems by Haykin, NPTEL" },
        { week: "Month 2: Week 3-4", title: "Advanced & Projects", topics: ["VLSI introduction", "Embedded systems (Arduino/RPi)", "IoT project", "PCB design basics", "2-3 electronics projects", "GATE preparation", "Industry certifications"], resources: "Arduino projects, Proteus, EasyEDA" }
      ]
    },
    7: {
      name: "Chartered Accountancy (CA)",
      category: "Commerce",
      duration: "4-5 Years",
      fees: "₹1-2 Lakhs (Total Course)",
      introduction: "CA is the most prestigious commerce qualification. CAs handle accounting, taxation, auditing, business advisory. High demand with excellent salaries. The CA qualification is recognized worldwide!",
      prerequisites: ["Class 12th pass (Any stream)", "Register with ICAI", "Strong analytical skills", "Dedication for 4-5 years"],
      career_opportunities: ["Practicing CA (₹8-50 LPA)", "Corporate CA (₹8-25 LPA)", "Tax Consultant (₹6-20 LPA)", "CFO (₹25-100 LPA)", "Investment Banker (₹15-40 LPA)", "Own Practice (Unlimited)"],
      top_colleges: ["ICAI (Institute of Chartered Accountants of India)"],
      entrance_exams: ["CA Foundation", "CA Intermediate", "CA Final"],
      roadmap_1month: [
        { week: "Week 1", title: "Accounting Basics", topics: ["Accounting concepts", "Accounting principles", "Journal entries", "Ledger accounts", "Trial balance", "50 entries practice"], resources: "ICAI Study Material, T.S. Grewal" },
        { week: "Week 2", title: "Financial Statements", topics: ["Trading account", "Profit & Loss account", "Balance sheet", "Adjustments", "Financial analysis", "Ratio analysis intro"], resources: "ICAI modules, YouTube CA channels" },
        { week: "Week 3", title: "Taxation Basics", topics: ["Income Tax concepts", "Heads of income", "Salary income", "House property income", "GST fundamentals"], resources: "Income Tax Act basics, GST portal" },
        { week: "Week 4", title: "CA Journey", topics: ["CA course structure", "Foundation registration", "Study strategy", "Articleship overview", "Success tips"], resources: "ICAI website, CA forums" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Accounts & Principles", topics: ["Accounting standards", "Partnership accounts", "Company accounts basics", "Depreciation", "Inventory valuation", "Bank reconciliation", "Complete financial statements"], resources: "ICAI Foundation, P.C. Tulsian" },
        { week: "Month 1: Week 3-4", title: "Business Laws & Economics", topics: ["Indian Contract Act", "Sale of Goods Act", "Companies Act basics", "Business Economics", "Demand and supply", "Market structures"], resources: "ICAI Business Law module, Economics" },
        { week: "Month 2: Week 1-2", title: "Taxation Complete", topics: ["Income Tax complete", "All heads of income", "Deductions & exemptions", "Tax computation", "GST comprehensive", "GST returns filing", "Tax planning"], resources: "V.S. Datey for Tax, ICAI module" },
        { week: "Month 2: Week 3-4", title: "Quantitative & Prep", topics: ["Business Mathematics", "Statistics and sampling", "Logical reasoning", "CA Foundation mock tests", "Previous year papers", "Exam strategy"], resources: "ICAI QA module, Mock tests" }
      ]
    },
    8: {
      name: "B.Com (Bachelor of Commerce)",
      category: "Commerce",
      duration: "3 Years",
      fees: "₹10K-50K/year (Govt) | ₹50K-2 Lakhs/year (Private)",
      introduction: "B.Com is the foundation degree for commerce. Learn accounting, finance, economics, taxation, business management. Opens doors to CA, CS, CMA, MBA, banking careers!",
      prerequisites: ["Class 12th Commerce (50%+)", "Basic mathematics", "Interest in business and finance"],
      career_opportunities: ["Accountant (₹2-5 LPA)", "Tax Assistant (₹2-4 LPA)", "Banking Jobs (₹4-10 LPA)", "Finance Executive (₹3-8 LPA)", "After CA/MBA (₹6-25 LPA)"],
      top_colleges: ["SRCC Delhi", "Hindu College Delhi", "St. Xavier's Mumbai", "Christ University", "Loyola Chennai"],
      entrance_exams: ["CUET", "DU JAT", "University Tests", "Merit-based"],
      roadmap_1month: [
        { week: "Week 1", title: "Accounts Fundamentals", topics: ["Accounting equation", "Journal entries practice", "Ledger posting", "Trial balance", "Rectification of errors"], resources: "T.S. Grewal, YouTube tutorials" },
        { week: "Week 2", title: "Financial Accounting", topics: ["Final accounts", "Depreciation methods", "Inventory valuation", "Partnership accounting", "Company accounts intro"], resources: "Accountancy textbooks, Practice problems" },
        { week: "Week 3", title: "Business Basics", topics: ["Business organization types", "Business environment", "Management principles", "Business ethics", "Entrepreneurship basics"], resources: "Business Studies books, Case studies" },
        { week: "Week 4", title: "Economics & Career", topics: ["Micro economics basics", "Macro economics intro", "Indian economy", "Career options after B.Com", "Higher studies guidance"], resources: "Economics NCERT, Career guides" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Advanced Accounting", topics: ["Company accounts complete", "Issue of shares/debentures", "Financial statement analysis", "Ratio analysis", "Cash flow statement", "Fund flow statement"], resources: "Advanced Accountancy, CA Foundation" },
        { week: "Month 1: Week 3-4", title: "Corporate Laws & Tax", topics: ["Companies Act 2013 basics", "Corporate governance", "Income tax fundamentals", "Salary & house property", "GST basics", "Tax planning intro"], resources: "Corporate Law books, Income Tax Act" },
        { week: "Month 2: Week 1-2", title: "Economics & Business", topics: ["Micro economics complete", "Macro economics complete", "Indian economy", "Monetary & fiscal policy", "International trade basics"], resources: "Economics by Mishra & Puri" },
        { week: "Month 2: Week 3-4", title: "Skills & Career", topics: ["Tally software", "Excel for finance", "Business communication", "Interview preparation", "CA/CS/CMA guidance", "Job market understanding"], resources: "Tally tutorials, Excel courses" }
      ]
    },
    9: {
      name: "BBA (Business Administration)",
      category: "Commerce",
      duration: "3 Years",
      fees: "₹50K-1.5 Lakhs/year (Govt) | ₹1-4 Lakhs/year (Private)",
      introduction: "BBA develops management and leadership skills. Learn marketing, finance, HR, operations, entrepreneurship. Perfect foundation for MBA. Prepares you for managerial roles!",
      prerequisites: ["Class 12th (Any stream - 50%+)", "Good communication", "Leadership interest", "Analytical thinking"],
      career_opportunities: ["Management Trainee (₹3-6 LPA)", "Marketing Executive (₹3-8 LPA)", "HR Executive (₹3-7 LPA)", "Business Development (₹3-10 LPA)", "After MBA (₹8-25 LPA)"],
      top_colleges: ["Christ University", "Symbiosis Pune", "NMIMS Mumbai", "St. Xavier's Mumbai", "IP University Delhi"],
      entrance_exams: ["CUET", "IPMAT", "SET", "NPAT", "University Tests"],
      roadmap_1month: [
        { week: "Week 1", title: "Management Fundamentals", topics: ["Introduction to management", "Management functions", "Management theories", "Planning and organizing", "Leadership styles"], resources: "Principles of Management, YouTube" },
        { week: "Week 2", title: "Marketing Basics", topics: ["Marketing concepts", "Marketing mix (4Ps/7Ps)", "Consumer behavior", "Market segmentation", "Digital marketing intro"], resources: "Philip Kotler Marketing, Videos" },
        { week: "Week 3", title: "Finance & HR", topics: ["Financial management basics", "Time value of money", "HR management", "Recruitment and selection", "Motivation theories"], resources: "Financial Management, HR books" },
        { week: "Week 4", title: "Business Skills", topics: ["Business communication", "Presentation skills", "Entrepreneurship basics", "Career planning", "MBA preparation intro"], resources: "Communication courses, TED Talks" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Management Complete", topics: ["Management process", "Organizational behavior", "Team dynamics", "Change management", "Strategic management intro", "Case study analysis"], resources: "Stephen Robbins Management, HBS cases" },
        { week: "Month 1: Week 3-4", title: "Marketing Deep Dive", topics: ["Marketing management", "Product life cycle", "Pricing strategies", "Distribution channels", "Services marketing", "Digital marketing complete"], resources: "Marketing by Kotler, Google Digital Garage" },
        { week: "Month 2: Week 1-2", title: "Finance & Operations", topics: ["Financial management complete", "Working capital", "Financial analysis", "Operations management", "Supply chain basics", "Quality management"], resources: "Financial Management texts, Operations books" },
        { week: "Month 2: Week 3-4", title: "HR & Entrepreneurship", topics: ["HR management complete", "Performance management", "Entrepreneurship", "Business plan writing", "CAT/MBA entrance prep", "Interview & GD skills"], resources: "HR books, Startup guides, CAT prep" }
      ]
    },
    10: {
      name: "B.Sc Nursing",
      category: "Medical",
      duration: "4 Years",
      fees: "₹30K-2 Lakhs/year (Govt) | ₹1-5 Lakhs/year (Private)",
      introduction: "B.Sc Nursing is a noble profession focused on patient care. Nurses are the backbone of healthcare. Growing demand in India and excellent international opportunities!",
      prerequisites: ["Physics, Chemistry, Biology (12th - 45%+)", "NEET UG or State Entrance", "Age: 17-35 years", "Physical fitness"],
      career_opportunities: ["Staff Nurse (₹3-6 LPA)", "ICU Nurse (₹4-8 LPA)", "Government Nurse (₹4-8 LPA)", "International Nurse (₹15-40 LPA abroad)", "Nursing Professor (₹6-12 LPA)"],
      top_colleges: ["AIIMS Nursing", "CMC Vellore", "RAK College Mumbai", "St. John's Bangalore", "PGIMER Chandigarh"],
      entrance_exams: ["NEET UG", "AIIMS Nursing Entrance", "State Nursing Entrances"],
      roadmap_1month: [
        { week: "Week 1", title: "Nursing Fundamentals", topics: ["Introduction to nursing", "History of nursing", "Nursing ethics", "Healthcare system", "Role of nurses"], resources: "Nursing textbooks, Florence Nightingale" },
        { week: "Week 2", title: "Anatomy & Physiology", topics: ["Human body systems", "Vital signs", "Medical terms", "Patient assessment", "Health and hygiene"], resources: "Nursing anatomy books, Videos" },
        { week: "Week 3", title: "Patient Care Basics", topics: ["Communication with patients", "Basic nursing procedures", "Personal hygiene assistance", "Medication basics", "Documentation"], resources: "Nursing procedure videos, Guides" },
        { week: "Week 4", title: "Clinical Preparation", topics: ["First aid basics", "Emergency care", "Nursing specializations", "Career paths", "International opportunities"], resources: "First aid courses, Career guidance" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Anatomy & Physiology", topics: ["All body systems anatomy", "Cardiovascular physiology", "Respiratory physiology", "Digestive and renal", "Nervous system", "Reproductive system"], resources: "Ross & Wilson Anatomy, Nursing guides" },
        { week: "Month 1: Week 3-4", title: "Fundamentals of Nursing", topics: ["Nursing process", "Patient care procedures", "Medication administration", "Wound care basics", "Catheterization", "IV therapy basics"], resources: "Fundamentals of Nursing by Potter & Perry" },
        { week: "Month 2: Week 1-2", title: "Medical-Surgical Nursing", topics: ["Common medical conditions", "Surgical nursing basics", "Pre/post-operative care", "Pain management", "Chronic disease nursing", "ICU basics"], resources: "Medical-Surgical Nursing by Brunner" },
        { week: "Month 2: Week 3-4", title: "Specialized & Career", topics: ["Pediatric nursing basics", "Obstetric nursing basics", "Mental health nursing", "Community health", "Entrance exam prep", "Resume and interviews"], resources: "Specialized nursing books, Entrance guides" }
      ]
    },
    11: {
      name: "B.Pharma (Pharmacy)",
      category: "Medical",
      duration: "4 Years",
      fees: "₹50K-2 Lakhs/year (Govt) | ₹1-4 Lakhs/year (Private)",
      introduction: "B.Pharma prepares you for pharmaceutical industry - from drug development to medicine dispensing. India is the pharmacy hub of the world. Excellent opportunities in pharma companies!",
      prerequisites: ["Physics, Chemistry, Biology/Maths (12th - 50%+)", "State Pharmacy Entrance or NEET", "Interest in chemistry"],
      career_opportunities: ["Hospital Pharmacist (₹3-6 LPA)", "Drug Inspector (₹5-10 LPA)", "Pharmaceutical Industry (₹4-12 LPA)", "Clinical Research (₹4-10 LPA)", "Quality Control (₹4-10 LPA)", "Own Pharmacy Store"],
      top_colleges: ["NIPER Mohali", "Jamia Hamdard", "ICT Mumbai", "Manipal College of Pharmacy", "Bombay College of Pharmacy"],
      entrance_exams: ["GPAT (for M.Pharma)", "State Pharmacy Entrances", "NEET (some colleges)"],
      roadmap_1month: [
        { week: "Week 1", title: "Pharmacy Basics", topics: ["Introduction to pharmacy", "History of pharmacy", "Pharmaceutical sciences", "Types of medications", "Drug forms", "Pharmacy regulations"], resources: "Pharmacy introduction books, YouTube" },
        { week: "Week 2", title: "Chemistry Foundations", topics: ["Organic chemistry review", "Pharmaceutical chemistry", "Drug structures", "Chemical reactions", "Quality testing basics"], resources: "Pharmaceutical Chemistry, Khan Academy" },
        { week: "Week 3", title: "Pharmaceutics Introduction", topics: ["Drug formulation basics", "Dosage forms", "Drug delivery systems", "Packaging and labeling", "Manufacturing overview"], resources: "Pharmaceutics by Aulton, Lab manuals" },
        { week: "Week 4", title: "Pharmacology & Career", topics: ["How drugs work", "Common drug categories", "Drug interactions", "Career options", "Industry overview"], resources: "Basic Pharmacology books, Industry videos" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Pharmaceutical Chemistry", topics: ["Organic chemistry complete", "Medicinal chemistry basics", "Drug synthesis", "Structure-activity", "Analytical chemistry", "Instrumental methods"], resources: "Medicinal Chemistry by Wilson & Gisvold" },
        { week: "Month 1: Week 3-4", title: "Pharmaceutics & Formulation", topics: ["Physical pharmacy", "Dosage form design", "Tablet formulation", "Liquid and semi-solid", "Novel drug delivery", "Industrial pharmacy intro"], resources: "Pharmaceutics by Remington, Aulton's" },
        { week: "Month 2: Week 1-2", title: "Pharmacology & Pharmacognosy", topics: ["General pharmacology", "Drug absorption/metabolism", "Autonomic pharmacology", "CNS pharmacology", "Natural drugs", "Herbal medicines"], resources: "Pharmacology by Rang & Dale" },
        { week: "Month 2: Week 3-4", title: "Clinical & Regulatory", topics: ["Clinical pharmacy basics", "Hospital pharmacy", "Drug regulations", "Quality assurance", "GPAT preparation intro", "Career planning"], resources: "Clinical pharmacy books, Drug regulations" }
      ]
    },
    12: {
      name: "BA (Bachelor of Arts)",
      category: "Arts & Humanities",
      duration: "3 Years",
      fees: "₹5K-30K/year (Govt) | ₹30K-1.5 Lakhs/year (Private)",
      introduction: "BA offers diverse subjects - History, Political Science, English, Psychology, Sociology. Develops critical thinking, communication, analytical skills. Gateway to civil services, teaching, journalism!",
      prerequisites: ["Class 12th (Any stream - 45%+)", "Good reading and writing", "Interest in humanities/social sciences"],
      career_opportunities: ["Civil Services IAS/IPS (₹8-15 LPA + perks)", "Teacher/Professor (₹3-12 LPA)", "Journalist (₹3-10 LPA)", "Content Writer (₹2-8 LPA)", "HR Executive (₹3-8 LPA)"],
      top_colleges: ["Lady Shri Ram College Delhi", "St. Stephen's College Delhi", "Hindu College Delhi", "Presidency College Kolkata"],
      entrance_exams: ["CUET", "University Tests", "Merit-based"],
      roadmap_1month: [
        { week: "Week 1", title: "Core Subject Foundation", topics: ["Choose specialization", "Subject fundamentals", "Key concepts and terms", "Important thinkers", "Reading techniques"], resources: "NCERT books, Subject introductions" },
        { week: "Week 2", title: "Writing & Analysis", topics: ["Essay writing skills", "Critical analysis", "Research methodology basics", "Argument construction", "Practice essays"], resources: "Writing guides, Sample essays" },
        { week: "Week 3", title: "General Knowledge", topics: ["Indian history overview", "Indian polity basics", "Geography fundamentals", "Current affairs", "Social issues"], resources: "Lucent GK, News sources, PIB" },
        { week: "Week 4", title: "Skills & Career", topics: ["Communication skills", "Presentation abilities", "Career options", "UPSC overview", "Higher studies guidance"], resources: "Soft skills courses, Career guides" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Subject Specialization", topics: ["Deep dive into subject", "Major theories and thinkers", "Historical development", "Contemporary debates", "Indian context study", "Important books reading"], resources: "Standard textbooks, IGNOU material, JSTOR" },
        { week: "Month 1: Week 3-4", title: "Research & Writing", topics: ["Academic writing mastery", "Research paper structure", "Literature review", "Primary/secondary sources", "Critical thinking", "Writing proposals"], resources: "Academic writing guides, Purdue OWL" },
        { week: "Month 2: Week 1-2", title: "Interdisciplinary Knowledge", topics: ["Cross-subject connections", "Indian Constitution", "Modern Indian history", "Sociology/psychology basics", "Philosophy introduction", "Environmental studies"], resources: "NCERT all subjects, Relevant textbooks" },
        { week: "Month 2: Week 3-4", title: "Competitive Exams", topics: ["UPSC syllabus overview", "State PSC understanding", "Banking/SSC overview", "UGC NET preparation", "Teaching career pathway", "MA entrance preparation"], resources: "UPSC previous papers, Career guides" }
      ]
    },
    13: {
      name: "LLB (Bachelor of Laws)",
      category: "Arts & Humanities",
      duration: "3 Years (After Graduation) / 5 Years (After 12th)",
      fees: "₹20K-1 Lakh/year (Govt) | ₹1-5 Lakhs/year (Private)",
      introduction: "LLB is the gateway to legal profession. Lawyers fight for justice, protect rights, advise businesses. From courtroom advocacy to corporate law - diverse career paths!",
      prerequisites: ["Class 12th (45%+) for 5-year LLB", "Graduation (45%+) for 3-year LLB", "CLAT/LSAT entrance", "Strong communication"],
      career_opportunities: ["Advocate (₹3-50 LPA)", "Corporate Lawyer (₹8-30 LPA)", "Government Lawyer (₹6-15 LPA)", "Judge (₹10-25 LPA)", "Legal Consultant (₹6-25 LPA)", "Own Practice (Unlimited)"],
      top_colleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi", "NUJS Kolkata", "Faculty of Law DU"],
      entrance_exams: ["CLAT", "AILET", "LSAT India", "MH CET Law"],
      roadmap_1month: [
        { week: "Week 1", title: "Legal Foundations", topics: ["Introduction to law", "Indian legal system", "Court hierarchy", "Types of laws", "Legal terminology", "Famous Indian cases"], resources: "Introduction to Law books, Legal videos" },
        { week: "Week 2", title: "Constitutional Law", topics: ["Indian Constitution overview", "Fundamental Rights", "Directive Principles", "Fundamental Duties", "Constitutional amendments"], resources: "Indian Constitution, Laxmikanth Polity" },
        { week: "Week 3", title: "Criminal & Civil Law", topics: ["IPC basics", "CrPC basics", "Civil Procedure basics", "Contract law intro", "Tort law basics"], resources: "Bare acts, Legal case studies" },
        { week: "Week 4", title: "Legal Skills & Career", topics: ["Legal research basics", "Legal writing intro", "Moot court awareness", "Career paths", "CLAT preparation guidance"], resources: "Legal research guides, CLAT prep" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Constitutional & Administrative", topics: ["Constitution detailed", "Part III - Fundamental Rights", "Constitutional remedies", "Administrative law basics", "Judicial review", "Landmark SC judgments"], resources: "Laxmikanth, M.P. Jain Constitutional Law" },
        { week: "Month 1: Week 3-4", title: "Contract & Tort Law", topics: ["Indian Contract Act 1872", "Essential elements", "Types of contracts", "Breach and remedies", "Tort law complete", "Negligence and defamation"], resources: "Contract Law by Avtar Singh, Law of Torts" },
        { week: "Month 2: Week 1-2", title: "Criminal Law", topics: ["IPC complete overview", "Offences against body/property", "CrPC procedures", "FIR, investigation, trial", "Evidence Act basics", "Criminal case analysis"], resources: "IPC & CrPC bare acts, Criminal Law by PSA Pillai" },
        { week: "Month 2: Week 3-4", title: "CLAT Preparation", topics: ["Legal reasoning development", "Reading comprehension", "Current legal affairs", "Moot court preparation", "CLAT exam pattern", "Mock test practice"], resources: "CLAT previous papers, Legal reasoning books" }
      ]
    },
    14: {
      name: "Mass Communication & Journalism (BJMC)",
      category: "Arts & Humanities",
      duration: "3 Years",
      fees: "₹30K-1 Lakh/year (Govt) | ₹1-4 Lakhs/year (Private)",
      introduction: "BJMC prepares you for media careers - TV news, digital content, advertising, PR. Learn reporting, video production, editing, digital marketing. High demand in content-driven world!",
      prerequisites: ["Class 12th (Any stream - 50%+)", "Excellent communication", "Creative thinking", "Interest in current affairs"],
      career_opportunities: ["TV Journalist (₹3-12 LPA)", "Digital Content Creator (₹3-15 LPA)", "PR Professional (₹4-15 LPA)", "Advertising Executive (₹3-12 LPA)", "Social Media Manager (₹3-10 LPA)"],
      top_colleges: ["IIMC Delhi", "AJK MCRC Jamia", "Symbiosis Pune", "Xavier's Mumbai", "Asian College of Journalism"],
      entrance_exams: ["IIMC Entrance", "CUET", "University Tests", "Merit-based"],
      roadmap_1month: [
        { week: "Week 1", title: "Media Fundamentals", topics: ["Introduction to mass communication", "Media history and evolution", "Types of media", "Media functions", "Current media landscape"], resources: "Mass Communication books, Documentaries" },
        { week: "Week 2", title: "Journalism Basics", topics: ["News writing fundamentals", "5W1H principle", "News story structure", "Headline writing", "Interview techniques"], resources: "Journalism textbooks, News analysis" },
        { week: "Week 3", title: "Visual & Digital Media", topics: ["Photography basics", "Video production intro", "Mobile journalism", "Social media for journalists", "Digital storytelling"], resources: "Mobile photography tutorials, Video editing" },
        { week: "Week 4", title: "PR, Advertising & Career", topics: ["Public relations basics", "Advertising fundamentals", "Brand communication", "Career paths", "Portfolio building"], resources: "PR & Advertising books, Career guides" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Journalism Complete", topics: ["Reporting for beats", "Investigative journalism", "Feature writing", "Editorial writing", "Sports/business journalism", "Interview skills"], resources: "Reporting and Writing News, Indian journalism" },
        { week: "Month 1: Week 3-4", title: "Broadcast & Digital", topics: ["TV journalism", "Radio production", "News anchoring", "Video editing (Premiere Pro)", "Audio editing", "Documentary making"], resources: "Adobe tutorials, Broadcasting guides" },
        { week: "Month 2: Week 1-2", title: "PR & Advertising", topics: ["Public relations detailed", "PR writing (Press release)", "Corporate communication", "Advertising copywriting", "Campaign planning", "Event management"], resources: "PR textbooks, Campaign India" },
        { week: "Month 2: Week 3-4", title: "Digital & Portfolio", topics: ["Digital marketing complete", "SEO and content marketing", "Social media management", "Analytics and metrics", "Build media portfolio", "Industry networking"], resources: "Google Digital Garage, HubSpot Academy" }
      ]
    },
    15: {
      name: "B.Sc (Bachelor of Science)",
      category: "Science",
      duration: "3 Years",
      fees: "₹10K-50K/year (Govt) | ₹50K-2 Lakhs/year (Private)",
      introduction: "B.Sc offers specialized study in Physics, Chemistry, Mathematics, Biology, Computer Science. Develops scientific thinking and research skills. Foundation for research, teaching, and advanced studies!",
      prerequisites: ["Class 12th Science (PCM/PCB - 50%+)", "Interest in scientific inquiry", "Analytical thinking"],
      career_opportunities: ["Scientist/Researcher (₹4-15 LPA)", "Lab Technician (₹2-5 LPA)", "Teacher/Professor (₹3-12 LPA)", "Data Analyst (₹4-12 LPA)", "After M.Sc/PhD (₹6-25 LPA)", "ISRO/DRDO Scientist (₹8-20 LPA)"],
      top_colleges: ["St. Stephen's College Delhi", "Hindu College Delhi", "Presidency College Kolkata", "Loyola Chennai", "IISc Bangalore"],
      entrance_exams: ["CUET", "JAM (for IIT M.Sc)", "University Tests", "Merit-based"],
      roadmap_1month: [
        { week: "Week 1", title: "Subject Foundation", topics: ["Core subject review", "Fundamental concepts", "Scientific method", "Lab safety", "Research basics"], resources: "NCERT, University textbooks" },
        { week: "Week 2", title: "Theoretical Deep Dive", topics: ["Advanced concepts", "Mathematical foundations", "Theory and applications", "Derivations and proofs", "Problem-solving"], resources: "Higher-level textbooks, NPTEL" },
        { week: "Week 3", title: "Practical Skills", topics: ["Laboratory techniques", "Equipment handling", "Experiment design", "Data collection", "Lab report writing"], resources: "Lab manuals, Practical videos" },
        { week: "Week 4", title: "Research & Career", topics: ["Scientific research overview", "Reading research papers", "Career paths", "M.Sc and PhD guidance", "IIT JAM basics"], resources: "Google Scholar, Career guides, JAM syllabus" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Subject Mastery", topics: ["Complete fundamentals", "Advanced theoretical concepts", "Mathematical derivations", "Numerical problems", "Conceptual understanding", "Inter-subject connections", "50+ problems"], resources: "University textbooks, Reference books, NPTEL" },
        { week: "Month 1: Week 3-4", title: "Advanced Topics", topics: ["Specialized topics", "Current research areas", "Modern developments", "Interdisciplinary applications", "Computer applications", "Programming basics (Python)"], resources: "Advanced textbooks, Research papers, Python" },
        { week: "Month 2: Week 1-2", title: "Research & Practical", topics: ["Research methodology", "Literature review", "Experimental design", "Statistical analysis", "Advanced lab techniques", "Project work"], resources: "Research methodology books, Lab manuals" },
        { week: "Month 2: Week 3-4", title: "Career Preparation", topics: ["IIT JAM preparation", "NET/GATE overview", "Research institutions", "MSc admission guidance", "PhD pathway", "Scholarship opportunities"], resources: "JAM previous papers, NET syllabus" }
      ]
    },
    16: {
      name: "Data Science & AI",
      category: "Technology",
      duration: "3-4 Years",
      fees: "₹1-3 Lakhs/year (Govt) | ₹2-8 Lakhs/year (Private)",
      introduction: "Data Science is the hottest career! Analyze massive data, build ML models, create AI systems. From Netflix recommendations to self-driving cars - revolutionize every industry with highest salaries!",
      prerequisites: ["Class 12th with Mathematics (60%+)", "Programming aptitude", "Statistical thinking", "Problem-solving skills"],
      career_opportunities: ["Data Scientist (₹6-25 LPA)", "Data Analyst (₹4-15 LPA)", "ML Engineer (₹8-30 LPA)", "AI Engineer (₹10-35 LPA)", "Business Analyst (₹5-15 LPA)", "Research Scientist (₹8-25 LPA)"],
      top_colleges: ["IIT Madras", "IIT Hyderabad", "IIIT Hyderabad", "ISI Kolkata", "IIM Calcutta"],
      entrance_exams: ["JEE Main", "University Entrance", "Aptitude Tests"],
      roadmap_1month: [
        { week: "Week 1", title: "Python for Data Science", topics: ["Python basics", "Data types and structures", "NumPy for numerical computing", "Pandas for data manipulation", "Data cleaning basics", "Real datasets practice"], resources: "Python.org, DataCamp, Kaggle Learn" },
        { week: "Week 2", title: "Data Visualization & Statistics", topics: ["Matplotlib and Seaborn", "Creating charts and graphs", "Descriptive statistics", "Probability basics", "Distributions understanding"], resources: "Khan Academy Statistics, Towards Data Science" },
        { week: "Week 3", title: "Machine Learning Basics", topics: ["ML concepts and types", "Linear regression", "Logistic regression", "Decision trees basics", "Model evaluation metrics"], resources: "Scikit-learn tutorials, Andrew Ng ML course" },
        { week: "Week 4", title: "Projects & Portfolio", topics: ["End-to-end ML project", "Kaggle competition basics", "GitHub portfolio creation", "Data science resume", "Interview preparation"], resources: "Kaggle, GitHub, LinkedIn" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Python & Data Analysis", topics: ["Python advanced (OOP)", "NumPy, Pandas mastery", "Data cleaning techniques", "Data visualization (Seaborn, Plotly)", "SQL for data analysis", "Real-world dataset projects"], resources: "Python Data Science Handbook, Mode SQL" },
        { week: "Month 1: Week 3-4", title: "Statistics & Mathematics", topics: ["Descriptive statistics complete", "Inferential statistics", "Hypothesis testing", "Probability distributions", "Linear algebra basics", "A/B testing"], resources: "StatQuest YouTube, Khan Academy, 3Blue1Brown" },
        { week: "Month 2: Week 1-2", title: "Machine Learning", topics: ["Supervised learning complete", "Unsupervised learning", "Feature engineering", "Model selection", "Hyperparameter tuning", "Cross-validation", "Scikit-learn projects"], resources: "Hands-On ML book, Kaggle courses, Fast.ai" },
        { week: "Month 2: Week 3-4", title: "Deep Learning & Portfolio", topics: ["Neural network basics", "TensorFlow/PyTorch intro", "Computer vision basics", "NLP basics", "Complete 3-5 Kaggle projects", "Build portfolio website"], resources: "Deep Learning Specialization, Kaggle competitions" }
      ]
    },
    17: {
      name: "Biotechnology (B.Tech/B.Sc)",
      category: "Science",
      duration: "4 Years (B.Tech) / 3 Years (B.Sc)",
      fees: "₹50K-2 Lakhs/year (Govt) | ₹2-6 Lakhs/year (Private)",
      introduction: "Biotechnology combines biology with technology - medicines, vaccines, biofuels, genetically modified crops. Growing pharma and biotech industry offers exciting opportunities in research and healthcare!",
      prerequisites: ["Class 12th with Biology (PCB - 55%+)", "JEE/State entrance for B.Tech", "Interest in life sciences"],
      career_opportunities: ["Research Scientist (₹4-15 LPA)", "Biotech Analyst (₹3-8 LPA)", "Quality Control (₹3-10 LPA)", "Clinical Research (₹4-12 LPA)", "Bioinformatics (₹5-15 LPA)", "After PhD (₹8-25 LPA)"],
      top_colleges: ["IIT Bombay", "IIT Delhi", "Anna University", "VIT Vellore", "Manipal", "SRM Chennai"],
      entrance_exams: ["JEE Main", "State Entrances", "University Tests", "CUET"],
      roadmap_1month: [
        { week: "Week 1", title: "Biology Foundations", topics: ["Cell biology review", "Molecular biology basics", "Genetics fundamentals", "DNA structure and function", "Gene expression"], resources: "Molecular Biology of the Cell, NCERT Biology" },
        { week: "Week 2", title: "Biotechnology Introduction", topics: ["What is biotechnology", "Applications of biotech", "Recombinant DNA technology", "PCR basics", "Gene cloning concepts"], resources: "Introduction to Biotechnology by Thieman" },
        { week: "Week 3", title: "Laboratory Techniques", topics: ["Lab safety and equipment", "Sterile techniques", "Microscopy basics", "DNA/RNA extraction", "Gel electrophoresis"], resources: "Lab manuals, Virtual labs, Protocol videos" },
        { week: "Week 4", title: "Applications & Career", topics: ["Medical biotechnology", "Agricultural biotechnology", "Industrial biotech", "Bioinformatics intro", "Career paths"], resources: "Application books, Industry webinars" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Core Biotechnology", topics: ["Molecular biology complete", "Genetic engineering", "Recombinant DNA technology", "Cloning vectors", "Gene transfer methods", "Protein expression systems"], resources: "Molecular Biotechnology by Glick, NPTEL" },
        { week: "Month 1: Week 3-4", title: "Advanced Techniques", topics: ["PCR and variations", "DNA sequencing", "Blotting techniques", "ELISA and immunotechniques", "Cell culture", "Fermentation technology"], resources: "Lab technique books, Protocol databases" },
        { week: "Month 2: Week 1-2", title: "Specialized Areas", topics: ["Bioinformatics tools", "Sequence analysis", "Medical biotechnology", "Vaccine development", "Agricultural biotech", "Environmental biotech"], resources: "NCBI tools, Bioinformatics tutorials" },
        { week: "Month 2: Week 3-4", title: "Research & Career", topics: ["Research methodology", "Scientific writing", "Project planning", "IPR and patents", "Industry vs academia", "MSc/PhD preparation"], resources: "Research guides, Patent databases" }
      ]
    },
    18: {
      name: "Architecture (B.Arch)",
      category: "Design",
      duration: "5 Years",
      fees: "₹1-3 Lakhs/year (Govt) | ₹3-10 Lakhs/year (Private)",
      introduction: "Architecture is the art and science of designing buildings and spaces. Create homes, offices, hospitals, cities. Creative career combining art, engineering, and sustainability!",
      prerequisites: ["Class 12th with Maths (50%+)", "NATA/JEE Paper 2", "Drawing and sketching skills", "Creative thinking"],
      career_opportunities: ["Architect (₹3-12 LPA)", "Interior Designer (₹3-10 LPA)", "Urban Planner (₹5-15 LPA)", "Landscape Architect (₹4-10 LPA)", "Own Practice (₹10-50 LPA)"],
      top_colleges: ["IIT Kharagpur", "IIT Roorkee", "SPA Delhi", "CEPT Ahmedabad", "JJ School of Art Mumbai"],
      entrance_exams: ["NATA", "JEE Main Paper 2", "State Level Tests"],
      roadmap_1month: [
        { week: "Week 1", title: "Architecture Basics", topics: ["Introduction to architecture", "History of architecture", "Famous architects and buildings", "Architectural styles", "Elements of design"], resources: "Architecture 101 videos, History books" },
        { week: "Week 2", title: "Technical Drawing", topics: ["Engineering drawing basics", "Orthographic projections", "Isometric and perspective", "Scale and dimensions", "Floor plan basics"], resources: "Engineering drawing books, YouTube" },
        { week: "Week 3", title: "Design Thinking", topics: ["Design principles", "Space planning basics", "Human scale and ergonomics", "Light and ventilation", "Simple design exercises"], resources: "Design books, Architecture magazines" },
        { week: "Week 4", title: "Software & Career", topics: ["AutoCAD basics", "SketchUp introduction", "Portfolio importance", "Career paths", "NATA preparation guidance"], resources: "AutoCAD tutorials, SketchUp free" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Design Fundamentals", topics: ["Design theory complete", "Form, space, and order", "Architectural composition", "Color theory", "Material studies", "10+ design exercises"], resources: "Architecture: Form, Space, Order by Ching" },
        { week: "Month 1: Week 3-4", title: "Technical Skills", topics: ["AutoCAD complete", "3D modeling basics", "Building construction basics", "Structural systems intro", "Complete floor plan project", "Model making"], resources: "AutoCAD Student, SketchUp" },
        { week: "Month 2: Week 1-2", title: "Advanced Design", topics: ["Site analysis", "Building design project", "Residential design", "Sustainable architecture", "Green building", "Urban design intro"], resources: "Case studies, Architectural journals" },
        { week: "Month 2: Week 3-4", title: "Portfolio & NATA", topics: ["Portfolio compilation", "Presentation techniques", "NATA drawing practice", "NATA aptitude prep", "Mock tests", "Interview skills"], resources: "NATA previous papers, Portfolio guides" }
      ]
    },
    19: {
      name: "Hotel Management (BHM)",
      category: "Management",
      duration: "4 Years",
      fees: "₹50K-2 Lakhs/year (Govt) | ₹2-6 Lakhs/year (Private)",
      introduction: "Hotel Management prepares you for hospitality industry - manage hotels, restaurants, resorts, cruise ships. Growing tourism industry with excellent placement opportunities!",
      prerequisites: ["Class 12th (Any stream - 50%+)", "Good communication", "Service orientation", "Personality"],
      career_opportunities: ["Hotel Manager (₹4-12 LPA)", "Chef (₹3-15 LPA)", "Restaurant Manager (₹3-10 LPA)", "Event Manager (₹3-10 LPA)", "Cruise Ship Jobs (₹5-20 LPA)", "Airline Hospitality (₹4-12 LPA)"],
      top_colleges: ["IHM Mumbai", "IHM Delhi", "IHM Bangalore", "Oberoi OCLD", "Welcomgroup Graduate School"],
      entrance_exams: ["NCHMCT JEE", "State Entrances", "University Tests"],
      roadmap_1month: [
        { week: "Week 1", title: "Hospitality Fundamentals", topics: ["Introduction to hospitality", "Hotel industry overview", "Hotel departments", "Types of hotels", "Career opportunities"], resources: "Hotel Management books, Industry videos" },
        { week: "Week 2", title: "Food & Beverage", topics: ["F&B service basics", "Restaurant operations", "Menu planning basics", "Food safety", "Customer service"], resources: "F&B textbooks, Service videos" },
        { week: "Week 3", title: "Front Office & Housekeeping", topics: ["Front office operations", "Reservation systems", "Guest handling", "Housekeeping basics", "Room maintenance"], resources: "Front office books, Training videos" },
        { week: "Week 4", title: "Communication & Career", topics: ["Hospitality communication", "Grooming standards", "Interview preparation", "Industry exposure", "Internship importance"], resources: "Communication courses, Career guides" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "F&B Production & Service", topics: ["Kitchen operations", "Food production basics", "Cooking methods", "Bakery and confectionery", "F&B service detailed", "Table setting and service styles"], resources: "Professional Chef, F&B service books" },
        { week: "Month 1: Week 3-4", title: "Front Office & Housekeeping", topics: ["Front office operations complete", "Property management systems", "Revenue management basics", "Housekeeping operations", "Laundry operations", "Guest relations"], resources: "Front Office Management, Housekeeping books" },
        { week: "Month 2: Week 1-2", title: "Management & Accounting", topics: ["Hotel accounting basics", "Food cost control", "Hospitality marketing", "Human resource management", "Quality management", "Event management"], resources: "Hotel Accounting, Marketing books" },
        { week: "Month 2: Week 3-4", title: "Specialization & Career", topics: ["Hotel software (Opera)", "Wine and beverage knowledge", "International hospitality", "Cruise line operations", "Industrial training prep", "Resume and interviews"], resources: "Hotel software tutorials, Career guides" }
      ]
    },
    20: {
      name: "Fashion Design (B.Des Fashion)",
      category: "Design",
      duration: "4 Years",
      fees: "₹1-3 Lakhs/year (Govt) | ₹2-8 Lakhs/year (Private)",
      introduction: "Fashion Design is about creating trendy clothing, accessories, and textiles. India's fashion industry is booming with opportunities in design houses, retail brands, and entrepreneurship!",
      prerequisites: ["Class 12th (Any stream - 50%+)", "NIFT/NID entrance", "Creative and artistic skills", "Fashion awareness"],
      career_opportunities: ["Fashion Designer (₹3-15 LPA)", "Textile Designer (₹3-10 LPA)", "Stylist (₹3-12 LPA)", "Fashion Merchandiser (₹4-15 LPA)", "Own Brand (Unlimited)", "Costume Designer (₹4-15 LPA)"],
      top_colleges: ["NIFT Delhi", "NID Ahmedabad", "Pearl Academy", "Symbiosis Design", "SOFT Mumbai"],
      entrance_exams: ["NIFT Entrance", "NID DAT", "Pearl Academy Test", "University Tests"],
      roadmap_1month: [
        { week: "Week 1", title: "Fashion Basics", topics: ["Introduction to fashion", "Fashion history", "Fashion terminology", "Current trends", "Fashion industry overview"], resources: "Fashion history books, Vogue, Fashion TV" },
        { week: "Week 2", title: "Design Fundamentals", topics: ["Elements of design", "Color theory", "Fabric knowledge basics", "Fashion illustration intro", "Mood boards"], resources: "Design books, Pinterest, YouTube" },
        { week: "Week 3", title: "Sketching & Illustration", topics: ["Fashion figure drawing", "Garment sketching", "Fabric rendering", "Accessory illustration", "Portfolio basics"], resources: "Fashion sketching books, Tutorials" },
        { week: "Week 4", title: "Construction & Career", topics: ["Sewing basics", "Pattern making intro", "Garment construction basics", "Career paths", "NIFT preparation guidance"], resources: "Sewing tutorials, NIFT prep materials" }
      ],
      roadmap_2months: [
        { week: "Month 1: Week 1-2", title: "Design & Illustration", topics: ["Fashion illustration complete", "Figure proportions", "Garment details", "Color theory advanced", "Textile design basics", "10+ illustrations"], resources: "Fashion Illustration by Fernandez, Tutorials" },
        { week: "Month 1: Week 3-4", title: "Textile & Materials", topics: ["Textile science basics", "Fiber types and properties", "Fabric construction", "Prints and patterns", "Sustainable textiles", "Material sourcing"], resources: "Textile books, Fabric stores visits" },
        { week: "Month 2: Week 1-2", title: "Pattern Making & Construction", topics: ["Pattern making basics", "Draping techniques", "Garment construction", "Finishing techniques", "Create 2-3 garments", "Quality standards"], resources: "Pattern making books, Sewing tutorials" },
        { week: "Month 2: Week 3-4", title: "Portfolio & NIFT Prep", topics: ["Portfolio compilation", "Fashion photography basics", "NIFT entrance pattern", "Creative ability test practice", "Situation test prep", "Interview preparation"], resources: "NIFT previous papers, Portfolio guides" }
      ]
    }
  };

  const course = allCourses[courseId] || {
    name: "Course Coming Soon",
    category: "General",
    duration: "Coming Soon",
    fees: "Coming Soon",
    introduction: "We're adding detailed roadmaps for all courses. Please check back soon!",
    prerequisites: ["To be updated"],
    career_opportunities: ["To be updated"],
    top_colleges: ["To be updated"],
    entrance_exams: ["To be updated"],
    roadmap_1month: [],
    roadmap_2months: []
  };

  const roadmap = selectedTimeline === "1month" ? course.roadmap_1month : course.roadmap_2months;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to={createPageUrl("Careers")}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
            <Badge className="bg-white text-blue-600 mb-4">{course.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{course.name}</h1>
            <div className="flex flex-wrap gap-4 mt-4 text-blue-100">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {course.fees}</span>
            </div>
          </div>
        </motion.div>

        {/* Course Introduction */}
        <Card className="mb-6 shadow-lg border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
              About This Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-lg">{course.introduction}</p>
          </CardContent>
        </Card>

        {/* Quick Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {course.prerequisites?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Entrance Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {course.entrance_exams?.map((exam, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{exam}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Top Colleges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {course.top_colleges?.slice(0, 5).map((college, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{college}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                Career & Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {course.career_opportunities?.slice(0, 5).map((career, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span className="text-gray-700">{career}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Selector */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="w-6 h-6 text-orange-600" />
              Choose Your Learning Timeline
            </CardTitle>
            <p className="text-gray-600 mt-2">Select how fast you want to learn the basics</p>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedTimeline("1month")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedTimeline === "1month"
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">🚀</div>
                  {selectedTimeline === "1month" && <CheckCircle className="w-6 h-6 text-blue-600" />}
                </div>
                <h3 className="font-bold text-xl mb-2">1 Month Fast Track</h3>
                <p className="text-sm text-gray-600 mb-3">Get started quickly with essential concepts</p>
                <div className="text-blue-600 font-semibold">4 Weeks • Quick Start</div>
              </button>

              <button
                onClick={() => setSelectedTimeline("2months")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedTimeline === "2months"
                    ? "border-green-500 bg-green-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">🎯</div>
                  {selectedTimeline === "2months" && <CheckCircle className="w-6 h-6 text-green-600" />}
                </div>
                <h3 className="font-bold text-xl mb-2">2 Months In-Depth</h3>
                <p className="text-sm text-gray-600 mb-3">Complete foundation with projects</p>
                <div className="text-green-600 font-semibold">8 Weeks • Full Foundation</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              {selectedTimeline === "1month" ? "1 Month Learning Roadmap" : "2 Months Learning Roadmap"}
            </CardTitle>
            <p className="text-gray-600 mt-2">Follow this week-by-week plan! 📚</p>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Progress Bar */}
            {roadmap && roadmap.length > 0 && user && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Your Progress</span>
                  <span className="text-green-600 font-bold">{getCompletedCount()}/{roadmap.length} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(getCompletedCount() / roadmap.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {roadmap && roadmap.length > 0 ? (
              <div className="space-y-6">
                {roadmap.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative"
                  >
                    {index < roadmap.length - 1 && (
                      <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500 hidden md:block"></div>
                    )}

                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <button
                          onClick={() => toggleStepComplete(index)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-lg transition-all duration-200 ${
                            isStepCompleted(index)
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gradient-to-br from-blue-500 to-green-500 hover:scale-105"
                          }`}
                        >
                          {isStepCompleted(index) ? <CheckCircle className="w-6 h-6" /> : index + 1}
                        </button>
                      </div>

                      <div className={`flex-1 rounded-xl p-6 border-2 transition-all duration-200 ${
                        isStepCompleted(index)
                          ? "bg-green-50 border-green-300"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg"
                      }`}>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={isStepCompleted(index) ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>{phase.week}</Badge>
                          <h3 className="font-bold text-xl text-gray-900">{phase.title}</h3>
                          {isStepCompleted(index) && <Badge className="bg-green-500 text-white">✓ Completed</Badge>}
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-600 mb-3">📖 Topics to Learn:</p>
                          <ul className="grid sm:grid-cols-2 gap-2">
                            {phase.topics.map((topic, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                <span className="text-gray-700 text-sm">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">📚 Recommended Resources:</p>
                          <p className="text-sm text-blue-700">{phase.resources}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-gray-600 text-lg">Detailed roadmap coming soon!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Button className="h-14 text-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
            <Download className="w-5 h-5 mr-2" />
            Download PDF Roadmap
          </Button>
          <Link to={createPageUrl("Chatbot")} className="w-full">
            <Button variant="outline" className="w-full h-14 text-lg border-2">
              <Video className="w-5 h-5 mr-2" />
              Talk to AI Career Buddy
            </Button>
          </Link>
        </div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-3">Believe in Yourself! 💪</h3>
          <p className="text-lg text-purple-100 mb-4">
            Every successful person started exactly where you are now. Follow this roadmap, stay consistent!
          </p>
          <p className="text-purple-200">
            "The future belongs to those who believe in the beauty of their dreams." ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
}
