import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeRecord, submitDraftForReview, recordHumanDecision } from '../src/review-gate.mjs';
import { planManual } from '../src/document-plan.mjs';
import { shouldProcess, processingIdentity } from '../src/retry-guard.mjs';

const ready = { projectName: 'Sample Installation', overview: 'Example only.', materials: 'Two panels', dimensions: '100 × 80 cm', setup: 'Place panels using the approved plan', safety: 'Confirm installation with responsible team.' };

test('missing measurements stop drafting rather than being invented', () => {
  const result = analyzeRecord({ ...ready, dimensions: '' });
  assert.equal(result.status, 'needs_information');
  assert.deepEqual(result.missing, ['dimensions']);
  assert.equal(result.canGenerateDraft, false);
});
test('contradictory source information is surfaced for clarification', () => {
  const result = analyzeRecord({ ...ready, contradictions: ['Panel count differs across notes'] });
  assert.equal(result.canGenerateDraft, false);
  assert.equal(result.contradictions.length, 1);
});
test('complete records allow a draft but never authorize publication', () => {
  const result = analyzeRecord(ready);
  assert.equal(result.status, 'ready_for_draft');
  assert.equal(result.canPublish, false);
});
test('a draft requires explicit human review', () => {
  const review = submitDraftForReview(analyzeRecord(ready), {pages:planManual(ready)});
  assert.equal(review.status, 'draft_ready_for_review');
  assert.equal(review.requiresHumanApproval, true);
  assert.equal(review.canPublish, false);
  assert.equal(recordHumanDecision(review, 'approved').status, 'approved_for_export');
  assert.equal(recordHumanDecision(review, 'approved').canPublish, false);
});
test('incomplete records cannot become reviewable drafts', () => {
  assert.throws(() => submitDraftForReview(analyzeRecord({...ready,setup:''}), { pages:[] }));
});
test('document plan preserves supplied material and only references supplied assets', () => {
  const pages = planManual(ready, [{id:'example-image-1',caption:'Placement diagram'}]);
  assert.equal(pages.find(p=>p.section==='Dimensions').text, ready.dimensions);
  assert.deepEqual(pages.at(-1).assets, [{id:'example-image-1',caption:'Placement diagram'}]);
});
test('duplicate source updates do not trigger processing again', () => {
  const event = { status:'Generate Draft', processed:false, recordId:'sample-record', revision:2 };
  assert.equal(shouldProcess(event), true);
  assert.equal(processingIdentity(event), 'sample-record:2');
  assert.equal(shouldProcess({...event,processed:true}), false);
  assert.equal(shouldProcess({...event,status:'Draft Ready for Review'}), false);
});
