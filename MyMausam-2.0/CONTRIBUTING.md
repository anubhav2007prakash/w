# Contributing to MyMausam 2.0

Thank you for your interest in contributing to MyMausam 2.0!

## Development Workflow
1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   cd apps/web && npm install
   cd ../../backend/python && pip install -r requirements.txt
   ```
3. Create a feature branch: `git checkout -b feature/amazing-feature`.
4. Commit your changes: `git commit -m 'Add amazing feature'`.
5. Push to the branch and open a Pull Request.

## Code Standards
- TypeScript: Run `npx tsc --noEmit` before submitting PRs.
- Python: Follow PEP 8 style guidelines.
