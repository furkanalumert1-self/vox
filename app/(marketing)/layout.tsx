"use client";

import Link from "next/link";
import { useState } from "react";
import appConfig from "@/app.config";
import { Logo, LogoMark } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { label: { tr: "Özellikler", en: "Features" }, href: "#features" },
    { label: { tr: "Nasıl çalışır", en: "How it works" }, href: "#how" },
    { label: { tr: "Fiyatlar", en: "Pricing" }, href: "#pricing" },
    { label: { tr: "Dokümanlar", en: "Docs" }, href: "#faq" },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <nav className="ml-8 hidden items-center gap-6 text-[13.5px] font-medium text-muted-foreground md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label[lang]}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle className="mr-1" />
            <Link
              href="/login"
              className="hidden rounded-md px-3 py-1.5 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              {lang === "tr" ? "Giriş yap" : "Sign in"}
            </Link>
            <Link
              href="/signup"
              className="glow-pulse inline-flex items-center gap-1.5 rounded-md border border-violet/50 bg-violet-soft px-3 py-1.5 text-[13.5px] font-semibold text-violet transition-colors hover:border-violet/80 hover:bg-violet/15"
            >
              <PhoneGlyph />
              {lang === "tr" ? "Bir numara al" : "Get a number"}
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
                {l.label[lang]}
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="flex-1">{children}</div>

      <SiteFooter />
    </div>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function SiteFooter() {
  const { lang } = useLang();
  const cols: { title: string; items: string[] }[] = [
    { title: lang === "tr" ? "Ürün" : "Product", items: [lang === "tr" ? "Aramalar" : "Calls", lang === "tr" ? "Ajanlar" : "Agents", lang === "tr" ? "Takvim" : "Calendar", "API"] },
    { title: lang === "tr" ? "Kullanım" : "Use cases", items: [lang === "tr" ? "Klinikler" : "Clinics", lang === "tr" ? "Emlak" : "Real estate", lang === "tr" ? "Restoranlar" : "Restaurants", lang === "tr" ? "Ajanslar" : "Agencies"] },
    { title: lang === "tr" ? "Şirket" : "Company", items: [lang === "tr" ? "Hakkımızda" : "About", "Blog", lang === "tr" ? "Kariyer" : "Careers", lang === "tr" ? "İletişim" : "Contact"] },
    { title: lang === "tr" ? "Yasal" : "Legal", items: [lang === "tr" ? "Şartlar" : "Terms", lang === "tr" ? "Gizlilik" : "Privacy", "DPA"] },
  ];
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              {lang === "tr"
                ? "İnsan gibi konuşan, hiçbir aramayı kaçırmayan AI sesli telefon ajanları."
                : "AI voice phone agents that sound human and never miss a call."}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {["X", "TG", "LI", "GH"].map((s) => (
                <span key={s} className="grid h-7 w-7 place-items-center rounded-md border border-border text-[10px] font-semibold text-muted-foreground transition-colors hover:border-violet/50 hover:text-foreground">{s}</span>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.items.map((it) => (
                  <li key={it}><a href="#" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">{it}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <LogoMark className="h-4 w-4" />
            © {new Date().getFullYear()} {appConfig.name} · {appConfig.domain}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">
            {lang === "tr" ? "İnsan gibi konuşur. Hiçbir aramayı kaçırmaz." : "Sounds human. Never misses a call."}
          </p>
        </div>
      </div>
    </footer>
  );
}
