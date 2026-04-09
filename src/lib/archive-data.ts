export type ProductVariant = {
  name: string;
  note: string;
  price: string;
};

export type ArchiveProduct = {
  slug: string;
  label: string;
  name: string;
  price: string;
  originalPrice: string;
  discountLabel: string;
  artClass: string;
  imageUrl: string | null;
  galleryImages: string[];
  category: string;
  fabric: string;
  occasion: string;
  color: string;
  colorChoices: string[];
  variants: ProductVariant[];
  length: string;
  blouse: string;
  delivery: string;
  codNote: string;
  rating: string;
  reviews: number;
  note: string;
  description: string;
  details: string[];
  styling: string[];
  occasions: string[];
};

export const archiveProducts: ArchiveProduct[] = [
  {
    slug: "midnight-emerald-silk",
    label: "BANARASI HERITAGE",
    name: "Midnight Emerald Silk",
    price: "₹ 42,500",
    originalPrice: "₹ 51,000",
    discountLabel: "17% off",
    artClass: "art-emerald",
    imageUrl: "/homepage-assets/17201f45c513ea82a55888b3c7f63b12.jpg",
    galleryImages: [
      "/homepage-assets/17201f45c513ea82a55888b3c7f63b12.jpg",
      "/homepage-assets/b93301f842aed71f39492ba6d5bdd216.jpg",
      "/homepage-assets/7060f58d2c93c01f661f4e6ee0012645.jpg"
    ],
    category: "Bridal Sarees",
    fabric: "Silk",
    occasion: "Wedding",
    color: "Deep Green",
    colorChoices: ["Deep Green", "Wine", "Royal Blue"],
    variants: [
      { name: "Saree Only", note: "Pure Banarasi drape with unstitched blouse piece.", price: "₹ 42,500" },
      { name: "Saree + Fall & Pico", note: "Pre-finished drape for immediate wear.", price: "₹ 43,250" },
      { name: "Bridal Styling Bundle", note: "Includes blouse consultation and finishing guidance.", price: "₹ 44,900" }
    ],
    length: "5.5 metres",
    blouse: "Unstitched blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.8",
    reviews: 128,
    note: "Zari-woven border with a ceremonial drape.",
    description:
      "A jewel-toned Banarasi with antique zari motifs and a statement pallu designed for evening rituals and formal gatherings.",
    details: ["Handwoven silk body", "Antique gold zari border", "Blouse piece included"],
    styling: ["Pair with antique gold jewelry", "Best with a structured bridal blouse", "Ideal for evening ceremonies"],
    occasions: ["Wedding", "Reception", "Engagement"]
  },
  {
    slug: "heirloom-crimson",
    label: "ROYAL KANCHIPURAM",
    name: "The Heirloom Crimson",
    price: "₹ 58,000",
    originalPrice: "₹ 68,000",
    discountLabel: "15% off",
    artClass: "art-crimson",
    imageUrl: "/homepage-assets/b93301f842aed71f39492ba6d5bdd216.jpg",
    galleryImages: [
      "/homepage-assets/b93301f842aed71f39492ba6d5bdd216.jpg",
      "/homepage-assets/7060f58d2c93c01f661f4e6ee0012645.jpg",
      "/homepage-assets/363f2870e0392b285659524eb68ef9c0.jpg"
    ],
    category: "Wedding Sarees",
    fabric: "Silk",
    occasion: "Wedding",
    color: "Crimson",
    colorChoices: ["Crimson", "Maroon", "Rani Pink"],
    variants: [
      { name: "Classic Drape", note: "Traditional Kanchipuram with contrast blouse.", price: "₹ 58,000" },
      { name: "Temple Border Edit", note: "Enhanced zari finish and tassel detailing.", price: "₹ 59,500" },
      { name: "Ceremony Set", note: "Includes saree finishing and bridal blouse planning.", price: "₹ 61,200" }
    ],
    length: "5.5 metres",
    blouse: "Contrast blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.9",
    reviews: 94,
    note: "A bridal-forward weave with temple border detailing.",
    description:
      "A rich crimson Kanchipuram imagined for heirloom wardrobes, with a broad zari frame and a luminous ceremonial finish.",
    details: ["Traditional korvai join", "Heavy zari pallu", "Hand-finished tassels"],
    styling: ["Pair with temple jewelry", "Suited for bridal portraits", "Works with traditional gold blouses"],
    occasions: ["Wedding", "Temple Ceremony", "Family Celebration"]
  },
  {
    slug: "morning-mist-floral",
    label: "ETHEREAL ORGANZA",
    name: "Morning Mist Floral",
    price: "₹ 24,900",
    originalPrice: "₹ 29,500",
    discountLabel: "16% off",
    artClass: "art-floral",
    imageUrl: "/homepage-assets/6a2cbe5ce9b56f8aaf9e04935473d540.jpg",
    galleryImages: [
      "/homepage-assets/6a2cbe5ce9b56f8aaf9e04935473d540.jpg",
      "/homepage-assets/0a6485e6977f363e23f9f07ab63de243.jpg",
      "/homepage-assets/28b50087fef53ebe82680ed11d4eddcd.jpg"
    ],
    category: "Festive Sarees",
    fabric: "Organza",
    occasion: "Festive",
    color: "Ivory",
    colorChoices: ["Ivory", "Blush Pink", "Powder Blue"],
    variants: [
      { name: "Printed Organza", note: "Light festive drape with floral placement print.", price: "₹ 24,900" },
      { name: "Pearl Border Edit", note: "Soft embellished edge for occasion wear.", price: "₹ 25,650" },
      { name: "Gift-Ready Finish", note: "Includes luxe packaging and blouse suggestion card.", price: "₹ 26,400" }
    ],
    length: "5.5 metres",
    blouse: "Matching blouse fabric available separately",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.7",
    reviews: 76,
    note: "A painterly floral panel softened by sheer organza.",
    description:
      "Lightweight and expressive, this ivory organza balances airy translucence with a floral placement print inspired by archival botanical studies.",
    details: ["Sheer organza base", "Placement floral artwork", "Light gold selvedge"],
    styling: ["Pair with pearl jewelry", "Best with tonal blouse styling", "Perfect for daytime festive events"],
    occasions: ["Festive Lunch", "Day Wedding", "Celebration Dinner"]
  },
  {
    slug: "azure-geometric-drapes",
    label: "JAIPUR INDIGO",
    name: "Azure Geometric Drapes",
    price: "₹ 8,500",
    originalPrice: "₹ 10,000",
    discountLabel: "15% off",
    artClass: "art-indigo",
    imageUrl: "/homepage-assets/79c318b77172d6052bc1bb59bbda66d0.jpg",
    galleryImages: [
      "/homepage-assets/79c318b77172d6052bc1bb59bbda66d0.jpg",
      "/homepage-assets/48e700b0980637ac4cb1a5cd262e48da.jpg",
      "/homepage-assets/1f1049120cfa2eb983d11f1c76bbef2a.jpg"
    ],
    category: "Office Wear Sarees",
    fabric: "Cotton",
    occasion: "Casual",
    color: "Indigo",
    colorChoices: ["Indigo", "Slate Blue", "Charcoal"],
    variants: [
      { name: "Daily Wear", note: "Breathable cotton with attached running blouse.", price: "₹ 8,500" },
      { name: "Office Ready", note: "Includes fall finishing for weekday rotation.", price: "₹ 9,100" },
      { name: "Travel Edit", note: "Lightweight packable drape with wrinkle-easy finish.", price: "₹ 9,450" }
    ],
    length: "5.5 metres",
    blouse: "Running blouse fabric attached",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.6",
    reviews: 58,
    note: "Soft cotton geometry for relaxed daytime wear.",
    description:
      "Printed in layered indigo motifs, this cotton saree is made for quieter styling moments with a crisp fall and graphic border language.",
    details: ["Breathable cotton weave", "Natural indigo-inspired palette", "Easy everyday drape"],
    styling: ["Pair with silver jewelry", "Ideal for office or casual styling", "Works with sleeveless cotton blouses"],
    occasions: ["Office Wear", "Daily Wear", "Travel"]
  },
  {
    slug: "noir-starlight-georgette",
    label: "TWILIGHT CHIC",
    name: "Noir Starlight Georgette",
    price: "₹ 18,200",
    originalPrice: "₹ 22,000",
    discountLabel: "17% off",
    artClass: "art-noir",
    imageUrl: "/homepage-assets/28b50087fef53ebe82680ed11d4eddcd.jpg",
    galleryImages: [
      "/homepage-assets/28b50087fef53ebe82680ed11d4eddcd.jpg",
      "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg",
      "/homepage-assets/f90434c1a5c20058e8ef2e72123c40aa.jpg"
    ],
    category: "Party Wear Sarees",
    fabric: "Georgette",
    occasion: "Evening",
    color: "Black",
    colorChoices: ["Black", "Gunmetal", "Plum"],
    variants: [
      { name: "Cocktail Drape", note: "Fluid georgette with sequined border.", price: "₹ 18,200" },
      { name: "Evening Glam", note: "Extra embellished blouse recommendation included.", price: "₹ 19,100" },
      { name: "Reception Edit", note: "Styled for statement evening occasions.", price: "₹ 19,850" }
    ],
    length: "5.5 metres",
    blouse: "Sequined blouse option available",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.8",
    reviews: 88,
    note: "Dark fluidity punctuated with subtle shimmer.",
    description:
      "An all-black georgette for late-evening dressing, framed by a tonal embellished border that catches light without overwhelming the silhouette.",
    details: ["Fluid georgette body", "Sequined edge finish", "Soft evening drape"],
    styling: ["Pair with statement earrings", "Ideal for cocktail styling", "Works well with embellished blouses"],
    occasions: ["Party Wear", "Reception", "Evening Event"]
  },
  {
    slug: "saffron-earth-loom",
    label: "RAW TUSSAR",
    name: "Saffron Earth Loom",
    price: "₹ 31,400",
    originalPrice: "₹ 37,000",
    discountLabel: "15% off",
    artClass: "art-saffron",
    imageUrl: "/homepage-assets/624c40a6b367855afa0f700c361a1a84.jpg",
    galleryImages: [
      "/homepage-assets/624c40a6b367855afa0f700c361a1a84.jpg",
      "/homepage-assets/6761b750dbfae854650f47dc911f13af.jpg",
      "/homepage-assets/8351ae7a6e906f4174258dfe74bb817b.jpg"
    ],
    category: "Festive Sarees",
    fabric: "Tussar",
    occasion: "Festive",
    color: "Saffron",
    colorChoices: ["Saffron", "Burnt Orange", "Mustard Gold"],
    variants: [
      { name: "Raw Tussar Classic", note: "Textured body with contrast border.", price: "₹ 31,400" },
      { name: "Ceremony Finish", note: "Includes drape finishing and blouse swatch guidance.", price: "₹ 32,250" },
      { name: "Gifting Edit", note: "Boutique-wrapped festive presentation.", price: "₹ 32,900" }
    ],
    length: "5.5 metres",
    blouse: "Contrast blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.7",
    reviews: 63,
    note: "Textural warmth with a grounded woven border.",
    description:
      "A raw tussar story in harvest saffron, finished with a deep border and understated body texture for festive daytime dressing.",
    details: ["Raw tussar texture", "Contrast woven border", "Light ceremonial sheen"],
    styling: ["Pair with oxidized or matte gold jewelry", "Strong daytime festive option", "Balances minimal and rich styling"],
    occasions: ["Festive Gathering", "Puja", "Day Celebration"]
  },
  {
    slug: "rose-jharokha-organza",
    label: "FLORAL OCCASION",
    name: "Rose Jharokha Organza",
    price: "₹ 21,900",
    originalPrice: "₹ 26,000",
    discountLabel: "16% off",
    artClass: "art-floral",
    imageUrl: "/homepage-assets/0a6485e6977f363e23f9f07ab63de243.jpg",
    galleryImages: [
      "/homepage-assets/0a6485e6977f363e23f9f07ab63de243.jpg",
      "/homepage-assets/6a2cbe5ce9b56f8aaf9e04935473d540.jpg",
      "/homepage-assets/e16ac21a1135eb19efaa059440ebc4bd.jpg"
    ],
    category: "Day Wedding Sarees",
    fabric: "Organza",
    occasion: "Festive",
    color: "Blush Pink",
    colorChoices: ["Blush Pink", "Ivory", "Lavender"],
    variants: [
      { name: "Soft Organza", note: "Painterly floral print with lightweight drape.", price: "₹ 21,900" },
      { name: "Scallop Border Edit", note: "Delicate edging for elevated occasion styling.", price: "₹ 22,750" },
      { name: "Statement Blouse Pairing", note: "Includes curated blouse suggestions.", price: "₹ 23,400" }
    ],
    length: "5.5 metres",
    blouse: "Matching blouse fabric available separately",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.7",
    reviews: 71,
    note: "A soft floral organza designed for brunch weddings and festive day dressing.",
    description: "This airy organza saree balances romantic florals with easy movement, making it a versatile choice for haldi brunches, festive hosting, and destination celebrations.",
    details: ["Featherlight organza weave", "Floral placement print", "Delicate contrast border"],
    styling: ["Pair with pearl drops", "Ideal with a sleeveless blouse", "Best for daytime festive styling"],
    occasions: ["Haldi", "Brunch Wedding", "Festive Lunch"]
  },
  {
    slug: "moonstone-tissue-glow",
    label: "LUMINOUS TISSUE",
    name: "Moonstone Tissue Glow",
    price: "₹ 27,500",
    originalPrice: "₹ 32,000",
    discountLabel: "14% off",
    artClass: "art-floral",
    imageUrl: "/homepage-assets/e16ac21a1135eb19efaa059440ebc4bd.jpg",
    galleryImages: [
      "/homepage-assets/e16ac21a1135eb19efaa059440ebc4bd.jpg",
      "/homepage-assets/5fd233e1c32bba16b1a8ed6b31e221b9.jpg",
      "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg"
    ],
    category: "Reception Sarees",
    fabric: "Tissue",
    occasion: "Evening",
    color: "Champagne Gold",
    colorChoices: ["Champagne Gold", "Silver Beige", "Rose Gold"],
    variants: [
      { name: "Classic Tissue", note: "Lustrous body with subtle woven shimmer.", price: "₹ 27,500" },
      { name: "Cocktail Finish", note: "Enhanced drape setting for evening wear.", price: "₹ 28,250" },
      { name: "Occasion Styling Set", note: "Includes blouse and jewelry recommendations.", price: "₹ 29,100" }
    ],
    length: "5.5 metres",
    blouse: "Self blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.6",
    reviews: 54,
    note: "A luminous tissue saree with soft shine for cocktail evenings and receptions.",
    description: "Designed to catch light gently instead of overpowering a look, this tissue saree creates a refined silhouette for evening events and reception styling.",
    details: ["Tissue silk blend", "Subtle metallic sheen", "Evening-ready structure"],
    styling: ["Style with crystal jewelry", "Works with structured blouses", "Great for reception portraits"],
    occasions: ["Reception", "Cocktail", "Evening Event"]
  },
  {
    slug: "forest-zari-checks",
    label: "HANDLOOM CHECKS",
    name: "Forest Zari Checks",
    price: "₹ 14,800",
    originalPrice: "₹ 18,500",
    discountLabel: "20% off",
    artClass: "art-emerald",
    imageUrl: "/homepage-assets/363f2870e0392b285659524eb68ef9c0.jpg",
    galleryImages: [
      "/homepage-assets/363f2870e0392b285659524eb68ef9c0.jpg",
      "/homepage-assets/48e700b0980637ac4cb1a5cd262e48da.jpg",
      "/homepage-assets/4b67d111b152db43340542607f2e53d5.jpg"
    ],
    category: "Handloom Sarees",
    fabric: "Cotton Silk",
    occasion: "Office",
    color: "Forest Green",
    colorChoices: ["Forest Green", "Teal", "Bottle Green"],
    variants: [
      { name: "Handloom Classic", note: "Light zari checks with soft structure.", price: "₹ 14,800" },
      { name: "Workday Edit", note: "Easy drape finish for repeated wear.", price: "₹ 15,350" },
      { name: "Gifted Handloom", note: "Packaged for festive gifting.", price: "₹ 15,900" }
    ],
    length: "5.5 metres",
    blouse: "Running blouse fabric attached",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.5",
    reviews: 62,
    note: "A soft-structured check saree built for repeat wear with a polished finish.",
    description: "This cotton-silk check saree brings everyday elegance to office wear, family lunches, and understated festive moments without feeling overly ceremonial.",
    details: ["Cotton-silk blend", "Subtle zari check pattern", "Comfortable repeat drape"],
    styling: ["Perfect for office blouses", "Pair with oxidized gold jewelry", "Works for casual celebrations"],
    occasions: ["Office Wear", "Daily Wear", "Small Gatherings"]
  },
  {
    slug: "ruby-mehfil-banarasi",
    label: "BANARASI BROCADE",
    name: "Ruby Mehfil Banarasi",
    price: "₹ 38,900",
    originalPrice: "₹ 45,500",
    discountLabel: "15% off",
    artClass: "art-crimson",
    imageUrl: "/homepage-assets/7060f58d2c93c01f661f4e6ee0012645.jpg",
    galleryImages: [
      "/homepage-assets/7060f58d2c93c01f661f4e6ee0012645.jpg",
      "/homepage-assets/b93301f842aed71f39492ba6d5bdd216.jpg",
      "/homepage-assets/17201f45c513ea82a55888b3c7f63b12.jpg"
    ],
    category: "Banarasi Sarees",
    fabric: "Silk",
    occasion: "Wedding",
    color: "Ruby Red",
    colorChoices: ["Ruby Red", "Magenta", "Deep Maroon"],
    variants: [
      { name: "Classic Banarasi", note: "Brocade weave with rich border language.", price: "₹ 38,900" },
      { name: "Celebration Edit", note: "Enhanced pallu finish for larger events.", price: "₹ 39,850" },
      { name: "Bridal Trousseau Pick", note: "Curated as a trousseau-ready heirloom option.", price: "₹ 41,200" }
    ],
    length: "5.5 metres",
    blouse: "Contrast blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.8",
    reviews: 111,
    note: "A rich brocade Banarasi designed for sangeet nights and wedding gifting.",
    description: "With a jewel-toned base and ceremonial zari detailing, this Banarasi balances festive grandeur with a softer, boutique-led styling direction.",
    details: ["Brocade silk body", "Statement zari pallu", "Ceremonial color story"],
    styling: ["Pair with kundan jewelry", "Works for wedding guests", "Strong evening styling option"],
    occasions: ["Wedding", "Sangeet", "Reception"]
  },
  {
    slug: "ivory-lotus-chanderi",
    label: "CHANDERI LIGHT",
    name: "Ivory Lotus Chanderi",
    price: "₹ 16,500",
    originalPrice: "₹ 19,500",
    discountLabel: "15% off",
    artClass: "art-floral",
    imageUrl: "/homepage-assets/5fd233e1c32bba16b1a8ed6b31e221b9.jpg",
    galleryImages: [
      "/homepage-assets/5fd233e1c32bba16b1a8ed6b31e221b9.jpg",
      "/homepage-assets/e16ac21a1135eb19efaa059440ebc4bd.jpg",
      "/homepage-assets/6cebbd594cc4f4af475c3750c465da57.jpg"
    ],
    category: "Day Occasion Sarees",
    fabric: "Chanderi",
    occasion: "Festive",
    color: "Ivory",
    colorChoices: ["Ivory", "Butter Yellow", "Dusty Peach"],
    variants: [
      { name: "Light Chanderi", note: "Airy weave with woven lotus motifs.", price: "₹ 16,500" },
      { name: "Temple Visit Edit", note: "Easy drape for ceremonies and poojas.", price: "₹ 17,100" },
      { name: "Gifting Choice", note: "Elegant packaging for festive gifting.", price: "₹ 17,650" }
    ],
    length: "5.5 metres",
    blouse: "Matching blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.6",
    reviews: 49,
    note: "A refined chanderi with airy movement and subtle festive detailing.",
    description: "This ivory chanderi is designed for intimate ceremonies, temple visits, and graceful daytime dressing with a soft boutique finish.",
    details: ["Lightweight chanderi weave", "Subtle woven motif story", "Daytime-friendly structure"],
    styling: ["Pair with heritage studs", "Ideal for daytime events", "Works with pastel blouses"],
    occasions: ["Puja", "Temple Ceremony", "Day Celebration"]
  },
  {
    slug: "peacock-rhythm-soft-silk",
    label: "SOFT SILK EDIT",
    name: "Peacock Rhythm Soft Silk",
    price: "₹ 26,800",
    originalPrice: "₹ 31,500",
    discountLabel: "15% off",
    artClass: "art-indigo",
    imageUrl: "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg",
    galleryImages: [
      "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg",
      "/homepage-assets/f90434c1a5c20058e8ef2e72123c40aa.jpg",
      "/homepage-assets/8351ae7a6e906f4174258dfe74bb817b.jpg"
    ],
    category: "Soft Silk Sarees",
    fabric: "Soft Silk",
    occasion: "Party",
    color: "Peacock Blue",
    colorChoices: ["Peacock Blue", "Teal", "Midnight Blue"],
    variants: [
      { name: "Soft Silk Classic", note: "Fluid silk with modern festive movement.", price: "₹ 26,800" },
      { name: "Evening Border Edit", note: "Statement border finish for event wear.", price: "₹ 27,650" },
      { name: "Occasion Ready", note: "Includes finishing suggestions and blouse direction.", price: "₹ 28,500" }
    ],
    length: "5.5 metres",
    blouse: "Contrasting blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.7",
    reviews: 67,
    note: "A fluid soft silk that bridges festive glamour and easy drape comfort.",
    description: "Rich in tone but lighter in feel, this soft silk saree is made for birthday celebrations, cocktail functions, and elegant evening hosting.",
    details: ["Soft silk drape", "Light zari edging", "Event-ready fall"],
    styling: ["Pair with statement earrings", "Best for contemporary styling", "Great for cocktail events"],
    occasions: ["Party Wear", "Cocktail", "Celebration Dinner"]
  },
  {
    slug: "sunlit-mango-cotton",
    label: "SUMMER COTTON",
    name: "Sunlit Mango Cotton",
    price: "₹ 7,900",
    originalPrice: "₹ 9,500",
    discountLabel: "17% off",
    artClass: "art-saffron",
    imageUrl: "/homepage-assets/48e700b0980637ac4cb1a5cd262e48da.jpg",
    galleryImages: [
      "/homepage-assets/48e700b0980637ac4cb1a5cd262e48da.jpg",
      "/homepage-assets/79c318b77172d6052bc1bb59bbda66d0.jpg",
      "/homepage-assets/1f1049120cfa2eb983d11f1c76bbef2a.jpg"
    ],
    category: "Cotton Sarees",
    fabric: "Cotton",
    occasion: "Casual",
    color: "Mango Yellow",
    colorChoices: ["Mango Yellow", "Mustard", "Marigold"],
    variants: [
      { name: "Daily Cotton", note: "Breathable cotton for warm weather wear.", price: "₹ 7,900" },
      { name: "Commute Ready", note: "Light finishing for easy weekday use.", price: "₹ 8,350" },
      { name: "Travel Pack", note: "Simple fold-and-carry drape option.", price: "₹ 8,650" }
    ],
    length: "5.5 metres",
    blouse: "Running blouse fabric attached",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.5",
    reviews: 84,
    note: "A cheerful cotton drape made for heat, movement, and everyday ease.",
    description: "This summer cotton saree is designed for workdays, errands, and casual festive mornings when comfort matters as much as color.",
    details: ["Breathable cotton weave", "Warm-weather friendly", "Easy repeat styling"],
    styling: ["Works with printed blouses", "Pair with silver or terracotta jewelry", "Ideal for daily wear"],
    occasions: ["Daily Wear", "Office Wear", "Travel"]
  },
  {
    slug: "wine-velvet-border-georgette",
    label: "EVENING EDIT",
    name: "Wine Velvet Border Georgette",
    price: "₹ 19,600",
    originalPrice: "₹ 23,000",
    discountLabel: "15% off",
    artClass: "art-noir",
    imageUrl: "/homepage-assets/f90434c1a5c20058e8ef2e72123c40aa.jpg",
    galleryImages: [
      "/homepage-assets/f90434c1a5c20058e8ef2e72123c40aa.jpg",
      "/homepage-assets/28b50087fef53ebe82680ed11d4eddcd.jpg",
      "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg"
    ],
    category: "Evening Sarees",
    fabric: "Georgette",
    occasion: "Evening",
    color: "Wine",
    colorChoices: ["Wine", "Plum", "Black Cherry"],
    variants: [
      { name: "Velvet Border", note: "Evening georgette with plush border detail.", price: "₹ 19,600" },
      { name: "Reception Ready", note: "Enhanced finish for formal event styling.", price: "₹ 20,300" },
      { name: "Statement Look", note: "Includes blouse and jewelry styling notes.", price: "₹ 21,100" }
    ],
    length: "5.5 metres",
    blouse: "Sequined blouse option available",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.7",
    reviews: 73,
    note: "A moody evening saree framed by a velvet-touch border for added depth.",
    description: "Made for festive dinners and formal evenings, this georgette saree offers movement, drama, and a richer border story for more dressed-up occasions.",
    details: ["Fluid georgette base", "Velvet-touch border", "Evening-ready silhouette"],
    styling: ["Best with statement earrings", "Ideal for night events", "Works with embellished blouses"],
    occasions: ["Evening Event", "Reception", "Party Wear"]
  },
  {
    slug: "lotus-temple-kanchipuram",
    label: "TEMPLE SILK",
    name: "Lotus Temple Kanchipuram",
    price: "₹ 46,200",
    originalPrice: "₹ 54,000",
    discountLabel: "14% off",
    artClass: "art-crimson",
    imageUrl: "/homepage-assets/8351ae7a6e906f4174258dfe74bb817b.jpg",
    galleryImages: [
      "/homepage-assets/8351ae7a6e906f4174258dfe74bb817b.jpg",
      "/homepage-assets/17201f45c513ea82a55888b3c7f63b12.jpg",
      "/homepage-assets/b93301f842aed71f39492ba6d5bdd216.jpg"
    ],
    category: "Kanchipuram Sarees",
    fabric: "Silk",
    occasion: "Wedding",
    color: "Rani Pink",
    colorChoices: ["Rani Pink", "Crimson", "Lotus Red"],
    variants: [
      { name: "Temple Silk", note: "Classic korvai-inspired bridal silk.", price: "₹ 46,200" },
      { name: "Wedding Hall Edit", note: "Enhanced zari pallu and tassel finish.", price: "₹ 47,350" },
      { name: "Bridal Reserve", note: "Curated for wedding and muhurtham dressing.", price: "₹ 48,900" }
    ],
    length: "5.5 metres",
    blouse: "Contrast blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.9",
    reviews: 97,
    note: "A celebratory Kanchipuram silk with a bridal pink palette and temple-inspired detail.",
    description: "This silk saree carries the structure and ceremonial presence expected of a wedding drape, while keeping the palette bright, feminine, and portrait-ready.",
    details: ["Traditional silk body", "Korvai-inspired border", "Bridal pink palette"],
    styling: ["Pair with temple jewelry", "Ideal for muhurtham", "Strong bridal trousseau option"],
    occasions: ["Wedding", "Muhurtham", "Family Celebration"]
  },
  {
    slug: "misty-lavender-linen",
    label: "LINEN LIGHT",
    name: "Misty Lavender Linen",
    price: "₹ 9,800",
    originalPrice: "₹ 11,500",
    discountLabel: "15% off",
    artClass: "art-floral",
    imageUrl: "/homepage-assets/6cebbd594cc4f4af475c3750c465da57.jpg",
    galleryImages: [
      "/homepage-assets/6cebbd594cc4f4af475c3750c465da57.jpg",
      "/homepage-assets/5d8f38c792e2240d09e7f041ca1c06df.jpg",
      "/homepage-assets/79c318b77172d6052bc1bb59bbda66d0.jpg"
    ],
    category: "Linen Sarees",
    fabric: "Linen",
    occasion: "Office",
    color: "Lavender",
    colorChoices: ["Lavender", "Mauve", "Ash Rose"],
    variants: [
      { name: "Pure Linen", note: "Breathable office-ready weave.", price: "₹ 9,800" },
      { name: "Workweek Edit", note: "Designed for all-day meetings and movement.", price: "₹ 10,250" },
      { name: "Minimal Styling Set", note: "Includes tonal blouse pairing advice.", price: "₹ 10,700" }
    ],
    length: "5.5 metres",
    blouse: "Running blouse fabric attached",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.5",
    reviews: 56,
    note: "A breathable lavender linen that brings softness to office dressing.",
    description: "This understated linen saree is meant for professionals who want a calm palette, clean lines, and enough comfort for long workdays or travel-heavy schedules.",
    details: ["Pure linen body", "Lightweight structure", "Office-friendly palette"],
    styling: ["Best with silver jewelry", "Works with sleeveless blouses", "Ideal for calm daywear"],
    occasions: ["Office Wear", "Meetings", "Travel"]
  },
  {
    slug: "gilded-maroon-patola-print",
    label: "PATOLA INSPIRED",
    name: "Gilded Maroon Patola Print",
    price: "₹ 13,900",
    originalPrice: "₹ 16,500",
    discountLabel: "16% off",
    artClass: "art-crimson",
    imageUrl: "/homepage-assets/4b67d111b152db43340542607f2e53d5.jpg",
    galleryImages: [
      "/homepage-assets/4b67d111b152db43340542607f2e53d5.jpg",
      "/homepage-assets/624c40a6b367855afa0f700c361a1a84.jpg",
      "/homepage-assets/6761b750dbfae854650f47dc911f13af.jpg"
    ],
    category: "Festive Printed Sarees",
    fabric: "Silk Blend",
    occasion: "Festive",
    color: "Maroon",
    colorChoices: ["Maroon", "Brick Red", "Rust"],
    variants: [
      { name: "Printed Silk Blend", note: "Patola-inspired motif story for festive wear.", price: "₹ 13,900" },
      { name: "Celebration Finish", note: "Prepped for easy festive draping.", price: "₹ 14,450" },
      { name: "Gift Edit", note: "Includes boutique-ready festive packaging.", price: "₹ 14,900" }
    ],
    length: "5.5 metres",
    blouse: "Matching blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.6",
    reviews: 64,
    note: "A festive printed saree with deeper maroon tones and a woven-look pattern language.",
    description: "Inspired by classic patola stories, this silk-blend saree adds festive color and easier maintenance to family celebrations and occasion gifting.",
    details: ["Silk blend base", "Patola-inspired print", "Festive-ready contrast border"],
    styling: ["Pair with kundan studs", "Easy festive pick", "Works for day-to-evening events"],
    occasions: ["Festive Gathering", "Navratri", "Family Event"]
  },
  {
    slug: "royal-ink-mysore-silk",
    label: "MYSORE SILK",
    name: "Royal Ink Mysore Silk",
    price: "₹ 22,700",
    originalPrice: "₹ 26,800",
    discountLabel: "15% off",
    artClass: "art-indigo",
    imageUrl: "/homepage-assets/5d8f38c792e2240d09e7f041ca1c06df.jpg",
    galleryImages: [
      "/homepage-assets/5d8f38c792e2240d09e7f041ca1c06df.jpg",
      "/homepage-assets/363f2870e0392b285659524eb68ef9c0.jpg",
      "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg"
    ],
    category: "Mysore Silk Sarees",
    fabric: "Silk",
    occasion: "Party",
    color: "Royal Blue",
    colorChoices: ["Royal Blue", "Navy", "Ink Blue"],
    variants: [
      { name: "Classic Mysore", note: "Smooth silk finish with understated sheen.", price: "₹ 22,700" },
      { name: "Dinner Edit", note: "Styled for evening hosting and festive dinners.", price: "₹ 23,350" },
      { name: "Boutique Finish", note: "Includes blouse and finishing consultation.", price: "₹ 24,100" }
    ],
    length: "5.5 metres",
    blouse: "Contrast blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.7",
    reviews: 59,
    note: "A polished silk saree with a smooth finish and rich ink-blue presence.",
    description: "This Mysore silk saree is a refined option for intimate receptions, milestone dinners, and polished festive evenings where fluidity matters.",
    details: ["Smooth silk texture", "Elegant light sheen", "Evening-ready color story"],
    styling: ["Pair with sleek blouses", "Works with silver or diamond jewelry", "Ideal for formal dinners"],
    occasions: ["Party Wear", "Dinner Event", "Reception"]
  },
  {
    slug: "coral-garden-kota-doria",
    label: "KOTA DORIA",
    name: "Coral Garden Kota Doria",
    price: "₹ 11,200",
    originalPrice: "₹ 13,500",
    discountLabel: "17% off",
    artClass: "art-floral",
    imageUrl: "/homepage-assets/1f1049120cfa2eb983d11f1c76bbef2a.jpg",
    galleryImages: [
      "/homepage-assets/1f1049120cfa2eb983d11f1c76bbef2a.jpg",
      "/homepage-assets/0a6485e6977f363e23f9f07ab63de243.jpg",
      "/homepage-assets/6a2cbe5ce9b56f8aaf9e04935473d540.jpg"
    ],
    category: "Lightweight Sarees",
    fabric: "Kota Doria",
    occasion: "Casual",
    color: "Coral",
    colorChoices: ["Coral", "Peach", "Rose"],
    variants: [
      { name: "Kota Doria Classic", note: "Featherlight weave for warm days.", price: "₹ 11,200" },
      { name: "Summer Edit", note: "Soft floral mood for day events.", price: "₹ 11,750" },
      { name: "Brunch Styling Set", note: "Includes tonal blouse recommendations.", price: "₹ 12,250" }
    ],
    length: "5.5 metres",
    blouse: "Separate blouse fabric included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.5",
    reviews: 44,
    note: "A featherlight saree for warm-weather celebrations and breezy day dressing.",
    description: "This Kota Doria saree is ideal for summer brunches, low-key festive plans, and easy vacation styling where comfort and color matter equally.",
    details: ["Lightweight kota weave", "Breathable warm-weather drape", "Soft floral accent story"],
    styling: ["Pair with minimal jewelry", "Best for daywear", "Easy travel and brunch option"],
    occasions: ["Brunch", "Travel", "Daily Wear"]
  },
  {
    slug: "heritage-black-gold-weave",
    label: "OCCASION BLACK",
    name: "Heritage Black Gold Weave",
    price: "₹ 29,400",
    originalPrice: "₹ 34,500",
    discountLabel: "15% off",
    artClass: "art-noir",
    imageUrl: "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg",
    galleryImages: [
      "/homepage-assets/925c4a841f04d6d7741e78e2d51b2cd8.jpg",
      "/homepage-assets/f90434c1a5c20058e8ef2e72123c40aa.jpg",
      "/homepage-assets/28b50087fef53ebe82680ed11d4eddcd.jpg"
    ],
    category: "Statement Sarees",
    fabric: "Silk Blend",
    occasion: "Evening",
    color: "Black Gold",
    colorChoices: ["Black Gold", "Midnight", "Bronze Black"],
    variants: [
      { name: "Signature Weave", note: "Dark festive weave with zari accents.", price: "₹ 29,400" },
      { name: "Event Ready", note: "Enhanced finish for formal evening wear.", price: "₹ 30,250" },
      { name: "Signature Styling Set", note: "Includes blouse and jewelry styling notes.", price: "₹ 31,200" }
    ],
    length: "5.5 metres",
    blouse: "Blouse piece included",
    delivery: "Delivered in 3-5 business days",
    codNote: "COD available for selected pincodes",
    rating: "4.8",
    reviews: 78,
    note: "A dark statement saree balanced by gold weave accents and evening depth.",
    description: "Created for festive nights and formal soirées, this saree offers a strong black-and-gold story without losing fluidity or styling flexibility.",
    details: ["Silk-blend body", "Gold weave accents", "Strong evening appeal"],
    styling: ["Style with gold cuffs", "Ideal for night functions", "Works with dramatic blouses"],
    occasions: ["Evening Event", "Reception", "Cocktail"]
  }
];

export const collectionCards = [
  {
    slug: "banarasi",
    title: "Banarasi Reveries",
    description: "Dense silk drapes, antique zari, and evening depth.",
    artClass: "collection-banarasi-card"
  },
  {
    slug: "kanchipuram",
    title: "Kanchipuram Icons",
    description: "Temple borders and bridal color in stately silhouettes.",
    artClass: "collection-kanchipuram-card"
  },
  {
    slug: "organza",
    title: "Whisper Organza",
    description: "Airy translucence with painterly florals and light gold edges.",
    artClass: "collection-organza-card"
  },
  {
    slug: "cotton",
    title: "Everyday Cotton Archive",
    description: "Graphic cotton drapes built for rhythm, comfort, and repetition.",
    artClass: "collection-cotton-card"
  }
];

export const storyMoments = [
  {
    year: "1924",
    title: "The first archive",
    copy: "Mandala began as a family textile room where ceremonial drapes were cataloged, restored, and passed across generations."
  },
  {
    year: "1978",
    title: "Direct artisan partnerships",
    copy: "The studio expanded into long-term weaving relationships across Banaras, Kanchipuram, and Bengal."
  },
  {
    year: "2024",
    title: "The heirloom archive",
    copy: "Today the collection pairs traditional textile languages with a calmer, contemporary wardrobe point of view."
  }
];

export const artisanRegions = [
  {
    name: "Banaras",
    craft: "Zari-rich silk brocades",
    copy: "Known for opulent borders, intricate butis, and a ceremonial surface that reads with depth in low light."
  },
  {
    name: "Kanchipuram",
    craft: "Temple-bordered bridal weaves",
    copy: "Celebrated for structural drape, korvai joins, and color stories meant to endure across decades."
  },
  {
    name: "Bengal",
    craft: "Organza and hand-painted softness",
    copy: "A lighter archive of sheer grounds, painterly placement, and a more lyrical approach to occasion dressing."
  }
];

export const assistanceLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/track-order", label: "Track Order" },
  { href: "/custom-services", label: "Custom Services" },
  { href: "/whatsapp-assist", label: "WhatsApp Assist" },
  { href: "/support", label: "Support" },
  { href: "/returns-request", label: "Returns Request" },
  { href: "/refund-policy", label: "Return & Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" }
];

export const offerCampaigns = [
  {
    slug: "wedding-season-sale",
    title: "Wedding Season Sale",
    subtitle: "Up to 20% off select bridal drapes and ceremonial silks.",
    eyebrow: "Festival Promotions",
    coupon: "BRIDE20",
    period: "Valid through the current wedding season"
  },
  {
    slug: "diwali-edit",
    title: "Diwali Celebration Edit",
    subtitle: "Festive sarees, luminous zari borders, and special seasonal gifting offers.",
    eyebrow: "Festival Promotions",
    coupon: "DIWALI10",
    period: "Limited-time festive offer"
  },
  {
    slug: "archive-welcome",
    title: "First Order Welcome",
    subtitle: "A boutique welcome offer for first-time collectors and archive members.",
    eyebrow: "Coupon Campaign",
    coupon: "ARCHIVE10",
    period: "Available for first orders only"
  }
];

export const lookbookPages = [
  {
    slug: "bridal-saree-collection",
    title: "Bridal Saree Collection",
    eyebrow: "Lookbook",
    intro: "Grand silks, zari borders, and heirloom color stories designed for wedding ceremonies and receptions.",
    highlights: [
      "Banarasi and Kanchipuram silhouettes for ceremonial dressing",
      "Rich reds, emerald greens, and regal jewel tones",
      "Styling direction for trousseau and bridal wardrobe planning"
    ]
  },
  {
    slug: "office-wear-sarees",
    title: "Office Wear Sarees",
    eyebrow: "Lookbook",
    intro: "Polished, repeatable sarees built for workdays, meetings, and elegant daily structure.",
    highlights: [
      "Cotton, linen, and lighter silk blends for all-day ease",
      "Subtle borders and practical drapes for frequent wear",
      "Color stories that balance professionalism and personal style"
    ]
  },
  {
    slug: "summer-cotton-edit",
    title: "Summer Cotton Edit",
    eyebrow: "Lookbook",
    intro: "Breathable cotton sarees chosen for warm-weather dressing, travel, and daytime comfort.",
    highlights: [
      "Lightweight fabrics for heat and movement",
      "Soft pastel, ivory, and indigo everyday palettes",
      "Weekend, casual, and festive-day cotton options"
    ]
  }
];

export const styleGuidePosts = [
  {
    slug: "how-to-drape-a-saree",
    title: "How to Drape a Saree",
    excerpt: "A practical draping guide for beginners, occasion dressing, and cleaner pleat structure.",
    category: "Style Guide",
    readTime: "5 min read",
    sections: [
      {
        heading: "Start with the base",
        copy: "Choose the blouse, petticoat, and footwear first. A stable base improves drape, hem balance, and pleat placement."
      },
      {
        heading: "Build the pleats gradually",
        copy: "Tuck the saree evenly around the waist, then form front pleats with consistent width before pinning and settling the pallu."
      },
      {
        heading: "Adjust for occasion",
        copy: "For weddings, keep the pallu fuller and more structured. For office or daily wear, a slimmer pallu and lighter pleat volume work better."
      }
    ]
  },
  {
    slug: "best-sarees-for-weddings",
    title: "Best Sarees for Weddings",
    excerpt: "A quick guide to choosing silk, color, and weave based on wedding ceremonies and guest roles.",
    category: "Occasion Edit",
    readTime: "6 min read",
    sections: [
      {
        heading: "Choose by role and ceremony",
        copy: "Brides often gravitate toward Kanchipuram and Banarasi silks, while guests may prefer lighter festive weaves with easier movement."
      },
      {
        heading: "Prioritize surface richness",
        copy: "Wedding sarees benefit from zari, temple borders, brocade texture, or luminous pallu details that photograph beautifully."
      },
      {
        heading: "Balance comfort and grandeur",
        copy: "If the event is long, choose a drape that still feels manageable across rituals, receptions, and repeated styling."
      }
    ]
  },
  {
    slug: "silk-vs-cotton-saree-guide",
    title: "Silk vs Cotton Saree Guide",
    excerpt: "Understand the difference between silk and cotton sarees across comfort, occasion, drape, and care.",
    category: "Fabric Guide",
    readTime: "4 min read",
    sections: [
      {
        heading: "Silk for ceremony",
        copy: "Silk sarees bring richer sheen, stronger occasion presence, and a more formal drape, making them ideal for weddings and grand events."
      },
      {
        heading: "Cotton for rhythm",
        copy: "Cotton sarees feel lighter, easier to repeat, and better suited for daytime routines, office wear, and warmer climates."
      },
      {
        heading: "Care expectations",
        copy: "Silk usually benefits from dry cleaning and more careful storage, while cotton can be simpler to maintain depending on weave and embellishment."
      }
    ]
  }
];

export const accountOrders = [
  {
    id: "MND-8210",
    date: "04 Apr 2026",
    status: "Delivered",
    total: "₹42,500",
    tracking: "BlueDart • Delivered",
    invoiceLabel: "Download invoice"
  },
  {
    id: "MND-8211",
    date: "03 Apr 2026",
    status: "Shipped",
    total: "₹85,000",
    tracking: "DTDC • In transit",
    invoiceLabel: "Download invoice"
  },
  {
    id: "MND-8212",
    date: "01 Apr 2026",
    status: "Processing",
    total: "₹12,400",
    tracking: "Preparing for dispatch",
    invoiceLabel: "Invoice available after dispatch"
  }
];

export const savedAddresses = [
  {
    id: "home",
    label: "Home",
    name: "Ananya Singh",
    lines: [
      "18/2 Lake View Residency",
      "JP Nagar 7th Phase",
      "Bangalore - 560078",
      "+91 98765 43210"
    ]
  },
  {
    id: "work",
    label: "Work",
    name: "Ananya Singh",
    lines: [
      "402 Sterling Park",
      "MG Road",
      "Bangalore - 560001",
      "+91 98765 43210"
    ]
  }
];
