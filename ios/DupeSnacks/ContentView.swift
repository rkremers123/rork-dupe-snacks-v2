import SwiftUI

struct ContentView: View {
    @State private var selectedTab: AppTab = .browse
    @State private var store = SnackStore()

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Browse", systemImage: "house.fill", value: .browse) {
                BrowseView()
            }

            Tab("Search", systemImage: "magnifyingglass", value: .search) {
                SearchView()
            }

            Tab("Favorites", systemImage: "heart.fill", value: .favorites) {
                FavoritesView()
            }
        }
        .tint(tintForTab)
        .environment(store)
    }

    private var tintForTab: Color {
        switch selectedTab {
        case .browse: Theme.teal
        case .search: Theme.magenta
        case .favorites: Theme.magenta
        }
    }
}

enum AppTab: Hashable {
    case browse
    case search
    case favorites
}
