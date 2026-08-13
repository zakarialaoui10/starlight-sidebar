import { mapfun } from "ziko/math";

function transformNode(node, currentPath, locale) {
  const { translations = {}, items } = node;

  const label = translations[locale] ?? "";

  const translatedLabels = Object.fromEntries(
    Object.entries(translations).filter(([lang]) => lang !== locale)
  );

  const starlightItem = {
    label,
    ...(Object.keys(translatedLabels).length > 0 && {
      translations: translatedLabels,
    }),
  };

  if (items) {
    starlightItem.items = mapSidebarItems(items, currentPath, locale);
  } else {
    starlightItem.items = [
      {
        autogenerate: {
          directory: currentPath,
        },
      },
    ];
  }

  return starlightItem;
}

function mapSidebarItems(structure, parentPath, locale) {
  const mappedObj = mapfun((val) => val, structure);

  return Object.entries(mappedObj).map(([key, val]) => {
    const currentPath = `${parentPath}/${key}`;
    return transformNode(val, currentPath, locale);
  });
}

export function createSidebarItems(
  structure,
  { locale = "en", rootDirectory = "reference" } = {}
) {
  return mapSidebarItems(structure, rootDirectory, locale);
}

export function createSidebar({
  label,
  translations = {},
  items,
  locale = "en",
  rootDirectory = "reference",
}) {
  const translatedLabels = Object.fromEntries(
    Object.entries(translations).filter(([lang]) => lang !== locale)
  );

  return {
    label: translations[locale] ?? label,

    ...(Object.keys(translatedLabels).length > 0 && {
      translations: translatedLabels,
    }),

    items: createSidebarItems(items, {
      locale,
      rootDirectory,
    }),
  };
}