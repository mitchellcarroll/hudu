# Hudu Workflow Builder

A lightweight, vanilla-JavaScript prototype for creating and reviewing multi-step workflow automation rules.  
No build tools or package managers are required – everything is plain HTML, CSS, and JS.

---

## Alternative Hotwire Version

A Stimulus (Hotwire) version of this mini-project lives on the `hotwire` branch. To try it:

```bash
git fetch   # make sure you have the latest branches
git switch hotwire   # or: git checkout hotwire
```

That branch includes its own README with instructions specific how to run that version of the application. 

It can also be reviewed on GitHub at https://github.com/mitchellcarroll/hudu/tree/hotwire

---

## Folder Structure

```
Hudu/
├── index.html              ← entry point for production build
├── src/
│   ├── index.js            ← WorkflowBuilder logic
│   └── index.css           ← styles
├── package.json            ← npm metadata & scripts
├── vite.config.js          ← Vite configuration
└── README.md
```

---

## Getting Started

1. **Download / clone the repo**
   ```bash
   git clone https://github.com/mitchellcarroll/hudu.git
   cd hudu
   ```

2. **Install dependencies & start the dev server**  
   ```bash
   npm install
   npm run dev
   ```
   This launches Vite on `http://localhost:5173` (or the next free port).

3. **Open the classic standalone version (without Vite)**  
   Simply double-click `index.html` if you prefer not to use the dev server or drag-and-drop it into your browser. Since the application is fully client-side, no server, bundler, or compiler is required.

---

## Running Tests

The project uses [Vitest](https://vitest.dev/) with the JSDOM environment.

```bash
# ensure dependencies are installed
npm install

# run all tests in watch mode
npm run test
```

The basic test suite exercises utility functions and UI helpers. 

---

## Clearing Your Draft

Open the developer console and run:
```js
localStorage.removeItem('workflowDraft');
```
This wipes any saved progress and reloads the form from scratch.

---