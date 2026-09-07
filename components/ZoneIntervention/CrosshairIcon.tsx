export const CrosshairIcon = () => (
  <svg
    width={15}
    height={15}
    viewBox="0 0 15 15"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.25}
    className="text-aerospace"
    aria-hidden="true">
    <circle cx={7.5} cy={7.5} r={3.5} />
    {/* top tick */}
    <line x1={7.5} y1={0.5} x2={7.5} y2={2.5} />
    {/* bottom tick */}
    <line x1={7.5} y1={12.5} x2={7.5} y2={14.5} />
    {/* left tick */}
    <line x1={0.5} y1={7.5} x2={2.5} y2={7.5} />
    {/* right tick */}
    <line x1={12.5} y1={7.5} x2={14.5} y2={7.5} />
  </svg>
);
