import Link from "next/link";
import type { ReactNode } from "react";

import { CartCountBadge } from "@/components/cart/cart-count-badge";
import { EmailCaptureForm } from "@/components/forms/email-capture-form";
import { BrandLogo } from "@/components/ui/brand-logo";
import { assistanceLinks } from "@/lib/archive-data";
import {
  footerDiscoverLinks,
  footerMetaLinks,
  footerStudioLinks,
  siteConfig,
  socialShortcutLinks
} from "@/lib/site";

type ArchiveShellProps = {
  children: ReactNode;
  activeNav?: "shop" | "collections" | "about";
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  crumb: string;
  intro?: string;
  actions?: ReactNode;
};

export function ArchiveShell({ children, activeNav = "shop" }: ArchiveShellProps) {
  const currentYear = new Date().getFullYear();

  return (
    <main className="archive-page">
      <header className="archive-header">
        <Link className="archive-brand" href="/">
          <BrandLogo className="brand-logo brand-logo-header" priority width={220} />
        </Link>
        <nav className="archive-nav" aria-label="Primary">
          <Link className={activeNav === "shop" ? "is-active" : undefined} href="/shop">
            Shop
          </Link>
          <Link className={activeNav === "collections" ? "is-active" : undefined} href="/collections">
            Collections
          </Link>
          <Link className={activeNav === "about" ? "is-active" : undefined} href="/our-story">
            About
          </Link>
        </nav>
        <div className="archive-actions" aria-label="Quick actions">
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
        </div>
      </header>

      {children}

      <footer className="archive-footer" id="footer">
        <div className="footer-column footer-brand">
          <Link className="footer-brand-logo" href="/">
            <BrandLogo className="brand-logo" width={260} />
          </Link>
          <p>{siteConfig.footerCopy}</p>
          <div className="footer-socials" aria-label="Social links">
            {socialShortcutLinks.map((item) => (
              <Link href={item.href} aria-label={item.label} key={item.href} title={item.label}>
                {item.shortLabel}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h3>The Studio</h3>
          {footerStudioLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Discover</h3>
          {footerDiscoverLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Assistance</h3>
          {assistanceLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Newsletter</h3>
          <p>Join Mandala Fashions for seasonal releases.</p>
          <div className="footer-newsletter">
            <EmailCaptureForm
              buttonLabel="Join"
              placeholder="Email Address"
              source="footer"
              subject="Mandala newsletter signup"
            />
          </div>
        </div>
      </footer>

      <div className="footer-meta">
        <p>© {currentYear} Mandala Fashions. All rights reserved.</p>
        <div>
          {footerMetaLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export function PageHero({ eyebrow, title, crumb, intro, actions }: PageHeroProps) {
  return (
    <section className="archive-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">All Collections</Link>
        <span aria-hidden="true">›</span>
        <span>{crumb}</span>
      </div>
      {intro ? <p className="hero-intro">{intro}</p> : null}
      {actions ? <div className="hero-actions-row">{actions}</div> : null}
    </section>
  );
}

export function ProductCard({
  href,
  label,
  name,
  price,
  artClass,
  imageUrl
}: {
  href: string;
  label: string;
  name: string;
  price: string;
  artClass: string;
  imageUrl?: string | null;
}) {
  return (
    <article className="product-card">
      <Link
        className={`product-art ${artClass}`}
        href={href}
        style={
          imageUrl
            ? {
                backgroundImage: `url('${imageUrl}')`,
                backgroundPosition: "center",
                backgroundSize: "cover"
              }
            : undefined
        }
      >
        <span className="wishlist-pill" aria-hidden="true">
          <span className="heart-icon" />
        </span>
      </Link>
      <p className="product-label">{label}</p>
      <h2>
        <Link href={href}>{name}</Link>
      </h2>
      <p className="product-price">{price}</p>
    </article>
  );
}
