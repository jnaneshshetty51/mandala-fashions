const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { data: Product[] };
    return payload.data;
  } catch {
    return [];
  }
}
