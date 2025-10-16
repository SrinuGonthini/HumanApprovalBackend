
---

## ⚙️ **Backend – `backend/README.md`**

```markdown
# Human Approvals – Backend (Node.js + Express)

The **backend** powers the Human Approvals workflow system, enabling human-in-the-loop approval processes with state management, rollback capabilities, and asynchronous job queues.

---

## 🚀 Features

- 🧩 REST APIs for creating and managing approvals
- 🧠 Human-in-the-loop approval orchestration
- 🗃️ MongoDB for state persistence
- ⚙️ Redis + BullMQ for queues and retries
- 📧 Email notifications via Nodemailer
- 🔁 Rollback & Compensation for failed workflows

---

## 🧩 Tech Stack

- **Node.js 22**
- **Express.js**
- **MongoDB (Mongoose)**
- **Redis (BullMQ)**
- **Nodemailer**
- **dotenv**

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/SrinuGonthini/HumanApproval.git
cd HumanApproval/backend

## Install dependencies

npm install

## Configure .env file

PORT=3500
DATABASE_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/human-approvals
REDIS_URL=redis://default:<password>@<redis-host>:<port>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your_email@gmail.com>
SMTP_PASS=<your_app_password>
FRONTEND_URL=http://localhost:5173/

## Start the backend server

npm run dev

## Server will start on:

http://localhost:3500