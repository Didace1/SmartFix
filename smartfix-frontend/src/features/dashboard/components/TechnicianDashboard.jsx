// src/features/dashboard/components/TechnicianDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, CheckCircle, Clock, TrendingUp, AlertCircle, ClipboardList, PlayCircle } from 'lucide-react';

export const TechnicianDashboard = ({ stats }) => {
  const assignedTasks = Number(stats?.myTasks || 0);
  const completedToday = Number(stats?.completedToday || 0);
  const pendingRepairs = Number(stats?.pendingRepairs || 0);
  const successRate = Number(stats?.successRate || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-8 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-base font-medium">Assigned Tasks</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{assignedTasks}</p>
            </div>
            <ClipboardList className="w-12 h-12 text-blue-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-base font-medium">Completed Today</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{completedToday}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-base font-medium">Pending Repairs</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{pendingRepairs}</p>
            </div>
            <Wrench className="w-12 h-12 text-blue-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-base font-medium">Success Rate</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{successRate}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Technician Workflow</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-4">
                <ClipboardList className="w-6 h-6 text-blue-600" />
                <span className="text-gray-800 text-base font-medium">Tasks assigned to you</span>
              </div>
              <span className="text-base font-semibold text-blue-700">{assignedTasks} assigned</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-4">
                <Wrench className="w-6 h-6 text-amber-600" />
                <span className="text-gray-800 text-base font-medium">Repair jobs waiting for completion</span>
              </div>
              <span className="text-base font-semibold text-amber-700">{pendingRepairs} pending</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-gray-800 text-base font-medium">Completed today</span>
              </div>
              <span className="text-base font-semibold text-green-700">{completedToday} done</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <span className="text-gray-800 text-base font-medium">Your success rate</span>
              </div>
              <span className="text-base font-semibold text-purple-700">{successRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Focus</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Next Task</p>
              <p className="text-base font-medium text-gray-800 mt-2">
                {stats?.nextTask || 'Review pending repair queue'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Average Repair Time</p>
              <p className="text-base font-medium text-gray-800 mt-2">
                {stats?.avgRepairTime ? `${stats.avgRepairTime} mins` : 'N/A'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Weekly Completed</p>
              <p className="text-base font-medium text-gray-800 mt-2">
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
    </div>
  );
};