import Link from "next/link";
import type { ReactNode } from "react";

import { CartCountBadge } from "@/components/cart/cart-count-badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { siteConfig } from "@/lib/site";

type AuthShellProps = {
  children: ReactNode;
  navigation?: Array<{ href: string; label: string }>;
  centerBrand?: boolean;
};

export function AuthShell({ children, navigation, centerBrand = false }: AuthShellProps) {
  const headerNavigation =
    navigation && navigation.length > 0
      ? navigation
      : [
          { href: "/shop", label: "Shop" },
          { href: "/collections", label: "Collections" },
          { href: "/our-story", label: "About" }
        ];

  return (
    <main className={`auth-page${centerBrand ? " auth-page-center" : ""}`}>
      <header className="archive-header auth-header">
        <Link className="archive-brand auth-brand" href="/">
          <BrandLogo className="brand-logo brand-logo-header" priority width={220} />
        </Link>
        <nav className="archive-nav auth-nav" aria-label="Primary">
          {headerNavigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="archive-actions auth-actions" aria-label="Quick actions">
          <Link aria-label="Search" href="/search">
            <span className="icon-search" />
          </Link>
          <Link aria-label="Account" href="/account">
            <span className="icon-user" />
          </Link>
          <Link aria-label="Cart" href="/cart">
            <span className="icon-bag" />
            <CartCountBadge />
          </Link>
          <Link aria-label="Close authentication" className="auth-close" href="/">
            <span />
            <span />
          </Link>
        </div>
      </header>

      {children}

      <footer className="auth-footer">
        <div className="auth-footer-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/contact">Contact Boutique</Link>
        </div>
        <p>© 2026 {siteConfig.name}. Preserving artistry.</p>
      </footer>
    </main>
  );
}
