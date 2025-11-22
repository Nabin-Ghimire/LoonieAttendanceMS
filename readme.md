# LoonieTech Attendance Management System

## Description

A modern attendance management system built with React and Node.js.  
The system allows employees to clock-in and clock-out using geolocation within office boundaries. Admins and managers can view attendance reports, while employees can view their own records. Role-based access ensures that each user sees only the data they are authorized to.

**Key Features**

- **Role-based access control**
  - Admin: Manage all employees and view all attendance reports.
  - Manager: Manage employees under their supervision and view connected employees’ reports.
  - Employee: Clock-in/out and view personal attendance.
- **Geolocation-based attendance**
  - Clock-in/out only allowed within defined office radius.
  - Offices stored as GeoJSON points with **2dsphere** indexes in MongoDB.
- **Attendance reporting**
  - Daily, weekly, and monthly reports.
  - Total working hours calculation.
  - Search and filter by employee name.
- **Authentication & Security**
  - JWT-based authentication with refresh tokens.
  - Passwords hashed with **bcrypt**.
  - Email notifications for new user creation.
- **Responsive UI**
  - Built with **React**, **Tailwind CSS**, and **React Query**.
  - Fully responsive on desktop and mobile devices.

---

## Tech Stack

**Frontend:** React, React Query, Tailwind CSS, React Router v6  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication & Security:** JWT, bcrypt, cookie-parser  
**Email Service:** Nodemailer

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

**Prerequisites**

- Node.js v18+
- MongoDB instance running locally or remotely

**Steps**

```bash
# Clone the repository
https://github.com/Nabin-Ghimire/LoonieAttendanceMS.git
cd loonie-attendance

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```
