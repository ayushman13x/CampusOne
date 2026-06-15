# CampusOne

CampusOne is a unified campus intelligence dashboard that brings important campus information into one place. It connects separate campus source servers for library, cafeteria, events, academics and notices, and provides an AI assistant that can answer natural-language campus questions.

The goal of this project is to reduce the need to search across multiple portals, PDFs, notices and calendars by providing one clean dashboard with source-aware answers.

## Features

* Unified dashboard for campus updates
* Library book search and availability information
* Cafeteria menu, timings and crowd status
* Upcoming events and club activities
* Academic information such as exams, syllabus and attendance rules
* Notices and important campus announcements
* AI assistant for asking campus-related questions
* Gemini-powered routing to select the most relevant campus source
* Independent source servers for each campus data category
* Local fallback router to keep the assistant usable if API quota is unavailable

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide React icons

### Backend

* Node.js
* Express.js
* Axios
* Gemini API integration

### Source Servers

* Independent Express-based campus source servers
* Library source server
* Cafeteria source server
* Events source server
* Academics source server
* Notices source server

## Project Structure

```text
CampusOne/
├── frontend/
├── backend/
├── mcp-library/
├── mcp-cafeteria/
├── mcp-events/
├── mcp-academics/
├── mcp-notices/
└── README.md
```

## How It Works

CampusOne uses a central backend server as an orchestrator. When a user asks a question, the backend first sends the question to Gemini. Gemini identifies the most relevant campus source, such as library, cafeteria, events, academics or notices.

After the source is selected, the backend queries the corresponding independent source server and returns a clean answer to the frontend.

If Gemini is unavailable because of API quota or network issues, CampusOne uses a local fallback router so that the assistant remains usable during development and demonstration.

## Running the Project Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd CampusOne
```

### 2. Install dependencies

Install dependencies in the root project:

```bash
npm install
```

Install dependencies in each app/server folder if needed:

```bash
cd frontend
npm install

cd ../backend
npm install

cd ../mcp-library
npm install

cd ../mcp-cafeteria
npm install

cd ../mcp-events
npm install

cd ../mcp-academics
npm install

cd ../mcp-notices
npm install
```

### 3. Start the project

From the root folder:

```bash
npm run dev
```

This starts the frontend, backend and all campus source servers together.

### 4. Open the application

```text
http://localhost:3000
```

## Example Questions

The assistant can answer questions such as:

* Suggest books for machine learning
* What is today's lunch menu?
* When is robotics workshop?
* What is the attendance rule?
* Any scholarship deadline?

## Backend Ports

```text
Frontend:        http://localhost:3000
Backend:         http://localhost:4000
Library Server:  http://localhost:5001
Cafeteria Server:http://localhost:5002
Events Server:   http://localhost:5003
Academics Server:http://localhost:5004
Notices Server:  http://localhost:5005
```

## Notes

This project uses realistic sample campus data for demonstration. In a real campus deployment, each source server can be connected to actual library systems, cafeteria PDFs, event calendars, academic handbooks and notice boards.

Gemini is used as the primary AI routing layer. A local fallback router is included only to keep the assistant usable when API quota or network issues occur.

