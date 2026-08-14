import { mapfun } from "ziko/math";

function createStructure(translations) {
  const entries = Object.entries(translations).map(
    ([path, labels]) => ({
      __mapfun__: true,
      path,
      labels,
    }),
  );
  const nodes = mapfun(
    (entry) => ({
      path: entry.path,
      labels: entry.labels,
      parts: entry.path.split("/"),
    }),
    entries,
  );
  const structure = {};
  for (const { parts } of nodes) {
    let current = structure;
    for (const part of parts) {
      current[part] ??= {};
      current = current[part];
    }
  }
  return structure;
}

function getTranslations(
  translations,
  path,
  defaultLocale,
) {
  const labels = translations[path] ?? {};
  const label =
    labels[defaultLocale] ??
    path.split("/").pop();
  const translatedLabels = Object.fromEntries(
    Object.entries(labels).filter(
      ([language]) => language !== defaultLocale,
    ),
  );

  return {
    label,
    ...(Object.keys(translatedLabels).length > 0 && {
      translations: translatedLabels,
    }),
  };
}

function mapSidebarItems(structure, translations, parentPath, defaultLocale) {
  const entries = Object.entries(structure);
  const nodes = entries.map(
    ([name, children]) => ({
      __mapfun__: true,
      name,
      children,
    }),
  );
  return mapfun(
    (node) => {
      const currentPath = `${parentPath}/${node.name}`;
      const item = getTranslations(
        translations,
        currentPath,
        defaultLocale,
      );
      const hasChildren = Object.keys(node.children).length > 0;
      if (hasChildren) {
        item.items = mapSidebarItems(
          node.children,
          translations,
          currentPath,
          defaultLocale,
        );
      } 
      else {
        item.items = [{ autogenerate: { directory: currentPath}}]
      }
      return item;
    },
    nodes,
  );
}

export function createSidebar(
  translations,
  {
    defaultLocale = "en",
    rootDirectory,
  } = {},
) {
  const structure =
    createStructure(translations);

  const root =
    rootDirectory ??
    Object.keys(structure)[0];

  const rootItem = getTranslations(
    translations,
    root,
    defaultLocale,
  );

  return {
    ...rootItem,

    items: mapSidebarItems(
      structure[root] ?? {},
      translations,
      root,
      defaultLocale,
    ),
  };
}

export function createSidebarItems(
  translations,
  {
    defaultLocale = "en",
    rootDirectory,
  } = {},
) {
  const structure = createStructure(translations);
  const root = rootDirectory ?? Object.keys(structure)[0];
  return mapSidebarItems(
    structure[root] ?? {},
    translations,
    root,
    defaultLocale,
  );
}