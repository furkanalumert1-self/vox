"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import appConfig from "@/app.config";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

/** The dark cockpit top nav: logo + tab nav + search + bell + number + user. */
export function TopNav() {
  const pathname = usePathname();
  const { t, lang } = useLang();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-1 px-3 sm:px-4">
        {/* Left: brand */}
        <Link href="/dashboard" className="mr-2 flex items-center">
          <Logo />
        </Link>

        {/* Tab nav */}
        <nav className="hidden items-center lg:flex">
          {appConfig.nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon name={item.icon} className="h-3.5 w-3.5" />
                {t(item.label)}
                {active && <span className="absolute inset-x-2 -bottom-[7px] h-0.5 rounded-full bg-violet" />}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Search */}
          <div className="hidden h-8 w-56 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[13px] text-muted-foreground xl:flex">
            <Icon name="search" className="h-3.5 w-3.5" />
            <span>{lang === "tr" ? "Arama veya ajan ara…" : "Search calls or agents…"}</span>
            <kbd className="ml-auto rounded border border-border bg-muted px-1.5 text-[10px] font-semibold">/</kbd>
          </div>

          <LanguageToggle className="hidden sm:inline-flex" />

          <button
            aria-label="Alerts"
            className="relative grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon name="bell" className="h-[17px] w-[17px]" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet ring-2 ring-background" />
          </button>

          {/* Active number pill */}
          <span className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[12.5px] font-semibold sm:inline-flex">
            <Icon name="phone" className="h-3.5 w-3.5 text-violet" />
            <span className="tabular-nums">+1 (415) 555-0100</span>
          </span>

          {/* User pill */}
          <Link
            href="/settings"
            className="flex items-center gap-1.5 rounded-md border border-border bg-card py-1 pl-1 pr-2 text-[13px] font-medium transition-colors hover:bg-muted"
          >
            <span className="grid h-6 w-6 place-items-center rounded bg-violet-soft font-mono text-[11px] font-bold text-violet">AJ</span>
            <span className="hidden sm:inline">Alex</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
