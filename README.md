# SkillMatchAI

### AI-Powered Job Scraper & Resume Matcher

SkillMatchAI is a Generative AI-powered web application that analyzes a candidate's resume against a job posting and provides an AI-generated compatibility report.

Users can either enter a job description manually or provide a public job URL. The application extracts relevant job information and uses Gemini to compare it with the uploaded resume.

## 🚀 Live Demo

https://skillmatchai-4bzu.onrender.com

## ✨ Features

- 📄 Resume upload and analysis
- 🔗 Job URL scraping and content extraction
- 📝 Manual job description input
- 🤖 Generative AI-powered resume matching
- 📊 Overall job match score
- ✅ Matching skills identification
- ⚠️ Skill and qualification gaps
- 💡 Personalized recommendations
- 🔐 SSRF protection for job URL fetching
- ⏱️ Request timeout and error handling
- 📱 Responsive web interface

## 🔄 How It Works

Resume
   ↓
Upload & Encode
   ↓
Choose Job URL or Job Description
   ↓
Job URL → Fetch & Extract Relevant Content
   ↓
Resume + Job Information
   ↓
Google Gemini
   ↓
Structured AI Analysis
   ↓
Match Report