---
name: respo-training-manual
description: >-
  Guidelines, design tokens, layout conventions, dual-file HTML synchronization rules, progress calculation standards, assessment feedback constraints, and strict verbatim text preservation rules for maintaining and extending the Respo Collections & VKYC Training Manual applications.
---

# Respo Training Manual Development Skill

This skill provides mandatory guidelines, design system specifications, progress calculation rules, assessment feedback logic, and workflow procedures for editing, maintaining, and adding modules to the Respo Collections and Video KYC Training Manual codebases.

---

## Core Directives & Guidelines

### 1. Strict Verbatim Content Preservation
- **NEVER** modify, rephrase, rewrite, or paraphrase text from the source manual or screenshots provided by the user.
- Maintain original spelling, formatting, quotes, and punctuation exactly as specified.
- Every callout box, bullet point, scenario script, and assessment question must match the authoritative manual source 1:1.

### 2. Dual HTML File Synchronization
The repository contains two primary entry points:
1. [`index.html`](file:///c:/Users/Bhavik%20Tank/Downloads/respo%20manual/index.html) — Respo Collections Training Manual
2. [`vkyc_index.html`](file:///c:/Users/Bhavik%20Tank/Downloads/respo%20manual/vkyc_index.html) — Respo Video KYC Training Manual

**MANDATORY RULE:** Any modification (content update, CSS tweak, DOM structure change, assessment logic, progress bar rule, or script change) made to one manual MUST be simultaneously applied to the other manual so both remain 100% synchronized in structure and behavior.

---

## Navigation, Progress Calculation & Sidebar Locking

### 1. Progress Bar Rules
- Initial load on Module 0 (Welcome / Overview) must display **`0% complete`**.
- Each completed learning module (Modules 1 through 8) increments progress by 10% (up to 80%).
- Passing the final assessment (`score >= 7/10`) adds Module 9 to completion and sets progress to **`100% complete`**.

### 2. Strict Sequential Sidebar Locking
- State begins with `unlocked = new Set([0])` and `completed = new Set([0])`.
- Modules 1 through 9 are locked initially (`.nav-item.locked` with `pointer-events: none; cursor: not-allowed; opacity: 0.45;`).
- Users **CANNOT** click unreached sidebar modules to skip ahead.
- Modules unlock sequentially ONLY when the user clicks the "Start Training" / "Next Module" CTA buttons (`showModule(n, true)`).

### 3. Retake / Reassessment Flow
- The **`🔄 Retake Assessment`** button (`#retakeBtn`) must ALWAYS be visible upon submitting assessment results.
- Clicking **`Retake Assessment`** (`retakeQuiz()`):
  1. Resets state: `completed = new Set([0])` and `unlocked = new Set([0])`.
  2. Strips `.done` class from all sidebar DOM nodes (`nav0` to `nav9`).
  3. Resets progress bar back to **`0% complete`**.
  4. Clears all selected quiz radio options, resets score containers, and hides explanation boxes.
  5. Navigates the user directly back to Module 0 (Welcome / Overview screen).

---

## Assessment Rules & Wrong Answer Masking

- **Passing Score**: Strictly **7/10 or above** to pass.
- **Wrong Answer Masking ("dont show correct answer")**:
  - When an answer is incorrect (`chosen !== correct`), ONLY highlight the chosen option in red (`.wrong`).
  - DO NOT highlight the green correct answer option.
  - DO NOT display the feedback explanation container (`.quiz-feedback` must remain `display: none`).
  - DO NOT display red error callout boxes (`.box-stop`).
- **Regulatory Feedback**: Include regulatory explanations (RBI RBC Third Amendment 2026, DPDP Act 2023, etc.) under each question definition for internal tracking.

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

### Sidebar Styling & State Contrast
- **Active Module (`.nav-item.active`)**: Dark navy background (`var(--darkgreen)` / `#171c26`) with crisp white title text (`color: #ffffff !important;`) and translucent white circle badge (`rgba(255, 255, 255, 0.2)`).
- **Uncompleted / Locked Modules (`.nav-item`)**: Faded light gray text (`#cbd5e1`) and light gray circle badge (`#f1f5f9` with `#cbd5e1` text).
- **Completed Modules (`.nav-item.done`)**: Dark text (`#334155`) with green circle badge (`#dcfce7` background with `#166534` bold green text).

### Callout Boxes
- **`.box-good`**: Green border & background (`#f0fdf4`, border `#bbf7d0`). Used for policy guidelines, pass notices, and annual refresh rules.
- **`.box-rule`**: Blue/Slate callout box (`#f8fafc`, border `#cbd5e1`). Used for operational structures, grievance levels, and assessment instructions.
- **`.box-warn`**: Amber callout box (`#fff7ed`, border `#fed7aa`). Used for cautions and warnings.
- **`.box-stop`**: Red callout box (`#fef2f2`, border `#ef4444`). Used for strict prohibitions, zero tolerance rules, and mandatory calling hours.

### Key Components & Layouts
- **Module Grid (Welcome Screen)**:
  `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;`
  Contains cards for learning modules with card number, title, key topics description, and completion time (`⏱ X mins`). Cards are static containers without pointer cursors or click handlers.
- **Header & Branding**: Topbar logo text reads `Respo Financial`.
- **Training Completion Acknowledgement**: Positioned at the bottom of Module 09 after the quiz/certificate block:
  - Confirms compliance with Respo's Fair Practice Code and Code of Conduct.
  - Annual Refresh policy callout box (`.box-good`).
  - Red italic confidentiality footer: `Respo Financial Capital Private Limited — For Internal Use Only — Not for Distribution`.
