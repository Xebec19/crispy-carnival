import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

type TaskNodeData = {
  label: string;
  icon: string;
  properties: Record<string, unknown>;
};

export const TaskNode = memo(({ data }: NodeProps<TaskNodeData>) => {
  // Dynamically get the icon from Lucide
  const IconComponent =
    (LucideIcons as unknown as Record<string, LucideIcon>)[data.icon] ||
    LucideIcons.Box;

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200 w-48">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-100">
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">
            {Object.keys(data.properties).length > 0
              ? `${Object.keys(data.properties).length} properties set`
              : "No properties set"}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

TaskNode.displayName = "TaskNode";
