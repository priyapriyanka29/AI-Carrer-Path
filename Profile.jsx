import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, BookOpen, Award, Heart, Trash2, ArrowRight, CheckCircle, Sparkles, TrendingUp, Calendar, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import TeamMemberDialog from "@/components/team/TeamMemberDialog";
import AddTeamMemberDialog from "@/components/team/AddTeamMemberDialog";

const careerData = {
  1: "Doctor (MBBS)", 2: "Computer Science (B.Tech CSE)", 3: "Mechanical Engineering",
  4: "Civil Engineering", 5: "Electrical Engineering", 6: "Electronics & Communication",
  7: "Chartered Accountancy (CA)", 8: "B.Com", 9: "BBA", 10: "B.Sc Nursing",
  11: "B.Pharma", 12: "BA", 13: "LLB", 14: "Mass Communication", 15: "B.Sc",
  16: "Data Science & AI", 17: "Biotechnology", 18: "Architecture", 19: "Hotel Management", 20: "Fashion Design"
};

const scholarshipData = {
  1: "SBI Asha Scholarship", 2: "Central Sector Scholarship", 3: "UOW Women in FinTech",
  4: "Post Matric SC Scholarship", 5: "National Merit Scholarship", 6: "INSPIRE Scholarship",
  7: "Sitaram Jindal Scholarship", 8: "Dr. Ambedkar Scholarship"
};

const motivationalMessages = [
  "🌟 Every expert was once a beginner. Keep going!",
  "💪 Your hard work today is tomorrow's success!",
  "🚀 Dream big, work hard, stay focused!",
  "✨ Success is the sum of small efforts repeated daily!",
  "🎯 You're one step closer to your dreams today!",
  "🌈 Believe in yourself - you've got this!",
  "📚 Education is the passport to the future!",
  "⭐ Your potential is unlimited!"
];

export default function Profile() {
  const queryClient = useQueryClient();
  const [currentMessage] = useState(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const result = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return result;
    },
    enabled: !!user?.email
  });

  const profile = profiles?.[0] || null;

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list()
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ data, id }) => id 
      ? base44.entities.TeamMember.update(id, data)
      : base44.entities.TeamMember.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id) => base44.entities.TeamMember.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
  });

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProfile.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] })
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile'] })
  });

  const [formData, setFormData] = useState({
    career_goal: "",
    target_year: "",
    current_class: "",
    preferred_stream: "",
    motivational_enabled: true
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        career_goal: profile.career_goal || "",
        target_year: profile.target_year || "",
        current_class: profile.current_class || "",
        preferred_stream: profile.preferred_stream || "",
        motivational_enabled: profile.motivational_enabled ?? true
      });
    }
  }, [profile]);

  const handleSaveGoals = () => {
    if (profile) {
      updateProfileMutation.mutate({ id: profile.id, data: formData });
    } else {
      createProfileMutation.mutate({ ...formData, saved_careers: [], saved_scholarships: [], roadmap_progress: {} });
    }
  };

  const handleRemoveCareer = (careerId) => {
    if (!profile) return;
    const updated = (profile.saved_careers || []).filter(id => id !== careerId);
    updateProfileMutation.mutate({ id: profile.id, data: { saved_careers: updated } });
  };

  const handleRemoveScholarship = (scholarshipId) => {
    if (!profile) return;
    const updated = (profile.saved_scholarships || []).filter(id => id !== scholarshipId);
    updateProfileMutation.mutate({ id: profile.id, data: { saved_scholarships: updated } });
  };

  const getProgressPercentage = (courseId) => {
    if (!profile?.roadmap_progress?.[courseId]) return 0;
    const progress = profile.roadmap_progress[courseId];
    const totalSteps = progress.timeline === "1month" ? 4 : 4;
    return Math.round((progress.completed_steps?.length || 0) / totalSteps * 100);
  };

  const totalProgress = () => {
    if (!profile?.roadmap_progress) return 0;
    const courseIds = Object.keys(profile.roadmap_progress);
    if (courseIds.length === 0) return 0;
    const total = courseIds.reduce((sum, id) => sum + getProgressPercentage(parseInt(id)), 0);
    return Math.round(total / courseIds.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.full_name || "Student"}</h1>
                <p className="text-blue-100">{user?.email}</p>
              </div>
            </div>
            {formData.motivational_enabled && (
              <div className="bg-white/10 rounded-xl p-4 mt-4">
                <p className="text-lg font-medium">{currentMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-4 text-center">
              <Heart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{profile?.saved_careers?.length || 0}</div>
              <div className="text-xs text-blue-700">Saved Careers</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-4 text-center">
              <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{profile?.saved_scholarships?.length || 0}</div>
              <div className="text-xs text-green-700">Saved Scholarships</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{totalProgress()}%</div>
              <div className="text-xs text-purple-700">Overall Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="pt-4 text-center">
              <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{profile?.career_goal ? "1" : "0"}</div>
              <div className="text-xs text-orange-700">Career Goal Set</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="bg-white border-2 w-full justify-start overflow-x-auto">
            <TabsTrigger value="goals">🎯 Goals</TabsTrigger>
            <TabsTrigger value="saved">❤️ Saved</TabsTrigger>
            <TabsTrigger value="progress">📊 Progress</TabsTrigger>
            <TabsTrigger value="team">👥 Team</TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Set Your Career Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Career Goal</label>
                    <Input
                      placeholder="e.g., Become a Software Engineer"
                      value={formData.career_goal}
                      onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Year</label>
                    <Select value={formData.target_year} onValueChange={(v) => setFormData({ ...formData, target_year: v })}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        {["2025", "2026", "2027", "2028", "2029", "2030"].map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Class</label>
                    <Select value={formData.current_class} onValueChange={(v) => setFormData({ ...formData, current_class: v })}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {["8th", "9th", "10th", "11th", "12th", "Graduate", "Other"].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Stream</label>
                    <Select value={formData.preferred_stream} onValueChange={(v) => setFormData({ ...formData, preferred_stream: v })}>
                      <SelectTrigger><SelectValue placeholder="Select stream" /></SelectTrigger>
                      <SelectContent>
                        {["Science", "Commerce", "Arts", "Undecided"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Motivational Messages</p>
                    <p className="text-sm text-gray-500">Receive daily motivation on your profile</p>
                  </div>
                  <Switch
                    checked={formData.motivational_enabled}
                    onCheckedChange={(v) => setFormData({ ...formData, motivational_enabled: v })}
                  />
                </div>

                <Button onClick={handleSaveGoals} className="w-full bg-gradient-to-r from-blue-500 to-green-500">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Save My Goals
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Saved Careers */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Saved Careers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(profile?.saved_careers?.length || 0) === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No saved careers yet</p>
                      <Link to={createPageUrl("Careers")}>
                        <Button variant="outline" className="mt-3">Explore Careers</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile.saved_careers.map(id => (
                        <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{careerData[id] || `Career ${id}`}</span>
                          <div className="flex gap-2">
                            <Link to={createPageUrl(`CourseDetails?id=${id}`)}>
                              <Button size="sm" variant="outline"><ArrowRight className="w-4 h-4" /></Button>
                            </Link>
                            <Button size="sm" variant="ghost" onClick={() => handleRemoveCareer(id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Saved Scholarships */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Saved Scholarships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(profile?.saved_scholarships?.length || 0) === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No saved scholarships yet</p>
                      <Link to={createPageUrl("Scholarships")}>
                        <Button variant="outline" className="mt-3">Find Scholarships</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile.saved_scholarships.map(id => (
                        <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{scholarshipData[id] || `Scholarship ${id}`}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleRemoveScholarship(id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!profile?.roadmap_progress || Object.keys(profile.roadmap_progress).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No roadmaps started yet</p>
                    <p className="text-sm mb-4">Start a career roadmap to track your learning progress!</p>
                    <Link to={createPageUrl("Careers")}>
                      <Button className="bg-gradient-to-r from-blue-500 to-green-500">
                        Start Learning Journey
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(profile.roadmap_progress).map(([courseId, progress]) => (
                      <div key={courseId} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-semibold">{careerData[parseInt(courseId)] || `Course ${courseId}`}</h3>
                            <Badge variant="secondary" className="mt-1">
                              {progress.timeline === "1month" ? "1 Month Plan" : "2 Month Plan"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">{getProgressPercentage(parseInt(courseId))}%</span>
                            <p className="text-xs text-gray-500">{progress.completed_steps?.length || 0}/4 steps</p>
                          </div>
                        </div>
                        <Progress value={getProgressPercentage(parseInt(courseId))} className="h-3" />
                        <div className="flex gap-2 mt-3">
                          {[0, 1, 2, 3].map(step => (
                            <div
                              key={step}
                              className={`flex-1 h-2 rounded-full ${
                                progress.completed_steps?.includes(step) ? "bg-green-500" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <Link to={createPageUrl(`CourseDetails?id=${courseId}`)}>
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Our Team
                  </CardTitle>
                  <Button 
                    onClick={() => setShowAddMember(true)}
                    className="bg-gradient-to-r from-blue-500 to-green-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {teamMembers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No team members yet</p>
                    <p className="text-sm mb-4">Add your teammates to showcase your team!</p>
                    <Button onClick={() => setShowAddMember(true)} className="bg-gradient-to-r from-blue-500 to-green-500">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Member
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {teamMembers.map((member) => (
                      <TeamMemberCard
                        key={member.id}
                        member={member}
                        onView={setSelectedMember}
                        onEdit={(m) => { setEditingMember(m); setShowAddMember(true); }}
                        onDelete={(m) => deleteMemberMutation.mutate(m.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <TeamMemberDialog
          member={selectedMember}
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
        <AddTeamMemberDialog
          open={showAddMember}
          onClose={() => { setShowAddMember(false); setEditingMember(null); }}
          onAdd={(data, id) => addMemberMutation.mutateAsync({ data, id })}
          editMember={editingMember}
        />
      </div>
    </div>
  );
}
