# Automotive Learning Platform (AutoLeaP)

**AutoLeaP** is a modular static web application for learning automotive software, embedded platforms and adjacent safety-critical software engineering domains.

Current modules:

- **Functional Safety** — 23 Functional Safety Management concepts and 100 practice checkpoints.
- **AUTOSAR Classic Platform** — 100 architecture, configuration, stack and integration exercises.
- **Embedded Systems & Firmware** — 10 core concepts and 100 exercises spanning firmware, RTOS, Linux, Android/AAOS, platform architecture and technical leadership.
- **Safety-Critical Aerospace Software** — 10 concepts and 100 exercises spanning DO-178B/C assurance, requirements, model-based development, target implementation, HIL, structural coverage, certification and technical leadership.
- **Semiconductor & Silicon Functional Safety** — 10 concepts and 100 exercises spanning element-level (SEooC) foundations, digital design, the semiconductor design/safety lifecycle, RTL verification, fault injection and FMEDA, lockstep/redundant hardware architectures, hardware safety metrics, safety-manual authoring, the IEC 61508/ISO 21434/ASPICE standards landscape, and certification-ready technical leadership.

## Learning model

```text
Learn one concept
      ↓
Study an engineering example
      ↓
Attempt difficult technical and role-based exercises
      ↓
Reveal guidance and deeper probes
      ↓
Record completion and confidence
```

| Layer | Purpose |
|---|---|
| Concepts | Strong foundations, engineering flow, examples and common mistakes |
| Exercises | Active recollection, debugging, architecture and decision-making |
| Guidance | Key technical reasoning and review points |
| Probes | Tough follow-up questions and boundary cases |
| Validation | Quizzes and architecture exercises |

## Editorial discovery home

AutoLeaP separates content discovery from the focused learning workspace.

The home page provides:

- a **Start Here** orientation;
- browser-state-aware **Continue Learning**;
- the four current learning paths;
- curated Concepts, Case Studies, Engineering Scenarios, Playbooks and Roadmaps;
- direct transitions into the existing concept and exercise engine.

The design uses the structure of clean technical publications as a reference while replacing magazine metadata with learning metadata such as module, stage, difficulty, estimated time and progress. It does not copy external branding, text or images.

Curated cards are version-controlled in `data/home.json` and validated against `schemas/v1/home-catalog.schema.json`. Design and authoring decisions are documented in [`docs/editorial-discovery-home.md`](docs/editorial-discovery-home.md).

## Simplified interface

AutoLeaP uses progressive disclosure so the complete curriculum does not crowd one page.

- Choose **Concepts** or **Exercises**.
- Select one topic.
- Select one concept, stage, system or validation question.
- Only one exercise stage is displayed at a time.
- Search and diagnostic filters remain collapsed until requested.
- A floating **Go to Top** button is always available.
- An always-visible AutoLeaP header returns to the discovery home.

Direct module and concept links remain compatible, and browser-retained completion, confidence and bookmarks are preserved.

The design rationale and comparison with Bengali Sadhana are documented in [`docs/clean-learning-ui.md`](docs/clean-learning-ui.md).

## Safety-Critical Aerospace Software

The aerospace path is employer-neutral. The supplied role description is used only as a coverage input for airborne software assurance, embedded control development, verification, certification support, programme execution and technical leadership.

### Ten-stage route

1. Lifecycle assurance and planning
2. Requirements, derived behaviour and traceability
3. Software architecture and low-level design
4. Model-based development and code generation
5. Embedded implementation and target debugging
6. Avionics communications, engine control and diagnostics
7. Verification strategy and HIL
8. Structural coverage and problem closure
9. Configuration, quality, certification and SOI readiness
10. Programme metrics, CAPA and technical leadership

Each stage contains exactly ten exercises, including:

- at least two strong foundation questions;
- at least seven advanced or expert technical questions;
- one technical-management scenario;
- one certification scenario;
- one software-quality audit scenario;
- one engineering-lead scenario.

The complete module provides:

- 10 concept records, one per stage;
- 100 exercises;
- direct concept-to-exercise mappings;
- MATLAB/Simulink/Stateflow and generated-code scenarios;
- C/C++/assembly, target-processor and Python-tool questions;
- ARINC 429, CAN, Ethernet, engine-control and diagnostic scenarios;
- HIL, structural-coverage, configuration, certification and SOI exercises;
- root-cause, CAPA, programme metrics, mentoring and global-team leadership decisions.

AutoLeaP provides original learning explanations and reference pointers. Licensed DO-178C/DO-178B, DO-331, DO-330 and programme-approved plans remain authoritative.

## Embedded Systems & Firmware

The module is employer-neutral. Two supplied role descriptions were used only as coverage inputs for embedded platform engineering, Android/Linux leadership, common software features and product ownership.

### Ten-stage route

1. Embedded systems foundations
2. Processor, memory and hardware interfaces
3. Firmware, boot and BSP architecture
4. RTOS, concurrency and timing
5. Embedded Linux platform engineering
6. Android platform and Android Automotive
7. Connectivity, infotainment and OTA
8. Reusable platforms and product variability
9. Performance, security, quality and release
10. Engineering and product leadership

Each stage contains exactly ten exercises, including:

- at least two strong foundation questions;
- difficult advanced and expert technical questions;
- one technical-management scenario;
- one product-owner scenario;
- one engineering-manager scenario;
- one board-level architecture exercise.

The full bank contains **100 exercises** and the concept collection links every stage concept directly to its ten exercises.

## Semiconductor & Silicon Functional Safety

The module is employer-neutral. Coverage draws on public functional-safety, verification and semiconductor-industry practice, not any single company's internal material.

### Ten-stage route

1. Semiconductor functional safety foundations
2. Digital design fundamentals for safety engineers
3. The semiconductor design and safety lifecycle
4. RTL verification strategy
5. Fault injection and silicon-level safety analysis
6. Lockstep, redundancy and diagnostic hardware architectures
7. Hardware safety metrics for IP and SoC
8. Safety Element out of Context: the producer's side
9. Standards landscape: IEC 61508, ISO/SAE 21434 and ASPICE
10. Certification, assessment and technical leadership

Each stage contains exactly ten exercises, including:

- at least two strong foundation questions;
- at least seven advanced or expert technical questions;
- one technical-management scenario;
- one certification scenario;
- one customer-integration scenario;
- one engineering-lead scenario.

The complete module provides:

- 10 concept records, one per stage;
- 100 exercises;
- direct concept-to-exercise mappings;
- RTL, digital-design, synthesis, DFT and clock-domain scenarios;
- gate-level fault-model, FMEDA and fault-injection-campaign questions;
- lockstep, delayed lockstep, TMR and comparator-independence scenarios;
- SPFM/LFM/PMHF and base-failure-rate producer-side questions;
- Assumptions of Use and safety-manual authoring exercises;
- IEC 61508, ISO/SAE 21434 and ASPICE HWE standards-landscape questions;
- assessment, safety-case defense and technical-leadership scenarios.

This module deliberately complements, rather than duplicates, the Functional Safety Management module's existing hardware-safety content (Day 5–6: FMEA/FTA/DFA, SPFM/LFM/PMHF, hardware safety lifecycle management): the FSM module teaches that content from the vehicle-level integrator's side — consuming a semiconductor supplier's safety evidence; this module teaches the same underlying concepts from the semiconductor producer's side — authoring RTL-level verification, FMEDA and safety-manual evidence for someone else to consume.

## Functional Safety Management concepts

Functional Safety uses ISO 26262:2018 as its published baseline. The 23-concept collection covers foundations plus two management concepts for every route stage from 2 through 10.

Each concept provides:

- learning objectives;
- original explanation;
- inputs, activities, outputs and evidence;
- an engineering example;
- common mistakes;
- related concepts;
- linked practice checkpoints;
- reference pointers.

Licensed standards remain authoritative; AutoLeaP does not reproduce normative text.

## Content structure

```text
auto-learning-platform/
├── index.html
├── assets/
│   ├── app.js
│   ├── concepts.js
│   ├── concepts.css
│   ├── domain-labels.js
│   ├── navigation.js
│   ├── navigation.css
│   ├── home.js
│   ├── home.css
│   ├── styles.css
│   ├── learning-language.js
│   └── content.js
├── content-source/
│   ├── safety/concepts/functional-safety-management/*.md
│   ├── embedded-systems/concepts/*.json
│   ├── aerospace/concepts.json
│   └── semiconductor/concepts.json
├── data/
│   ├── home.json
│   ├── topics.json
│   ├── safety/concepts.json
│   ├── autosar/
│   │   ├── meta.json
│   │   └── day1.json ... day10.json
│   ├── embedded/
│   │   ├── meta.json
│   │   ├── day1.json ... day10.json
│   │   └── concepts.json
│   ├── aerospace/
│   │   ├── meta.json
│   │   ├── exercises.json
│   │   └── concepts.json
│   └── semiconductor/
│       ├── meta.json
│       ├── exercises.json
│       └── concepts.json
├── schemas/v1/
│   ├── concept-authoring.schema.json
│   ├── concept.schema.json
│   ├── concept-collection.schema.json
│   ├── exercise.schema.json
│   ├── exercise-batch.schema.json
│   ├── exercise-module.schema.json
│   └── home-catalog.schema.json
├── scripts/
│   ├── assemble-embedded-source.mjs
│   ├── build-concepts.mjs
│   ├── build-aerospace-concepts.mjs
│   ├── build-semiconductor-concepts.mjs
│   ├── render-concept-source.mjs
│   ├── validate-content.mjs
│   ├── validate-concepts-ui.mjs
│   ├── validate-home-ui.mjs
│   └── validate-schema-contracts.mjs
├── docs/
│   ├── clean-learning-ui.md
│   └── editorial-discovery-home.md
├── package.json
└── netlify.toml
```

Functional Safety concepts use Markdown as their canonical source. Embedded Systems concepts use versioned JSON concept records under `content-source/embedded-systems/concepts/`. Aerospace and Semiconductor concepts each use a version-controlled collection file (`content-source/aerospace/concepts.json`, `content-source/semiconductor/concepts.json`). Builds assemble these forms into deterministic runtime JSON for the site.

## Versioned generation contracts

Machine-readable schemas are stored under `schemas/v1/`:

- `concept-authoring.schema.json`
- `concept.schema.json`
- `concept-collection.schema.json`
- `exercise.schema.json`
- `exercise-batch.schema.json`
- `exercise-module.schema.json`
- `home-catalog.schema.json`

Breaking contract changes require a new version directory such as `schemas/v2/`.

## Validation

```bash
npm run build:concepts
npm run check:concepts
npm run validate:schemas
npm run validate
```

The validation pipeline checks:

- deterministic concept generation;
- concept metadata and required sections;
- concept relationships and linked exercise IDs;
- ten stages and 100 exercises per module;
- exactly ten exercises per stage;
- declared tracks and supported difficulty levels;
- the Embedded module's foundation, difficult technical, management and role-scenario mix;
- the Aerospace module's foundation, difficult technical, certification, audit and leadership mix;
- versioned JSON Schema contracts;
- discovery-home catalog structure and target resolution;
- home-to-workspace transitions and retained progress integration;
- simplified navigation, stage focus and Go-to-top UI hooks;
- domain-appropriate concept labels;
- learning-oriented user-facing terminology.

## Retained browser state

Progress is stored per module in the current browser profile:

```text
autoNotesNvM:safety
autoNotesNvM:autosar
autoNotesNvM:embedded
autoNotesNvM:aerospace
autoNotesNvM:semiconductor
```

State is not synchronized across devices. The discovery home reads these same keys to determine the most relevant Continue Learning destination.

## Run locally

```bash
git clone https://github.com/ytee/auto-learning-platform.git
cd auto-learning-platform
npm run validate
python3 -m http.server 8000
```

Open `http://localhost:8000`. A local HTTP server is required because the application fetches JSON assets.

## Deployment

The static site is deployed through Netlify. Both GitHub Actions and Netlify run `npm run validate` before publication.

## Content principles

- Teach strong foundations before difficult applications.
- Preserve technical depth and system context.
- Include debugging, architecture, technical-management, certification and product decisions.
- Keep role-derived coverage employer-neutral.
- Connect software behavior to hardware, timing, interfaces, safety, quality, assurance and release evidence.
- Use original explanations and project-appropriate reference pointers.
- Do not reproduce proprietary or normative standards content.
- Verify release-specific implementation details against authoritative platform, programme and vendor documentation.
