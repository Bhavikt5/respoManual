---
name: respo-training-manual
description: >-
  Guidelines, design tokens, layout conventions, dual-file HTML synchronization rules, and strict verbatim text preservation standards for maintaining and extending the Respo Collections Training Manual application.
---

# Respo Collections Training Manual Development Skill

This skill provides mandatory guidelines, design system specifications, and workflow procedures for editing, maintaining, and adding modules to the Respo Collections Training Manual codebase.

---

## Core Directives & Guidelines

### 1. Strict Verbatim Content Preservation
- **NEVER** modify, rephrase, rewrite, or paraphrase text from the source manual or screenshots provided by the user.
- Maintain original spelling, formatting, quotes, and punctuation exactly as specified.
- Every callout box, bullet point, scenario script, and assessment question must match the authoritative manual source 1:1.

### 2. Dual HTML File Synchronization
The project contains two primary HTML entry points:
1. [`index.html`](file:///c:/Users/Bhavik%20Tank/Downloads/respo%20manual/index.html)
2. [`Respo_Collections_Training_Manual.html`](file:///c:/Users/Bhavik%20Tank/Downloads/respo%20manual/Respo_Collections_Training_Manual.html)

**MANDATORY RULE:** Any modification (content update, CSS tweak, DOM structure change, assessment update, or script change) made to one file MUST be simultaneously applied to the other file so both remain 100% identical in structure and content.

---

## Design Tokens & Styling Conventions

### CSS Variables (`:root`)
```css
:root {
  --darkgreen: #171c26;
  --lightblue: #f1f5f9;
  --black: #111827;
  --white: #ffffff;

  --navy: #171c26;
  --blue: #171c26;
  --mid: #475569;
  --sky: #f1f5f9;
  --gold: #c2410c;
  --amber: #fff7ed;
  --red: #dc2626;
  --red-bg: #fef2f2;
  --green: #16a34a;
  --grn-bg: #dcfce7;
  --ink: #111827;
  --muted: #64748b;
  --rule: #e2e8f0;
  --bg: #f8fafc;
  --radius: 10px;
  --shadow: 0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
}
```

### Callout Boxes
- **`.box-good`**: Green border & background (`#f0fdf4`, border `#bbf7d0`). Used for policy guidelines, pass notices, and annual refresh rules.
- **`.box-rule`**: Blue/Slate callout box (`#f8fafc`, border `#cbd5e1`). Used for operational structures, grievance levels, and assessment instructions.
- **`.box-warn`**: Amber callout box (`#fff7ed`, border `#fed7aa`). Used for cautions and warnings.
- **`.box-stop`**: Red callout box (`#fef2f2`, border `#ef4444`). Used for strict prohibitions, zero tolerance rules, and mandatory calling hours.

### Key Components & Layouts
- **Module Grid (Welcome Screen)**:
  `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;`
  Contains 9 cards (Modules 01–08 + Final Assessment) with card number, title, key topics description, and completion time (`⏱ X mins`).
- **Numbered Steps**:
  `<ol class="steps">` used for step-by-step procedures.
- **Prohibited Tables**:
  Single-column clean table formatting for prohibited practices.

---

## Final Assessment & Acknowledgement

- **Score Requirement**: 7/10 or above to pass.
- **Feedback & Regulatory Basis**: Include inline regulatory explanation (RBI RBC Third Amendment 2026, DPDP Act 2023, etc.) under each question.
- **Training Completion Acknowledgement**: Positioned at the bottom of Module 09 after the quiz/certificate block:
  - Confirms compliance with Respo's Fair Practice Code and Code of Conduct.
  - Annual Refresh policy callout box (`.box-good`).
  - Red italic confidentiality footer: `Respo Financial Capital Private Limited — For Internal Use Only — Not for Distribution`.
