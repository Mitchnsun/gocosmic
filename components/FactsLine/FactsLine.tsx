/** One entry of the mono facts line, e.g. `Dès 10€` + `/ mois`. */
export interface Fact {
  highlight: string;
  text: string;
}

interface FactsLineProps {
  facts: Fact[];
}

/** Mono facts line closing a hero: a highlighted figure followed by its label. */
export const FactsLine = ({ facts }: FactsLineProps) => (
  <ul className="border-line text-fg-3 text-2xs flex flex-wrap gap-x-10 gap-y-3 border-t pt-6 font-mono tracking-[0.16em] uppercase">
    {facts.map((fact) => (
      <li key={fact.highlight}>
        <span className="text-fg">{fact.highlight}</span> {fact.text}
      </li>
    ))}
  </ul>
);
