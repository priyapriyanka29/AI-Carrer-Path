import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, User, Pencil } from "lucide-react";

export default function TeamMemberCard({ member, onView, onDelete, onEdit }) {
  return (
    <Card 
      className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group relative bg-white hover:scale-105 border-2 hover:border-blue-200"
      onClick={() => onView(member)}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(member);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Remove ${member.name} from team?`)) {
                onDelete(member);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-col items-center text-center">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-gradient-to-r from-blue-200 to-green-200 shadow-lg mb-3 group-hover:border-blue-300 transition-all"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center border-4 border-white shadow-lg mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
        )}
        
        <h3 className="font-bold text-gray-900 text-sm truncate w-full">{member.name}</h3>
        <p className="text-xs text-blue-600 font-medium mb-2">{member.role}</p>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {member.skills?.slice(0, 2).map((skill, idx) => (
            <Badge key={idx} className="text-xs px-2 py-0 bg-gradient-to-r from-blue-100 to-green-100 text-blue-700">
              {skill}
            </Badge>
          ))}
          {member.skills?.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-0 border-blue-200 text-blue-600">
              +{member.skills.length - 2}
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-gray-400 mt-2">Click to view details</p>
      </div>
    </Card>
  );
}
