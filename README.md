# Plugin-Based Discord Bot System

A modular, plugin-driven Discord bot with a Web UI for management.

## Features
- Core system that never changes
- Plugin-based architecture for all features
- Web UI for plugin management
- Hot-reloading of plugins
- Sandboxed plugin execution

## Installation
```bash
npm install
```

## Usage
```bash
npm run dev
```

## Structure
- `core/` - Permanent core system
- `plugins/` - Installed plugins
- `docs/` - Documentation for AI/human handover
- `logs/` - System logs
- `config/` - Configuration files
- `backups/` - Plugin and config backups
- `tests/` - Automated tests