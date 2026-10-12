interface JsonLdProps {
  /** Unique id of the script element. */
  scriptKey: string;
  /** The schema.org object; keys set to `undefined` are left out. */
  data: Record<string, unknown>;
}

/** A schema.org block for search engines. `<` is escaped so no value can close the script element. */
export function JsonLd({ scriptKey, data }: JsonLdProps) {
  return (
    <script
      id={scriptKey}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
