# 🚀 Subsphere - Modern SaaS Subscription & AI Platform

Subsphere is a high-performance SaaS platform built for professional subscription management, AI integrations, and frictionless payments. Combining a robust **Spring Boot** backend with a dynamic **React/Vite** frontend, it’s designed for scale and developer experience.

## ✨ Key Features

- **🔐 Secure Authentication**: Integrated with Google OAuth2 for seamless, one-click user onboarding.
- **💳 Payment Infrastructure**: Full-stack Stripe integration with support for subscriptions, checkouts, and webhooks.
- **🤖 AI-Powered Capabilities**: Native integration with Google Gemini AI for advanced workflow automation (metadata analysis, user assistance, etc.).
- **⚡ High-Performance Caching**: Redis-backed caching for ultra-fast session management and lower database latency.
- **🎨 Premium UI**: A sleek, responsive dashboard built with React, Tailwind CSS, and Vite for a modern editorial aesthetic.

## 🛠 Tech Stack

### Backend
- **Core**: Java 17+, Spring Boot
- **Database**: MySQL (Hibernate/JPA)
- **Security**: Spring Security, OAuth2
- **Infrastructure**: Redis (Cache), Stripe (Payments)
- **AI**: Google Gemini API

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Interactions**: Framer Motion for premium animations

---

## 🚀 Quick Start (Local)

### 1. Prerequisites
- Java 17+
- Node.js & npm/yarn/pnpm
- MySQL & Redis

### 2. Environment Setup
Create a `.env` file (refer to [`.env.template`](.env.template)) and fill in your credentials.

### 3. Backend Execution
```bash
./mvnw clean package
java -jar target/subsphere-0.0.1-SNAPSHOT.jar
```

### 4. Frontend Execution
```bash
cd subsphere-ui
npm install
npm run dev
```

---

## ☁️ Deployment Architecture

This project is optimized for deployment on **AWS** using:
- **AWS Amplify** for frontend hosting.
- **AWS Elastic Beanstalk** for backend compute.
- **AWS RDS (MySQL)** for persistent data storage.

---

## 📜 License
This project is for demonstration and production use. All rights reserved.
