import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, Plus, Search, Calendar, 
  Award, MessageSquare, CheckCircle2, Clock, X
} from 'lucide-react';

export default function InternshipTasksView() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // New task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(10);

  // Feedback form
  const [enrollmentId, setEnrollmentId] = useState(1);
  const [score, setScore] = useState(9);
  const [feedbackComments, setFeedbackComments] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/internship-tasks/batch/${selectedBatchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch batch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, selectedBatchId, token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/internship-tasks/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          batch_id: selectedBatchId,
          title,
          description,
          due_date: dueDate || null,
          max_score: Number(maxScore)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowTaskModal(false);
        setTitle('');
        setDescription('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to create batch task:', err);
    }
  };

  const handleScoreSubmission = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/internship-tasks/mentor-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          enrollment_id: Number(enrollmentId),
          task_id: selectedTaskId,
          score: Number(score),
          comments: feedbackComments
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowFeedbackModal(false);
        setFeedbackComments('');
        alert('Mentor feedback & score submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Internship Assignments & Progress</h1>
          <p className="text-sm text-gray-500 mt-1">Assign batch development tasks, review daily student logs, and score deliverables</p>
        </div>
        <button 
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
        >
          <Plus size={16} /> Assign Batch Task
        </button>
      </div>

      {/* Batch Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm text-gray-900">{task.title}</h3>
                <span className="text-[10px] font-extrabold text-orange bg-orange/10 px-2 py-0.5 rounded">
                  Max: {task.max_score} Pts
                </span>
              </div>

              {task.description && (
                <p className="text-xs text-gray-500 line-clamp-3 mb-4">{task.description}</p>
              )}

              <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-xs text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Batch:</span>
                  <span className="font-bold text-gray-800">{task.batch_name || `Batch #${task.batch_id}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span className="text-gray-700">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Open ended'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedTaskId(task.id); setShowFeedbackModal(true); }}
              className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors text-center"
            >
              Evaluate & Score Intern
            </button>
          </div>
        ))}

        {tasks.length === 0 && !loading && (
          <div className="col-span-full p-12 bg-white border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400">
            No assignments published for this batch yet
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Assign New Batch Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Task Title *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build REST API for Product Catalog"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description & Requirements</label>
                <textarea 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical criteria, required endpoints, and git PR instructions..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Score</label>
                  <input 
                    type="number" 
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange text-white font-bold rounded-xl shadow-lg shadow-orange/20 hover:bg-orange-dark"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluate Intern Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Mentor Evaluation & Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScoreSubmission} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Intern Enrollment ID *</label>
                <input 
                  type="number" 
                  required
                  value={enrollmentId}
                  onChange={(e) => setEnrollmentId(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Score (out of 10) *</label>
                <input 
                  type="number" 
                  min="0"
                  max="10"
                  required
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-sm focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mentor Feedback Comments</label>
                <textarea 
                  rows="3"
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder="Code quality, architecture review, and improvement tips..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                >
                  Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
