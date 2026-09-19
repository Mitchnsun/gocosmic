import { afterEach, beforeEach, vi } from 'vitest';

import { clearStoredPlanCode, PLAN_STORAGE_KEY, readStoredPlanCode, storePlanCode } from '@/lib/pricing/plan-storage';

const CODE = 'website~showcase~p2~u3~domain.email~fr';

describe('plan storage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('round-trips a plan code', () => {
    storePlanCode(CODE);

    expect(window.sessionStorage.getItem(PLAN_STORAGE_KEY)).toBe(CODE);
    expect(readStoredPlanCode()).toBe(CODE);
  });

  it('reads null when nothing is stored', () => {
    expect(readStoredPlanCode()).toBeNull();
  });

  it.each(['not-a-plan', 'website~showcase~p9~u-~-~fr', 'website~showcase~p0~u-~email.domain~fr'])(
    'reads null for the invalid or non-canonical value %s',
    (value) => {
      window.sessionStorage.setItem(PLAN_STORAGE_KEY, value);

      expect(readStoredPlanCode()).toBeNull();
    }
  );

  it('clears the stored plan', () => {
    storePlanCode(CODE);
    clearStoredPlanCode();

    expect(window.sessionStorage.getItem(PLAN_STORAGE_KEY)).toBeNull();
  });

  it('tolerates a blocked storage', () => {
    const blocked = () => {
      throw new Error('blocked');
    };
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(blocked);

    expect(() => storePlanCode(CODE)).not.toThrow();
    expect(readStoredPlanCode()).toBeNull();
    expect(() => clearStoredPlanCode()).not.toThrow();
  });
});
