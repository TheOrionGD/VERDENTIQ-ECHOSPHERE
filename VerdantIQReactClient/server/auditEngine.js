import crypto from 'crypto';
import { canonicalStringify } from './canonicalJson.js';

/**
 * Creates a cryptographically verifiable SHA-256 hash for an audit record.
 * Uses canonical JSON serialization to guarantee stable key ordering.
 * Form: SHA256(timestamp + userId + userRole + action + canonicalDetails + previousHash)
 */
export function computeAuditHash({ timestamp, userId, userRole, action, details, previousHash }) {
  const detailsCanonical = canonicalStringify(details || {});
  const payload = `${timestamp}|${userId || 'SYSTEM'}|${userRole || 'ANON'}|${action}|${detailsCanonical}|${previousHash || '0000000000000000000000000000000000000000000000000000000000000000'}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Verifies that a sequence of audit logs forms an unbroken, untampered SHA-256 chain.
 * @param {Array} logs - Chronologically ordered audit logs (oldest to newest)
 * @returns {Object} { isValid: boolean, unbrokenCount: number, tamperedIndex: number | null, reason: string | null }
 */
export function verifyAuditChain(logs) {
  if (!logs || logs.length === 0) {
    return { isValid: true, unbrokenCount: 0, tamperedIndex: null, reason: 'Empty chain' };
  }

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const expectedPrev = i === 0 ? (log.previousHash || '0000000000000000000000000000000000000000000000000000000000000000') : logs[i - 1].currentHash;

    if (log.previousHash !== expectedPrev) {
      return {
        isValid: false,
        unbrokenCount: i,
        tamperedIndex: i,
        reason: `Broken chain link at index ${i}: previousHash mismatch. Record expected '${expectedPrev}', got '${log.previousHash}'.`
      };
    }

    const recomputedHash = computeAuditHash({
      timestamp: log.timestamp,
      userId: log.userId,
      userRole: log.userRole,
      action: log.action,
      details: log.details,
      previousHash: log.previousHash
    });

    if (recomputedHash !== log.currentHash) {
      return {
        isValid: false,
        unbrokenCount: i,
        tamperedIndex: i,
        reason: `Cryptographic tamper detected at index ${i}: data inside record has been modified after hashing.`
      };
    }
  }

  return {
    isValid: true,
    unbrokenCount: logs.length,
    tamperedIndex: null,
    reason: 'Cryptographic SHA-256 chain is completely valid and untampered.'
  };
}
