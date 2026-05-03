# GasTrack Pro — Component Architecture Visual Map

This document visually maps how every single React component mounts in the application and what states are managed.

## Application Root Mounting (App.jsx & Routing)

The entry point of the app forces a top-level layout wrapper and resolves the URL to inject a Feature Page.

```mermaid
graph TD
    Root[main.jsx: HTML React Mount] --> App[App.jsx: Global Providers]
    App --> Router[AppRoutes.jsx: URL Router]
    
    Router --> LayoutWrapper[Layout.jsx: Application Shell]
    LayoutWrapper -.- AppSideBar[Sidebar Navigation]
    
    Router -- "/tanks" --> TankMasterPage[pages/TankMaster.jsx]
    Router -- "/production" --> ProdPage[pages/Production.jsx]
    Router -- "/monitoring" --> MonitPage[pages/Monitoring.jsx]
    Router -- "/" --> DashPage[pages/Dashboard.jsx]

    style Root fill:#f1f5f9,stroke:#94a3b8
    style App fill:#f1f5f9,stroke:#94a3b8
    style Router fill:#e0f2fe,stroke:#38bdf8
    style LayoutWrapper fill:#fef08a,stroke:#eab308
    style TankMasterPage fill:#1e40af,color:#fff
    style ProdPage fill:#b45309,color:#fff
    style MonitPage fill:#0f766e,color:#fff
```

___

## Tank Master Module (`/tanks`)

The Tank Master tracks bulk gas storage. `TankMasterView.jsx` acts as the traffic controller, holding the state of the table data and dynamically switching the mounted child based on `viewMode`.

```mermaid
graph TD
    TankMaster[pages/TankMaster.jsx] --> TankView[TankMasterView.jsx]
    
    %% State Variables
    TankView -.- State1[State: tanks Array]
    TankView -.- State2[State: viewMode string]
    
    TankView -- "viewMode = 'grid'" --> TankTable[TankTable.jsx]
    TankView -- "viewMode = 'add'" --> AddTank[AddTankPage.jsx initialData=null]
    TankView -- "viewMode = 'edit'" --> EditTank[AddTankPage.jsx initialData=tank]
    TankView -- "viewMode = 'view'" --> LockView[ViewTankPage.jsx]

    style TankMaster fill:#1e40af,color:#fff
    style TankView fill:#dbeafe,stroke:#3b82f6
    style TankTable fill:#f1f5f9
    style AddTank fill:#bbf7d0
    style EditTank fill:#fef08a
    style LockView fill:#e2e8f0
```

___

## Gas Production Module (`/production`)

The Production system operates almost identically to Tank Master, using a `_mode` flag string (`save` vs `post`) in the data object to determine if editing is allowed.

```mermaid
graph TD
    ProdMaster[pages/Production.jsx] --> ProdView[ProductionView.jsx]
    
    %% State Variables
    ProdView -.- State1[State: entries Array]
    ProdView -.- State2[State: viewMode string]
    
    ProdView -- "viewMode = 'list'" --> ProdTable[ProductionTable.jsx]
    ProdView -- "viewMode = 'add'" --> AddProd[AddProductionPage.jsx initialData=null]
    ProdView -- "viewMode = 'edit'" --> EditProd[AddProductionPage.jsx initialData=entry]
    ProdView -- "viewMode = 'view'" --> LockView[ViewProductionPage.jsx]

    style ProdMaster fill:#b45309,color:#fff
    style ProdView fill:#ffedd5,stroke:#f97316
    style ProdTable fill:#f1f5f9
    style AddProd fill:#bbf7d0
    style EditProd fill:#fef08a
    style LockView fill:#e2e8f0
```

___

## Tank Monitoring Module (`/monitoring`)

The Monitoring system is unique. Instead of a standard table, the default view is a responsive grid of `<TankCard>` elements summarizing capacity, with an Entry Log history table below it.

```mermaid
graph TD
    MonitMaster[pages/Monitoring.jsx] --> MonitView[MonitoringView.jsx]
    
    %% State Variables
    MonitView -.- State1[State: tanks Array]
    MonitView -.- State2[State: entries Array]
    MonitView -.- State3[State: viewMode string]
    
    MonitView -- "viewMode = 'grid'" --> Grid[CSS Grid]
    Grid --> TankCard1[TankCard.jsx: TK-1001]
    Grid --> TankCardN[TankCard.jsx: TK-100N]
    
    Grid --> LogTable[HTML/React Logic: Entry Log Table]
    
    MonitView -- "viewMode = 'add'" --> AddLevel[AddLevelEntryPage.jsx]
    MonitView -- "viewMode = 'edit'" --> EditLevel[AddLevelEntryPage.jsx]

    style MonitMaster fill:#0f766e,color:#fff
    style MonitView fill:#ccfbf1,stroke:#14b8a6
    style Grid fill:#f1f5f9
    style TankCard1 fill:#fff
    style AddLevel fill:#bbf7d0
    style EditLevel fill:#fef08a
```

___

## Component Architecture Principles

### 1. The "Traffic Cop" Pattern (Conditional Rendering)
Instead of relying on heavy page routing (which would refresh the dashboard shell unnecessarily), each feature's `View.jsx` acts as a pure state machine:
- It tracks `viewMode`. 
- Depending on the active mode string, it physically unmounts the current child (e.g., table) and mounts the incoming child (e.g., editing form).

### 2. Form Reusability (Prop Drilling)
Forms are **never duplicated**. Whether creating a new Tank or Editing an existing one, the application uses `<AddTankPage>`.
- If `initialData` evaluates to a null value, the form loads empty fields.
- If `initialData` receives an active Object, it injects those properties directly into React State, forcing the component to mount in "Edit Mode".

### 3. The Lock (`_mode = "post"`) System 
When updating data on any form, a user can trigger either the `handleSave("save")` or `handleSave("post")` callbacks.
- The `View.jsx` component receives the updated data object.
- The Object is destructured to add `_mode: "post"`.
- Any component interpreting `_mode: "post"` will strictly conditionally hide the `<button>` tags required to open the Edit screen!
