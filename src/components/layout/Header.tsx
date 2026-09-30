"use client";

import type { SVGProps } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { LogoutButton } from "./LogoutButton";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/trips", key: "trips" },
  { href: "/services", key: "services" },
  { href: "/contact", key: "contact" },
] as const;

function LogInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M11 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
      <path d="M3.5 12h11.25M11 8.25 14.75 12 11 15.75" />
    </svg>
  );
}

function LogOutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M13 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="M20.5 12H9.25M13 8.25 9.25 12l3.75 3.75" />
    </svg>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const { user } = useAuth();
  const { open } = useLoginModal();

  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          {/* Full logo (desktop) vs. small mark (mobile) — swap in the real
              asset once provided; placeholder wordmark for now. */}
          <span className="hidden text-headline-sm md:inline">ΑΛΛΟΥ</span>
          <span className="text-headline-sm md:hidden">Α</span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-body-md hover:text-primary">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          {user ? (
            <>
              <div className="hidden items-center gap-4 md:flex">
                <Link href="/account" className="text-body-md hover:text-primary">
                  {t("myTrips")}
                </Link>
                <LogoutButton className="text-body-md text-ink-muted hover:text-ink" />
              </div>
              <LogoutButton className="text-ink-muted hover:text-ink md:hidden">
                <LogOutIcon className="h-5 w-5" />
              </LogoutButton>
            </>
          ) : (
            <>
              <div className="hidden items-center gap-4 md:flex">
                <button type="button" onClick={() => open({ tab: "login" })} className="text-body-md hover:text-primary">
                  {t("logIn")}
                </button>
                <ButtonLink href="/trips" size="sm">
                  {t("browseTrips")}
                </ButtonLink>
              </div>
              <button
                type="button"
                onClick={() => open({ tab: "login" })}
                aria-label={t("logIn")}
                className="text-ink-muted hover:text-ink md:hidden"
              >
                <LogInIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
