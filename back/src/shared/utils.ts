export const toNumber = (value: string): number => {
  const parsedValue = parseInt(value);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

export const normalizeUrl = (raw: string): string => {
  const u = new URL(raw);
  return `${u.origin}${u.pathname}`;
};
