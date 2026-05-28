export function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/\S+)/);
  return parts.map((part, i) => {
    if (!part.startsWith('http://') && !part.startsWith('https://')) return part;
    const clean = part.replace(/[.,;:)]+$/, '');
    const trailing = part.slice(clean.length);
    return (
      <span key={`${clean}-${i}`}>
        <a href={clean} target="_blank" rel="noopener noreferrer" className="underline transition hover:text-blue-300">
          {clean}
        </a>
        {trailing}
      </span>
    );
  });
}
