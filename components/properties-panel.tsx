"use client";

import { useState, useEffect } from "react";
import type { Node } from "reactflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PropertiesPanelProps = {
  node: Node;
  updateProperties: (properties: Record<string, any>) => void;
};

// Define property fields based on node type
const getPropertyFields = (nodeName: string) => {
  switch (nodeName) {
    case "Email":
      return [
        { name: "to", label: "To", type: "text" },
        { name: "subject", label: "Subject", type: "text" },
        { name: "body", label: "Body", type: "textarea" },
      ];
    case "Calendar":
      return [
        { name: "title", label: "Event Title", type: "text" },
        { name: "start", label: "Start Time", type: "text" },
        { name: "end", label: "End Time", type: "text" },
      ];
    case "Database":
      return [
        {
          name: "connection",
          label: "Connection",
          type: "select",
          options: ["MySQL", "PostgreSQL", "MongoDB"],
        },
        { name: "query", label: "Query", type: "textarea" },
      ];
    case "Delay":
      return [{ name: "duration", label: "Duration (seconds)", type: "text" }];
    case "Filter":
      return [{ name: "condition", label: "Condition", type: "textarea" }];
    default:
      return [
        { name: "name", label: "Name", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
      ];
  }
};

export function PropertiesPanel({
  node,
  updateProperties,
}: PropertiesPanelProps) {
  const [properties, setProperties] = useState<Record<string, any>>(
    node.data.properties || {}
  );
  const propertyFields = getPropertyFields(node.data.label);

  useEffect(() => {
    setProperties(node.data.properties || {});
  }, [node]);

  const handlePropertyChange = (name: string, value: any) => {
    const updatedProperties = { ...properties, [name]: value };
    setProperties(updatedProperties);
  };

  const handleSave = () => {
    updateProperties(properties);
  };

  return (
    <div className="w-80 border-l bg-background p-4 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <div className="rounded-full w-8 h-8 flex items-center justify-center bg-background">
            {/* We would dynamically render the icon here, but for simplicity we'll skip it */}
          </div>
          <div>
            <div className="font-medium">{node.data.label}</div>
            <div className="text-xs text-muted-foreground">ID: {node.id}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {propertyFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>

            {field.type === "text" && (
              <Input
                id={field.name}
                value={properties[field.name] || ""}
                onChange={(e) =>
                  handlePropertyChange(field.name, e.target.value)
                }
              />
            )}

            {field.type === "textarea" && (
              <Textarea
                id={field.name}
                value={properties[field.name] || ""}
                onChange={(e) =>
                  handlePropertyChange(field.name, e.target.value)
                }
                rows={3}
              />
            )}

            {field.type === "select" && field.options && (
              <Select
                value={properties[field.name] || ""}
                onValueChange={(value) =>
                  handlePropertyChange(field.name, value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 mt-auto">
        <Button onClick={handleSave} className="w-full">
          Save Properties
        </Button>
      </div>
    </div>
  );
}
