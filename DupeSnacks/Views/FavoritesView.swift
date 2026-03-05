import SwiftUI

struct FavoritesView: View {
    @Environment(SnackStore.self) private var store
    @State private var selectedProduct: Product?

    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    var body: some View {
        NavigationStack {
            Group {
                if store.favoriteProducts.isEmpty {
                    emptyState
                } else {
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(store.favoriteProducts) { product in
                                Button {
                                    selectedProduct = product
                                } label: {
                                    FavoriteCardView(
                                        product: product,
                                        onFavorite: { store.toggleFavorite(product) }
                                    )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 8)
                        .padding(.bottom, 20)
                    }
                    .scrollIndicators(.hidden)
                }
            }
            .background(Theme.navy)
            .navigationTitle("Favorites")
            .navigationBarTitleDisplayMode(.large)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .sheet(item: $selectedProduct) { product in
                ProductDetailView(product: product)
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "heart.slash")
                .font(.system(size: 56))
                .foregroundStyle(Theme.magenta.opacity(0.4))
                .symbolEffect(.pulse, options: .repeating)

            Text("No Favorites Yet")
                .font(.title2.weight(.bold))
                .foregroundStyle(.white)

            Text("Tap the heart on any snack to save it here")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.5))
                .multilineTextAlignment(.center)
        }
        .padding(40)
    }
}

struct FavoriteCardView: View {
    let product: Product
    let onFavorite: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Color(white: 0.15)
                .aspectRatio(1.3, contentMode: .fit)
                .overlay {
                    AsyncImage(url: product.imageURL) { phase in
                        if let image = phase.image {
                            image.resizable().aspectRatio(contentMode: .fill)
                        } else {
                            ProgressView().tint(.white.opacity(0.5))
                        }
                    }
                    .allowsHitTesting(false)
                }
                .clipShape(.rect(cornerRadius: 12, style: .continuous))
                .overlay(alignment: .topTrailing) {
                    Button(action: onFavorite) {
                        Image(systemName: "heart.fill")
                            .font(.subheadline)
                            .foregroundStyle(Theme.magenta)
                            .padding(6)
                            .background(.black.opacity(0.45), in: Circle())
                    }
                    .padding(6)
                }

            VStack(alignment: .leading, spacing: 3) {
                Text(product.name)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.white)
                    .lineLimit(2)

                Text(product.brand)
                    .font(.caption2)
                    .foregroundStyle(Theme.teal)

                Text("$\(product.price, specifier: "%.2f")")
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(.white)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 8)
        }
        .background(Theme.navyCard)
        .clipShape(.rect(cornerRadius: 14))
    }
}
