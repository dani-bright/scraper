LinkedIn Topic Scraper

This project is a technical test aimed at scraping LinkedIn content and categorizing it by regulatory topics. It consists of a NestJS backend and a Next.js frontend using Shadcn UI for displaying topics and posts.

# 🛠 Stack

## Backend:

- NestJS
- TypeORM with SQLite
- Playwright for scraping
- open ai

## Frontend:

- Next.js 16
- React 18
- TailwindCSS
- Shadcn UI components

# ⚡ Features

## LinkedIn Scraping:

- Fetches topics from /top-content.
- Scrapes posts associated with topics.
- Filters posts based on keywords and minimum reactions.

## Topics & Posts Management:

- Automatically creates topics if they don't exist.
- Increments post count and popularity for topics.
- Displays posts for each topic.

## Frontend:

- Lists topics on the homepage.
- Displays a feed of posts per topic.
- Button to trigger the scraper and refresh the topic list.

# 🚀 Installation

## Clone the repo

```bash
git clone <repo-url>
cd <repo-folder>
```

## Install backend dependencies

```bash
cd backend
npm install
```

## Install frontend dependencies

```bash
cd ../frontend
npm install
```

# ⚙ Configuration

Database: SQLite (db.sqlite by default)

🏃 Running the project

## Backend:

```bash
cd backend
npm run start:dev
```

## Frontend:

```bash
cd frontend
npm run dev
```

Access the UI at http://localhost:6006

## 📦 API Endpoints

Method URL Description

- GET /topics List all topics
- GET /topics/:id/posts List posts for a specific topic
- POST /scraper Run the scraper to fetch posts

## 📝 Usage

Click the "Run Scraper" button in the UI to fetch posts.

Topics are automatically created if they do not exist.

Posts are filtered based on defined keywords concerning regulation.

# Limitations

- first wanted to search with https://www.linkedin.com/search/results/content/?keywords=AI%20Act but you need to be logged in to use this url. I figured the test wouldn't make me use fake profiles and proxies so I first tried with my own cookies. I was able to access the page but linkedin wasn't giving me any results and was displaying an error page. could'nt figure out why and lost a lot of time so I used https://www.linkedin.com/top-contents to give something at least

# amelioration

- frontend is not well written at all (bad design such as fetch directly in pages, etc) think of a better design
- classify the profile of the author
- implement popularity score
- maybe too much different topics
- impelement infinite scroll
- add tests
