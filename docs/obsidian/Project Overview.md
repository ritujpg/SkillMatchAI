# Project Overview

SkillMatchAI compares a resume image with a job opportunity and produces a match report.

## Implemented Inputs

- Resume image in JPG, JPEG, or PNG format
- Manually pasted job description
- Public HTTP(S) job URL

The Analyze page validates the active input mode. Manual descriptions must meet the existing 35-word minimum. URL mode requires a valid URL and does not require the word minimum.

## Implemented Output

The report includes:

- Match score
- Matching skills and skill gaps
- Strengths
- Recommendations
- Job title
- Optional company name
- Structured breakdown and summary in the API result

## User Flow

1. The user selects a resume image and job input.
2. The Analyze page base64-encodes the image and stores the analysis input in session storage.
3. The app navigates to the Analyzing page.
4. The Analyzing page posts to `/api/analyze`.
5. The server optionally extracts job-page text, sends the image and job text to Gemini, validates the result, and returns JSON.
6. The result is stored in session storage and displayed by Results.
