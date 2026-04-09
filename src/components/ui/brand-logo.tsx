import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  width?: number;
  priority?: boolean;
};

export function BrandLogo({ className, width = 220, priority = false }: BrandLogoProps) {
  return (
    <Image
      alt="Mandala"
      className={className}
      height={158}
      priority={priority}
      src="/homepage-assets/brand-logo.jpeg"
      width={width}
    />
  );
}
