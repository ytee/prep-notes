import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const sourceFile = path.join(root, 'content-source', 'semiconductor', 'concepts.json');
const exerciseFile = path.join(root, 'data', 'semiconductor', 'exercises.json');
const outputFile = path.join(root, 'data', 'semiconductor', 'concepts.json');
const fail = message => { throw new Error(message); };

const model = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const exercises = JSON.parse(fs.readFileSync(exerciseFile, 'utf8'));
const questionIds = new Set(exercises.map(item => item.id));

if (model.schemaVersion !== 1) fail('Semiconductor concept source must use schemaVersion 1');
if (model.module !== 'semiconductor') fail('Semiconductor concept source has the wrong module');
if (model.collection?.id !== 'semiconductor-silicon-functional-safety') {
  fail('Semiconductor concept source has the wrong collection');
}
if (!Array.isArray(model.concepts) || model.concepts.length !== 10) {
  fail(`Expected 10 Semiconductor concepts; found ${model.concepts?.length || 0}`);
}
if (!Array.isArray(exercises) || exercises.length !== 100) {
  fail(`Expected 100 Semiconductor exercises; found ${exercises?.length || 0}`);
}

const ids = new Set();
const orders = new Set();
for (const concept of model.concepts) {
  if (!concept.id || ids.has(concept.id)) fail(`Duplicate or missing concept id ${concept.id}`);
  if (orders.has(concept.order)) fail(`Duplicate concept order ${concept.order}`);
  if (concept.module !== 'semiconductor') fail(`${concept.id}: module must be semiconductor`);
  if (!Number.isInteger(concept.stage) || concept.stage < 1 || concept.stage > 10) {
    fail(`${concept.id}: stage must be 1–10`);
  }
  ids.add(concept.id);
  orders.add(concept.order);
}

for (const concept of model.concepts) {
  for (const relatedId of concept.relatedConcepts || []) {
    if (!ids.has(relatedId)) fail(`${concept.id}: unknown related concept ${relatedId}`);
  }
  for (const questionId of concept.linkedQuestions || []) {
    if (!questionIds.has(questionId)) fail(`${concept.id}: unknown linked exercise ${questionId}`);
  }
  if (concept.linkedQuestions?.length !== 10) {
    fail(`${concept.id}: expected 10 linked exercises`);
  }
}

const serialized = `${JSON.stringify(model, null, 2)}\n`;
if (checkOnly) {
  if (!fs.existsSync(outputFile)) fail('data/semiconductor/concepts.json is missing');
  if (fs.readFileSync(outputFile, 'utf8') !== serialized) {
    fail('data/semiconductor/concepts.json is stale; run npm run build:concepts');
  }
  console.log('semiconductor: 10 concepts validated; generated JSON is current');
} else {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, serialized);
  console.log('semiconductor: wrote 10 concepts to data/semiconductor/concepts.json');
}
