// src/features/dashboard/components/TechnicianDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, CheckCircle, Clock, TrendingUp, AlertCircle, ClipboardList, PlayCircle } from 'lucide-react';

export const TechnicianDashboard = ({ stats }) => {
  const openDiagnoses = Number(stats?.myTasks || 0);
  const completedToday = Number(stats?.completedToday || 0);
  const urgentJobs = Number(stats?.urgentTasks || 0);
  const successRate = Number(stats?.successRate || 0);
  const pendingRepairs = Number(stats?.pendingRepairs || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Open Diagnoses</p>
              <p className="text-2xl font-bold text-blue-600">{openDiagnoses}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-blue-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Today</p>
              <p className="text-2xl font-bold text-green-600">{completedToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Urgent Tasks</p>
              <p className="text-2xl font-bold text-red-600">{urgentJobs}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technician Workflow</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-800">Diagnose new device issues</span>
              </div>
              <span className="text-sm font-semibold text-blue-700">{openDiagnoses} open</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-amber-600" />
                <span className="text-gray-800">Repair jobs waiting for completion</span>
              </div>
              <span className="text-sm font-semibold text-amber-700">{pendingRepairs} pending</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-gray-800">Urgent interventions</span>
              </div>
              <span className="text-sm font-semibold text-red-700">{urgentJobs} urgent</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-800">Completed today</span>
              </div>
              <span className="text-sm font-semibold text-green-700">{completedToday} done</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Focus</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 border">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Next Task</p>
              <p className="text-sm font-medium text-gray-800 mt-1">
                {stats?.nextTask || 'Review pending repair queue'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Average Repair Time</p>
              <p className="text-sm font-medium text-gray-800 mt-1">
                {stats?.avgRepairTime ? `${stats.avgRepairTime} mins` : 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Weekly Completed</p>
              <p className="text-sm font-medium text-gray-800 mt-1">
                {stats?.weeklyCompleted || 0} tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/diagnosis"
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
          >
            Start New Diagnosis
          </Link>
          <Link
            to="/my-repair-tasks"
            className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center font-medium"
          >
            Open My Tasks
          </Link>
          <Link
            to="/spare-part-requests"
            className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-center font-medium"
          >
            Request Spare Parts
          </Link>
        </div>
      </div>

      {stats?.nextTask && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-700" />
            <h3 className="font-semibold text-blue-800">Priority Reminder</h3>
          </div>
          <p className="text-blue-700">{stats.nextTask}</p>
        </div>
      )}
    </div>
  );
};