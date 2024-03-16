export const formatDate = (dateStr: string, years: boolean = false) => {
  const date = new Date(dateStr);

  const format: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
  }

  if (years) format.year = 'numeric'

  const dateTimeFormat = new Intl.DateTimeFormat("en", format);

  return dateTimeFormat.format(date);
};
