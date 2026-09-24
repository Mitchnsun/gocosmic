'use client';

import { useCallback, useEffect, useState } from 'react';

import { parseProjectFilter, type ProjectFilter } from './ProjectGrid.utils';

const QUERY_KEY = 'type';

/**
 * Active project filter, mirrored in the optional `?type=` query parameter so a
 * filtered list can be shared. The URL is read once on mount and rewritten in
 * place, without adding history entries.
 */
export function useProjectFilter() {
  const [filter, setFilterState] = useState<ProjectFilter>('all');

  useEffect(() => {
    setFilterState(parseProjectFilter(new URLSearchParams(window.location.search).get(QUERY_KEY)));
  }, []);

  const setFilter = useCallback((next: ProjectFilter) => {
    setFilterState(next);
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete(QUERY_KEY);
    else url.searchParams.set(QUERY_KEY, next);
    window.history.replaceState(window.history.state, '', url);
  }, []);

  return { filter, setFilter };
}
