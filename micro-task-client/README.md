MicroTasks Platform

A full-stack micro-tasking web platform that connects **Buyers**, **Workers**, and **Admins** to manage and complete small paid tasks.


- **Frontend**: React, Vite, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, bcryptjs
- **Hosting**: Firebase (frontend), Vercel (backend)


### Authentication
- JWT-based login and registration
- Role-based access: `worker`, `buyer`, `admin`
- Passwords securely hashed with bcrypt
- `lastLogin` tracking for worker notifications

---

### Buyer Features
- Add Task**: Create new tasks with required fields and image (optional)
- My Tasks**: View/delete tasks, see submissions
- Purchase Coins**: Add coins to wallet for creating tasks
- Submit Testimonial**: Share user experience with avatar & message

---

Worker Features
- **Available Tasks**: Browse and submit proof links for tasks
- **My Submissions**: Track statuses (`pending`, `approved`, `rejected`)
- **Withdraw Coins**: Request withdrawal when coins are sufficient
- **Notifications**:
  - Badge shows updated submissions
  - Toast shows updates since last login

---

###Admin Features
- **Manage Users**: View, delete users, change roles
- **Moderate Submissions**: Approve/reject and reward workers
- **Manage Tasks**: View/delete all tasks
- **Withdraw Requests**: Approve or remove pending withdrawal requests
- **Admin Stats**: Dashboard with total users, coins, tasks, etc.
- **Notifications**: System alerts like new submissions or withdrawals

---

##Notification System
- Created on key events:
  - Submission by worker
  - Approval/Rejection of submission
  - Withdrawal request
- Displayed via bell icon with real-time badge and dropdown
- Auto-clear on click

---

## Home Page Highlights
- **Hero Section**: Welcome message + Get Started CTA
- **Top 6 Workers**: Ranked by coin balance
- **Testimonials**: Submitted by buyers
- **Footer**: Branding + Social media icons

Deployment & Configuration

Backend (Vercel)
vercel --prod

