import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AddTeamMemberDialog({ open, onClose, onAdd, editMember }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    photo_url: "",
    skills: [],
    bio: "",
    email: "",
    linkedin: ""
  });
  const [skillInput, setSkillInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (editMember) {
      setFormData({
        name: editMember.name || "",
        role: editMember.role || "",
        photo_url: editMember.photo_url || "",
        skills: editMember.skills || [],
        bio: editMember.bio || "",
        email: editMember.email || "",
        linkedin: editMember.linkedin || ""
      });
    } else {
      setFormData({ name: "", role: "", photo_url: "", skills: [], bio: "", email: "", linkedin: "" });
    }
  }, [editMember, open]);

  const resetForm = () => {
    setFormData({ name: "", role: "", photo_url: "", skills: [], bio: "", email: "", linkedin: "" });
    setSkillInput("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, photo_url: file_url }));
    } catch (err) {
      alert("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.role) return;
    
    setSaving(true);
    try {
      await onAdd(formData, editMember?.id);
      resetForm();
      onClose();
    } catch (err) {
      alert("Failed to save team member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">Profile Photo</p>
            <div className="relative">
              {formData.photo_url ? (
                <div className="relative">
                  <img
                    src={formData.photo_url}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, photo_url: "" }))}
                    className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center border-4 border-dashed border-gray-300">
                  <Upload className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Upload</span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-green-500 text-white p-2.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity shadow-lg">
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">Click + to upload photo</p>
          </div>

          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
            />
          </div>

          <div className="space-y-2">
            <Label>Role *</Label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {skill}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Short bio..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input
              value={formData.linkedin}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!formData.name || !formData.role || saving}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {editMember ? "Save Changes" : "Add Team Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
