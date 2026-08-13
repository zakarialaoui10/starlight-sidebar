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
  locale,
) {
  const labels = translations[path] ?? {};
  const label =
    labels[locale] ??
    path.split("/").pop();
  const translatedLabels = Object.fromEntries(
    Object.entries(labels).filter(
      ([language]) => language !== locale,
    ),
  );

  return {
    label,
    ...(Object.keys(translatedLabels).length > 0 && {
      translations: translatedLabels,
    }),
  };
}

function mapSidebarItems(structure, translations, parentPath, locale) {
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
        locale,
      );
      const hasChildren = Object.keys(node.children).length > 0;
      if (hasChildren) {
        item.items = mapSidebarItems(
          node.children,
          translations,
          currentPath,
          locale,
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
    locale = "en",
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
    locale,
  );

  return {
    ...rootItem,

    items: mapSidebarItems(
      structure[root] ?? {},
      translations,
      root,
      locale,
    ),
  };
}

export function createSidebarItems(
  translations,
  {
    locale = "en",
    rootDirectory,
  } = {},
) {
  const structure = createStructure(translations);
  const root = rootDirectory ?? Object.keys(structure)[0];
  return mapSidebarItems(
    structure[root] ?? {},
    translations,
    root,
    locale,
  );
}