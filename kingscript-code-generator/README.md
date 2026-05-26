# Kingscript Code Generator

An AI skill for **KWC script controller backend APIs + data CRUD**. Helps the AI assistant generate, explain, and review KingScript code based on the SDK index, runtime constraints, and safe templates in this repository — without inventing unusable APIs.

> Covers backend development only. Legacy frontend-coupled plugin systems (form plugins, list plugins, operation plugins, bill conversion, reports, mobile, printing, workflow, etc.) are **out of scope for this skill**.

## Directory Layout

```text
kingscript-code-generator/
├─ SKILL.md                      # Sole entry point (AI reads this)
├─ README.md                     # This file
├─ LICENSE
├─ .gitignore
└─ references/
   ├─ backend/                   # KWC topics: dev guide / safe templates / runtime constraints / FAQ
   ├─ sdk/
   │  ├─ strategy.md             # SDK lookup strategy
   │  ├─ indexes/                # Reverse lookup by keyword / scenario / error / module
   │  ├─ classes/                # Knowledge cards for data CRUD + metadata classes (27 total)
   │  └─ manifests/              # Module statistics JSON (modules / summary)
   └─ syntax/                    # Syntax / keywords / naming conventions
```

## Installation

This skill is drop-in. No install script needed — clone and create a symlink once.

**Qoder:**
```bash
ln -s "$(pwd)" ~/.qoder/skills/kingscript-code-generator
```

**Claude Code:**
```bash
ln -s "$(pwd)" ~/.claude/skills/kingscript-code-generator
```

**Codex (OpenAI Agents):**
```bash
ln -s "$(pwd)" ~/.agents/skills/kingscript-code-generator
```

You can also just copy the directory to the appropriate location.

## Usage

After installation, the AI automatically loads [SKILL.md](./SKILL.md) as the entry point. SKILL.md provides:

- Trigger conditions
- Task routing quick reference
- Full reference map (direct links to leaf files)
- P0 runtime hard constraints (short table — full details in the FAQ)
- Fallback lookup paths
- Output rules and prohibitions

All inter-document links use relative paths (`./references/...`). No runtime path resolution or config files are required.

## Maintenance Conventions

1. New KWC topic material → `references/backend/`
2. New SDK class knowledge card → `references/sdk/classes/<ClassName>.md`, and update the hand-written indexes `indexes/keyword-index.md` / `scenario-index.md` accordingly
3. New runtime constraint → first update the P0 master table at the top of `references/backend/faq-runtime-pitfalls.md`, then add the corresponding topic document
4. **Do not reintroduce frontend-coupled content** (form plugins, list plugins, operation plugins, event classes, control classes, view classes, etc.)
5. When the user points out incorrect generated code, do not just fix the current snippet — also decide whether it should be distilled into a reusable constraint and back-ported to SKILL.md or the FAQ

## License

MIT
