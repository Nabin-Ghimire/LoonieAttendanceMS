import React from 'react';
import PunchIn from '../../components/Attendance/PunchIn.jsx';
import AttendanceReport from '../../components/Attendance/AttendanceReport.jsx';
import { userAuthStore } from '../../store.js';

const AttendancePage = () => {
  // Subscribe to user object so we can wait for the store to hydrate.
  const user = userAuthStore((s) => s.user);

  // While the store is hydrating, show a brief loading placeholder to avoid
  // rendering role-based UI with a default role.
  if (user === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  const role = user?.role;

  return (
    <div className="max-w-6xl flex items-center flex-col mx-auto p-4 min-h-screen justify-center">
      <header className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
      </header>

      <main className="space-y-6 w-full max-w-md flex flex-col items-center">
        {role === 'employee' && (
          <section className="w-full flex flex-col items-center">
            <div className="card bg-base-100 p-6 shadow w-full">
              <h3 className="text-lg font-semibold mb-4 text-center">Punch In / Out</h3>
              <PunchIn />
            </div>
            <div className="text-sm text-gray-500 mt-4 text-center">
              Please Click on Use my location Before Punch
            </div>
          </section>
        )}

        {role === 'manager' && (
          <section className="w-full flex flex-col items-center">
            <div className="card bg-base-100 p-6 shadow w-full">
              <h3 className="text-lg font-semibold mb-4 text-center">Punch In / Out</h3>
              <PunchIn />
            </div>
            <div className="text-sm text-gray-500 mt-4 text-center">
              Please Click on Use my location Before Punch
            </div>
          </section>
        )}

        {role === 'admin' && (
          <section className="w-full flex flex-col items-center">
            <div className="card bg-base-100 p-6 shadow w-full">
              <h3 className="text-lg font-semibold mb-4 text-center">Admin - Attendance & Management</h3>
              <PunchIn />
            </div>
            <div className="text-sm text-gray-500 mt-4 text-center">
              Please Click on Use my location Before Punch
            </div>
          </section>
        )}

        {role === 'guest' && (
          <div className="alert alert-info text-center w-full">Please log in to access attendance.</div>
        )}
      </main>
    </div>
  )
};

export default AttendancePage;
