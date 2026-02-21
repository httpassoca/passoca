export const capitalize = (string: string) => {
  let capitalized = string.toLowerCase();
  return capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
};

export const getSlug = (path: string) => {
  const fileNameRegex = /[^\\/]+$/;
  const extensionRegex = /\.[^./\\]*$/;

  const base = path.match(fileNameRegex) ? path.match(fileNameRegex)[0] : "";
  const ext = base.match(extensionRegex) ? base.match(extensionRegex)[0] : "";
  const slug = base.slice(0, base.length - ext.length);

  return slug;
};
