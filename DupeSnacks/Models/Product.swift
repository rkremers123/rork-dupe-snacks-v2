import Foundation

nonisolated enum SnackCategory: String, CaseIterable, Identifiable, Codable, Sendable {
    case cookies = "Cookies"
    case chips = "Chips"
    case crackers = "Crackers"
    case bars = "Bars"
    case candy = "Candy"
    case cereal = "Cereal"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .cookies: "birthday.cake"
        case .chips: "leaf"
        case .crackers: "square.grid.2x2"
        case .bars: "rectangle.split.3x1"
        case .candy: "drop.fill"
        case .cereal: "cup.and.saucer"
        }
    }
}

nonisolated enum Allergen: String, CaseIterable, Identifiable, Codable, Sendable {
    case soy = "Soy"
    case dairy = "Dairy"
    case nuts = "Nuts"
    case eggs = "Eggs"
    case corn = "Corn"

    var id: String { rawValue }
}

nonisolated enum SortOption: String, CaseIterable, Identifiable, Sendable {
    case popular = "Popular"
    case topRated = "Top Rated"
    case priceLow = "Price: Low"
    case priceHigh = "Price: High"

    var id: String { rawValue }
}

struct Product: Identifiable, Hashable, Sendable {
    let id: String
    let name: String
    let brand: String
    let description: String
    let price: Double
    let rating: Double
    let reviewCount: Int
    let category: SnackCategory
    let allergens: [Allergen]
    let isGlutenFreeCertified: Bool
    let imageURL: URL?
    let amazonURL: URL?
    let dupeOf: String

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    static func == (lhs: Product, rhs: Product) -> Bool {
        lhs.id == rhs.id
    }
}
