# starlight-sidebar
A lightweight utility for building deeply nested, multilingual Starlight sidebars from a simple, declarative structure.

```js
const sidebar = createSidebar({
  label: "Reference",

  translations: {
    en: "Reference",
    ar: "المرجع",
  },

  items: {
    core: {
      translations: {
        en: "Core",
        ar: "النواة",
      },

      items: {
        ui: {
          translations: {
            en: "UI",
            ar: "واجهة المستخدم",
          },

          items: {
            utilities: {
              translations: {
                en: "Utilities",
                ar: "الأدوات المساعدة",
              },
            },
          },
        },
      },
    },
  },
});
```
