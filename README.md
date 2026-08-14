# starlight-sidebar
A lightweight utility for building deeply nested, multilingual Astro Starlight sidebars from a simple, declarative translation map.

Instead of manually defining nested Starlight sidebar objects, starlight-sidebar derives the hierarchy directly from your directory paths.

## Usage 

```js
import { createSidebar } from 'starlight-sidebar'
export const ReferenceTranslations = {
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
  "reference/core/ui/built-in-components": {
    en: "Built-in Components",
    ar: "المكونات المدمجة",
  },
}
const sidebar = createSidebar(ReferenceTranslations);
```

The directory hierarchy is inferred from the translation keys:

```
reference/
└── core/
    └── ui/
        ├── built-in-components/
        ├── ui-constructors/
        └── utilities/
```
And the generated result is compatible with Starlight's sidebar configuration.

## Features

- ***Deeply nested sidebars*** : Supports arbitrary levels of nested documentation.
- ***Flexible integration*** : Mix generated sidebars from createSidebar() with manually defined Starlight sidebar sections in the same configuration.
```js
{
  /// ...
  sidebar: [
    {
      label: "Start Here",
      items: [
        {
          autogenerate: {
            directory: "get-started",
          },
        },
      ],
    },
    createSidebar(ReferenceTranslations),
  ],
}

```
- ***Multilingual labels*** :  Define translations for every sidebar level.
- ***Path-based structure*** : The hierarchy is derived automatically from directory paths.
- ***No duplicated structure*** : No need to maintain a separate nested structure object.
- ***Automatic directory generation*** : Leaf nodes are automatically converted to autogenerate entries.
- ***Default locale support*** : Use English by default or specify another base locale.
- ***Declarative API*** : Describe what your documentation contains rather than manually constructing sidebar objects.
- ***Recursive transformation*** : Deeply nested structures are generated automatically.

## Configuration 

```js
createSidebar(translations, options);
```

|Option|Type|Default|Description|
|-|-|-|-|
|`defaultLocale`|`string`|`en`|Locale used for the primary Starlight label|
|`rootDirectory`|`string`|inferred|Root documentation directory|

## How it works ? 

starlight-sidebar separates the documentation hierarchy from Starlight's sidebar configuration.

Instead of writing :

```js
{
  label: "Core",
  translations: {
    ar: "النواة",
  },
  items: [
    {
      label: "UI",
      translations: {
        ar: "واجهة المستخدم",
      },
      items: [
        // ...
      ],
    },
  ],
}
```

you describe the hierarchy through paths:

```js
{
  "reference/core": {
    en: "Core",
    ar: "النواة",
  },

  "reference/core/ui": {
    en: "UI",
    ar: "واجهة المستخدم",
  },
}
```

The utility transforms those paths into the nested structure expected by Starlight : 