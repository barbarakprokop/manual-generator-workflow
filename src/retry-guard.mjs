/** Illustrative guard against duplicate triggers when a source record is edited. */
export function shouldProcess(event) {
  return Boolean(event && event.status === 'Generate Draft' && event.processed !== true && event.recordId && event.revision);
}
export function processingIdentity(event) {
  if (!shouldProcess(event)) return null;
  return `${event.recordId}:${event.revision}`;
}
