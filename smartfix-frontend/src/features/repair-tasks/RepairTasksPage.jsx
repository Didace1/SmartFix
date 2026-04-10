import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { CheckCircle, Clock3, AlertTriangle, ClipboardList } from 'lucide-react';
import { PageHeader } from '../../shared/components/Common/PageHeader';
import { LoadingState } from '../../shared/components/Common/LoadingState';
import { EmptyState } from '../../shared/components/Common/EmptyState';
import { StatCard } from '../../shared/components/Common/StatCard';

const LOCAL_TASKS_KEY = 'technician_repair_tasks';

export const RepairTasksPage = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const { user } = useSelector((state) => state.auth);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/repair-tasks`);
        if (!response.ok) throw new Error('Repair tasks endpoint unavailable');
        const data = await response.json();
        const normalized = Array.isArray(data) ? data : [];
        setTasks(normalized);
      } catch {
        const localTasks = JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY) || '[]');
        if (Array.isArray(localTasks) && localTasks.length > 0) {
          setTasks(localTasks);
        } else {
          const seeded = [
            {
              id: `local-${Date.now()}-1`,
              title: 'Dell XPS 13 Battery Replacement',
              customer: 'Jean Claude',
              device: 'Laptop / Dell XPS 13',
              issue: 'Battery failure',
              priority: 'high',
              status: 'pending',
              createdAt: new Date().toISOString()
            },
            {
              id: `local-${Date.now()}-2`,
              title: 'iPhone 14 Charging Port Repair',
              customer: 'Aline Umuhoza',
              device: 'Smartphone / iPhone 14',
              issue: 'USB/charging failure',
              priority: 'normal',
              status: 'in_progress',
              createdAt: new Date().toISOString()
            }
          ];
          setTasks(seeded);
          localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(seeded));
        }
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [SYSTEM_BACKEND_BASE_URL]);

  const pendingCount = useMemo(
    () => tasks.filter((task) => task?.status === 'pending').length,
    [tasks]
  );

  const inProgressCount = useMemo(
    () => tasks.filter((task) => task?.status === 'in_progress').length,
    [tasks]
  );

  const completedCount = useMemo(
    () => tasks.filter((task) => task?.status === 'completed').length,
    [tasks]
  );

  const activeTasks = useMemo(
    () => tasks.filter((task) => task?.status !== 'completed'),
    [tasks]
  );

  const completeTaskLocally = (taskId) => {
    const updated = tasks.map((task) =>
      String(task.id) === String(taskId)
        ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
        : task
    );
    setTasks(updated);
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated));
  };

  const handleApproveComplete = async (taskId) => {
    setUpdatingTaskId(taskId);
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/repair-tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technicianId: user?.id || null,
          technicianName: user?.fullName || null,
          completedAt: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Repair task completion endpoint unavailable');

      const savedTask = await response.json();
      setTasks((prev) => prev.map((task) => (String(task.id) === String(taskId) ? savedTask : task)));
      toast.success('Task marked completed.');
    } catch {
      completeTaskLocally(taskId);
      toast.success('Task marked completed (local mode).');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getPriorityBadge = (priority) => {
    const normalized = String(priority || 'normal').toLowerCase();
    if (normalized === 'urgent' || normalized === 'high') return 'bg-red-100 text-red-700';
    if (normalized === 'normal') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <LoadingState message="Loading repair tasks..." />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="My Repair Tasks"
        subtitle="Track assigned repairs and approve completion"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard label="Pending" value={pendingCount} accent="text-red-600" icon={<AlertTriangle />} />
        <StatCard label="In Progress" value={inProgressCount} accent="text-blue-600" icon={<Clock3 />} />
        <StatCard label="Completed" value={completedCount} accent="text-green-600" icon={<CheckCircle />} />
        <StatCard label="Total Assigned" value={tasks.length} accent="text-purple-600" icon={<ClipboardList />} />
      </div>

      {activeTasks.length === 0 ? (
        <EmptyState
          title="No active repair tasks"
          description="You have no pending tasks right now."
        />
      ) : (
        <div className="space-y-4">
          {activeTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow p-5 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title || 'Repair Task'}</h3>
                  <p className="text-sm text-gray-600 mt-1">Customer: {task.customer || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Device: {task.device || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Issue: {task.issue || 'N/A'}</p>
                </div>

                <div className="flex flex-col gap-2 min-w-[190px]">
                  <span className={`inline-flex self-start px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(task.priority)}`}>
                    {String(task.priority || 'normal').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    Status: {String(task.status || 'pending').replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    disabled={updatingTaskId === task.id}
                    onClick={() => handleApproveComplete(task.id)}
                    className="mt-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {updatingTaskId === task.id ? 'Saving...' : 'Approve Complete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
