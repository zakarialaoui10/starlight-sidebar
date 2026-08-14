## Motivation

While building the documentation for ZikoJS, I needed a better way to organize a growing API reference into a deeply nested sidebar while keeping the navigation fully translated.

The documentation started with a simple structure:

```text
Reference
├── Core
├── Wrapper
└── Server
```
As the ZikoJS API grew, the Core reference became more detailed :

```
Reference
└── Core
    ├── UI
    │   ├── Built-in Components
    │   ├── UI Constructors
    │   └── Utilities
    ├── Math
    ├── Router
    ├── Time
    ├── Hooks
    └── Events
```

I wanted this same hierarchy to work naturally across multiple languages.
For example, the English sidebar :

```
Reference
└── Core
    └── UI
        ├── Built-in Components
        ├── UI Constructors
        └── Utilities
```

should become :

```
المرجع
└── النواة
    └── واجهة المستخدم
        ├── المكونات المدمجة
        ├── منشئات واجهة المستخدم
        └── الأدوات المساعدة
```

Starlight already provides excellent support for localized sidebar labels. However, when working with deeply nested structures, manually defining every level of the sidebar can become verbose and difficult to maintain.

I initially built the sidebar manually :

```js
{
  label: "UI",
  translations: {
    ar: "واجهة المستخدم",
  },
  items: [
    {
      label: "Built-in Components",
      translations: {
        ar: "المكونات المدمجة",
      },
      // ...
    },
  ],
}
```

As the ZikoJS documentation grew, maintaining this configuration became increasingly repetitive.

I then explored representing the documentation hierarchy separately from the Starlight configuration :

```js
{
  core: {
    ui: {
      "built-in-components": {},
      "ui-constructors": {},
      utilities: {},
    },
    math: {},
    router: {},
    time: {},
    hooks: {},
    events: {},
  },
  wrapper: {},
  server: {},
}
```

However, this introduced another structure that had to be maintained alongside the translations.

The current approach simplifies this further by using a flattened translation map as the single source of truth :

```js
const translations = {
  reference: {
    en: "Reference",
    ar: "المرجع",
  },

  "reference/core": {
    en: "Core",
    ar: "النواة",
  },

  "reference/core/ui": {
    en: "UI",
    ar: "واجهة المستخدم",
  },

  "reference/core/ui/utilities": {
    en: "Utilities",
    ar: "الأدوات المساعدة",
  },
};
```

The path itself describes the hierarchy :

```text
reference
└── core
    └── ui
        └── utilities
```

`starlight-sidebar` derives the nested structure from these paths and generates the corresponding Starlight sidebar configuration :

```
Translation map
       ↓
starlight-sidebar
       ↓
Directory hierarchy
       ↓
Starlight sidebar configuration
```

This allows the documentation structure and its translations to live together without manually maintaining two separate trees.

The utility also supports multiple locales by selecting the requested locale as the primary label while passing the remaining locales to Starlight's translations property.

For example :

```js
createSidebar(translations, {
  locale: "en",
  rootDirectory: "reference",
});
```

can generate the appropriate Starlight sidebar while preserving the Arabic translations.

The implementation also makes use of ZikoJS's `mapfun` where appropriate for recursive data transformation. This was a natural fit because the problem involves transforming nested documentation data into another representation.

Although `starlight-sidebar` was originally created while solving a problem in the ZikoJS documentation, the problem itself is not specific to ZikoJS.

Any Astro Starlight project with a large, nested, multilingual documentation structure can benefit from the same approach:

> Define the paths and translations once, and let starlight-sidebar handle the repetitive Starlight sidebar configuration.