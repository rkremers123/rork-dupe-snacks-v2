import SwiftUI

@Observable
final class SnackStore {
    var products: [Product] = []
    var favoriteIDs: Set<String> = []
    var searchText: String = ""
    var selectedCategory: SnackCategory? = nil
    var selectedAllergens: Set<Allergen> = []
    var priceRange: ClosedRange<Double> = 0...30
    var sortOption: SortOption = .popular
    var isGlutenFreeCertifiedOnly: Bool = false

    var favoriteProducts: [Product] {
        products.filter { favoriteIDs.contains($0.id) }
    }

    var filteredProducts: [Product] {
        var result = products

        if !searchText.isEmpty {
            result = result.filter {
                $0.name.localizedStandardContains(searchText) ||
                $0.brand.localizedStandardContains(searchText) ||
                $0.dupeOf.localizedStandardContains(searchText)
            }
        }

        if let category = selectedCategory {
            result = result.filter { $0.category == category }
        }

        if !selectedAllergens.isEmpty {
            result = result.filter { product in
                selectedAllergens.allSatisfy { allergen in
                    !product.allergens.contains(allergen)
                }
            }
        }

        if isGlutenFreeCertifiedOnly {
            result = result.filter { $0.isGlutenFreeCertified }
        }

        result = result.filter { $0.price >= priceRange.lowerBound && $0.price <= priceRange.upperBound }

        switch sortOption {
        case .popular:
            result.sort { $0.reviewCount > $1.reviewCount }
        case .topRated:
            result.sort { $0.rating > $1.rating }
        case .priceLow:
            result.sort { $0.price < $1.price }
        case .priceHigh:
            result.sort { $0.price > $1.price }
        }

        return result
    }

    func productsByCategory(_ category: SnackCategory) -> [Product] {
        products.filter { $0.category == category }
            .sorted { $0.reviewCount > $1.reviewCount }
    }

    func isFavorite(_ product: Product) -> Bool {
        favoriteIDs.contains(product.id)
    }

    func toggleFavorite(_ product: Product) {
        if favoriteIDs.contains(product.id) {
            favoriteIDs.remove(product.id)
        } else {
            favoriteIDs.insert(product.id)
        }
    }

    func clearFilters() {
        selectedCategory = nil
        selectedAllergens = []
        priceRange = 0...30
        isGlutenFreeCertifiedOnly = false
        sortOption = .popular
    }

    init() {
        loadMockData()
    }

    private func loadMockData() {
        products = [
            Product(
                id: "1",
                name: "GF Chocolate Sandwich Cookies",
                brand: "Glutino",
                description: "Rich chocolate cookies with a sweet cream filling. A perfect gluten-free alternative that tastes just like the original. Made with quality ingredients and certified gluten-free for peace of mind.",
                price: 5.49,
                rating: 4.5,
                reviewCount: 2847,
                category: .cookies,
                allergens: [.soy, .dairy],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Oreos"
            ),
            Product(
                id: "2",
                name: "Sea Salt Kettle Chips",
                brand: "Kettle Brand",
                description: "Perfectly crispy kettle-cooked potato chips with just the right amount of sea salt. Naturally gluten-free and made with simple ingredients you can trust.",
                price: 4.29,
                rating: 4.7,
                reviewCount: 5123,
                category: .chips,
                allergens: [],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Lay's Classic"
            ),
            Product(
                id: "3",
                name: "Almond Flour Crackers",
                brand: "Simple Mills",
                description: "Crispy, crunchy crackers made from a simple blend of almond flour, sunflower seeds, and organic spices. Perfect for snacking or dipping.",
                price: 4.99,
                rating: 4.6,
                reviewCount: 3456,
                category: .crackers,
                allergens: [.nuts],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1590080876351-941da357adde?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Wheat Thins"
            ),
            Product(
                id: "4",
                name: "Dark Chocolate Coconut Bars",
                brand: "KIND",
                description: "Satisfying snack bars combining dark chocolate, toasted coconut, and whole almonds. A delicious and gluten-free energy boost for any time of day.",
                price: 8.99,
                rating: 4.4,
                reviewCount: 1892,
                category: .bars,
                allergens: [.nuts, .soy],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Snickers Bars"
            ),
            Product(
                id: "5",
                name: "Organic Gummy Bears",
                brand: "YumEarth",
                description: "Fruity organic gummy bears made with real fruit juice. Free from artificial dyes, flavors, and common allergens. A guilt-free candy treat.",
                price: 3.99,
                rating: 4.3,
                reviewCount: 4210,
                category: .candy,
                allergens: [],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Haribo Gummy Bears"
            ),
            Product(
                id: "6",
                name: "Honey Nut Crunchy Cereal",
                brand: "Nature's Path",
                description: "Crunchy corn cereal sweetened with honey and packed with roasted almonds. A gluten-free breakfast that doesn't compromise on taste.",
                price: 6.49,
                rating: 4.2,
                reviewCount: 1567,
                category: .cereal,
                allergens: [.nuts],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Honey Nut Cheerios"
            ),
            Product(
                id: "7",
                name: "Cheddar Cheese Puffs",
                brand: "Pirate's Booty",
                description: "Light and airy puffed rice and corn snacks dusted with real aged white cheddar. A crunchy, cheesy snack that's naturally gluten-free.",
                price: 3.79,
                rating: 4.5,
                reviewCount: 3890,
                category: .chips,
                allergens: [.dairy],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Cheetos Puffs"
            ),
            Product(
                id: "8",
                name: "Double Chocolate Chip Cookies",
                brand: "Enjoy Life",
                description: "Chewy chocolate cookies loaded with chocolate chips. Free from the top 14 allergens including wheat, dairy, and nuts. Allergy-friendly indulgence.",
                price: 5.99,
                rating: 4.1,
                reviewCount: 2134,
                category: .cookies,
                allergens: [],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Chips Ahoy"
            ),
            Product(
                id: "9",
                name: "Caramel Rice Cakes",
                brand: "Quaker",
                description: "Light and crunchy rice cakes drizzled with sweet caramel coating. A satisfying low-calorie snack that's naturally gluten-free.",
                price: 3.49,
                rating: 4.0,
                reviewCount: 6721,
                category: .bars,
                allergens: [.soy],
                isGlutenFreeCertified: false,
                imageURL: URL(string: "https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Rice Krispie Treats"
            ),
            Product(
                id: "10",
                name: "Seed Crackers Everything",
                brand: "Mary's Gone Crackers",
                description: "Organic crackers made from brown rice, quinoa, flax, and sesame seeds with everything bagel seasoning. Crunchy and packed with nutrients.",
                price: 5.79,
                rating: 4.4,
                reviewCount: 2890,
                category: .crackers,
                allergens: [],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Ritz Crackers"
            ),
            Product(
                id: "11",
                name: "Peanut Butter Cups",
                brand: "Unreal",
                description: "Dark chocolate peanut butter cups made with fair trade chocolate and organic peanut butter. Less sugar than the original with better ingredients.",
                price: 4.49,
                rating: 4.6,
                reviewCount: 3678,
                category: .candy,
                allergens: [.nuts, .soy, .dairy],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Reese's Cups"
            ),
            Product(
                id: "12",
                name: "Cocoa Pebbles Cereal",
                brand: "Fruity & Cocoa Pebbles",
                description: "Classic crispy rice cereal with rich chocolate flavor. A naturally gluten-free cereal that's been a fan favorite for decades.",
                price: 4.29,
                rating: 4.3,
                reviewCount: 4512,
                category: .cereal,
                allergens: [.dairy],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Cocoa Puffs"
            ),
            Product(
                id: "13",
                name: "BBQ Sweet Potato Chips",
                brand: "Jackson's",
                description: "Sweet potato chips cooked in premium avocado oil with smoky BBQ seasoning. Grain-free, paleo-friendly, and certified gluten-free.",
                price: 5.29,
                rating: 4.2,
                reviewCount: 1345,
                category: .chips,
                allergens: [],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "BBQ Lay's"
            ),
            Product(
                id: "14",
                name: "Vanilla Sandwich Cremes",
                brand: "Kinnikinnick",
                description: "Golden vanilla cookies with a sweet vanilla cream filling. Made in a dedicated gluten-free facility for maximum safety.",
                price: 6.29,
                rating: 4.0,
                reviewCount: 987,
                category: .cookies,
                allergens: [.eggs, .soy],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1548365328-8c819d3e2dbc?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Golden Oreos"
            ),
            Product(
                id: "15",
                name: "Protein Oat Bars Chocolate",
                brand: "Bobo's",
                description: "Hearty oat bars made with certified gluten-free oats, dipped in dark chocolate. Perfect pre or post workout fuel.",
                price: 9.99,
                rating: 4.5,
                reviewCount: 2100,
                category: .bars,
                allergens: [.dairy, .soy],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1611260070798-88d1e4ba6cdc?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Nature Valley Bars"
            ),
            Product(
                id: "16",
                name: "Sour Gummy Worms",
                brand: "Smart Sweets",
                description: "Tangy sour gummy worms with only 3g of sugar per bag. Naturally flavored and colored with plant-based ingredients.",
                price: 3.49,
                rating: 3.9,
                reviewCount: 5670,
                category: .candy,
                allergens: [],
                isGlutenFreeCertified: true,
                imageURL: URL(string: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop"),
                amazonURL: URL(string: "https://amazon.com"),
                dupeOf: "Trolli Sour Worms"
            ),
        ]
    }
}
