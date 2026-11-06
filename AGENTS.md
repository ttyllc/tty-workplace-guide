# TTY Workplace Solutions Guide

## Instance Overview
- **Host**: portal (192.168.75.35)
- **Deployment Path**: `/opt/tty-workplace-guide`
- **Backend Process**: PM2 `tty-backend`
- **GitHub Repo**: `https://github.com/ttyllc/tty-workplace-guide`
- **CI/CD**: GitHub Actions (Self-hosted runner on `fl-wd-v13` or `fl-wd-h9`)

## Technical Configuration
- **Frontend**: React/Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js/Express (running via PM2)
- **Design Principles**: OpenDesign (OKLCH colors, refined typography, animated price tickers)

## Deployment Workflow
- CI/CD pushes build artifacts via rsync to `/opt/tty-workplace-guide`
- Restarts `tty-backend` via PM2.
