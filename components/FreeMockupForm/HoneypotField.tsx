'use client';

/**
 * Invisible trap field. Humans never see it, never tab into it and never fill
 * it; a bot that fills every input does, and the server action then drops the
 * request silently.
 */
export function HoneypotField() {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor="free-mockup-company">Company</label>
      <input id="free-mockup-company" type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
