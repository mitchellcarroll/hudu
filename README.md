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
├── index.html              ← entry point you open in the browser
├── styles/
│   └── main.css            ← application styles
├── scripts/
│   └── index.js            ← all front-end logic (WorkflowBuilder class)
└── README.md               
```

---

## Getting Started

1. **Download / clone the repo**
   ```bash
   git clone https://github.com/mitchellcarroll/hudu.git
   cd hudu
   ```

2. **Open `index.html` in any browser**  
   Double-click the file or drag-and-drop it into Chrome, Firefox, Edge, or Safari.

   That’s it – the app is fully client-side, so no additional servers, bundlers, or compilers are needed.

## Clearing Your Draft

Open the developer console and run:
```js
localStorage.removeItem('workflowDraft');
```
This wipes any saved progress and reloads the form from scratch.

---