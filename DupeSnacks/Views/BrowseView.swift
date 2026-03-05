import SwiftUI

struct BrowseView: View {
    @Environment(SnackStore.self) private var store
    @State private var selectedProduct: Product?

    private let categoriesInOrder: [SnackCategory] = [.cookies, .chips, .crackers, .bars, .candy, .cereal]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    headerSection

                    ForEach(categoriesInOrder) { category in
                        let products = store.productsByCategory(category)
                        if !products.isEmpty {
                            categorySection(category: category, products: products)
                        }
                    }
                }
                .padding(.bottom, 20)
            }
            .scrollIndicators(.hidden)
            .background(Theme.navy)
            .navigationBarTitleDisplayMode(.inline)
            .sheet(item: $selectedProduct) { product in
                ProductDetailView(product: product)
            }
        }
    }

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 8) {
                Image(systemName: "leaf.circle.fill")
                    .font(.title)
                    .foregroundStyle(Theme.teal)
                Text("Dupe Snacks")
                    .font(.largeTitle.weight(.bold))
                    .foregroundStyle(.white)
            }

            Text("Gluten-free alternatives to your favorites")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.6))
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
    }

    private func categorySection(category: SnackCategory, products: [Product]) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: category.icon)
                    .font(.headline)
                    .foregroundStyle(Theme.teal)
                Text(category.rawValue)
                    .font(.title3.weight(.bold))
                    .foregroundStyle(.white)
            }
            .padding(.horizontal, 16)

            ScrollView(.horizontal) {
                HStack(spacing: 12) {
                    ForEach(products) { product in
                        Button {
                            selectedProduct = product
                        } label: {
                            BrowseCardView(
                                product: product,
                                isFavorite: store.isFavorite(product),
                                onFavorite: { store.toggleFavorite(product) },
                                onBuy: { openAmazon(product) }
                            )
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .contentMargins(.horizontal, 16)
            .scrollIndicators(.hidden)
        }
    }

    private func openAmazon(_ product: Product) {
        guard let url = product.amazonURL else { return }
        UIApplication.shared.open(url)
    }
}

struct BrowseCardView: View {
    let product: Product
    let isFavorite: Bool
    let onFavorite: () -> Void
    let onBuy: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Color(white: 0.15)
                .frame(width: 200, height: 140)
                .overlay {
                    AsyncImage(url: product.imageURL) { phase in
                        if let image = phase.image {
                            image.resizable().aspectRatio(contentMode: .fill)
                        } else if phase.error != nil {
                            Image(systemName: "photo")
                                .font(.title2)
                                .foregroundStyle(.white.opacity(0.3))
                        } else {
                            ProgressView().tint(.white.opacity(0.5))
                        }
                    }
                    .allowsHitTesting(false)
                }
                .clipShape(.rect(cornerRadius: 12, style: .continuous))
                .overlay(alignment: .topTrailing) {
                    Button(action: onFavorite) {
                        Image(systemName: isFavorite ? "heart.fill" : "heart")
                            .font(.subheadline)
                            .foregroundStyle(isFavorite ? Theme.magenta : .white)
                            .padding(6)
                            .background(.black.opacity(0.45), in: Circle())
                    }
                    .padding(8)
                }

            VStack(alignment: .leading, spacing: 4) {
                Text(product.dupeOf)
                    .font(.caption2.weight(.medium))
                    .foregroundStyle(Theme.teal.opacity(0.8))
                    .lineLimit(1)

                Text(product.name)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.white)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)

                Text(product.brand)
                    .font(.caption)
                    .foregroundStyle(Theme.teal)

                HStack(spacing: 3) {
                    ForEach(0..<5) { index in
                        Image(systemName: starName(for: index))
                            .font(.system(size: 9))
                            .foregroundStyle(Theme.starYellow)
                    }
                    Text("(\(product.reviewCount))")
                        .font(.system(size: 9))
                        .foregroundStyle(.white.opacity(0.5))
                }

                HStack {
                    Text("$\(product.price, specifier: "%.2f")")
                        .font(.headline.weight(.bold))
                        .foregroundStyle(.white)

                    Spacer()

                    Button(action: onBuy) {
                        Text("Buy")
                            .font(.caption.weight(.bold))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 5)
                            .background(Theme.magenta)
                            .clipShape(Capsule())
                    }
                }
            }
            .padding(10)
        }
        .frame(width: 200)
        .background(Theme.navyCard)
        .clipShape(.rect(cornerRadius: 16))
    }

    private func starName(for index: Int) -> String {
        let starValue = Double(index) + 1.0
        if product.rating >= starValue { return "star.fill" }
        if product.rating >= starValue - 0.5 { return "star.leadinghalf.filled" }
        return "star"
    }
}
