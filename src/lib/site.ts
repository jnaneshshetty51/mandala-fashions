export const siteConfig = {
  name: "Mandala Fashions",
  description:
    "Mandala Fashions is a saree boutique for bridal, festive, and everyday Indian wear, with collections, lookbooks, styling guidance, and customer support in one polished storefront.",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  footerCopy:
    "Mandala Fashions curates bridal, festive, and everyday sarees with boutique support, thoughtful styling help, and heritage-led storytelling."
};

export const footerStudioLinks = [
  { href: "/our-story", label: "Our Story" },
  { href: "/artisanship", label: "Artisanship" },
  { href: "/contact", label: "Contact Us" }
];

export const footerDiscoverLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbooks", label: "Lookbooks" },
  { href: "/style-guide", label: "Style Guide" },
  { href: "/offers", label: "Offers" }
];

export const footerMetaLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/site-map", label: "Sitemap" }
];

export const socialShortcutLinks = [
  { href: "/whatsapp-assist", label: "WhatsApp Assist", shortLabel: "WA" },
  { href: "/lookbooks", label: "Lookbooks", shortLabel: "LB" },
  { href: "/style-guide", label: "Style Guide", shortLabel: "SG" }
];

export const siteDirectory = [
  {
    title: "Shop",
    links: [
      { href: "/", label: "Home" },
      { href: "/shop", label: "Shop All" },
      { href: "/collections", label: "Collections" },
      { href: "/offers", label: "Offers & Deals" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Cart" },
      { href: "/checkout", label: "Checkout" }
    ]
  },
  {
    title: "Editorial",
    links: [
      { href: "/lookbooks", label: "Lookbooks" },
      { href: "/style-guide", label: "Style Guide" },
      { href: "/our-story", label: "Our Story" },
      { href: "/artisanship", label: "Artisanship" },
      { href: "/custom-services", label: "Custom Services" }
    ]
  },
  {
    title: "Support",
    links: [
      { href: "/support", label: "Support Centre" },
      { href: "/faq", label: "FAQ" },
      { href: "/track-order", label: "Track Order" },
      { href: "/returns-request", label: "Returns Request" },
      { href: "/whatsapp-assist", label: "WhatsApp Assist" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "Policies",
    links: [
      { href: "/shipping-policy", label: "Shipping Policy" },
      { href: "/refund-policy", label: "Return & Refund Policy" },
      { href: "/shipping-returns", label: "Shipping & Returns" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/site-map", label: "Sitemap" }
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "Account Overview" },
      { href: "/account/orders", label: "Orders" },
      { href: "/account/addresses", label: "Addresses" },
      { href: "/account/profile", label: "Profile" },
      { href: "/auth/sign-in", label: "Sign In" },
      { href: "/auth/sign-up", label: "Create Account" }
    ]
  }
] as const;
