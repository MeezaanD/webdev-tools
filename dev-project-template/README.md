# Dev Project Template (Tabs + Arrows + Auto-Format)

A simple project starter that gives every new project:

✔ Tabs (not spaces)  
✔ Visible tab arrows  
✔ Auto-format on save  
✔ Prettier config  
✔ EditorConfig  
✔ VS Code + Cursor settings  

Works on **Windows Git Bash, WSL Ubuntu, Linux, macOS, VS Code, and Cursor**.

---

## Installation

### Clone this repo

```bash
git clone https://github.com/MeezaanD/webdev-tools.git
cd webdev-tools/dev-project-template
```

---

## Make the script executable

```bash
chmod +x newproject.sh
```

---

## (Optional but recommended) Add a global shortcut command

Add this to your `~/.bashrc` or `~/.zshrc`:

```bash
alias newproject="/path/to/dev-project-template/newproject.sh"
```

Reload your terminal:

```bash
source ~/.bashrc
```

Now you can run `newproject <project-name>` from anywhere.

---

# Usage

The **new project will be created in the directory where you run the script**.

```bash
cd /c/dev/webdev-tools
./dev-project-template/newproject.sh keyboard-history
```

Output:

```
Project 'keyboard-history' created successfully!
➡ Location: /c/dev/webdev-tools/keyboard-history
```

---

## Notes

- Make sure the `template/` folder exists inside the script folder.  
- If a folder with the same project name already exists, the script will **not overwrite it**.  
- Works in **VS Code** and **Cursor**, preserving tabs, arrows, and formatting rules.  

---

# Customize the template

Everything inside `template/` is copied into each new project:

```
template/
│
├── .editorconfig
├── .prettierrc
└── .vscode/
    └── settings.json
```

You can add:

- `src/` folder  
- README template  
- Node/Python boilerplate  
- Docker starter  
- License  
- Anything else  

Every new project will include your changes.

---

# Contribute

Fork and remix the template however you like.

---

# Enjoy coding with clean, consistent, beautiful formatting

Tabs. Arrows. Auto-format. Zero setup. Every time.
