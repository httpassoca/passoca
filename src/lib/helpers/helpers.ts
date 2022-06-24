export const capitalize = (string: string) => {
  let capitalized = string.toLowerCase();
  return capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
}
