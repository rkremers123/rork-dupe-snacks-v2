import SwiftUI

struct ProductCardView: View {
    let product: Product
    let isFavorite: Bool
    let onFavorite: () -> Void
    let onBuy: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Color(white: 0.15)
                .frame(width: 110, height: 110)
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
                .clipShape(.rect(cornerRadius: 12))

            VStack(alignment: .leading, spacing: 6) {
                Text(product.name)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.white)
                    .lineLimit(2)

                Text(product.brand)
                    .font(.caption)
                    .foregroundStyle(Theme.teal)

                HStack(spacing: 3) {
                    ForEach(0..<5) { index in
                        Image(systemName: starImageName(for: index))
                            .font(.system(size: 10))
                            .foregroundStyle(Theme.starYellow)
                    }
                    Text("(\(product.reviewCount))")
                        .font(.caption2)
                        .foregroundStyle(.white.opacity(0.6))
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
                            .padding(.horizontal, 16)
                            .padding(.vertical, 7)
                            .background(Theme.magenta)
                            .clipShape(Capsule())
                    }
                }
            }

            VStack {
                Button(action: onFavorite) {
                    Image(systemName: isFavorite ? "heart.fill" : "heart")
                        .font(.body)
                        .foregroundStyle(isFavorite ? Theme.magenta : .white.opacity(0.5))
                }
                .contentTransition(.symbolEffect(.replace))

                Spacer()
            }
        }
        .padding(12)
        .background(Theme.navyCard)
        .clipShape(.rect(cornerRadius: 16))
    }

    private func starImageName(for index: Int) -> String {
        let starValue = Double(index) + 1.0
        if product.rating >= starValue {
            return "star.fill"
        } else if product.rating >= starValue - 0.5 {
            return "star.leadinghalf.filled"
        }
        return "star"
    }
}
