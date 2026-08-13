## Motivation 

While building the documentation for ZikoJS, I needed a way to organize a large API reference into a deeply nested sidebar while keeping the navigation fully translated.

The documentation structure started simple:

```
Reference
├── Core
├── Wrapper
└── Server
```

But as the ZikoJS API grew, the Core reference became more structured:

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

I wanted the same structure to work naturally across multiple languages, for example:

```
Reference
└── Core
    └── UI
        ├── Built-in Components
        ├── UI Constructors
        └── Utilities
```

becoming :

```
المرجع
└── النواة
    └── واجهة المستخدم
        ├── المكونات المدمجة
        ├── منشئات واجهة المستخدم
        └── الأدوات المساعدة
```

Starlight provides excellent support for localized sidebar labels, but defining translations for a deeply nested structure can become repetitive and difficult to maintain. In particular, automatically generated directories make it difficult to control the translation of every level of a nested reference tree.

I initially solved this by manually constructing the Starlight sidebar configuration. As the ZikoJS documentation grew, however, this became increasingly verbose:

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

This led to the idea behind `starlight-sidebar`: describe the documentation hierarchy once, using a simple nested structure, and let the utility transform it into the sidebar configuration expected by Starlight.

The result is a cleaner separation between ***documentation structure*** and ***Starlight's sidebar API***, while making deeply nested and multilingual documentation much easier to maintain.

```
Documentation structure
        ↓
  starlight-sidebar
        ↓
Starlight sidebar configuration
```

Although the utility was initially created for the ZikoJS documentation, the problem is not specific to ZikoJS. Any Astro Starlight project with a large, nested, multilingual documentation structure can benefit from the same approach.