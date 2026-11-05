import { MILO } from './palette';

/** Milo: curious young auburn fox in a blue vest. Fixed silhouette and palette. */
export function Milo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Milo, a young auburn fox wearing a blue vest"
    >
      <polygon points="18,46 26,10 46,32" fill={MILO.furDeep} />
      <polygon points="78,46 70,10 50,32" fill={MILO.furDeep} />
      <polygon points="24,38 28,20 40,32" fill={MILO.cream} />
      <polygon points="72,38 68,20 56,32" fill={MILO.cream} />
      <ellipse cx="48" cy="52" rx="30" ry="26" fill={MILO.fur} />
      <circle cx="36" cy="48" r="4.5" fill={MILO.nose} />
      <circle cx="60" cy="48" r="4.5" fill={MILO.nose} />
      <circle cx="37.5" cy="46.5" r="1.5" fill="#ffffff" />
      <circle cx="61.5" cy="46.5" r="1.5" fill="#ffffff" />
      <ellipse cx="48" cy="62" rx="14" ry="10" fill={MILO.cream} />
      <ellipse cx="48" cy="58" rx="4" ry="3" fill={MILO.nose} />
      <path d="M22 96 L30 74 L42 74 L42 96 Z" fill={MILO.vest} />
      <path d="M74 96 L66 74 L54 74 L54 96 Z" fill={MILO.vest} />
      <rect x="42" y="74" width="12" height="22" fill={MILO.vestDeep} />
    </svg>
  );
}
