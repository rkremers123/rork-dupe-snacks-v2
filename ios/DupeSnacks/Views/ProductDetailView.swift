import SwiftUI

struct ProductDetailView: View {
    @Environment(SnackStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let product: Product

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    heroImage
                    detailContent
                }
            }
            .scrollIndicators(.hidden)
            .background(Theme.navy)
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Theme.navy.opacity(0.8), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title3)
                            .symbolRenderingMode(.hierarchical)
                            .foregroundStyle(.white.opacity(0.7))
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        store.toggleFavorite(product)
                    } label: {
                        Image(systemName: store.isFavorite(product) ? "heart.fill" : "heart")
                            .font(.title3)
                            .foregroundStyle(store.isFavorite(product) ? Theme.magenta : .white.opacity(0.7))
                            .contentTransition(.symbolEffect(.replace))
                    }
                    .sensoryFeedback(.impact(weight: .light), trigger: store.isFavorite(product))
                }
            }
            .safeAreaInset(edge: .bottom) {
                buyButton
            }
        }
        .presentationDragIndicator(.visible)
    }

    private var heroImage: some View {
        Color(white: 0.12)
            .frame(height: 280)
            .overlay {
                AsyncImage(url: product.imageURL) { phase in
                    if let image = phase.image {
                        image.resizable().aspectRatio(contentMode: .fill)
                    } else if phase.error != nil {
                        Image(systemName: "photo")
                            .font(.largeTitle)
                            .foregroundStyle(.white.opacity(0.2))
                    } else {
                        ProgressView().tint(.white.opacity(0.5))
                    }
                }
                .allowsHitTesting(false)
            }
            .clipped()
            .overlay(alignment: .bottomLeading) {
                LinearGradient(
                    stops: [
                        .init(color: .clear, location: 0.5),
                        .init(color: Theme.navy.opacity(0.95), location: 1.0)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            }
            .overlay(alignment: .bottomLeading) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Dupe for \(product.dupeOf)")
                        .font(.caption.weight(.medium))
                        .foregroundStyle(Theme.teal)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Theme.teal.opacity(0.15))
                        .clipShape(Capsule())

                    Text(product.name)
                        .font(.title2.weight(.bold))
                        .foregroundStyle(.white)
                }
                .padding(16)
            }
    }

    private var detailContent: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Text(product.brand)
                    .font(.headline)
                    .foregroundStyle(Theme.teal)

                Spacer()

                Text("$\(product.price, specifier: "%.2f")")
                    .font(.title.weight(.bold))
                    .foregroundStyle(.white)
            }

            ratingRow

            badgesSection

            Text(product.description)
                .font(.body)
                .foregroundStyle(.white.opacity(0.8))
                .lineSpacing(4)

            if !product.allergens.isEmpty {
                allergenSection
            }
        }
        .padding(16)
    }

    private var ratingRow: some View {
        HStack(spacing: 4) {
            ForEach(0..<5) { index in
                Image(systemName: starName(for: index))
                    .font(.body)
                    .foregroundStyle(Theme.starYellow)
            }
            Text("\(product.rating, specifier: "%.1f")")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
            Text("(\(product.reviewCount) reviews)")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.5))
        }
    }

    private var badgesSection: some View {
        HStack(spacing: 8) {
            if product.isGlutenFreeCertified {
                HStack(spacing: 4) {
                    Image(systemName: "checkmark.seal.fill")
                        .font(.caption)
                    Text("Gluten-Free Certified")
                        .font(.caption.weight(.semibold))
                }
                .foregroundStyle(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Theme.certifiedGreen)
                .clipShape(Capsule())
            }

            HStack(spacing: 4) {
                Image(systemName: "leaf.fill")
                    .font(.caption)
                Text(product.category.rawValue)
                    .font(.caption.weight(.medium))
            }
            .foregroundStyle(.white.opacity(0.8))
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Theme.navyLight)
            .clipShape(Capsule())
        }
    }

    private var allergenSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Contains")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white.opacity(0.6))

            HStack(spacing: 6) {
                ForEach(product.allergens) { allergen in
                    Text(allergen.rawValue)
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Theme.allergenRed.opacity(0.8))
                        .clipShape(Capsule())
                }
            }
        }
    }

    private var buyButton: some View {
        Button {
            guard let url = product.amazonURL else { return }
            UIApplication.shared.open(url)
        } label: {
            HStack(spacing: 8) {
                Image(systemName: "cart.fill")
                Text("Buy on Amazon")
                    .fontWeight(.bold)
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Theme.magenta)
            .clipShape(.rect(cornerRadius: 16))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Theme.navy)
    }

    private func starName(for index: Int) -> String {
        let starValue = Double(index) + 1.0
        if product.rating >= starValue { return "star.fill" }
        if product.rating >= starValue - 0.5 { return "star.leadinghalf.filled" }
        return "star"
    }
}
