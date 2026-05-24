import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Clock, CheckCircle, XCircle, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '../../shared/components/Common/PageHeader';
import { LoadingState } from '../../shared/components/Common/LoadingState';

/**
 * Phase 3: Technician Performance Dashboard
 * Tracks success rates, repair times, customer satisfaction
 */
export const TechnicianPerformancePage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  const API_BASE = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/performance/dashboard`);
      if (!response.ok) throw new Error('Failed to load dashboard');
      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load performance dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceBadge = (level) => {
    const badges = {
      EXCELLENT: { color: 'bg-green-100 text-green-800 border-green-300', icon: '🏆', label: 'Excellent' },
      GOOD: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '⭐', label: 'Good' },
      AVERAGE: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '👍', label: 'Average' },
      NEEDS_IMPROVEMENT: { color: 'bg-red-100 text-red-800 border-red-300', icon: '📈', label: 'Needs Improvement' },
    };
    return badges[level] || badges.AVERAGE;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return <LoadingState message="Loading performance dashboard..." />;
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  const { overallStats, technicianLeaderboard, repairTrends, deviceTypeStats } = dashboard;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="📊 Technician Performance Dashboard"
        subtitle="Track repair success rates, customer satisfaction, and team performance"
      />

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Repairs</p>
              <p className="text-3xl font-bold text-gray-900">{overallStats.totalRepairsCompleted}</p>
              <p className="text-xs text-gray-500 mt-1">
                {overallStats.repairsCompletedThisMonth} this month
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">{overallStats.overallSuccessRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Overall performance</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Customer Satisfaction</p>
              <p className="text-3xl font-bold text-purple-600">
                {overallStats.overallCustomerSatisfactionRate}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Happy customers</p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Repair Time</p>
              <p className="text-3xl font-bold text-orange-600">
                {overallStats.averageRepairTimeMinutes}m
              </p>
              <p className="text-xs text-gray-500 mt-1">Per repair</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">🏆 Technician Leaderboard</h2>
              <p className="text-blue-100 text-sm">
                Ranked by success rate and total repairs completed
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Technician</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Repairs</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Success Rate</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Customer Satisfaction</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Time</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">This Month</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {technicianLeaderboard.map((tech, index) => {
                  const badge = getPerformanceBadge(tech.performanceLevel);
                  const isTopThree = tech.rank <= 3;

                  return (
                    <tr
                      key={tech.technicianId}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isTopThree ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="text-2xl">{getRankBadge(tech.rank)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{tech.technicianName}</div>
                        <div className="text-xs text-gray-500">ID: {tech.technicianId}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-gray-900">{tech.totalRepairs}</div>
                        <div className="text-xs text-gray-500">
                          {tech.successfulRepairs} success
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`text-lg font-bold ${
                              tech.successRate >= 90
                                ? 'text-green-600'
                                : tech.successRate >= 75
                                ? 'text-blue-600'
                                : tech.successRate >= 60
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {tech.successRate}%
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-gray-900">
                          {tech.customerSatisfactionRate}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {tech.customerSatisfiedCount}/{tech.totalRepairs}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-gray-900">
                          {tech.averageRepairTimeMinutes}m
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-gray-900">{tech.repairsThisMonth}</div>
                        <div className="text-xs text-gray-500">{tech.repairsThisWeek} this week</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
                        >
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {technicianLeaderboard.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No technician data available yet. Complete repairs to see performance metrics.
            </div>
          )}
        </div>
      </div>

      {/* Device Type Stats */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-lg">
          <h2 className="text-xl font-bold">📱 Device Type Performance</h2>
          <p className="text-green-100 text-sm">Success rates by device category</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deviceTypeStats.map((device) => (
              <div
                key={device.deviceType}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{device.deviceType}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Repairs:</span>
                    <span className="font-semibold">{device.totalRepairs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span
                      className={`font-semibold ${
                        device.successRate >= 80 ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {device.successRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Time:</span>
                    <span className="font-semibold">{device.averageRepairTimeMinutes}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {deviceTypeStats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No device type data available yet
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How Performance is Calculated</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            • <strong>Success Rate:</strong> Percentage of repairs marked as "SUCCESS" (vs FAILED or
            PARTIAL)
          </p>
          <p>
            • <strong>Customer Satisfaction:</strong> Percentage of repairs where customer was
            satisfied (not returned)
          </p>
          <p>
            • <strong>Performance Level:</strong> Based on average of success rate and customer
            satisfaction
          </p>
          <p>
            • <strong>Leaderboard Ranking:</strong> Sorted by success rate first, then total repairs
          </p>
          <p className="mt-2 pt-2 border-t border-blue-300">
            <strong>Note:</strong> All metrics are calculated from completed repairs captured through
            the Repair Completion Flow (Phase 1)
          </p>
        </div>
      </div>
    </div>
  );
};
