# Architecture and design decisions

This is a reconstructed public companion based on project descriptions and prior design work, **not a direct export** of the original n8n automation or the current ChatGPT Project instructions. The demonstrations are synthetic. The private production workflows were not executed or independently audited in preparing this public package.

## The actual design shift

### V1: structured automation

The initial workflow used Notion as structured input, n8n to orchestrate status changes and AI generation, Google Drive for images, and Google Slides as an assembly target. It was designed to make document preparation more consistent while keeping technical facts and approvals under human control.

The process was multi-step and therefore brittle: field completeness, trigger conditions, duplicate executions, API permissions and image transfer all mattered. A key lesson was to prevent updates to the source record from launching the same job repeatedly. The sample in `src/retry-guard.mjs` illustrates this principle; it does not reproduce the original n8n node configuration.

### V2: conversational, human-reviewed documentation

The redesign moved from a rigid orchestration chain to a ChatGPT Project using reference instructions and template material. The workflow begins with mixed project material such as notes, images and dimensions, analyzes what is known and missing, asks targeted follow-up questions, and then prepares a document for human review and PDF export.

The important change was *reducing the machinery*, not increasing the number of AI steps. Approval, technical accuracy and open questions remain visible instead of being buried inside automatically generated prose.

## Information contract

Before a draft is assembled, missing measurements, unresolved contradictions and ambiguous technical instructions should be flagged. An output can be a **draft ready for review** without being **approved for use**. That distinction is deliberate.

The companion's pure JavaScript modules demonstrate three separate decisions: validating information completeness; planning document sections without inventing source material; and guarding against repeated triggers. They are not claimed to be the exact current ChatGPT Project logic.

## What was achieved and what is not proved here

The case study describes a reduction from about **2–3 days of preparation to approximately 1–2 hours** in the redesigned process. This is project-reported experience, not a controlled performance study or a benchmark produced by this repository.

Neither V1 nor V2 is represented here as an autonomous publisher. PDF export and approval are separate activities; generated materials require human verification.

## What to inspect

`npm test` runs seven synthetic scenarios. These tests demonstrate the public examples, not production n8n integrations, WordPress/Notion/Drive permissions or document quality.
