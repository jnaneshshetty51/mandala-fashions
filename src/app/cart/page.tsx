import { ArchiveShell, PageHero } from "@/components/archive-shell";
import { CartPageView } from "@/components/cart/cart-page-view";

export default function CartPage() {
  return (
    <ArchiveShell activeNav="shop">
      <PageHero
        eyebrow="Review Selection"
        title="Cart"
        crumb="Order Summary"
        intro="Review your selected drapes, apply an offer, check delivery timing, and add finishing touches before checkout."
      />

      <CartPageView />
    </ArchiveShell>
  );
}
