import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Clock3, UserCheck, Wrench, Plus, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../shared/components/Common/PageHeader';
import { StatCard } from '../../shared/components/Common/StatCard';
import { EmptyState } from '../../shared/components/Common/EmptyState';
import toast from 'react-hot-toast';

const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
const SALE_SERVICE_LOG_KEY = 'sales_device_service_log';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800'
};

export const SalesRepairPage = () => {
  const [repairTasks, setRepairTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [localIntakes, setLocalIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    deviceType: '',
    deviceModel: ''
  });

  const loadRepairTasks = async () => {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/repair-tasks`);
      if (response.ok) {
        const data = await response.json();
        setRepairTasks(data);
      }
    } catch {
      // backend unreachable — rely on local data
    }
  };

  const loadTechnicians = async () => {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/technicians`);
      if (response.ok) {
        const data = await response.json();
        setTechnicians(data);
      }
    } catch {
      setTechnicians([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const storedLogs = JSON.parse(localStorage.getItem(SALE_SERVICE_LOG_KEY) || '[]');
      const repairOnlyLogs = storedLogs.filter((entry) => entry?.serviceContext?.repairNeeded);
      setLocalIntakes(repairOnlyLogs);
      await Promise.all([loadRepairTasks(), loadTechnicians()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleCreateTask = async (intake) => {
    const payload = {
      deviceType: intake?.serviceContext?.deviceType || intake?.deviceType || '',
      deviceModel: intake?.serviceContext?.deviceModel || intake?.deviceModel || '',
      repairNote: intake?.serviceContext?.repairNote || intake?.repairNote || ''
    };

    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/repair-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        toast.success('Repair task created');
        await loadRepairTasks();
      } else {
        toast.error('Failed to create repair task');
      }
    } catch {
      toast.error('Backend not reachable');
    }
  };

  const handleCreateManualTask = async () => {
    if (!newTask.deviceType.trim()) {
      toast.error('Please enter device type');
      return;
    }
    await handleCreateTask(newTask);
    setNewTask({ deviceType: '', deviceModel: '' });
    setShowNewTaskForm(false);
  };

  const handleAssignTechnician = async (taskId, technicianId) => {
    if (!technicianId) return;
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/repair-tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId: Number(technicianId) })
      });
      if (response.ok) {
        toast.success('Technician assigned successfully');
        await loadRepairTasks();
      } else {
        const err = await response.json();
        toast.error(err?.message || 'Assignment failed');
      }
    } catch {
      toast.error('Backend not reachable');
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/repair-tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        toast.success(`Status updated to ${status}`);
        await loadRepairTasks();
      }
    } catch {
      toast.error('Backend not reachable');
    }
  };

  const pendingCount = repairTasks.filter((t) => t.status === 'PENDING').length;
  const assignedCount = repairTasks.filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;
  const completedCount = repairTasks.filter((t) => t.status === 'COMPLETED').length;

  const unsubmittedIntakes = useMemo(() => {
    const submittedRefs = new Set(repairTasks.map((t) => t.customerRef).filter(Boolean));
    return localIntakes.filter((entry) => {
      const ref = entry?.customer?.ref || '';
      return !ref || !submittedRefs.has(ref);
    });
  }, [localIntakes, repairTasks]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Sales Repair Intake"
        subtitle="Create repair tasks and assign them to technicians"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Tasks" value={repairTasks.length} accent="text-blue-600" icon={<ClipboardList className="w-8 h-8" />} />
        <StatCard label="Pending" value={pendingCount} accent="text-yellow-600" icon={<Clock3 className="w-8 h-8" />} />
        <StatCard label="Assigned / In Progress" value={assignedCount} accent="text-orange-600" icon={<UserCheck className="w-8 h-8" />} />
        <StatCard label="Completed" value={completedCount} accent="text-green-600" icon={<CheckCircle2 className="w-8 h-8" />} />
      </div>

      {/* Unsubmitted local intakes */}
      {unsubmittedIntakes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-bold text-amber-900 mb-3">
            Repair requests from checkout ({unsubmittedIntakes.length}) — click to create task
          </h3>
          <div className="space-y-2">
            {unsubmittedIntakes.map((intake, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                <div className="text-sm">
                  <p className="text-sm text-gray-700">
                    {intake.serviceContext?.deviceType || 'Unknown Device'}
                    {intake.serviceContext?.deviceModel ? ` — ${intake.serviceContext.deviceModel}` : ''}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{intake.serviceContext?.repairNote || 'No note'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCreateTask(intake)}
                  className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Create Task
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New task form */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Repair Task
        </button>

        {showNewTaskForm && (
          <div className="mt-3 bg-white rounded-lg shadow p-4 border max-w-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Create Repair Task</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Device Type *"
                  value={newTask.deviceType}
                  onChange={(e) => setNewTask({ ...newTask, deviceType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Device Model"
                  value={newTask.deviceModel}
                  onChange={(e) => setNewTask({ ...newTask, deviceModel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateManualTask}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTaskForm(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Repair tasks list */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Repair Tasks</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : repairTasks.length === 0 ? (
          <EmptyState
            title="No repair tasks yet"
            description="Create a repair task from a checkout intake or manually using the button above."
          />
        ) : (
          <div className="space-y-4">
            {[...repairTasks]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((task) => (
                <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-700'}`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-400">#{task.id}</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {task.deviceType || 'Unknown Device'}
                        {task.deviceModel ? ` — ${task.deviceModel}` : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2 min-w-[220px]">
                      {task.assignedTechnician ? (
                        <div className="text-sm bg-blue-50 rounded-lg p-2 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-800">Assigned to:</p>
                          <p className="font-medium text-blue-900">{task.assignedTechnician.fullName}</p>
                          <p className="text-xs text-blue-700">{task.assignedTechnician.specialization || ''}</p>
                          {task.assignedAt && (
                            <p className="text-xs text-blue-600 mt-1">
                              on {new Date(task.assignedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Technician</label>
                          <select
                            defaultValue=""
                            onChange={(e) => handleAssignTechnician(task.id, e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg text-sm"
                          >
                            <option value="" disabled>Select technician...</option>
                            {technicians.map((tech) => (
                              <option key={tech.id} value={tech.id}>
                                {tech.fullName} — {tech.specialization || 'General'}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {task.status !== 'COMPLETED' && task.assignedTechnician && (
                        <div className="flex gap-1">
                          {task.status === 'ASSIGNED' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                              className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                            >
                              Start Work
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Mark Complete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
