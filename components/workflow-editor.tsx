"use client";

import type React from "react";

import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { TaskNode } from "./task-node";
import { TaskSidebar } from "./task-sidebar";
import { PropertiesPanel } from "./properties-panel";

// Define custom node types
const nodeTypes: NodeTypes = {
  taskNode: TaskNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function WorkflowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle dropping new nodes onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData("application/reactflow");
        const name = event.dataTransfer.getData("application/nodeName");
        const icon = event.dataTransfer.getData("application/nodeIcon");

        // Check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
          id: `node_${nodes.length + 1}`,
          type,
          position,
          data: { label: name, icon, properties: {} },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, nodes, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const updateNodeProperties = useCallback(
    (nodeId: string, properties: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                properties,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  return (
    <div className="flex h-full">
      <TaskSidebar />
      <div className="flex-1 h-[calc(100vh-3.5rem)]" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      {selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          updateProperties={(properties) =>
            updateNodeProperties(selectedNode.id, properties)
          }
        />
      )}
    </div>
  );
}
