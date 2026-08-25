import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const readText = file => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = file => JSON.parse(readText(file));
const fail = message => { throw new Error(message); };

new vm.Script(readText('assets/concepts.js'), { filename: 'assets/concepts.js' });
new vm.Script(readText('assets/domain-labels.js'), { filename: 'assets/domain-labels.js' });
new vm.Script(readText('assets/navigation.js'), { filename: 'assets/navigation.js' });

const indexHtml = readText('index.html');
for (const hook of [
  'assets/concepts.css',
  'assets/navigation.css',
  'data-view="concepts"',
  'id="view-concepts"',
  'id="conceptNav"',
  'id="conceptDetail"',
  'id="routeStages"',
  'id="systemCards"',
  'id="knowledgeCheck"',
  'assets/concepts.js',
  'assets/domain-labels.js',
  'assets/navigation.js'
]) {
  if (!indexHtml.includes(hook)) fail(`index.html: missing learning UI hook ${hook}`);
}

const appScriptPosition = indexHtml.indexOf('assets/app.js');
const conceptsScriptPosition = indexHtml.indexOf('assets/concepts.js');
const domainLabelsPosition = indexHtml.indexOf('assets/domain-labels.js');
const navigationScriptPosition = indexHtml.indexOf('assets/navigation.js');
if (appScriptPosition === -1 || conceptsScriptPosition < appScriptPosition) {
  fail('index.html: concepts.js must load after app.js');
}
if (domainLabelsPosition < conceptsScriptPosition) {
  fail('index.html: domain-labels.js must load after concepts.js');
}
if (navigationScriptPosition < domainLabelsPosition) {
  fail('index.html: navigation.js must load after domain-labels.js');
}

const manifest = readJson('data/topics.json');
const expectedModules = new Set(['safety', 'autosar', 'embedded', 'aerospace', 'semiconductor']);
for (const moduleId of expectedModules) {
  if (!manifest.topics?.some(module => module.id === moduleId)) {
    fail(`data/topics.json: missing ${moduleId} module`);
  }
}

function validateConceptCollection(moduleId, expectedCount, expectedStageCounts = null) {
  const module = manifest.topics.find(item => item.id === moduleId);
  if (!module?.concepts) fail(`${moduleId}: missing concepts path`);
  const model = readJson(module.concepts);
  if (model.module !== moduleId) fail(`${moduleId}: concept model has invalid module id`);
  if (!Array.isArray(model.concepts) || model.concepts.length !== expectedCount) {
    fail(`${moduleId}: expected ${expectedCount} concepts`);
  }

  const ids = new Set();
  const orders = new Set();
  const stageCounts = new Map();
  for (const concept of model.concepts) {
    if (!concept.id || ids.has(concept.id)) fail(`${moduleId}: duplicate or missing concept id ${concept.id}`);
    if (!Number.isInteger(concept.order) || orders.has(concept.order)) {
      fail(`${moduleId}: duplicate or invalid concept order ${concept.order}`);
    }
    ids.add(concept.id);
    orders.add(concept.order);
    stageCounts.set(concept.stage, (stageCounts.get(concept.stage) || 0) + 1);
  }

  for (let order = 1; order <= expectedCount; order += 1) {
    if (!orders.has(order)) fail(`${moduleId}: concept order ${order} is missing`);
  }
  for (const concept of model.concepts) {
    for (const relatedId of concept.relatedConcepts) {
      if (!ids.has(relatedId)) fail(`${moduleId}/${concept.id}: unresolved related concept ${relatedId}`);
    }
  }
  if (expectedStageCounts) {
    for (const [stage, expected] of expectedStageCounts) {
      const actual = stageCounts.get(stage) || 0;
      if (actual !== expected) fail(`${moduleId}: stage ${stage} has ${actual} concepts; expected ${expected}`);
    }
  }
  return model;
}

const safetyModel = validateConceptCollection('safety', 23, new Map([
  [1, 5], [2, 2], [3, 2], [4, 2], [5, 2],
  [6, 2], [7, 2], [8, 2], [9, 2], [10, 2]
]));
const oneConceptPerStage = new Map(Array.from({ length: 10 }, (_, index) => [index + 1, 1]));
const embeddedModel = validateConceptCollection('embedded', 10, oneConceptPerStage);
const aerospaceModel = validateConceptCollection('aerospace', 10, oneConceptPerStage);
const semiconductorModel = validateConceptCollection('semiconductor', 10, oneConceptPerStage);

const conceptsScript = readText('assets/concepts.js');
for (const behavior of [
  'Practice this concept',
  'linkedQuestions',
  'concept-practice-hidden',
  'data-related-concept',
  'data-clear-concept-practice'
]) {
  if (!conceptsScript.includes(behavior)) fail(`assets/concepts.js: missing behavior ${behavior}`);
}

const domainLabelsScript = readText('assets/domain-labels.js');
for (const behavior of [
  'AEROSPACE EXAMPLE',
  'AUTOMOTIVE EXAMPLE',
  'aerospace',
  'setTextIfChanged',
  'scheduleDomainLabels'
]) {
  if (!domainLabelsScript.includes(behavior)) fail(`assets/domain-labels.js: missing behavior ${behavior}`);
}

function simulateDomainLabelObserver(moduleId) {
  let observerCallback = null;
  let writes = 0;
  const moduleSelect = { value: moduleId, addEventListener() {} };
  const detail = { querySelectorAll() { return []; } };
  const exampleLabel = {
    current: '',
    get textContent() { return this.current; },
    set textContent(value) {
      this.current = value;
      writes += 1;
      if (writes > 5) throw new Error('recursive DOM writes detected');
      observerCallback?.([]);
    }
  };

  const sandbox = {
    document: {
      querySelector(selector) {
        if (selector === '#moduleSelect') return moduleSelect;
        if (selector === '#conceptDetail') return detail;
        if (selector === '#conceptDetail .concept-example .eyebrow') return exampleLabel;
        return null;
      }
    },
    location: { hash: '' },
    URLSearchParams,
    requestAnimationFrame(callback) { callback(); },
    MutationObserver: class {
      constructor(callback) { observerCallback = callback; }
      observe() {}
    }
  };

  try {
    vm.runInNewContext(domainLabelsScript, sandbox, { filename: 'assets/domain-labels.js' });
  } catch (error) {
    fail(`assets/domain-labels.js: observer is not stable for ${moduleId}: ${error.message}`);
  }

  if (writes !== 1) {
    fail(`assets/domain-labels.js: expected one idempotent label write for ${moduleId}; observed ${writes}`);
  }
}

simulateDomainLabelObserver('safety');
simulateDomainLabelObserver('aerospace');
simulateDomainLabelObserver('semiconductor');

const navigationScript = readText('assets/navigation.js');
for (const behavior of [
  'simpleLearningNavigation',
  'simpleTopicSelect',
  'simpleStageSelect',
  'simpleConceptSelect',
  'simpleSystemSelect',
  'simpleQuizPosition',
  'goToTop',
  'simple-toolbar-closed',
  'simple-stage-hidden',
  'moduleSelect',
  'activeArea'
]) {
  if (!navigationScript.includes(behavior)) fail(`assets/navigation.js: missing simplified behavior ${behavior}`);
}

const navigationStyles = readText('assets/navigation.css');
for (const style of [
  '.simple-learning-navigation',
  '.simple-context-controls',
  '.go-to-top',
  '.simple-stage-hidden',
  '.simple-quiz-hidden'
]) {
  if (!navigationStyles.includes(style)) fail(`assets/navigation.css: missing style ${style}`);
}

console.log(
  `Learning UI validation passed: ${safetyModel.concepts.length} Safety concepts, ` +
  `${embeddedModel.concepts.length} Embedded concepts, ${aerospaceModel.concepts.length} Aerospace concepts, ` +
  `${semiconductorModel.concepts.length} Semiconductor concepts, ` +
  'stable domain-label observers and simplified progressive navigation.'
);
