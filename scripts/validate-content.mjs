import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const readText = file => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = file => JSON.parse(readText(file));
const fail = message => { throw new Error(message); };

function loadLearningLanguage() {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(readText('assets/learning-language.js'), sandbox, {
    filename: 'assets/learning-language.js'
  });
  if (!sandbox.AUTO_NOTES_LANGUAGE) fail('Learning-language module did not initialize');
  return sandbox.AUTO_NOTES_LANGUAGE;
}

const learningLanguage = loadLearningLanguage();

function validateQuestions(topicId, days, tracks, questions) {
  if (!Array.isArray(days) || days.length !== 10) fail(`${topicId}: expected 10 stages`);
  if (!Array.isArray(questions) || questions.length !== 100) fail(`${topicId}: expected 100 exercises`);

  const dayNumbers = new Set(days.map(day => day.day));
  const ids = new Set();
  const knownTiers = new Set(['Foundation', 'Intermediate', 'Advanced', 'Expert']);

  for (const question of questions) {
    if (!question.id || ids.has(question.id)) fail(`${topicId}: duplicate or missing exercise id ${question.id}`);
    ids.add(question.id);
    if (!dayNumbers.has(question.day)) fail(`${topicId}/${question.id}: invalid stage ${question.day}`);
    if (!knownTiers.has(question.tier)) fail(`${topicId}/${question.id}: invalid tier ${question.tier}`);
    if (!Number.isFinite(question.minutes) || question.minutes < 1) fail(`${topicId}/${question.id}: invalid minutes`);

    for (const field of ['question', 'kind']) {
      if (!question[field]) fail(`${topicId}/${question.id}: missing ${field}`);
    }
    for (const field of ['tracks', 'answer', 'probes', 'refs']) {
      if (!Array.isArray(question[field]) || question[field].length === 0) {
        fail(`${topicId}/${question.id}: missing ${field}`);
      }
    }
  }

  for (const day of days) {
    const stageQuestions = questions.filter(question => question.day === day.day);
    if (stageQuestions.length !== 10) {
      fail(`${topicId}: stage ${day.day} has ${stageQuestions.length} exercises; expected 10`);
    }
  }

  if (!Array.isArray(tracks) || tracks.length === 0) fail(`${topicId}: missing tracks`);
  console.log(`${topicId}: ${questions.length} exercises, ${days.length} stages, ${tracks.length} tracks`);
}

function validateEmbeddedMix(questions) {
  const requiredKinds = new Set([
    'Technical management',
    'Product owner scenario',
    'Engineering manager scenario',
    'Board exercise'
  ]);

  for (let stage = 1; stage <= 10; stage += 1) {
    const items = questions.filter(question => question.day === stage);
    const foundationCount = items.filter(question => question.tier === 'Foundation').length;
    const toughCount = items.filter(question => ['Advanced', 'Expert'].includes(question.tier)).length;
    if (foundationCount < 2) fail(`embedded: stage ${stage} needs at least two foundation exercises`);
    if (toughCount < 5) fail(`embedded: stage ${stage} needs at least five advanced/expert exercises`);

    for (const kind of requiredKinds) {
      if (!items.some(question => question.kind === kind)) {
        fail(`embedded: stage ${stage} is missing ${kind}`);
      }
    }
  }

  const roleTrackCount = questions.filter(question => question.tracks.includes('Role Scenarios')).length;
  if (roleTrackCount < 20) fail('embedded: expected at least 20 role-based exercises');
  console.log('embedded: strong foundation, tough technical and role/management mix passed');
}

function validateAerospaceMix(questions) {
  const requiredKinds = new Set([
    'Technical management',
    'Certification scenario',
    'Quality audit scenario',
    'Engineering lead scenario'
  ]);

  for (let stage = 1; stage <= 10; stage += 1) {
    const items = questions.filter(question => question.day === stage);
    const foundationCount = items.filter(question => question.tier === 'Foundation').length;
    const toughCount = items.filter(question => ['Advanced', 'Expert'].includes(question.tier)).length;
    if (foundationCount < 2) fail(`aerospace: stage ${stage} needs at least two foundation exercises`);
    if (toughCount < 7) fail(`aerospace: stage ${stage} needs at least seven advanced/expert exercises`);

    for (const kind of requiredKinds) {
      if (!items.some(question => question.kind === kind)) {
        fail(`aerospace: stage ${stage} is missing ${kind}`);
      }
    }
  }

  const roleTrackCount = questions.filter(question => question.tracks.includes('Role Scenarios')).length;
  if (roleTrackCount < 40) fail('aerospace: expected at least 40 role-based exercises');

  const requiredCoverage = [
    'DO-178 Assurance',
    'Requirements & Traceability',
    'Model-Based Development',
    'Embedded C/C++ & Target',
    'Avionics Communications',
    'Engine Control & Diagnostics',
    'Verification, HIL & Coverage',
    'Configuration, Quality & Certification',
    'Program Metrics & CAPA',
    'Technical Leadership'
  ];
  const representedTracks = new Set(questions.flatMap(question => question.tracks));
  for (const track of requiredCoverage) {
    if (!representedTracks.has(track)) fail(`aerospace: required coverage track is missing: ${track}`);
  }

  console.log('aerospace: foundation, difficult technical, certification, audit and leadership mix passed');
}

function validateSemiconductorMix(questions) {
  const requiredKinds = new Set([
    'Technical management',
    'Certification scenario',
    'Customer integration scenario',
    'Engineering lead scenario'
  ]);

  for (let stage = 1; stage <= 10; stage += 1) {
    const items = questions.filter(question => question.day === stage);
    const foundationCount = items.filter(question => question.tier === 'Foundation').length;
    const toughCount = items.filter(question => ['Advanced', 'Expert'].includes(question.tier)).length;
    if (foundationCount < 2) fail(`semiconductor: stage ${stage} needs at least two foundation exercises`);
    if (toughCount < 7) fail(`semiconductor: stage ${stage} needs at least seven advanced/expert exercises`);

    for (const kind of requiredKinds) {
      if (!items.some(question => question.kind === kind)) {
        fail(`semiconductor: stage ${stage} is missing ${kind}`);
      }
    }
  }

  const roleTrackCount = questions.filter(question => question.tracks.includes('Role Scenarios')).length;
  if (roleTrackCount < 40) fail('semiconductor: expected at least 40 role-based exercises');

  const requiredCoverage = [
    'Semiconductor FuSa Foundations',
    'Digital Design',
    'Design Flow & Lifecycle',
    'RTL Verification',
    'Fault Injection & Analysis',
    'Lockstep & Redundancy',
    'Hardware Safety Metrics',
    'SEooC & Safety Manuals',
    'Standards Landscape',
    'Certification & Leadership'
  ];
  const representedTracks = new Set(questions.flatMap(question => question.tracks));
  for (const track of requiredCoverage) {
    if (!representedTracks.has(track)) fail(`semiconductor: required coverage track is missing: ${track}`);
  }

  console.log('semiconductor: foundation, difficult technical, certification and leadership mix passed');
}

function validateLearningModel(topicId, content) {
  const normalized = learningLanguage.normalize(content);
  const findings = learningLanguage.findProhibited(normalized);
  if (findings.length) {
    const first = findings[0];
    fail(`${topicId}: prohibited learning-language term "${first.term}" remains at ${first.path}`);
  }
  console.log(`${topicId}: user-facing learning language passed`);
}

function loadLegacy(globalName) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readText('assets/content.js'), sandbox, { filename: 'assets/content.js' });
  const content = sandbox.window[globalName];
  if (!content) fail(`Legacy global ${globalName} was not created`);
  return content;
}

function validateConceptRuntime(file, topicId, questionIds, expectedCount) {
  if (!fs.existsSync(path.join(root, file))) fail(`${file}: generated concept model is missing`);
  const model = readJson(file);

  if (model.schemaVersion !== 1) fail(`${file}: unsupported schema version`);
  if (model.module !== topicId) fail(`${file}: module must be ${topicId}`);
  if (!model.collection?.id || !model.collection?.title) fail(`${file}: invalid collection`);
  if (
    typeof model.standardBaseline?.family !== 'string' ||
    typeof model.standardBaseline?.edition !== 'string' ||
    typeof model.standardBaseline?.status !== 'string'
  ) {
    fail(`${file}: invalid learning baseline`);
  }
  if (!Array.isArray(model.concepts) || model.concepts.length !== expectedCount) {
    fail(`${file}: expected ${expectedCount} concepts`);
  }

  const ids = new Set();
  const orders = new Set();
  for (const concept of model.concepts) {
    if (!concept.id || ids.has(concept.id)) fail(`${file}: duplicate or missing concept id ${concept.id}`);
    ids.add(concept.id);
  }
  const requiredArrays = [
    'systems', 'learningObjectives', 'explanation', 'whyItMatters',
    'inputs', 'activities', 'outputs', 'commonMistakes',
    'relatedConcepts', 'linkedQuestions', 'references'
  ];

  for (const concept of model.concepts) {
    if (orders.has(concept.order)) fail(`${file}: duplicate concept order ${concept.order}`);
    orders.add(concept.order);

    for (const field of ['title', 'summary', 'automotiveExample', 'source']) {
      if (!concept[field]) fail(`${file}/${concept.id}: missing ${field}`);
    }
    if (concept.module !== topicId) fail(`${file}/${concept.id}: module mismatch`);
    if (!Number.isInteger(concept.stage) || concept.stage < 1 || concept.stage > 10) {
      fail(`${file}/${concept.id}: invalid stage`);
    }
    for (const field of requiredArrays) {
      if (!Array.isArray(concept[field]) || concept[field].length === 0) {
        fail(`${file}/${concept.id}: missing ${field}`);
      }
    }
    for (const relatedId of concept.relatedConcepts) {
      if (!ids.has(relatedId)) fail(`${file}/${concept.id}: unknown related concept ${relatedId}`);
    }
    for (const exerciseId of concept.linkedQuestions) {
      if (!questionIds.has(exerciseId)) fail(`${file}/${concept.id}: unknown linked exercise ${exerciseId}`);
    }
  }

  validateLearningModel(`${topicId}-concepts`, model);
  console.log(`${topicId}-concepts: ${model.concepts.length} concepts validated`);
}

new vm.Script(readText('assets/app.js'), { filename: 'assets/app.js' });
new vm.Script(readText('assets/navigation.js'), { filename: 'assets/navigation.js' });

const indexHtml = readText('index.html');
for (const requiredScript of [
  'assets/content.js',
  'assets/learning-language.js',
  'assets/app.js',
  'assets/concepts.js',
  'assets/navigation.js'
]) {
  if (!indexHtml.includes(requiredScript)) fail(`index.html: missing ${requiredScript}`);
}

const manifest = readJson('data/topics.json');
if (!Array.isArray(manifest.topics) || manifest.topics.length < 4) {
  fail('Learning manifest must contain Functional Safety, AUTOSAR, Embedded Systems and Aerospace Software');
}
validateLearningModel('manifest', manifest);

const topicIds = new Set();
for (const topic of manifest.topics) {
  if (!topic.id || topicIds.has(topic.id)) fail(`Duplicate or missing topic id ${topic.id}`);
  topicIds.add(topic.id);

  let content;
  let questions;

  if (topic.legacyGlobal) {
    content = loadLegacy(topic.legacyGlobal);
    questions = content.questions;
  } else {
    if (!topic.content) fail(`${topic.id}: missing metadata content path`);
    content = readJson(topic.content);
    const questionFiles = topic.questionFiles || [];
    if (!questionFiles.length) fail(`${topic.id}: no exercise files`);
    questions = questionFiles.flatMap(file => readJson(file));
  }

  validateQuestions(topic.id, content.days, content.tracks, questions);
  if (topic.id === 'embedded') validateEmbeddedMix(questions);
  if (topic.id === 'aerospace') validateAerospaceMix(questions);
  if (topic.id === 'semiconductor') validateSemiconductorMix(questions);

  if (!topic.legacyGlobal) {
    const declaredTracks = new Set(content.tracks.map(track => track.name));
    const undeclaredTracks = [...new Set(
      questions.flatMap(question => question.tracks).filter(track => !declaredTracks.has(track))
    )];
    if (undeclaredTracks.length) fail(`${topic.id}: undeclared tracks: ${undeclaredTracks.join(', ')}`);

    const knowledgeCheckTitle = content.knowledgeCheckTitle || content.mockTitle;
    const architectureExercise = content.architectureExercise || content.boardExercise;
    if (!knowledgeCheckTitle) fail(`${topic.id}: missing knowledge-check title`);
    if (!architectureExercise?.title || !architectureExercise?.prompt) {
      fail(`${topic.id}: missing architecture exercise`);
    }
  }

  validateLearningModel(topic.id, { ...content, questions });

  if (topic.concepts) {
    const expectedCounts = { safety: 23, embedded: 10, aerospace: 10, semiconductor: 10 };
    const expectedCount = expectedCounts[topic.id];
    if (!expectedCount) fail(`${topic.id}: concept count expectation is not configured`);
    validateConceptRuntime(
      topic.concepts,
      topic.id,
      new Set(questions.map(question => question.id)),
      expectedCount
    );
  }
}

for (const requiredTopic of ['safety', 'autosar', 'embedded', 'aerospace']) {
  if (!topicIds.has(requiredTopic)) fail(`Manifest is missing ${requiredTopic}`);
}

console.log('AutoLeaP content validation passed.');
