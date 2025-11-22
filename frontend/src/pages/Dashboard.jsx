import { useQuery } from '@tanstack/react-query';
import { FingerprintPattern, Users, Building, CalendarCheck } from 'lucide-react';
import { userAuthStore } from '../store.js';
import { getAttendance, getUsers } from '../http/api.js';

const DashboardPage = () => {
  const user = userAuthStore((s) => s.user);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers().then((res) => res.data),
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendances"],
    queryFn: () => getAttendance().then((res) => res.data),
  });

  if (!user) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const showCards = user.role === 'admin' || user.role === 'manager';

  if (!showCards) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p className="text-gray-500 mt-2">Analytics will be available soon for your role.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 text-center">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">Welcome to Loonie Attendance</h1>
        <p className="mt-2 text-gray-500">{user.role === 'admin' ? "Admin Dashboard" : "Manager Dashboard"}</p>
      </header>

      <main className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {/* Attendance Card */}
          <div className="card bg-base-100 shadow-md p-4 w-60 flex flex-col items-center">
            <FingerprintPattern size={32} className="mb-2 text-purple-600 p-2 rounded-full bg-purple-100" />
            <div className="text-sm font-medium text-gray-500">Attendance Records</div>
            <div className="text-2xl font-bold mt-1">{attendanceLoading ? '...' : attendance?.report?.length ?? '0'}</div>
            <div className="text-xs text-green-500 mt-1">Today / Period</div>
          </div>

          {/* Employees Card */}
          <div className="card bg-base-100 shadow-md p-4 w-60 flex flex-col items-center">
            <Users size={32} className="mb-2 text-yellow-600 p-2 rounded-full bg-yellow-100" />
            <div className="text-sm font-medium text-gray-500">Employees</div>
            <div className="text-2xl font-bold mt-1">{usersLoading ? '...' : users?.total ?? '0'}</div>
          </div>

          {/* Offices Card */}
          <div className="card bg-base-100 shadow-md p-4 w-60 flex flex-col items-center">
            <Building size={32} className="mb-2 text-blue-600 p-2 rounded-full bg-blue-100" />
            <div className="text-sm font-medium text-gray-500">Offices</div>
            <div className="text-2xl font-bold mt-1">--</div>
          </div>

          {/* Leaves Card */}
          <div className="card bg-base-100 shadow-md p-4 w-60 flex flex-col items-center">
            <CalendarCheck size={32} className="mb-2 text-red-600 p-2 rounded-full bg-red-100" />
            <div className="text-sm font-medium text-gray-500">Leaves</div>
            <div className="text-2xl font-bold mt-1">--</div>
          </div>
        </div>

        <p className="mt-6 text-gray-400 text-lg">Analytics are coming soon</p>
      </main>
    </div>
  );
};

export default DashboardPage;
