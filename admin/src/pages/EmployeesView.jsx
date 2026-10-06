import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Plus, Search, CheckCircle2, XCircle, 
  Clock, Calendar, Award, Briefcase, ChevronRight, X
} from 'lucide-react';

export default function EmployeesView() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // New Employee Form State
  const [userId, setUserId] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Full Stack Developer');
  const [employmentType, setEmploymentType] = useState('full_time');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEmployees(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const fetchEmployeeDetails = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedEmployee(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch employee details:', err);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: Number(userId),
          department,
          designation,
          employment_type: employmentType
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setUserId('');
        fetchEmployees();
      }
    } catch (err) {
      console.error('Failed to create employee:', err);
    }
  };

  const handleApproveLeave = async (leaveId, status) => {
    try {
      const res = await fetch(`${baseUrl}/api/employees/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success && selectedEmployee) {
        fetchEmployeeDetails(selectedEmployee.id);
      }
    } catch (err) {
      console.error('Failed to update leave:', err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">HR & Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage staff records, daily attendance tracking, and leave approvals</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div 
            key={emp.id} 
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold text-sm">
                    {(emp.full_name ? emp.full_name[0] : 'E').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{emp.full_name}</h3>
                    <p className="text-xs text-gray-400 font-medium">{emp.designation}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  {emp.employee_code}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-xs text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Department:</span>
                  <span className="font-semibold text-gray-800">{emp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize font-semibold text-gray-800">{emp.employment_type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-gray-700 truncate max-w-[160px]">{emp.email}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => fetchEmployeeDetails(emp.id)}
              className="w-full py-2 bg-gray-50 hover:bg-orange/10 text-gray-700 hover:text-orange text-xs font-bold rounded-xl transition-colors text-center"
            >
              View Attendance & Leaves
            </button>
          </div>
        ))}

        {employees.length === 0 && !loading && (
          <div className="col-span-full p-12 bg-white border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400">
            No employees registered in the directory
          </div>
        )}
      </div>

      {/* Employee Detail Drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange/10 text-orange flex items-center justify-center font-extrabold text-base">
                  {(selectedEmployee.full_name ? selectedEmployee.full_name[0] : 'E').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedEmployee.full_name}</h3>
                  <p className="text-xs text-gray-500">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Leave Requests Queue */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-orange" /> Leave Requests
                </h4>

                <div className="space-y-2">
                  {selectedEmployee.leaves?.map(leave => (
                    <div key={leave.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800 capitalize">{leave.leave_type} Leave</span>
                        <p className="text-gray-400 mt-0.5">{leave.start_date} to {leave.end_date}</p>
                        {leave.reason && <p className="text-gray-600 mt-1 italic text-[11px]">"{leave.reason}"</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {leave.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleApproveLeave(leave.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleApproveLeave(leave.id, 'rejected')}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${leave.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {leave.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!selectedEmployee.leaves || selectedEmployee.leaves.length === 0) && (
                    <p className="text-xs text-gray-400 italic">No leave requests filed</p>
                  )}
                </div>
              </div>

              {/* Attendance Log (Last 30 days) */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" /> Recent Attendance History
                </h4>

                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100/70 text-gray-500 font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Check In</th>
                        <th className="p-2.5">Check Out</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedEmployee.attendance?.map(att => (
                        <tr key={att.id}>
                          <td className="p-2.5 font-bold text-gray-800">{att.work_date}</td>
                          <td className="p-2.5 text-gray-600">{att.check_in || '—'}</td>
                          <td className="p-2.5 text-gray-600">{att.check_out || '—'}</td>
                          <td className="p-2.5">
                            <span className="text-[10px] font-extrabold text-emerald-600 capitalize bg-emerald-50 px-1.5 py-0.5 rounded">
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!selectedEmployee.attendance || selectedEmployee.attendance.length === 0) && (
                    <p className="p-4 text-center text-xs text-gray-400">No attendance records found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Registered User ID *</label>
                <input 
                  type="number" 
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Department</label>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Designation</label>
                <input 
                  type="text" 
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Employment Type</label>
                <select 
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-medium"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contractor</option>
                  <option value="intern">Intern / Trainee</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange text-white font-bold rounded-xl shadow-lg shadow-orange/20 hover:bg-orange-dark"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
