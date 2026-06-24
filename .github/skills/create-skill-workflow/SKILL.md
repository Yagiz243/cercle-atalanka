---
name: create-skill-workflow
description: 'Create reusable SKILL.md files from conversation workflows. Use when extracting step-by-step methods, decision branches, and quality checks into a shareable skill.'
argument-hint: 'What workflow should this skill package?'
user-invocable: true
disable-model-invocation: false
---

# Create Skill Workflow

## What This Produces
A workspace-scoped `SKILL.md` that turns a repeatable process into an on-demand agent skill, including:
- Explicit procedure steps
- Decision points and branching logic
- Quality gates and completion criteria
- Example prompts for usage

## When to Use
- You repeatedly follow the same implementation, review, or debugging process
- You want a slash-invocable workflow for team reuse
- You need a structured method instead of one-off prompts

## Procedure
1. Extract Workflow From Conversation
- Identify repeated steps already used in the thread.
- Capture branching decisions (for example: if requirements are unclear, ask focused clarifying questions).
- Record completion checks (for example: tests passed, constraints satisfied, files updated).

2. Decide Scope And Depth
- Scope branch:
  - If the workflow is project-specific, store under `.github/skills/<name>/SKILL.md`.
  - If the workflow is personal and cross-project, store under `~/.copilot/skills/<name>/SKILL.md`.
- Depth branch:
  - If the process is short and stable, write a quick checklist.
  - If the process has conditionals and quality gates, write a full multi-step workflow.

3. Draft The Skill
- Add YAML frontmatter with `name`, `description`, and optional invocation settings.
- Ensure `name` matches the folder name exactly.
- Write concise sections: purpose, when to use, procedure, and validation checklist.

4. Validate Discovery And Structure
- Verify description has keyword-rich trigger phrases.
- Confirm file path and naming conventions are valid.
- Keep `SKILL.md` focused; move large references to sibling files when needed.

5. Iterate With One Focused Question
- Find the weakest or most ambiguous part (scope, depth, or quality criteria).
- Ask one targeted follow-up question.
- Update the draft based on the response.

6. Finalize And Hand Off
- Summarize what the skill produces.
- Provide 3 example prompts that should trigger or invoke the skill.
- Suggest the next related customization (instruction, prompt, or custom agent).

## Quality Checklist
- Frontmatter is valid YAML between `---` markers
- `name` is lowercase with hyphens and matches folder
- Description contains concrete trigger words
- Procedure includes at least one decision branch
- Completion checks are explicit and testable

## Example Prompts
- `/create-skill-workflow package our PR review method into a SKILL.md`
- `/create-skill-workflow turn our bug triage process into a reusable workflow`
- `/create-skill-workflow create a skill for release-readiness checks`
