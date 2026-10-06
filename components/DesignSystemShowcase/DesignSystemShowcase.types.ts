/** Sample texts of the showcase, translated by the page (`design-system.sample`). */
export interface ShowcaseSamples {
  primary: string;
  secondary: string;
  link: string;
  neutral: string;
  eyebrow: string;
  chip: string;
  chip_ok: string;
  name_label: string;
  name_placeholder: string;
  email_label: string;
  email_error: string;
  optional: string;
  checkbox: string;
  slider: string;
  cell: string;
}

/** Section titles and samples of one theme panel. */
export interface ShowcaseLabels {
  tokens: string;
  buttons: string;
  tags: string;
  fields: string;
  grid: string;
  sample: ShowcaseSamples;
}
