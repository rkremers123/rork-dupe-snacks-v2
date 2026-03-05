import SwiftUI

struct FilterSheetView: View {
    @Environment(SnackStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var tempCertifiedOnly: Bool = false
    @State private var tempAllergens: Set<Allergen> = []
    @State private var tempPriceLow: Double = 0
    @State private var tempPriceHigh: Double = 30

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    certificationSection
                    allergenSection
                    priceSection
                }
                .padding(16)
            }
            .background(Theme.navy)
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Theme.navyLight, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Reset") {
                        tempCertifiedOnly = false
                        tempAllergens = []
                        tempPriceLow = 0
                        tempPriceHigh = 30
                    }
                    .foregroundStyle(Theme.teal)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Apply") {
                        applyFilters()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                    .foregroundStyle(Theme.magenta)
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationContentInteraction(.scrolls)
        .onAppear {
            tempCertifiedOnly = store.isGlutenFreeCertifiedOnly
            tempAllergens = store.selectedAllergens
            tempPriceLow = store.priceRange.lowerBound
            tempPriceHigh = store.priceRange.upperBound
        }
    }

    private var certificationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Certification")
                .font(.headline.weight(.bold))
                .foregroundStyle(.white)

            Toggle(isOn: $tempCertifiedOnly) {
                HStack(spacing: 8) {
                    Image(systemName: "checkmark.seal.fill")
                        .foregroundStyle(Theme.certifiedGreen)
                    Text("Gluten-Free Certified Only")
                        .font(.subheadline)
                        .foregroundStyle(.white)
                }
            }
            .tint(Theme.teal)
            .padding(12)
            .background(Theme.navyCard)
            .clipShape(.rect(cornerRadius: 12))
        }
    }

    private var allergenSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Exclude Allergens")
                .font(.headline.weight(.bold))
                .foregroundStyle(.white)

            Text("Hide products containing:")
                .font(.caption)
                .foregroundStyle(.white.opacity(0.5))

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 100), spacing: 8)], spacing: 8) {
                ForEach(Allergen.allCases) { allergen in
                    Button {
                        if tempAllergens.contains(allergen) {
                            tempAllergens.remove(allergen)
                        } else {
                            tempAllergens.insert(allergen)
                        }
                    } label: {
                        HStack(spacing: 6) {
                            if tempAllergens.contains(allergen) {
                                Image(systemName: "xmark")
                                    .font(.caption2.weight(.bold))
                            }
                            Text(allergen.rawValue)
                                .font(.subheadline.weight(.medium))
                        }
                        .foregroundStyle(tempAllergens.contains(allergen) ? .white : .white.opacity(0.6))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(tempAllergens.contains(allergen) ? Theme.allergenRed.opacity(0.7) : Theme.navyCard)
                        .clipShape(.rect(cornerRadius: 10))
                    }
                }
            }
        }
    }

    private var priceSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Price Range")
                .font(.headline.weight(.bold))
                .foregroundStyle(.white)

            HStack {
                Text("$\(Int(tempPriceLow))")
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(Theme.teal)

                Spacer()

                Text("$\(Int(tempPriceHigh))")
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(Theme.teal)
            }

            HStack(spacing: 16) {
                Slider(value: $tempPriceLow, in: 0...29, step: 1) {
                    Text("Min")
                }
                .tint(Theme.teal)
                .onChange(of: tempPriceLow) { _, newValue in
                    if newValue >= tempPriceHigh {
                        tempPriceLow = tempPriceHigh - 1
                    }
                }

                Slider(value: $tempPriceHigh, in: 1...30, step: 1) {
                    Text("Max")
                }
                .tint(Theme.magenta)
                .onChange(of: tempPriceHigh) { _, newValue in
                    if newValue <= tempPriceLow {
                        tempPriceHigh = tempPriceLow + 1
                    }
                }
            }
            .padding(12)
            .background(Theme.navyCard)
            .clipShape(.rect(cornerRadius: 12))
        }
    }

    private func applyFilters() {
        store.isGlutenFreeCertifiedOnly = tempCertifiedOnly
        store.selectedAllergens = tempAllergens
        store.priceRange = tempPriceLow...tempPriceHigh
    }
}
