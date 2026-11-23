---
name: friendly-pr
description: 'Guidelines for creating friendly, high-level, and non-technical Pull Requests for executives'
---

# Friendly and Non-Technical Pull Requests

Use these guidelines whenever creating or describing Pull Requests (PRs) in this repository.

## Rules for PR Title

- **The Pull Request title MUST follow the Conventional Commits format** (e.g., `feat: ...`, `fix: ...`, `refactor: ...`, `style: ...`).
- The title can be in Spanish or English, but must be descriptive of the main feature or fix (e.g., `feat: mejoras en el diseño de las tarjetas de pedidos`).

## Rules for PR Body/Description

- **Write in a friendly, high-level, and non-technical language** that is easy to understand for everyone, including business executives and product managers.
- **Do NOT describe internal code elements**, database schemas, internal classes, variables, or refactoring details unless strictly necessary.
- **Explain the _what_ and the _impact_** from a user/product perspective.
- **Organize by feature or impact area** using Markdown headings (e.g., `### Pedidos`, `### Afiliados`).
- **Include bullet points** for key changes under each category.
- **Provide verification status** at the bottom, confirming that tests, linting, and production builds completed successfully.

## Workflows & Agent Behavior

Before performing any Pull Request operation, follow this workflow:

1. **Check for Existing PR**:
   - Check if there is an active/open PR for the current branch by querying the repository's open pull requests (using `list_pull_requests` or similar tool).
2. **If an Active PR Exists**:
   - Do **NOT** create a new PR.
   - Stage and commit your local changes following the `friendly-commits` guidelines.
   - Push the commits to the remote branch (`git push origin <branch-name>`).
   - Update the existing PR's title and/or description (using the `update_pull_request` tool with the appropriate `pullNumber` and `body`) to summarize both the old and new changes.
3. **If NO Active PR Exists**:
   - Stage and commit your local changes.
   - Push the branch setting the upstream tracking branch (`git push -u origin <branch-name>`).
   - Create a brand new PR (using the `create_pull_request` tool) pointing to `develop` or the target base branch, using the template below.

## Template

Use a structure similar to the following template:

```markdown
# [Product/Feature Title]: [High-level summary of the impact]

This Pull Request introduces [high-level explanation of the changes] on the CRM:

### [Area/Screen 1, e.g., Pedidos]

- **[Feature/Fix Name]**: [What changed and why it helps the user]
- **[Feature/Fix Name]**: [What changed and why it helps the user]

### [Area/Screen 2, e.g., Afiliados]

- **[Feature/Fix Name]**: [What changed and why it helps the user]

---

All production builds and code quality linting tests passed successfully.
```
