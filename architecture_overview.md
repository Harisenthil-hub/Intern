# GasTrack Pro — Frontend Architecture

This document explains the full folder structure of the GasTrack Pro inventory system and how all the React components are connected and mounted.

## 📂 Folder Structure Overview

```text
frontend/src/
├── main.jsx                     # 1. Entry point: Mounts React to the DOM
├── App.jsx                      # 2. Global wrappers (Router, Providers)
├── index.css                    # Global styles (Tailwind config, custom OKLCH colors)
│
├── routes/
│   └── AppRoutes.jsx            # 3. Connects URLs to Pages via React Router
│
├── components/
│   ├── layout/                  # 4. App Shell (Sidebar, TopNav, Page Wrapper)
│   │   ├── Layout.jsx           # Master layout containing the sticky Sidebar
│   │   └── AppSideBar.jsx       # Navigation sidebar with all page links
│   │
│   └── ui/                      # Generic reusable UI blocks (ShadCN UI library)
│       ├── button.jsx, input.jsx, select.jsx, label.jsx, sidebar.jsx, etc.
│
├── pages/                       # 5. Top-level Route Pages
│   ├── Dashboard.jsx            # The main dashboard with stats and overview
│   ├── TankMaster.jsx           # Wrapper page for /tanks route
│   ├── Production.jsx           # Wrapper page for /production route
│   └── Monitoring.jsx           # Wrapper page for /monitoring route
│
└── modules/                     # 6. Feature-specific business logic & sub-components
    │
    ├── tanks/                   # ── TANK MASTER MODULE ──
    │   ├── TankMasterView.jsx   # Core logic: State manager for tanks (Draft/Post logic)
    │   └── components/
    │       ├── TankTable.jsx    # Displays the list of tanks
    │       ├── AddTankPage.jsx  # Form for adding/editing a tank
    │       └── ViewTankPage.jsx # Locked detail view for a specific tank
    │
    ├── production/              # ── GAS PRODUCTION MODULE ──
    │   ├── ProductionView.jsx   # Core logic: State manager for production entries
    │   └── components/
    │       ├── ProductionTable.jsx
    │       ├── AddProductionPage.jsx
    │       └── ViewProductionPage.jsx
    │
    └── monitoring/              # ── TANK MONITORING MODULE ──
        ├── MonitoringView.jsx   # Core logic: State manager for tank levels and log table
        └── components/
            ├── TankCard.jsx          # Visual block showing live capacity % and level
            └── AddLevelEntryPage.jsx # Form calculating (Opening + Added - Issued)
```

---

## 🔗 How Components are Connected & Mounted

The application uses a **Top-Down Unidirectional Flow**. Here is the exact chain of how a user sees a screen:

### Level 1: Root Mounting (`main.jsx` & `App.jsx`)
When the webpage loads, `main.jsx` grabs the `<div id="root">` from your HTML file and **mounts the React Application**. Inside `App.jsx`, we wrap the entire app in a `BrowserRouter` so React handles URLs (like `/tanks` and `/production`) without reloading the page.

### Level 2: The Routing & Layout (`AppRoutes.jsx` & `Layout.jsx`)
`AppRoutes.jsx` listens to the URL in the browser bar.
- It always wraps the screen in `<Layout>`.
- The `<Layout>` component forces `<AppSideBar>` to render on the left, and creates a main `main` box on the right.
- Whatever URL you type, the matching Page component is injected into that right-side box.

### Level 3: The Feature Pages (`pages/`)
If the user clicks "Tank Master" in the sidebar, the URL changes to `/tanks`.
`AppRoutes` sees `/tanks` and mounts `<TankMaster />` (from the `pages` folder).
The page acts as a simple empty canvas, and immediately mounts the brain of that feature: `<TankMasterView />`.

### Level 4: The Module "Brain" (`modules/...View.jsx`)
This is the most important part of the architecture. Let's use `ProductionView.jsx` as an example.
The View component holds two critical pieces of React State (`useState`):
1. **The Data Array**: `[entries, setEntries]` — contains all the dummy data (drafts and posted).
2. **The View Mode**: `[viewMode, setViewMode]` — a string tracking what the user is looking at (`"list"`, `"add"`, `"view"`, or `"edit"`).

Depending on what `viewMode` equals, `ProductionView.jsx` runs an `if` statement to mount only one specific feature component:

```javascript
// Pseudo Code of how the "brain" connects everything
if (viewMode === "add") {
    // Mounts the Entry Form
    return <AddProductionPage onAdd={handleSaveData} />;

} else if (viewMode === "edit") {
    // Mounts the exact same Form, but passes the existing data into 'initialData'
    return <AddProductionPage initialData={selectedItem} onAdd={handleUpdateData} />;

} else if (viewMode === "view") {
    // Mounts the Locked display page
    return <ViewProductionPage item={selectedItem} />;

} else {
    // Default: Mounts the Data Table
    return <ProductionTable data={entries} onRowClick={handleView} />;
}
```

---

## 🔒 Summary of State Flow (Draft vs Post)

The recent modifications improved the connection between adding and editing forms:

1. **Saving**: When a user clicks "Save Draft" in `<AddProductionPage>`, it passes an object back up to the brain (`ProductionView`) via an `onAdd` callback with `_mode: "save"`.
2. **Updating Local State**: The `ProductionView` pushes that object into its array. It renders the row with a yellow "Draft" pill.
3. **Editing**: If the user clicks "Edit", the View switches the UI to `<AddProductionPage>` again, but passes the row data down as a prop called `initialData`. The form sees this prop, fills all its text inputs automatically, and waits for a new save.
4. **Posting**: When "Post" is clicked, the object is updated to `_mode: "post"`. The View reacts by turning the badge grey with a Lock icon, and the "Edit" button logic becomes `if (isPosted) return null;`, completely hiding the button from view.
