import { useId, type SVGProps } from "react";

type CogniMarkProps = SVGProps<SVGSVGElement> & {
  size?: number;
  tile?: boolean;
  title?: string;
};

export function CogniMark({
  size = 64,
  tile = true,
  title = "Cogni brand mark",
  ...props
}: CogniMarkProps) {
  const id = useId().replace(/:/g, "");
  const tileId = `cogni-tile-${id}`;
  const accentId = `cogni-accent-${id}`;
  const strokeId = `cogni-stroke-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={tileId} x1="9" y1="7" x2="55" y2="57" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBF8F2" />
          <stop offset="52%" stopColor="#F3ECDD" />
          <stop offset="100%" stopColor="#E8D9BD" />
        </linearGradient>
        <linearGradient id={accentId} x1="34" y1="21" x2="43" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DABD8A" />
          <stop offset="100%" stopColor="#B8935A" />
        </linearGradient>
        <linearGradient id={strokeId} x1="18" y1="15" x2="48" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#223A63" />
          <stop offset="100%" stopColor="#15294A" />
        </linearGradient>
      </defs>

      {tile ? (
        <>
          <rect x="4" y="4" width="56" height="56" rx="18" fill={`url(#${tileId})`} />
          <rect x="4.75" y="4.75" width="54.5" height="54.5" rx="17.25" stroke="rgba(21, 41, 74, 0.11)" />
          <path
            d="M13 10.5H44.5"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : null}

      <path
        d="M46.2 17.8C43.6 14.9 39.4 13.15 34.55 13.15C26.25 13.15 19.55 19.95 19.55 28.4C19.55 36.9 26.25 43.7 34.55 43.7C39.15 43.7 43.1 42.1 45.85 39.35"
        stroke={`url(#${strokeId})`}
        strokeWidth="6.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M28.5 44.6H47.1"
        stroke="#15294A"
        strokeOpacity="0.14"
        strokeWidth="2.1"
        strokeLinecap="round"
      />

      <rect x="29.3" y="33.6" width="4.1" height="10.9" rx="2.05" fill="#294675" />
      <rect x="36.35" y="28.45" width="4.1" height="16.05" rx="2.05" fill={`url(#${accentId})`} />
      <rect x="43.4" y="22.25" width="4.1" height="22.25" rx="2.05" fill="#294675" />

      <circle cx="46.2" cy="18.1" r="2.15" fill="#C19B5F" />
    </svg>
  );
}
