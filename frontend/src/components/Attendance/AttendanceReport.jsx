import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../http/client';

const fetchReport = async (params) => {
  const { data } = await api.get('/api/attendance', { params });
  return data; // { period, report }
};

const AttendanceReport = ({ compact = false }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (search) params.search = search;


  const { data, isLoading, refetch } = useQuery({
    queryKey: ['attendance-report', startDate || '', endDate || '', search || ''],
    queryFn: () => fetchReport(params),
    keepPreviousData: true,
  });


  return (
    <div className={compact ? '' : 'p-2'}>
      <div className="flex flex-col md:flex-row gap-2 items-center mb-3">
        <div>
          <label className="label"><span className="label-text">Start</span></label>
          <input type="date" className="input input-bordered" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="label"><span className="label-text">End</span></label>
          <input type="date" className="input input-bordered" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label className="label"><span className="label-text">Search</span></label>
          <input className="input input-bordered" placeholder="employee name" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <button className="btn btn-secondary mt-6" onClick={() => refetch()}>Filter</button>
        </div>
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && data?.report && (
        data.report.map((userReport) => (
          <div key={userReport.userId} className="card bg-base-100 shadow mb-4">
            <div className="card-body">
              <h3 className="card-title">{userReport.fullName} — Total: {userReport.totalHours.toFixed ? userReport.totalHours.toFixed(2) : userReport.totalHours}</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userReport.records.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.date}</td>
                        <td>{r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : '—'}</td>
                        <td>{r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : '—'}</td>
                        <td>{r.workHour}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}

      {!isLoading && !data?.report && <div>No report available</div>}
    </div>
  );
};

export default AttendanceReport;
