import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const schemaRoot = path.join(root, 'schemas', 'v1');
const fail = message => { throw new Error(message); };
const schemaCache = new Map();

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function schemaAt(file) {
  const resolved = path.resolve(file);
  if (!schemaCache.has(resolved)) schemaCache.set(resolved, readJson(resolved));
  return schemaCache.get(resolved);
}

function resolveRef(ref, currentFile) {
  const [filePart, fragment = ''] = ref.split('#');
  const targetFile = filePart ? path.resolve(path.dirname(currentFile), filePart) : currentFile;
  let target = schemaAt(targetFile);
  if (fragment) {
    if (!fragment.startsWith('/')) fail(`${currentFile}: unsupported schema fragment ${fragment}`);
    for (const rawToken of fragment.slice(1).split('/')) {
      const token = rawToken.replace(/~1/g, '/').replace(/~0/g, '~');
      if (!Object.hasOwn(target, token)) fail(`${currentFile}: unresolved schema fragment ${ref}`);
      target = target[token];
    }
  }
  return { schema: target, file: targetFile };
}

function typeMatches(value, type) {
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'array') return Array.isArray(value);
  if (type === 'string') return typeof value === 'string';
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'boolean') return typeof value === 'boolean';
  if (type === 'null') return value === null;
  return false;
}

function validate(value, schema, schemaFile, dataPath = '$') {
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, schemaFile);
    return validate(value, resolved.schema, resolved.file, dataPath);
  }

  if (Object.hasOwn(schema, 'const') && !deepEqual(value, schema.const)) {
    fail(`${dataPath}: expected constant ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some(candidate => deepEqual(value, candidate))) {
    fail(`${dataPath}: value is not in the allowed enum`);
  }
  if (schema.type && !typeMatches(value, schema.type)) {
    fail(`${dataPath}: expected ${schema.type}`);
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) fail(`${dataPath}: string is too short`);
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) fail(`${dataPath}: string does not match ${schema.pattern}`);
  }

  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) fail(`${dataPath}: value is below minimum`);
    if (schema.maximum !== undefined && value > schema.maximum) fail(`${dataPath}: value is above maximum`);
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) fail(`${dataPath}: array has too few items`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) fail(`${dataPath}: array has too many items`);
    if (schema.uniqueItems) {
      const serialized = value.map(item => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) fail(`${dataPath}: array items must be unique`);
    }
    if (schema.items) value.forEach((item, index) => validate(item, schema.items, schemaFile, `${dataPath}[${index}]`));
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of schema.required || []) {
      if (!Object.hasOwn(value, key)) fail(`${dataPath}: missing required property ${key}`);
    }
    const properties = schema.properties || {};
    for (const [key, item] of Object.entries(value)) {
      if (Object.hasOwn(properties, key)) {
        validate(item, properties[key], schemaFile, `${dataPath}.${key}`);
      } else if (schema.additionalProperties === false) {
        fail(`${dataPath}: unexpected property ${key}`);
      }
    }
  }
}

function validateFile(dataFile, schemaFile) {
  validate(readJson(dataFile), schemaAt(schemaFile), schemaFile);
}

const schemaFiles = fs.readdirSync(schemaRoot)
  .filter(name => name.endsWith('.schema.json'))
  .sort()
  .map(name => path.join(schemaRoot, name));

if (!schemaFiles.length) fail('No v1 schema files found');

for (const file of schemaFiles) {
  const schema = schemaAt(file);
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
    fail(`${path.relative(root, file)}: JSON Schema draft must be 2020-12`);
  }
  if (typeof schema.$id !== 'string' || !schema.$id.includes('/schemas/v1/')) {
    fail(`${path.relative(root, file)}: missing versioned $id`);
  }
}

validateFile(
  path.join(schemaRoot, 'examples', 'concept-authoring.example.json'),
  path.join(schemaRoot, 'concept-authoring.schema.json')
);
validateFile(
  path.join(schemaRoot, 'examples', 'exercise-batch.example.json'),
  path.join(schemaRoot, 'exercise-batch.schema.json')
);
validateFile(
  path.join(schemaRoot, 'examples', 'exercise-module.example.json'),
  path.join(schemaRoot, 'exercise-module.schema.json')
);
validateFile(
  path.join(root, 'data', 'home.json'),
  path.join(schemaRoot, 'home-catalog.schema.json')
);
validateFile(
  path.join(root, 'data', 'comparisons', 'aerospace-vs-automotive-safety.json'),
  path.join(schemaRoot, 'safety-domain-comparison.schema.json')
);

for (const moduleId of ['safety', 'embedded', 'aerospace', 'semiconductor']) {
  const conceptRuntime = path.join(root, 'data', moduleId, 'concepts.json');
  if (!fs.existsSync(conceptRuntime)) {
    fail(`Generated data/${moduleId}/concepts.json is missing; run npm run build:concepts`);
  }
  validateFile(conceptRuntime, path.join(schemaRoot, 'concept-collection.schema.json'));
}

for (const moduleId of ['autosar', 'embedded', 'aerospace', 'semiconductor']) {
  validateFile(
    path.join(root, 'data', moduleId, 'meta.json'),
    path.join(schemaRoot, 'exercise-module.schema.json')
  );
}

for (let stage = 1; stage <= 10; stage += 1) {
  validateFile(
    path.join(root, 'data', 'autosar', `day${stage}.json`),
    path.join(schemaRoot, 'exercise-batch.schema.json')
  );
}

for (let stage = 1; stage <= 5; stage += 1) {
  validateFile(
    path.join(root, 'data', 'embedded', `day${stage}.json`),
    path.join(schemaRoot, 'exercise-batch.schema.json')
  );
}
validateFile(
  path.join(root, 'data', 'embedded', 'day6-10.json'),
  path.join(schemaRoot, 'exercise-batch.schema.json')
);
validateFile(
  path.join(root, 'data', 'aerospace', 'exercises.json'),
  path.join(schemaRoot, 'exercise-batch.schema.json')
);
validateFile(
  path.join(root, 'data', 'semiconductor', 'exercises.json'),
  path.join(schemaRoot, 'exercise-batch.schema.json')
);

console.log(
  `Schema contracts passed: ${schemaFiles.length} schemas, discovery home catalog, safety-domain comparison, ` +
  'four concept runtimes, four modular exercise modules and eighteen exercise batches.'
);
