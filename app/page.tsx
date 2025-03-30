import WorkflowEditor from "@/components/workflow-editor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center px-4">
          <h1 className="text-xl font-bold">Workflow Manager</h1>
        </div>
      </header>
      <div className="flex-1">
        <WorkflowEditor />
      </div>
    </main>
  );
}
