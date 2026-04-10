import React, { useEffect, useState } from 'react';

export const TechniciansPage = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/technicians`);
        const data = await response.json();
        setTechnicians(response.ok ? data : []);
      } catch {
        setTechnicians([]);
      } finally {
        setLoading(false);
      }
    };
    loadTechnicians();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Technician Management</h1>
        <p className="text-gray-600 mt-2">Live technician directory from system backend.</p>

        {loading ? (
          <p className="mt-6 text-gray-500">Loading technicians...</p>
        ) : technicians.length === 0 ? (
          <p className="mt-6 text-gray-500">No technician records found.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicians.map((tech) => (
              <div key={tech.id} className="border rounded-lg p-4 bg-gray-50">
                <p className="font-semibold text-gray-900">{tech.fullName}</p>
                <p className="text-sm text-gray-700">{tech.email}</p>
                <p className="text-sm text-gray-700">Employee ID: {tech.employeeId || '-'}</p>
                <p className="text-sm text-gray-700">Specialization: {tech.specialization || '-'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
