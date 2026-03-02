import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Linkedin, Briefcase } from "lucide-react";

export default function TeamMemberDialog({ member, open, onClose }) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Team Member Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center py-6">
          {/* Profile Photo */}
          <div className="relative mb-4">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-xl">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>
          
          {/* Name & Role */}
          <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
          <div className="flex items-center gap-2 text-blue-600 font-medium mt-1 mb-3">
            <Briefcase className="w-4 h-4" />
            <span>{member.role}</span>
          </div>
          
          {/* Bio */}
          {member.bio && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full">
              <p className="text-sm text-gray-700 leading-relaxed">{member.bio}</p>
            </div>
          )}
          
          {/* Skills */}
          {member.skills?.length > 0 && (
            <div className="mb-4 w-full">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Skills</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {member.skills.map((skill, idx) => (
                  <Badge key={idx} className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Contact Buttons */}
          <div className="flex gap-3 mt-2">
            {member.email && (
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600" size="sm" asChild>
                <a href={`mailto:${member.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </Button>
            )}
            {member.linkedin && (
              <Button className="bg-gradient-to-r from-blue-700 to-blue-800" size="sm" asChild>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
