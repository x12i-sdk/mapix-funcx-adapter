import assert from 'node:assert/strict';
import { profileCollection } from '@x12i/mapix-mongo-profiler';
const profile = profileCollection({ runId: 'demo-run', sourceId: 'fixture-source',
  collection: { sourceId: 'fixture-source', dbName: 'fixture-db', collectionName: 'assets', dataRoot: 'data' },
  sampleStrategy: 'first_n', records: [
    { data: { id: 'asset-1', name: 'Example laptop', status: 'active' } },
    { data: { id: 'asset-2', name: 'Example server', status: 'active' } },
  ],
});
import { applyInferenceToProfile } from '@x12i/mapix-funcx-adapter';
const field = profile.fields.find(item => item.path.endsWith('name'));
const result = applyInferenceToProfile(profile, [{ inferenceId: 'fixture-inference', runId: 'demo-run', profileId: profile.profileId, fieldPath: field.path,
  functionName: 'fixture', functionVersion: '1', input: {}, output: { semanticType: 'display' },
  confidence: 'high', success: true, durationMs: 0, createdAt: '2026-01-01T00:00:00.000Z',
}]);
assert.equal(result.fields.find(item => item.path === field.path).displayLike, true);
assert(result.fields.find(item => item.path === field.path).semanticHints.some(hint => hint.hint === 'display' && hint.source === 'semantic'));
console.log(result.fields.find(item => item.path === field.path));
