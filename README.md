# 🚀 Fullstack Web App (React + Node.js + MongoDB)

## 📌 Giới thiệu

Project này là một ứng dụng web fullstack cơ bản giúp bạn hiểu cách:

* Kết nối Frontend (React) với Backend (Node.js)
* Gọi API (GET, POST, PUT, DELETE)
* Lưu trữ dữ liệu với MongoDB
* Xây dựng CRUD app hoàn chỉnh
* Cải thiện UX/UI (search, sort, loading...)

---

## 🧠 Tech Stack

* Frontend: React
* Backend: Node.js + Express
* Database: MongoDB
* Tool: VS Code

---

## ⚙️ Setup môi trường

### 1. Cài Node.js

```bash
node -v
npm -v
```

---

### 2. Tạo project

```bash
npx create-react-app frontend
mkdir backend
cd backend
npm init -y
```

---

### 3. Cài backend dependencies

```bash
npm install express cors mongoose dotenv
```

---

## 🔐 Cấu hình môi trường (.env)

Tạo file `.env` trong thư mục backend:

```env
MONGO_URL=your_mongodb_connection_string
```

⚠️ Lưu ý:

* Không có dấu cách: `MONGO_URL=...`
* File phải tên đúng `.env` (không phải `.env.txt`)

---

## 🖥️ Backend (server.js)

```js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const User = mongoose.model('User', {
  name: String
});

// CREATE
app.post('/api', async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.json(user);
});

// READ
app.get('/api', async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
});

// DELETE
app.delete('/api/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// UPDATE
app.put('/api/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.json(updatedUser);
});

app.listen(5000, () => console.log('Server running'));
```

---

## 🎨 Frontend (React)

### Chức năng:

* Thêm user
* Hiển thị danh sách
* Search
* Sort
* Update
* Delete
* Không reload trang

---

## 🔁 Data Flow

```
React → API → Express → MongoDB → Response → React UI
```

---

## ✨ Tính năng

* ✅ CRUD đầy đủ
* ✅ Realtime UI (không reload)
* ✅ Search filter
* ✅ Sort A-Z / Z-A
* ✅ Loading state
* ✅ Confirm delete

---

## ⚠️ Lỗi thường gặp

### 1. CORS error

```js
app.use(cors());
```

---

### 2. req.body undefined

```js
app.use(express.json());
```

---

### 3. MongoDB undefined (.env lỗi)

* Kiểm tra file `.env`
* Không có `.txt`
* Đúng biến `MONGO_URL`

---

### 4. React không update UI

```js
setUsers([...users, newUser]);
```

---

## 🚀 Nâng cấp tiếp theo

### Backend

* Validation
* Auth (login/register)
* JWT
* Security

### Frontend

* UI đẹp (Tailwind CSS)
* Toast notification
* Tách component

---

## 🧠 Bài học

* Hiểu flow fullstack là quan trọng nhất
* Debug là kỹ năng chính
* Học qua project nhanh hơn lý thuyết

---

## 🎯 Mục tiêu đạt được

* Xây dựng fullstack app cơ bản
* Hiểu cách frontend ↔ backend giao tiếp
* Làm được CRUD thực tế

---

## 💡 Gợi ý project tiếp theo

* Todo App nâng cao
* Blog system
* User authentication system

---

## 👨‍💻 Author

Bạn 🚀