import imageAssets, { type ImageStructure } from 'assets/imageAssets';

type PathKeys<T> =
  T extends Record<string, string>
    ? [string]
    : { [K in keyof T]: [K] | [K, ...PathKeys<T[K]>] }[keyof T];

export const getImage = <T extends PathKeys<ImageStructure>>(
  path: T,
): string => {
  let current: any = imageAssets;
  for (const key of path) {
    current = current?.[key];
    if (!current) {
      return '';
    }
  }
  return current;
};
