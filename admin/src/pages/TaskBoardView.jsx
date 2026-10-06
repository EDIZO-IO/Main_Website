import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Kanban, Plus, Clock, MessageSquare, AlertCircle, 
  CheckCircle2, PlayCircle, Layers, Calendar, User, X
} from 'lucide-react';

const TASK_COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'border-blue-400 bg-blue-50/50' },
  { id: 'in_progress', label: 'In Progress', color: 'border-amber-400 bg-amber-50/50' },
  { id: 'in_review', label: 'In Review', color: 'border-purple-400 bg-purple-50/50' },
  { id: 'done', label: 'Completed', color: 'border-emerald-400 bg-emerald-50/50' },
  { id: 'blocked', label: 'Blocked', color: 'border-rose-400 bg-rose-50/50' }
];

export default function TaskBoardView() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [timeSpentMinutes, setTimeSpentMinutes] = useState('');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskHours, setNewTaskHours] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/projects/${selectedProjectId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, selectedProjectId, token]);

  const fetchSprints = useCallback(async () => {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedProjectId}/sprints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSprints(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sprints:', err);
    }
  }, [baseUrl, selectedProjectId, token]);

  useEffect(() => {
    fetchTasks();
    fetchSprints();
  }, [fetchTasks, fetchSprints]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${baseUrl}/api/projects/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/projects/${selectedProjectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          estimated_hours: newTaskHours || null,
          due_date: newTaskDueDate || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateTaskModal(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskPriority('medium');
        setNewTaskHours('');
        setNewTaskDueDate('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleLogTime = async (taskId) => {
    if (!timeSpentMinutes) return;
    try {
      const res = await fetch(`${baseUrl}/api/projects/tasks/${taskId}/time-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          minutes_spent: Number(timeSpentMinutes),
          work_date: new Date().toISOString().slice(0, 10),
          notes: 'Logged from Kanban board'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTimeSpentMinutes('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to log time:', err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Project Sprints & Kanban Board</h1>
          <p className="text-sm text-gray-500 mt-1">Deliver agile engineering milestones, manage task states, and track hours</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Sprints & Status Row */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Sprints:</span>
        {sprints.map(sprint => (
          <div key={sprint.id} className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {sprint.name} ({sprint.task_count || 0} tasks)
          </div>
        ))}
        {sprints.length === 0 && (
          <span className="text-xs text-gray-400 italic">No specific sprints configured (General Kanban)</span>
        )}
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {TASK_COLUMNS.map(column => {
          const colTasks = tasks.filter(t => t.status === column.id);

          return (
            <div key={column.id} className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-3 flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-gray-700 tracking-wide">{column.label}</span>
                <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map(task => (
                  <div 
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-xs text-gray-900 leading-snug">{task.title}</h4>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        task.priority === 'urgent' ? 'bg-red-50 text-red-600' :
                        task.priority === 'high' ? 'bg-orange/10 text-orange' :
                        task.priority === 'medium' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                    )}

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <User size={12} />
                        <span>{task.assigned_to_name || 'Unassigned'}</span>
                      </div>
                      {task.estimated_hours && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{task.estimated_hours}h</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Move Selector */}
                    <div className="mt-3 pt-2 border-t border-gray-100/60 flex items-center justify-between">
                      <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 focus:outline-none"
                      >
                        {TASK_COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>Move to {c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="p-4 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add New Kanban Task</h3>
              <button onClick={() => setShowCreateTaskModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Task Title *</label>
                <input 
                  type="text" 
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Webhook Signature Verification"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea 
                  rows="3"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Details, technical acceptance criteria, or branch info..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Priority</label>
                  <select 
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Est. Hours</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(e.target.value)}
                    placeholder="4.0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange text-white font-bold rounded-xl shadow-lg shadow-orange/20 hover:bg-orange-dark"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
