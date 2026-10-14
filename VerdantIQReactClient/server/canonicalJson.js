/**
 * Canonical JSON serializer for consistent cryptographic hashing
 * Ensures identical key ordering recursively across all object layers.
 */
export function canonicalStringify(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalStringify).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map(k => JSON.stringify(k) + ':' + canonicalStringify(obj[k]));
  return '{' + pairs.join(',') + '}';
}
