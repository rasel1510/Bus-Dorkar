// Number and Digit Localization Helper for English & Bangla

const BANGLA_DIGITS: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

/**
 * Converts any standard digits 0-9 inside a string or number to Bengali digits ০-৯.
 */
export function toBanglaDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return "";
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => BANGLA_DIGITS[digit] || digit);
}

/**
 * Formats a number with commas and converts to Bengali digits if language is 'bn'.
 */
export function formatLocalizedNumber(
  num: number | string | undefined | null,
  lang: "en" | "bn" = "en"
): string {
  if (num === undefined || num === null) return "";
  if (typeof num === "string" && isNaN(Number(num))) {
    // If it's a string like "500+" or "24/7"
    return lang === "bn" ? toBanglaDigits(num) : num;
  }

  const numericValue = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(numericValue)) {
    return lang === "bn" ? toBanglaDigits(String(num)) : String(num);
  }

  // Format with standard thousand separators
  const formatted = new Intl.NumberFormat("en-US").format(numericValue);
  return lang === "bn" ? toBanglaDigits(formatted) : formatted;
}

/**
 * Formats currency amount with ৳ symbol and Bengali digits in 'bn' mode.
 */
export function formatLocalizedCurrency(
  amount: number | string | undefined | null,
  lang: "en" | "bn" = "en"
): string {
  if (amount === undefined || amount === null) return "৳ 0";
  const numStr = formatLocalizedNumber(amount, lang);
  return `৳ ${numStr}`;
}

/**
 * Formats time string e.g. "07:30 AM" into Bangla or English.
 */
export function formatLocalizedTime(
  timeStr: string | undefined | null,
  lang: "en" | "bn" = "en"
): string {
  if (!timeStr) return "";
  if (lang === "en") return timeStr;

  let localized = toBanglaDigits(timeStr);
  localized = localized
    .replace(/AM/gi, "সকাল")
    .replace(/PM/gi, "সন্ধ্যা");
  return localized;
}

/**
 * Formats distance with km / কি.মি.
 */
export function formatLocalizedDistance(
  distanceKm: number | string,
  lang: "en" | "bn" = "en"
): string {
  const num = formatLocalizedNumber(distanceKm, lang);
  return lang === "bn" ? `${num} কি.মি.` : `${num} km`;
}

/**
 * Formats duration with hrs mins / ঘণ্টা মিনিট
 */
export function formatLocalizedDuration(
  durationStr: string | undefined | null,
  lang: "en" | "bn" = "en"
): string {
  if (!durationStr) return "";
  if (lang === "en") return durationStr;

  let result = toBanglaDigits(durationStr);
  result = result
    .replace(/hrs?/gi, "ঘণ্টা")
    .replace(/hours?/gi, "ঘণ্টা")
    .replace(/mins?/gi, "মিনিট")
    .replace(/minutes?/gi, "মিনিট");
  return result;
}
