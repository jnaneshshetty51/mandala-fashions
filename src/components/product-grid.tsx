type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
};

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="product-card">
        <div className="product-copy">
          <h3>No products yet</h3>
          <p>
            Seed the database through the backend API and your first collection will appear here
            automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div
            className="product-image"
            style={
              product.imageUrl
                ? {
                    backgroundImage: `url(${product.imageUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                  }
                : undefined
            }
          />
          <div className="product-copy">
            <header>
              <h3>{product.name}</h3>
              <span className="price">${product.price.toFixed(2)}</span>
            </header>
            <p>{product.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
