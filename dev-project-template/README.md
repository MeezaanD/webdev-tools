# Dev Project Template (Tabs + Arrows + Auto-Format)

A simple project starter that gives every new project:

✔ Tabs (not spaces)  
✔ Visible tab arrows  
✔ Auto-format on save  
✔ Prettier config  
✔ EditorConfig  
✔ VS Code + Cursor settings  

Works on **WSL Ubuntu, Linux, macOS, VS Code, and Cursor**.

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
alias newproject="~/dev-project-template/newproject.sh"
```

Reload your terminal:

```bash
source ~/.bashrc
```

---

# Usage

Create a new project instantly:

```bash
newproject myapp
```

It appears here:

```
~/dev/projects/myapp
```

With automatic files included:

```
.editorconfig
.prettierrc
.vscode/settings.json
```

Ready to code with tabs → arrows → format-on-save.

---

# Example

```bash
newproject keepittogether
code ~/dev/projects/keepittogether
```

Open it in:

- VS Code  
- Cursor  

Both will automatically apply the formatting rules.

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

Feel free to fork, remix, or add your own customizations.

---

# Enjoy coding with clean, consistent, beautiful formatting

Tabs. Arrows. Auto-format. Zero setup. Every time.

