import { BannerStatus } from "@prisma/client";

import { prisma } from "@/server/db";

export type CreateBannerInput = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  href?: string;
  placement: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  startsAt?: string;
  endsAt?: string;
};

export type UpdateBannerInput = Partial<CreateBannerInput>;

export async function createBanner(input: CreateBannerInput) {
  return prisma.banner.create({
    data: {
      title: input.title,
      subtitle: input.subtitle,
      imageUrl: input.imageUrl,
      href: input.href,
      placement: input.placement,
      status: input.status ? BannerStatus[input.status] : BannerStatus.DRAFT,
      startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
      endsAt: input.endsAt ? new Date(input.endsAt) : undefined
    }
  });
}

export async function updateBanner(id: string, input: UpdateBannerInput) {
  return prisma.banner.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.subtitle !== undefined && { subtitle: input.subtitle }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      ...(input.href !== undefined && { href: input.href }),
      ...(input.placement !== undefined && { placement: input.placement }),
      ...(input.status !== undefined && { status: BannerStatus[input.status] }),
      ...(input.startsAt !== undefined && { startsAt: new Date(input.startsAt) }),
      ...(input.endsAt !== undefined && { endsAt: new Date(input.endsAt) })
    }
  });
}

export async function deleteBanner(id: string) {
  return prisma.banner.delete({ where: { id } });
}

export async function publishBanner(id: string) {
  return prisma.banner.update({
    where: { id },
    data: { status: BannerStatus.PUBLISHED }
  });
}

export async function unpublishBanner(id: string) {
  return prisma.banner.update({
    where: { id },
    data: { status: BannerStatus.DRAFT }
  });
}

export async function getPublishedBanners(placement?: string): Promise<
  Array<{
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string | null;
    href: string | null;
    placement: string;
  }>
> {
  const now = new Date();

  const banners = await prisma.banner.findMany({
    where: {
      status: BannerStatus.PUBLISHED,
      ...(placement ? { placement } : {}),
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }
      ]
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      imageUrl: true,
      href: true,
      placement: true
    },
    orderBy: { updatedAt: "desc" }
  });

  return banners;
}
