/**
 * Country flag emojis and metadata
 */

export const countryFlags: Record<string, string> = {
  // Tier 1 Nations
  "New Zealand": "🇳🇿",
  "South Africa": "🇿🇦",
  "Ireland": "🇮🇪",
  "France": "🇫🇷",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Australia": "🇦🇺",
  "Argentina": "🇦🇷",
  "Italy": "🇮🇹",
  "Japan": "🇯🇵",
  "Fiji": "🇫🇯",

  // Tier 2 Nations
  "Georgia": "🇬🇪",
  "Samoa": "🇼🇸",
  "Tonga": "🇹🇴",
  "USA": "🇺🇸",
  "Uruguay": "🇺🇾",
  "Spain": "🇪🇸",
  "Portugal": "🇵🇹",
  "Romania": "🇷🇴",
  "Namibia": "🇳🇦",
  "Chile": "🇨🇱",
  "Canada": "🇨🇦",
  "Brazil": "🇧🇷",
  "Hong Kong": "🇭🇰",
  "Korea": "🇰🇷",
  "Netherlands": "🇳🇱",
  "Russia": "🇷🇺",
  "Belgium": "🇧🇪",
  "Germany": "🇩🇪",
  "Switzerland": "🇨🇭",
  "Poland": "🇵🇱",
  "Kenya": "🇰🇪",
  "Zimbabwe": "🇿🇼",
  "Uganda": "🇺🇬",
  "Colombia": "🇨🇴",
  "Paraguay": "🇵🇾",
  "Madagascar": "🇲🇬",
};

export function getCountryFlag(countryName: string): string {
  return countryFlags[countryName] || "🏴";
}
