import { NIA } from './palette';

/** Nia: thoughtful green turtle with round glasses. Fixed silhouette and palette. */
export function Nia({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Nia, a thoughtful green turtle wearing round glasses"
    >
      <path d="M8 96 A40 40 0 0 1 88 96 Z" fill={NIA.shell} />
      <path d="M22 96 A26 26 0 0 1 74 96" fill="none" stroke={NIA.skinDeep} strokeWidth="3" />
      <circle cx="48" cy="46" r="26" fill={NIA.skin} />
      <circle cx="38" cy="44" r="4" fill={NIA.glasses} />
      <circle cx="58" cy="44" r="4" fill={NIA.glasses} />
      <circle cx="38" cy="44" r="10" fill="none" stroke={NIA.glasses} strokeWidth="3" />
      <circle cx="58" cy="44" r="10" fill="none" stroke={NIA.glasses} strokeWidth="3" />
      <line x1="28" y1="42" x2="23" y2="40" stroke={NIA.glasses} strokeWidth="3" strokeLinecap="round" />
      <line x1="68" y1="42" x2="73" y2="40" stroke={NIA.glasses} strokeWidth="3" strokeLinecap="round" />
      <path d="M40 60 Q48 66 56 60" fill="none" stroke={NIA.skinDeep} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
