// Rwandan Franc has no minor unit in everyday use, so we format as a
// plain thousands-grouped integer with an "FRW" prefix (e.g. "FRW 12,500").
export const formatFRW = (value) => `FRW ${Math.round(Number(value) || 0).toLocaleString("en-US")}`;

export const CURRENCY_PREFIX = "FRW ";
