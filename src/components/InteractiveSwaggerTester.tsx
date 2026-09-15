import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, RefreshCw, Send, Database, ShieldCheck, ArrowRight, Code } from 'lucide-react';

interface TaskRecord {
  id: number;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  created_at: string;
}

const INITIAL_TASKS: TaskRecord[] = [
  {
    id: 1,
    title: 'Migrate Core Services to FastAPI',
    description: 'Decommission legacy monolithic endpoints and rewrite in modern async ASGI',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    created_at: '2026-09-12T08:30:00Z'
  },
  {
    id: 2,
    title: 'Implement Alembic Async Migrations',
    description: 'Configure autogenerate pipeline for PostgreSQL connection pool',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    created_at: '2026-09-12T09:15:00Z'
  },
  {
    id: 3,
    title: 'Benchmarking RyuJIT vs CPython uv',
    description: 'Measure cold-start latency and request throughput under load',
    status: 'PENDING',
    priority: 'HIGH',
    created_at: '2026-09-12T10:00:00Z'
  }
];

export function InteractiveSwaggerTester() {
  const [tasks, setTasks] = useState<TaskRecord[]>(INITIAL_TASKS);
  const [activeEndpoint, setActiveEndpoint] = useState<'GET_ALL' | 'POST_TASK' | 'GET_BY_ID' | 'HEALTH'>('POST_TASK');
  const [taskTitle, setTaskTitle] = useState<string>('Deploy UV Docker Container');
  const [taskDescription, setTaskDescription] = useState<string>('Multi-stage build with non-root security context');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [taskIdInput, setTaskIdInput] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Simulated response states
  const [responseStatus, setResponseStatus] = useState<number>(201);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({
    'content-type': 'application/json',
    'server': 'uvicorn / fastapi',
    'x-process-time': '1.84ms'
  });
  const [responseBody, setResponseBody] = useState<any>({
    id: 4,
    title: 'Deploy UV Docker Container',
    description: 'Multi-stage build with non-root security context',
    status: 'PENDING',
    priority: 'HIGH',
    created_at: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const startTime = performance.now();

      if (activeEndpoint === 'HEALTH') {
        setResponseStatus(200);
        setResponseBody({
          status: 'healthy',
          version: '0.1.0',
          environment: 'production',
          engine: 'FastAPI + SQLAlchemy 2.0 Async',
          database_connected: true
        });
        return;
      }

      if (activeEndpoint === 'GET_ALL') {
        const filtered = statusFilter === 'ALL' ? tasks : tasks.filter(t => t.status === statusFilter);
        setResponseStatus(200);
        setResponseBody(filtered);
        return;
      }

      if (activeEndpoint === 'GET_BY_ID') {
        const found = tasks.find(t => t.id === taskIdInput);
        if (found) {
          setResponseStatus(200);
          setResponseBody(found);
        } else {
          setResponseStatus(404);
          setResponseBody({
            detail: `Task with ID ${taskIdInput} not found in database.`
          });
        }
        return;
      }

      if (activeEndpoint === 'POST_TASK') {
        // Demonstrate Pydantic v2 validation logic!
        if (!taskTitle || taskTitle.trim().length === 0) {
          setResponseStatus(422); // Unprocessable Entity
          setResponseBody({
            detail: [
              {
                type: 'string_too_short',
                loc: ['body', 'title'],
                msg: 'String should have at least 1 character',
                input: taskTitle,
                ctx: { min_length: 1 }
              }
            ]
          });
          return;
        }

        const newTask: TaskRecord = {
          id: tasks.length + 1,
          title: taskTitle.trim(),
          description: taskDescription.trim() || null,
          status: 'PENDING',
          priority: taskPriority,
          created_at: new Date().toISOString()
        };

        setTasks(prev => [newTask, ...prev]);
        setResponseStatus(201);
        setResponseBody(newTask);
      }
    }, 250);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
              OPENAPI 3.1 &bull; SWAGGER SANDBOX
            </span>
            <h3 className="text-lg font-bold text-white">
              Live FastAPI Interactive Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test the FastAPI ASGI microservice with live Pydantic v2 request validation, HTTP status codes, and JSON serialization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTasks(INITIAL_TASKS);
              setActiveEndpoint('GET_ALL');
              executeRequest();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset DB State</span>
          </button>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveEndpoint('POST_TASK')}
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
            activeEndpoint === 'POST_TASK'
              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-400">POST</span>
          <span className="truncate">/api/v1/tasks/</span>
        </button>

        <button
          onClick={() => setActiveEndpoint('GET_ALL')}
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
            activeEndpoint === 'GET_ALL'
              ? 'border-blue-500 bg-blue-950/30 text-blue-300'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-400">GET</span>
          <span className="truncate">/api/v1/tasks/</span>
        </button>

        <button
          onClick={() => setActiveEndpoint('GET_BY_ID')}
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
            activeEndpoint === 'GET_BY_ID'
              ? 'border-blue-500 bg-blue-950/30 text-blue-300'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-400">GET</span>
          <span className="truncate">/tasks/{'{id}'}</span>
        </button>

        <button
          onClick={() => setActiveEndpoint('HEALTH')}
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
            activeEndpoint === 'HEALTH'
              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-400">GET</span>
          <span className="truncate">/health</span>
        </button>
      </div>

      {/* Interactive Request Form & Response Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Request Parameters */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Request Payload (Pydantic Schema)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Content-Type: application/json</span>
          </div>

          {activeEndpoint === 'POST_TASK' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  title <span className="text-rose-400">*</span> <span className="text-slate-500 text-[11px]">(min: 1 char)</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="Enter task headline (leave blank to test 422 error)"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Tip: Clear this text field completely to test Pydantic's automatic 422 Unprocessable Entity response!
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  description <span className="text-slate-500 text-[11px]">(optional str)</span>
                </label>
                <textarea
                  rows={2}
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  priority <span className="text-slate-500 text-[11px]">(TaskPriority Enum)</span>
                </label>
                <select
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-hidden"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
            </div>
          )}

          {activeEndpoint === 'GET_ALL' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  status filter <span className="text-slate-500 text-[11px]">(Query parameter)</span>
                </label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-hidden"
                >
                  <option value="ALL">ALL (No filter)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <p className="text-xs text-slate-400">
                SQLAlchemy will execute: <code className="text-amber-300 font-mono">select(TaskItem).limit(20)</code>
              </p>
            </div>
          )}

          {activeEndpoint === 'GET_BY_ID' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  task_id <span className="text-rose-400">*</span> <span className="text-slate-500 text-[11px]">(Path parameter)</span>
                </label>
                <input
                  type="number"
                  value={taskIdInput}
                  onChange={e => setTaskIdInput(parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Enter an ID like 999 to test FastAPI's HTTP 404 Not Found exception handler.
                </p>
              </div>
            </div>
          )}

          {activeEndpoint === 'HEALTH' && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              Performs an ASGI heartbeat check returning application uptime, DB connectivity status, and container health metrics.
            </div>
          )}

          <button
            onClick={executeRequest}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span>{isLoading ? 'Executing Request...' : 'Send API Request'}</span>
          </button>
        </div>

        {/* Right: Live Response Inspector */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Response
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {responseStatus} {responseStatus === 201 ? 'Created' : responseStatus === 200 ? 'OK' : responseStatus === 422 ? 'Unprocessable Entity' : 'Not Found'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">1.84 ms</span>
            </div>

            {/* Response JSON */}
            <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-200 overflow-x-auto max-h-[220px]">
              <pre>{JSON.stringify(responseBody, null, 2)}</pre>
            </div>
          </div>

          {/* Rosetta Comparison Note */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5 text-xs text-slate-400 space-y-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase font-mono block">
              Behind the Scenes:
            </span>
            <p className="text-[11px] leading-relaxed text-slate-300">
              In ASP.NET Core, ModelState validation requires manual inspection or filter attributes. FastAPI with Pydantic v2 validates types at the Rust layer (<code className="text-amber-300 font-mono">pydantic-core</code>) before your Python controller method is ever invoked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
