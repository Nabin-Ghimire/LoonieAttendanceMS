import { createBrowserRouter } from "react-router-dom";
import Root from "./layouts/Root.jsx";
import Dashboard from "./layouts/Dashboard.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import NonAuth from "./layouts/NonAuth.jsx";
import Login from "./pages/login/Login.jsx";
import Users from "./pages/users/Users.jsx";
import AttendancePage from "./pages/attendance/AttendancePage.jsx";
import Offices from "./pages/offices/Offices.jsx";
import AttendanceReport from "./components/Attendance/AttendanceReport.jsx";
import NotFound from "./components/NotFound.jsx";


// NotFound component moved to ./components/NotFound.jsx


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Dashboard />,
        children: [
          {
            path: '',
            element: <DashboardPage />
          },
          {
            path: 'users',
            element: <Users />
          },

          {
            path: 'attendance',
            element: <AttendancePage />
          },
          {
            path: 'offices',
            element: <Offices />
          },

          {
            path: 'reports',
            element: <AttendanceReport />
          },

        ],

      },

      {
        path: '/auth',
        element: <NonAuth />,
        children: [
          {
            path: 'login',
            element: <Login />
          },
        ]
      },

    ]
  },


  {
    path: '*',
    element: <NotFound />
  }

])