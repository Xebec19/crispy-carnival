"use client";

import type React from "react";

import { useState } from "react";
import {
  Mail,
  Calendar,
  FileText,
  Database,
  MessageSquare,
  Clock,
  Search,
  Filter,
  Webhook,
  Share2,
  FileSpreadsheet,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type TaskType = {
  name: string;
  icon: string;
  category: string;
};

const taskTypes: TaskType[] = [
  { name: "Email", icon: "Mail", category: "Communication" },
  { name: "Calendar", icon: "Calendar", category: "Scheduling" },
  { name: "Document", icon: "FileText", category: "Content" },
  { name: "Database", icon: "Database", category: "Data" },
  { name: "Chat", icon: "MessageSquare", category: "Communication" },
  { name: "Delay", icon: "Clock", category: "Flow" },
  { name: "Search", icon: "Search", category: "Data" },
  { name: "Filter", icon: "Filter", category: "Data" },
  { name: "Webhook", icon: "Webhook", category: "Integration" },
  { name: "Share", icon: "Share2", category: "Communication" },
  { name: "Spreadsheet", icon: "FileSpreadsheet", category: "Content" },
  { name: "Automation", icon: "Zap", category: "Flow" },
];

export function TaskSidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(taskTypes.map((task) => task.category))
  );

  const filteredTasks = taskTypes.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? task.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    task: TaskType
  ) => {
    event.dataTransfer.setData("application/reactflow", "taskNode");
    event.dataTransfer.setData("application/nodeName", task.name);
    event.dataTransfer.setData("application/nodeIcon", task.icon);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r bg-background p-4 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`text-xs px-2 py-1 rounded-full ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`text-xs px-2 py-1 rounded-full ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.name}
            className="flex items-center p-2 border rounded-md bg-card cursor-grab hover:bg-accent"
            draggable
            onDragStart={(event) => onDragStart(event, task)}
          >
            <div className="mr-2 w-8 h-8 flex items-center justify-center rounded-full bg-muted">
              {task.icon === "Mail" && <Mail className="h-4 w-4" />}
              {task.icon === "Calendar" && <Calendar className="h-4 w-4" />}
              {task.icon === "FileText" && <FileText className="h-4 w-4" />}
              {task.icon === "Database" && <Database className="h-4 w-4" />}
              {task.icon === "MessageSquare" && (
                <MessageSquare className="h-4 w-4" />
              )}
              {task.icon === "Clock" && <Clock className="h-4 w-4" />}
              {task.icon === "Search" && <Search className="h-4 w-4" />}
              {task.icon === "Filter" && <Filter className="h-4 w-4" />}
              {task.icon === "Webhook" && <Webhook className="h-4 w-4" />}
              {task.icon === "Share2" && <Share2 className="h-4 w-4" />}
              {task.icon === "FileSpreadsheet" && (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              {task.icon === "Zap" && <Zap className="h-4 w-4" />}
            </div>
            <span className="text-sm">{task.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
