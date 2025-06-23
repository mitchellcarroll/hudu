# Workflow Builder (Stimulus + Vite)

This repo contains the prototype of Hudu’s Workflow Builder implemented with Stimulus and Vite.

## Prerequisites

* Node.js ≥ 18

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server: 

```bash
npm run dev
```

The server prints a local URL such as `http://localhost:5173` (or another free port). Open it in your browser to view the application.

## Directory structure

```
├─ index.html              # Entry page with Stimulus data attributes
├─ src/
│  ├─ controllers/
│  │  └─ workflow_builder_controller.js  # Main Stimulus controller for Workflow Builder
│  ├─ style.css            # Styles
│  └─ application.js       # Main JS file
├─ public/                 # Static assets copied as-is
├─ vite.config.js          # Vite config
└─ package.json            # Project scripts & dependencies
```
