#!/usr/bin/env python3
"""Minimal uptime checker.

Usage examples:
  Run once:
    python app.py

  Run in loop (check every 5 minutes = 300s):
    python app.py -i 300

Behavior summary:
 - Reads a `.env` file in the project root and expects a single variable `URLS`
   that contains a comma-separated list of sites to check.
 - If a URL does not include a scheme, the script will prepend `http://` by default.
 - Results are printed to stdout and appended to `uptime_log.txt` in the project root.
 - When an interval is provided with `-i` the script re-reads `.env` on every loop
   iteration so you can update the monitored sites live.

Notes for maintainers:
 - The script purposely keeps a minimal dependency surface (requests + python-dotenv).
 - Consider adding configurable timeouts, custom user-agent, or HTTP status codes
   considered as 'UP' if you need more advanced checks.
"""

import argparse
import datetime
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from dotenv import dotenv_values

# Project paths: keep logs and .env next to this script
ROOT = Path(__file__).parent
ENV_PATH = ROOT / ".env"
LOG_PATH = ROOT / "uptime_log.txt"


def get_sites():
    """Read `.env` and return a list of validated URLs.

    - Reads the file fresh on each call using dotenv_values so runtime changes
      to `.env` are picked up (useful when running in interval mode).
    - Expects a variable named `URLS` with comma-separated values.
    - If a value has no scheme (http/https), `http://` is prepended by default.
    - Invalid entries (e.g., missing host) are skipped with a warning.

    Returns:
      list[str]: normalized URLs (strings) suitable for requests.get().
    """
    cfg = dotenv_values(ENV_PATH)  # loads key=value pairs from .env
    # dotenv_values returns None for missing keys; ensure we have a string
    urls = cfg.get("URLS", "") or ""
    sites: list[str] = []

    # Split on commas to allow multiple sites in a single environment variable
    for raw in urls.split(","):
        s = raw.strip()
        if not s:
            # ignore empty entries like trailing commas
            continue

        # Default to http if no scheme provided. This keeps the config simple
        # for users who just list hostnames (e.g. example.com).
        if not s.startswith(("http://", "https://")):
            s = "http://" + s

        # Use urlparse to validate minimal structure (scheme + netloc)
        parsed = urlparse(s)
        if not parsed.scheme or not parsed.netloc:
            print(f"Warning: invalid URL '{raw}' — skipping")
            continue

        sites.append(s)

    return sites


def check_sites(sites: list[str]):
    """Check each site via HTTP GET and log the result.

    The function treats an HTTP 200 response as UP and any other status code as DOWN
    (including non-200 success codes). Network errors and timeouts are reported
    as DOWN with the exception text.
    """
    for site in sites:
        try:
            # Keep a small timeout to avoid long hangs. The User-Agent is explicit
            # so some servers won't reject the request as coming from a botless client.
            r = requests.get(site, timeout=7, headers={"User-Agent": "up-down-monitor/1.0"})
            status = "UP" if r.status_code == 200 else f"DOWN ({r.status_code})"
        except requests.RequestException as e:
            # This catches timeouts, connection errors, DNS failures, etc.
            status = f"DOWN (Error: {e})"

        log_status(site, status)


def log_status(site: str, status: str):
    """Append a timestamped status line to the console and the log file.

    The log is appended to `uptime_log.txt` using UTF-8. Failures to write the
    file are printed to stdout but do not interrupt the monitoring loop.
    """
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {site} - {status}"
    print(line)
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception as e:
        # Don't raise here — keep the monitor running even if logging fails.
        print(f"Failed to write log: {e}")


def main(interval: int | None):
    """Program entry point.

    If interval is None the script runs a single check and exits. If an integer
    number of seconds is provided the script runs continuously and sleeps for
    `interval` seconds between checks. In interval mode `.env` is re-read each
    iteration to allow live changes.
    """
    if interval is None:
        sites = get_sites()
        if not sites:
            print("No sites configured in .env (URLS). Exiting.")
            return
        check_sites(sites)
        return

    # interval mode: re-read .env each iteration
    print(f"Running in loop mode: checking every {interval} seconds. Ctrl+C to stop.")
    try:
        while True:
            sites = get_sites()
            if sites:
                check_sites(sites)
            else:
                # Print a timestamped message so users see there's no configured sites
                print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] No valid sites in .env")
            time.sleep(interval)
    except KeyboardInterrupt:
        print("Stopped by user.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--interval", type=int, help="Seconds between checks. Omit to run once.")
    args = parser.parse_args()
    main(args.interval)
