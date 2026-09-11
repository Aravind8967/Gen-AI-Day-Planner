# Gen-AI-Day-Planner

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aravind8967/Gen-AI-Day-Planner.git
```

### 2. Go to the project directory

```bash
cd Gen-AI-Day-Planner
```

### 3. Start Docker

Make sure **Docker Desktop** is running.

### 4. Start the application

```bash
docker compose up -d --build
```

The application will start:

* Frontend → `http://localhost:602`
* FastAPI → `http://localhost:601`
* Ollama → `http://localhost:600`

Open the application:

```text
http://localhost:602
```

---

## 🛑 Stop the Application

To stop the containers:

```bash
docker compose down
```

---

## 🔄 Start Again

After stopping the application, you can start it again with:

```bash
docker compose up -d
```

---

## 📋 Check Running Containers

```bash
docker ps
```

You should see:

```text
day-planner-frontend
day-planner-api
day-planner-ollama
```

---

## 📥 Update the Project

To get the latest changes from GitHub:

```bash
git pull
```

Then rebuild and restart the application:

```bash
docker compose down
docker compose up -d --build
```

That's it! 🚀

## System Design

<img width="1706" height="753" alt="hdd" src="https://github.com/user-attachments/assets/204e01a7-b23d-4c5c-86b7-3a82b83a7e8d" />

## Website images
<img width="1641" height="948" alt="app3" src="https://github.com/user-attachments/assets/a212d2ff-0c28-4caa-b916-a961dd91426d" />
<img width="1628" height="941" alt="app2" src="https://github.com/user-attachments/assets/3de0a7f4-4dc3-41d0-b506-73b8bb20e531" />
<img width="1550" height="928" alt="app1" src="https://github.com/user-attachments/assets/2e52ea44-f6d8-41cc-8883-2d43fed31ed4" />


