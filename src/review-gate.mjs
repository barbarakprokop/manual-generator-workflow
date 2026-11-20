/** Standalone demonstration of a human-reviewed document-generation decision. */
export function analyzeRecord(record) {
  const required = ['projectName', 'materials', 'dimensions', 'setup'];
  const missing = required.filter(field => {
    const value = record?.[field];
    return typeof value !== 'string' || !value.trim();
  });
  const contradictions = Array.isArray(record?.contradictions) ? record.contradictions : [];
  return {
    status: missing.length || contradictions.length ? 'needs_information' : 'ready_for_draft',
    missing,
    contradictions,
    canGenerateDraft: missing.length === 0 && contradictions.length === 0,
    canPublish: false,
  };
}

export function submitDraftForReview(analysis, draft) {
  if (!analysis.canGenerateDraft) throw new Error('Resolve missing information before drafting.');
  if (!draft || !Array.isArray(draft.pages) || draft.pages.length === 0) throw new Error('Draft pages required.');
  return { status: 'draft_ready_for_review', draft, requiresHumanApproval: true, canPublish: false };
}

export function recordHumanDecision(state, decision) {
  if (state.status !== 'draft_ready_for_review') throw new Error('A draft must exist before review.');
  if (!['approved', 'changes_requested'].includes(decision)) throw new Error('Unknown review decision.');
  return { ...state, status: decision === 'approved' ? 'approved_for_export' : 'revision_requested', canPublish: false };
}
