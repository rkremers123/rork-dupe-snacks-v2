import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "crackers", name: "Crackers", emoji: "🧀", sortOrder: 1, blurb: "Gluten-free crackers that crunch just like the originals." },
  { slug: "cookies", name: "Cookies", emoji: "🍪", sortOrder: 2, blurb: "Sandwich cookies, chocolate chip and more — all celiac-safe." },
  { slug: "snacks", name: "Snacks", emoji: "🥨", sortOrder: 3, blurb: "Pretzels, puffs and everything to grab by the handful." },
  { slug: "chips", name: "Chips", emoji: "🥔", sortOrder: 4, blurb: "Crispy gluten-free chips for every craving." },
  { slug: "bread", name: "Bread", emoji: "🍞", sortOrder: 5, blurb: "Sandwich bread, bagels and buns you can actually eat." },
  { slug: "bars", name: "Bars", emoji: "🍫", sortOrder: 6, blurb: "Granola and snack bars for on the go." },
  { slug: "candy", name: "Candy", emoji: "🍬", sortOrder: 7, blurb: "Sweet treats certified gluten-free." },
  { slug: "cereal", name: "Cereal", emoji: "🥣", sortOrder: 8, blurb: "Start the day gluten-free." },
  { slug: "jerky", name: "Jerky", emoji: "🥩", sortOrder: 9, blurb: "Protein-packed jerky and meat snacks." },
  { slug: "pasta", name: "Pasta", emoji: "🍝", sortOrder: 10, blurb: "Gluten-free pasta that holds its bite." },
];

function img(text: string) {
  return `https://placehold.co/600x600/1a1a2e/2dd4bf?text=${encodeURIComponent(text)}`;
}

type Seed = {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  certified?: boolean;
  allergens?: string;
  dupeOf?: string;
  dupeBrand?: string;
  featured?: boolean;
  popularity?: number;
};

const products: Seed[] = [
  { name: "Cheddar Bunnies Baked Snack Crackers", brand: "Annie's", category: "crackers", description: "Cheesy, crunchy fish-shaped crackers made with real cheddar — a dead ringer for Goldfish.", price: 4.49, rating: 4.7, reviewCount: 8200, certified: true, allergens: "dairy", dupeOf: "Goldfish Crackers", dupeBrand: "Pepperidge Farm", featured: true, popularity: 100 },
  { name: "Cheddar Square Crackers", brand: "Simple Mills", category: "crackers", description: "Almond-flour cheese squares with a sharp cheddar bite. The gluten-free answer to Cheez-It.", price: 5.29, rating: 4.6, reviewCount: 5400, certified: true, allergens: "dairy,nuts", dupeOf: "Cheez-It", dupeBrand: "Sunshine", featured: true, popularity: 96 },
  { name: "Multi-Seed Crackers", brand: "Crunchmaster", category: "crackers", description: "Crispy multi-seed crackers with the hearty crunch of a wheat cracker — minus the wheat.", price: 4.19, rating: 4.5, reviewCount: 3900, certified: true, dupeOf: "Wheat Thins", dupeBrand: "Nabisco", popularity: 80 },
  { name: "Table Crackers", brand: "Schär", category: "crackers", description: "Light, buttery round crackers perfect for cheese boards — just like Ritz.", price: 3.99, rating: 4.4, reviewCount: 2600, certified: true, allergens: "soy", dupeOf: "Ritz Crackers", dupeBrand: "Nabisco", popularity: 78 },
  { name: "Original Chocolate Creme Cookies", brand: "Goodie Girl", category: "cookies", description: "Two chocolate wafers hugging a creamy vanilla filling. The gluten-free Oreo you've missed.", price: 4.99, rating: 4.6, reviewCount: 6100, certified: true, allergens: "soy", dupeOf: "Oreos", dupeBrand: "Nabisco", featured: true, popularity: 98 },
  { name: "Crispy Chocolate Chip Cookies", brand: "Tate's Bake Shop", category: "cookies", description: "Thin, buttery and loaded with chocolate chips — the gluten-free take on Chips Ahoy.", price: 5.49, rating: 4.7, reviewCount: 7300, allergens: "dairy,eggs,soy", dupeOf: "Chips Ahoy", dupeBrand: "Nabisco", popularity: 88 },
  { name: "S'moreables Graham Style Crackers", brand: "Kinnikinnick", category: "cookies", description: "Honey graham crackers for s'mores and pie crusts, gluten-free.", price: 5.19, rating: 4.4, reviewCount: 2100, certified: true, allergens: "soy", dupeOf: "Honey Maid Graham Crackers", dupeBrand: "Nabisco", popularity: 60 },
  { name: "Gluten-Free Mini Pretzels", brand: "Snyder's of Hanover", category: "snacks", description: "Crunchy, salty mini pretzel twists made without gluten. Just like Rold Gold.", price: 4.29, rating: 4.6, reviewCount: 9100, certified: true, allergens: "soy", dupeOf: "Rold Gold Pretzels", dupeBrand: "Rold Gold", featured: true, popularity: 95 },
  { name: "White Cheddar Cheese Puffs", brand: "Pirate's Booty", category: "snacks", description: "Airy baked rice-and-corn puffs dusted with white cheddar — a Cheetos-style melt-in-your-mouth snack.", price: 3.79, rating: 4.5, reviewCount: 4400, allergens: "dairy", dupeOf: "Cheetos", dupeBrand: "Frito-Lay", popularity: 72 },
  { name: "Tortilla Chips Rounds", brand: "Mission", category: "chips", description: "Classic restaurant-style corn tortilla rounds, naturally gluten-free.", price: 3.49, rating: 4.5, reviewCount: 5200, certified: false, dupeOf: "Tostitos", dupeBrand: "Frito-Lay", popularity: 70 },
  { name: "Sea Salt Kettle Potato Chips", brand: "Kettle Brand", category: "chips", description: "Thick-cut kettle chips with a satisfying crunch and simple sea-salt flavor.", price: 3.99, rating: 4.6, reviewCount: 6800, dupeOf: "Lay's Kettle Cooked", dupeBrand: "Lay's", popularity: 68 },
  { name: "Gluten-Free White Sandwich Bread", brand: "Canyon Bakehouse", category: "bread", description: "Soft, sliceable sandwich bread that actually tastes like the real thing. Wonder Bread, reborn.", price: 6.49, rating: 4.7, reviewCount: 11200, certified: true, allergens: "eggs", dupeOf: "Wonder Bread", dupeBrand: "Wonder", featured: true, popularity: 99 },
  { name: "Plain Gluten-Free Bagels", brand: "Canyon Bakehouse", category: "bread", description: "Chewy, toaster-ready bagels for breakfast sandwiches.", price: 6.99, rating: 4.5, reviewCount: 4300, certified: true, allergens: "eggs", dupeOf: "Thomas' Bagels", dupeBrand: "Thomas'", popularity: 66 },
  { name: "Chewy Chocolate Chip Granola Bars", brand: "MadeGood", category: "bars", description: "Soft granola bars with chocolate chips and a hidden serving of veggies. The GF Quaker Chewy.", price: 5.49, rating: 4.5, reviewCount: 5900, certified: true, dupeOf: "Quaker Chewy Bars", dupeBrand: "Quaker", popularity: 74 },
  { name: "Crispy Rice Treats", brand: "Glutino", category: "bars", description: "Gooey marshmallow rice-crisp squares — the gluten-free Rice Krispies Treat.", price: 4.79, rating: 4.3, reviewCount: 2700, certified: true, allergens: "soy", dupeOf: "Rice Krispies Treats", dupeBrand: "Kellogg's", popularity: 58 },
  { name: "Fruit Snacks Variety Pack", brand: "Welch's", category: "candy", description: "Chewy fruit snacks made with real fruit — naturally gluten-free.", price: 7.99, rating: 4.8, reviewCount: 15400, dupeOf: "Mott's Fruit Snacks", dupeBrand: "Mott's", popularity: 64 },
  { name: "Gluten-Free Rice Cereal Squares", brand: "Chex", category: "cereal", description: "Crunchy rice cereal squares — great in a bowl or as the base for party mix.", price: 4.59, rating: 4.7, reviewCount: 8800, certified: false, dupeOf: "Rice Krispies", dupeBrand: "Kellogg's", popularity: 76 },
  { name: "Honey Nut Toasted Oat Cereal", brand: "Cheerios", category: "cereal", description: "Lightly sweetened oat O's, made gluten-free.", price: 4.99, rating: 4.6, reviewCount: 9600, allergens: "nuts", dupeOf: "Honey Nut Cheerios", dupeBrand: "General Mills", popularity: 62 },
  { name: "Original Beef Jerky", brand: "Chomps", category: "jerky", description: "Grass-fed beef sticks with no added sugar — a clean, gluten-free Slim Jim alternative.", price: 12.99, rating: 4.7, reviewCount: 13200, certified: true, dupeOf: "Slim Jim", dupeBrand: "Slim Jim", featured: true, popularity: 90 },
  { name: "Teriyaki Beef Jerky", brand: "Country Archer", category: "jerky", description: "Tender teriyaki jerky made with gluten-free tamari.", price: 8.99, rating: 4.5, reviewCount: 4100, certified: true, allergens: "soy", dupeOf: "Jack Link's Teriyaki", dupeBrand: "Jack Link's", popularity: 55 },
  { name: "Gluten-Free Spaghetti", brand: "Jovial", category: "pasta", description: "Brown-rice spaghetti that cooks up al dente and doesn't turn to mush. A true Barilla stand-in.", price: 3.99, rating: 4.6, reviewCount: 7700, certified: true, dupeOf: "Barilla Spaghetti", dupeBrand: "Barilla", popularity: 73 },
  { name: "Chickpea Penne", brand: "Banza", category: "pasta", description: "High-protein chickpea penne with twice the protein and the bite of regular pasta.", price: 3.49, rating: 4.4, reviewCount: 9900, certified: false, dupeOf: "Barilla Penne", dupeBrand: "Barilla", popularity: 71 },
  { name: "Pretzel Sticks", brand: "Glutino", category: "snacks", description: "Crunchy salted pretzel sticks for dipping. Gluten-free.", price: 4.49, rating: 4.4, reviewCount: 3300, certified: true, allergens: "soy", dupeOf: "Snyder's Pretzel Sticks", dupeBrand: "Snyder's", popularity: 52 },
  { name: "Vanilla Wafers", brand: "Goodie Girl", category: "cookies", description: "Light, crisp vanilla wafers for snacking and banana pudding.", price: 4.99, rating: 4.3, reviewCount: 1900, certified: true, allergens: "soy", dupeOf: "Nilla Wafers", dupeBrand: "Nabisco", popularity: 48 },
];

async function main() {
  console.log("Seeding categories…");
  const idBySlug = new Map<string, number>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    idBySlug.set(c.slug, row.id);
  }

  console.log("Seeding products…");
  for (const p of products) {
    const slug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const categoryId = idBySlug.get(p.category)!;
    const data = {
      slug,
      name: p.name,
      brand: p.brand,
      description: p.description,
      imageUrl: img(p.brand),
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(p.brand + " " + p.name)}`,
      price: p.price,
      rating: p.rating,
      reviewCount: p.reviewCount,
      glutenFreeCertified: p.certified ?? false,
      allergens: p.allergens ?? "",
      dupeOf: p.dupeOf ?? null,
      dupeBrand: p.dupeBrand ?? null,
      featured: p.featured ?? false,
      popularity: p.popularity ?? 0,
      categoryId,
    };
    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: data,
    });
  }

  // A starter collection to demonstrate the feature.
  const collection = await prisma.collection.upsert({
    where: { slug: "lunchbox-favorites" },
    update: {},
    create: {
      slug: "lunchbox-favorites",
      name: "Lunchbox Favorites",
      emoji: "🎒",
      description: "Gluten-free swaps to pack for school and work.",
      sortOrder: 1,
    },
  });
  const lunchboxSlugs = [
    "cheddar-bunnies-baked-snack-crackers",
    "gluten-free-mini-pretzels",
    "chewy-chocolate-chip-granola-bars",
    "original-chocolate-creme-cookies",
    "fruit-snacks-variety-pack",
  ];
  for (let i = 0; i < lunchboxSlugs.length; i++) {
    const product = await prisma.product.findUnique({
      where: { slug: lunchboxSlugs[i] },
    });
    if (product) {
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: {
            collectionId: collection.id,
            productId: product.id,
          },
        },
        update: { sortOrder: i },
        create: {
          collectionId: collection.id,
          productId: product.id,
          sortOrder: i,
        },
      });
    }
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
