import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

/**
 * Vox logomark — a bespoke inline-SVG mark: a soundwave / voice equalizer held
 * inside a ringed circle (a phone-pulse), rendered in electric violet on
 * near-black. The center bars read as both a waveform and a "V". No image files
 * needed; public/logo.svg + app/icon.svg mirror this for OG/favicon/setup.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="vox-mark" x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(72% 0.2 290)" />
          <stop offset="1" stopColor="oklch(58% 0.24 305)" />
        </linearGradient>
      </defs>
      {/* phone-pulse ring */}
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="url(#vox-mark)"
        strokeWidth="2"
        fill="oklch(66% 0.22 295 / 0.07)"
      />
      {/* inner soundwave / equalizer — bars rise then fall, forming a voiced "V" */}
      <g stroke="url(#vox-mark)" strokeWidth="2.4" strokeLinecap="round">
        <line x1="9.5" y1="13.5" x2="9.5" y2="18.5" />
        <line x1="13" y1="10" x2="13" y2="22" />
        <line x1="16" y1="12.5" x2="16" y2="19.5" />
        <line x1="19" y1="8.5" x2="19" y2="23.5" />
        <line x1="22.5" y1="13.5" x2="22.5" y2="18.5" />
      </g>
    </svg>
  );
}

/**
 * Brand mark + wordmark. `onDark` keeps the API compatible with the base kit,
 * but Vox is dark-first either way.
 */
export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {withWordmark && (
        <span className="font-display text-[17px] font-bold tracking-tight text-foreground">
          {appConfig.name}
        </span>
      )}
    </span>
  );
}
