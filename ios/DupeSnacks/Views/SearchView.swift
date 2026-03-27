import SwiftUI

struct SearchView: View {
    @Environment(SnackStore.self) private var store
    @State private var selectedProduct: Product?
    @State private var showFilters: Bool = false

    var body: some View {
        @Bindable var store = store

        NavigationStack {
            VStack(spacing: 0) {
                searchHeader

                ScrollView {
                    VStack(spacing: 12) {
                        categoryChips

                        sortPicker

                        if store.filteredProducts.isEmpty {
                            emptyState
                        } else {
                            LazyVStack(spacing: 10) {
                                ForEach(store.filteredProducts) { product in
                                    Button {
                                        selectedProduct = product
                                    } label: {
                                        ProductCardView(
                                            product: product,
                                            isFavorite: store.isFavorite(product),
                                            onFavorite: { store.toggleFavorite(product) },
                                            onBuy: { openAmazon(product) }
                                        )
                                    }
                                    .buttonStyle(.plain)
                                    .sensoryFeedback(.selection, trigger: selectedProduct)
                                }
                            }
                            .padding(.horizontal, 16)
                        }
                    }
                    .padding(.bottom, 20)
                }
                .scrollIndicators(.hidden)
            }
            .background(Theme.navy)
            .navigationBarTitleDisplayMode(.inline)
            .sheet(item: $selectedProduct) { product in
                ProductDetailView(product: product)
            }
            .sheet(isPresented: $showFilters) {
                FilterSheetView()
            }
        }
    }

    private var searchHeader: some View {
        VStack(spacing: 10) {
            HStack(spacing: 10) {
                @Bindable var store = store
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(.white.opacity(0.4))
                    TextField("Search snacks...", text: $store.searchText)
                        .foregroundStyle(.white)
                        .autocorrectionDisabled()
                    if !store.searchText.isEmpty {
                        Button {
                            store.searchText = ""
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(.white.opacity(0.4))
                        }
                    }
                }
                .padding(10)
                .background(Theme.navyLight)
                .clipShape(.rect(cornerRadius: 12))

                Button {
                    showFilters = true
                } label: {
                    Image(systemName: "slider.horizontal.3")
                        .font(.body.weight(.medium))
                        .foregroundStyle(hasActiveFilters ? Theme.magenta : .white.opacity(0.6))
                        .padding(10)
                        .background(Theme.navyLight)
                        .clipShape(.rect(cornerRadius: 12))
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    private var categoryChips: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 8) {
                chipButton(title: "All", isSelected: store.selectedCategory == nil) {
                    store.selectedCategory = nil
                }

                ForEach(SnackCategory.allCases) { category in
                    chipButton(
                        title: category.rawValue,
                        isSelected: store.selectedCategory == category
                    ) {
                        withAnimation(.snappy) {
                            store.selectedCategory = store.selectedCategory == category ? nil : category
                        }
                    }
                }
            }
        }
        .contentMargins(.horizontal, 16)
        .scrollIndicators(.hidden)
    }

    private func chipButton(title: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(isSelected ? .white : .white.opacity(0.6))
                .padding(.horizontal, 14)
                .padding(.vertical, 7)
                .background(isSelected ? Theme.magenta : Theme.navyLight)
                .clipShape(Capsule())
        }
    }

    private var sortPicker: some View {
        @Bindable var store = store
        return ScrollView(.horizontal) {
            HStack(spacing: 8) {
                ForEach(SortOption.allCases) { option in
                    Button {
                        withAnimation(.snappy) {
                            store.sortOption = option
                        }
                    } label: {
                        HStack(spacing: 4) {
                            if store.sortOption == option {
                                Image(systemName: "checkmark")
                                    .font(.caption2.weight(.bold))
                            }
                            Text(option.rawValue)
                                .font(.caption.weight(.medium))
                        }
                        .foregroundStyle(store.sortOption == option ? Theme.teal : .white.opacity(0.5))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(
                            store.sortOption == option
                                ? Theme.teal.opacity(0.15)
                                : Color.clear
                        )
                        .clipShape(Capsule())
                        .overlay(
                            Capsule()
                                .strokeBorder(
                                    store.sortOption == option
                                        ? Theme.teal.opacity(0.3)
                                        : Color.white.opacity(0.1),
                                    lineWidth: 1
                                )
                        )
                    }
                }
            }
        }
        .contentMargins(.horizontal, 16)
        .scrollIndicators(.hidden)
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 48))
                .foregroundStyle(.white.opacity(0.2))
            Text("No snacks found")
                .font(.title3.weight(.semibold))
                .foregroundStyle(.white.opacity(0.5))
            Text("Try adjusting your search or filters")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.3))

            if hasActiveFilters {
                Button {
                    store.clearFilters()
                } label: {
                    Text("Clear Filters")
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(Theme.magenta)
                }
            }
        }
        .padding(.top, 60)
    }

    private var hasActiveFilters: Bool {
        store.isGlutenFreeCertifiedOnly ||
        !store.selectedAllergens.isEmpty ||
        store.priceRange != 0...30
    }

    private func openAmazon(_ product: Product) {
        guard let url = product.amazonURL else { return }
        UIApplication.shared.open(url)
    }
}
