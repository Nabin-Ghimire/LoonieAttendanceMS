import { createBrowserRouter } from "react-router-dom";
import Root from "./layouts/Root.jsx";
import Dashboard from "./layouts/Dashboard.jsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Dashboard />,
        //     // children: [
        //     //   {
        //     //     path: '',
        //     //     element: <HomePage />
        //     //   },
        //     //   {
        //     //     path: 'users',
        //     //     element: <Users />
        //     //   },
        //     //   {
        //     //     path: 'tenants',
        //     //     element: <Tenants />
        //     //   },
        //     //   {
        //     //     path: 'products',
        //     //     element: <Products />
        //     //   },
        //     //   {
        //     //     path: 'categories',
        //     //     element: <Categories />
        //     //   },


        //     // ]
        //   },

        //   {
        //     path: '/auth',
        //     element: <NonAuth />,
        //     children: [
        //       {
        //         path: 'login',
        //         element: <LoginPage />
        //       },
        //     ]
      },

    ]
  },


  // {
  //   path: '*',
  //   element: <NotFound />
  // }

])