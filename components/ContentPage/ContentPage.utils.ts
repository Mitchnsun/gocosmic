/** HUD counter of a numbered section, e.g. `02 / 04`. */
export const formatCounter = (position: number, total: number) =>
  `${String(position).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
