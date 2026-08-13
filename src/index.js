import { mapfun } from "ziko/math";

function getTranslations(translations, path, locale) {
  const labels = translations[path] ?? {};

  const label = labels[locale] ?? path.split("/").pop();

  const translatedLabels = mapfun(
    (value, language) => {
      if (language === locale) return undefined;
      return value;
    },
    labels,
  );

  const filteredTranslations = Object.fromEntries(
    Object.entries(translatedLabels).filter(
      ([, value]) => value !== undefined,
    ),
  );

  return {
    label,
    ...(Object.keys(filteredTranslations).length > 0 && {
      translations: filteredTranslations,
    }),
  };
}

function mapSidebarItems(
  structure,
  translations,
  parentPath,
  locale,
) {
  return Object.entries(structure).map(([name, children]) => {
    const currentPath = `${parentPath}/${name}`;

    const item = getTranslations(
      translations,
      currentPath,
      locale,
    );

    if (Object.keys(children).length > 0) {
      item.items = mapSidebarItems(
        children,
        translations,
        currentPath,
        locale,
      );
    } else {
      item.items = [
        {
          autogenerate: {
            directory: currentPath,
          },
        },
      ];
    }

    return item;
  });
}

export function createSidebarItems(
  structure,
  translations = {},
  {
    locale = "en",
    rootDirectory = "reference",
  } = {},
) {
  return mapSidebarItems(
    structure,
    translations,
    rootDirectory,
    locale,
  );
}

export function createSidebar(
  structure,
  translations = {},
  {
    locale = "en",
    rootDirectory = "reference",
  } = {},
) {
  const rootTranslations = getTranslations(
    translations,
    rootDirectory,
    locale,
  );

  return {
    ...rootTranslations,

    items: createSidebarItems(
      structure,
      translations,
      {
        locale,
        rootDirectory,
      },
    ),
  };
}