'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface AuditLogFilterState {
  searchQuery: string;
  selectedAction: string;
  selectedRole: string;
  selectedSeverity?: string;
  selectedRule?: string;
  [key: string]: any;
}

/**
 * Custom React hook to automatically persist and retrieve user-specific
 * audit log filter preferences from browser localStorage across reloads and sessions.
 */
export function useAuditLogFilters<T extends AuditLogFilterState>(
  keyPrefix: string,
  initialFilters: T
) {
  const { user } = useAuth();
  const userAccountIdentifier = user?.email || user?.id || 'default_user';
  const storageKey = `verdantiq_audit_filters_${keyPrefix}_${userAccountIdentifier}`;

  const [filters, setFilters] = useState<T>(initialFilters);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Restore filter state from localStorage on mount or when user account changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFilters((prev) => ({ ...prev, ...parsed }));
        setIsSaved(true);
      }
    } catch (e) {
      console.warn('Failed to parse saved audit log filter preferences from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Persist updated filter state to localStorage whenever filters change after initial mount
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters));
      setIsSaved(true);
    } catch (e) {
      console.warn('Failed to save audit log filter preferences to localStorage:', e);
    }
  }, [filters, isLoaded, storageKey]);

  const updateFilter = <K extends keyof T>(field: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    try {
      localStorage.removeItem(storageKey);
      setIsSaved(false);
    } catch (e) {
      console.warn('Failed to clear audit log filter preferences from localStorage:', e);
    }
  };

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    isLoaded,
    isSaved,
    storageKey,
    userAccountIdentifier,
  };
}
