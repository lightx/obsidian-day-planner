const ulToken = `[-*+]`;
const olToken = `\\d+[.)]`;
const listToken = `(${ulToken}|${olToken})`;
const listTokenWithSpaces = `^\\s*${listToken}\\s+`;

const checkbox = `\\s*\\[(?<completion>[^\\]])]\\s+`;

const hours12h = "[0-1]?\\d";
const hours24h = "[0-2]?\\d";
const minutes = "[0-5]\\d";
const hourMinuteSeparator = "[:.]";
const ampm = "\\s?[apAP][mM](?!\\w)";

const time12h = `(${hours12h})(?:${hourMinuteSeparator}?(${minutes}))(${ampm})`;
const time24h = `(${hours24h})(?:${hourMinuteSeparator}(${minutes}))`;
const time = `(?:${time12h}|${time24h})`;

const timeRangeSeparator = `\\s?-\\s?`;
const timeRange = `(?<start>${time})(?:${timeRangeSeparator}(?<end>${time}))?`;

export const timeRegExp = new RegExp(time);

export const timeRangeRegExp = new RegExp(timeRange, "im");
export const timeRangeAtStartOfLineRegExp = new RegExp(`^${timeRange}`, "im");

const datePattern = "\\d{4}-\\d{2}-\\d{2}";

export const listTokenWithSpacesRegExp = new RegExp(listTokenWithSpaces);
export const checkboxRegExp = new RegExp(checkbox);

export const headingRegExp = /^(#+)\s/;
export const obsidianBlockIdRegExp = /\s\^[a-z1-9-]+$/i;
export const listItemRegExp = new RegExp(
  "^[\\s>]*(?<symbol>\\d+\\.|\\d+\\)|\\*|-|\\+)\\s*(?:\\[(?<task>.)\\])?\\s*(?<text>.*)$",
  "mu",
);

export const scheduledPropRegExp = new RegExp(
  `(\\[scheduled\\s*::\\s*)(?<date>${datePattern})(])`,
);

export const keylessScheduledPropRegExp = new RegExp(
  `(\\(scheduled\\s*::\\s*)(?<date>${datePattern})(\\))`,
);

// Bold-time pattern: **HH:MM** or **HH:MM-HH:MM** at the start of a non-list line
// Matches: **9:30** some text, **9:30-10:00** some text, **9:30 AM** some text
const boldTimeWrapper = `\\*\\*`;
const boldTimeRange = `${boldTimeWrapper}(?<start>${time})(?:${timeRangeSeparator}(?<end>${time}))?${boldTimeWrapper}`;
export const boldTimeRangeRegExp = new RegExp(
  `^\\s*${boldTimeRange}(?:\\s+(?<textAfterBoldTime>.+))?`,
  "im",
);

export const hourglass = "⏳";

export const shortScheduledPropRegExp = new RegExp(
  `(${hourglass}\\s*)(?<date>${datePattern})`,
);

export const scheduledPropRegExps = [
  scheduledPropRegExp,
  keylessScheduledPropRegExp,
  shortScheduledPropRegExp,
];

export const propRegexp = /\[([^\]]+)::([^\]]+)]/g;

export const dashOrNumberWithMultipleSpaces = /(-|\d+[.)])\s+/g;
export const escapedSquareBracket = /\\\[/g;
