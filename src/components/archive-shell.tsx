import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { CartCountBadge } from "@/components/cart/cart-count-badge";
import { EmailCaptureForm } from "@/components/forms/email-capture-form";
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

function FooterSocialIcon({ label }: { label: string }) {
  if (label.toLowerCase().includes("whatsapp")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M19.05 4.94A9.86 9.86 0 0 0 12 2a9.94 9.94 0 0 0-8.6 14.92L2 22l5.23-1.37A9.94 9.94 0 1 0 19.05 4.94ZM12 20.1a8.04 8.04 0 0 1-4.1-1.12l-.3-.18-3.1.81.83-3.02-.2-.31A8.04 8.04 0 1 1 12 20.1Zm4.42-6.03c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06a6.54 6.54 0 0 1-1.93-1.19 7.19 7.19 0 0 1-1.33-1.66c-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.46-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.5.58.18 1.1.15 1.52.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    );
  }

  if (label.toLowerCase().includes("lookbook")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.75 1.55a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12.02 2a8.2 8.2 0 0 0-2.58 15.98c-.04-.34-.07-.87.02-1.25.08-.33.54-2.3.54-2.3s-.14-.29-.14-.72c0-.67.39-1.18.88-1.18.42 0 .62.31.62.69 0 .42-.27 1.04-.4 1.62-.12.49.24.88.72.88.86 0 1.52-.91 1.52-2.22 0-1.16-.84-1.98-2.04-1.98-1.39 0-2.2 1.04-2.2 2.12 0 .42.16.87.37 1.12.04.05.04.1.03.16l-.15.61c-.02.1-.08.12-.18.07-.69-.32-1.12-1.33-1.12-2.14 0-1.74 1.26-3.34 3.64-3.34 1.91 0 3.4 1.36 3.4 3.19 0 1.9-1.2 3.43-2.87 3.43-.56 0-1.09-.29-1.27-.64l-.34 1.29c-.12.47-.45 1.06-.67 1.42.5.15 1.03.23 1.59.23A8.2 8.2 0 1 0 12.02 2Z" />
    </svg>
  );
}

export function ArchiveShell({ children, activeNav = "shop" }: ArchiveShellProps) {
  const currentYear = new Date().getFullYear();

  return (
    <main className="archive-page">
      <header className="archive-header">
        <Link className="archive-brand" href="/">
          <Image
            alt="Mandala logo"
            className="brand-logo brand-logo-header"
            height={136}
            priority
            src="/homepage-assets/mandala.png"
            width={210}
          />
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
            <Image
              alt="Mandala footer logo"
              className="brand-logo"
              height={162}
              src="/homepage-assets/mandala.png"
              width={250}
            />
          </Link>
          <p>{siteConfig.footerCopy}</p>
          <div className="footer-socials" aria-label="Social links">
            {socialShortcutLinks.map((item) => (
              <Link href={item.href} aria-label={item.label} key={item.href} title={item.label}>
                <FooterSocialIcon label={item.label} />
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
