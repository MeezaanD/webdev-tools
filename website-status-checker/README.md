Website Status Checker

Small utility to check whether a list of websites is up. The project contains:

- `app.py` — command-line checker that reads `URLS` from `.env` and logs results to `uptime_log.txt`.
- `web.py` — optional lightweight Flask frontend that shows configured sites and runs live checks.
- `.env.example` — example environment file (copy to `.env` and edit).

## Setup (PowerShell)

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If PowerShell blocks script execution, run once:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Running

### CLI (single run)

```powershell
python app.py
```

### CLI (loop mode)

```powershell
python app.py -i 300
```

### Web UI

```powershell
python web.py
# then open http://localhost:5000 in your browser
```

## Notes

- Copy `.env.example` to `.env` and edit `URLS` with a comma-separated list of sites.
- `.env` is ignored by git; don't commit secrets.
- For production, run `web.py` behind a WSGI server instead of the dev server.
