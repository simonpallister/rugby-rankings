# World Rugby RIMS Rankings API Documentation

## Endpoint

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/{sport}
```

## Base URL

`https://api.wr-rims-prod.pulselive.com`

## Description

Retrieves the current World Rugby rankings for a specific rugby format. This endpoint returns a ranked list of all international teams with their current ranking points, positions, and historical position/points data for tracking ranking movements.

---

## Endpoint Variants

| Sport | URL | Description |
|-------|-----|-------------|
| Men's Rugby Union | `/rugby/v3/rankings/mru` | Men's 15-a-side rugby rankings |
| Women's Rugby Union | `/rugby/v3/rankings/wru` | Women's 15-a-side rugby rankings |
| Men's Sevens | `/rugby/v3/rankings/mrs` | Men's sevens rugby rankings (inferred) |
| Women's Sevens | `/rugby/v3/rankings/wrs` | Women's sevens rugby rankings (inferred) |

---

## Query Parameters

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `language` | string | `en` | Language code for response labels and text | `en` (English) |

---

## Response Format

### Success Response (HTTP 200)

The API returns a JSON object with the following structure:

```json
{
  "label": "string",
  "entries": [
    {
      "team": {
        "id": "string",
        "altId": "uuid",
        "name": "string",
        "abbreviation": "string",
        "countryCode": "string",
        "annotations": "string or null",
        "metadata": {}
      },
      "pts": 93.94110080257116,
      "pos": 1,
      "previousPts": 93.06274723260489,
      "previousPos": 1
    }
  ],
  "effective": {
    "millis": 1763985685976,
    "gmtOffset": 0.0,
    "label": "2025-11-24"
  }
}
```

### Response Fields

#### Root Object

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Human-readable label for the ranking (e.g., "Mens Rugby Union") |
| `entries` | array | Array of ranking entry objects, ordered by current position |
| `effective` | object | Timestamp indicating when these rankings became effective |

#### Ranking Entry Object (entries array)

| Field | Type | Description |
|-------|------|-------------|
| `team` | object | Team information object (see below) |
| `pts` | number | Current World Rugby ranking points (decimal value) |
| `pos` | integer | Current ranking position (1 = highest ranked) |
| `previousPts` | number | Previous ranking points (for tracking movement) |
| `previousPos` | integer | Previous ranking position (for tracking movement) |

#### Team Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique team identifier |
| `altId` | string (UUID) | Alternative team identifier |
| `name` | string | Team name |
| `abbreviation` | string | Three-letter team abbreviation (ISO-3 or World Rugby standard) |
| `countryCode` | string | ISO 3166-1 alpha-3 country code |
| `annotations` | string or null | Additional annotations about the team |
| `metadata` | object | Additional metadata (typically empty) |

#### Effective Time Object

| Field | Type | Description |
|-------|------|-------------|
| `millis` | number | Unix timestamp in milliseconds (UTC) when rankings were last updated |
| `gmtOffset` | number | Timezone offset from UTC in hours |
| `label` | string | Human-readable date label (YYYY-MM-DD format) |

---

## Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid query parameters (e.g., invalid sport code or language) |
| 401 | Unauthorized | Authentication required |
| 404 | Not Found | Invalid sport code or no rankings available |
| 500 | Server Error | Internal server error |

---

## Sport Codes

| Code | Description |
|------|-------------|
| `mru` | Men's Rugby Union (15-a-side) |
| `wru` | Women's Rugby Union (15-a-side) |
| `mrs` | Men's Rugby Sevens (inferred) |
| `wrs` | Women's Rugby Sevens (inferred) |

---

## Language Codes

| Code | Language |
|------|----------|
| `en` | English (default) |

**Note**: Other language codes may be supported (e.g., `fr` for French, `es` for Spanish), but have not been tested.

---

## Examples

### Example Request - Men's Rugby Union Rankings

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/mru?language=en
```

### Example Request - Women's Rugby Union Rankings

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/wru?language=en
```

### Example Response (Abbreviated - Top 10)

```json
{
  "label": "Mens Rugby Union",
  "entries": [
    {
      "team": {
        "id": "39",
        "altId": "a49729a5-a9e7-4a53-b18b-13b81d4752f4",
        "name": "South Africa",
        "abbreviation": "RSA",
        "countryCode": "ZAF",
        "annotations": null,
        "metadata": {}
      },
      "pts": 93.94110080257116,
      "pos": 1,
      "previousPts": 93.06274723260489,
      "previousPos": 1
    },
    {
      "team": {
        "id": "37",
        "altId": "ec6ede05-0367-4b75-a66d-2d7a58950dcd",
        "name": "New Zealand",
        "abbreviation": "NZL",
        "countryCode": "NZL",
        "annotations": null,
        "metadata": {}
      },
      "pts": 90.3251602439559,
      "pos": 2,
      "previousPts": 90.3251602439559,
      "previousPos": 2
    },
    {
      "team": {
        "id": "34",
        "altId": "b543a019-7df4-4ba0-b1e9-bc796d20df88",
        "name": "England",
        "abbreviation": "ENG",
        "countryCode": "ENG",
        "annotations": null,
        "metadata": {}
      },
      "pts": 89.40925368207189,
      "pos": 3,
      "previousPts": 89.0886021814294,
      "previousPos": 3
    },
    {
      "team": {
        "id": "36",
        "altId": "f683c048-abc7-4713-9286-4dd1921a3285",
        "name": "Ireland",
        "abbreviation": "IRE",
        "countryCode": "IRL",
        "annotations": null,
        "metadata": {}
      },
      "pts": 87.96792936230135,
      "pos": 4,
      "previousPts": 88.84628293226763,
      "previousPos": 4
    },
    {
      "team": {
        "id": "42",
        "altId": "6f456794-9a4a-4623-abba-c7f93fbaf7d7",
        "name": "France",
        "abbreviation": "FRA",
        "countryCode": "FRA",
        "annotations": null,
        "metadata": {}
      },
      "pts": 87.23511637973905,
      "pos": 5,
      "previousPts": 87.07357472964966,
      "previousPos": 5
    }
  ],
  "effective": {
    "millis": 1763985685976,
    "gmtOffset": 0.0,
    "label": "2025-11-24"
  }
}
```

---

## Key Features

### Ranking Points

World Rugby ranking points are decimal values that represent each team's strength. Teams with higher points are ranked higher. Points can fluctuate between 0 and approximately 100+.

### Position Tracking

Each ranking entry includes both current and previous position/points data, allowing clients to:
- Identify teams that have moved up or down in the rankings
- Calculate points gained or lost since the last ranking update
- Track ranking trends over time

### Effective Timestamp

The `effective` field indicates when these rankings became official. Rankings are typically updated:
- After international test matches
- On a regular schedule (often weekly or monthly)
- Following major tournament results

---

## Implementation Notes

1. **Timestamps** are provided in milliseconds since epoch (UTC) in the `millis` field
2. **Timezone Offset** is included in `gmtOffset` field for local time conversion
3. **Ranking Points** are decimal values and should not be rounded for comparisons
4. **Position Ties** can occur when teams have identical or very similar points
5. **Country Codes** follow ISO 3166-1 alpha-3 standard (with World Rugby exceptions for categories like "Chinese Taipei")
6. **Entries are Pre-sorted** - The array is returned in ranking order (pos 1, 2, 3, etc.)
7. **No Pagination** - All teams are returned in a single response
8. **Response Size** - Expect 100+ entries (114 teams in sample data)

---

## Data Update Frequency

Rankings are updated regularly by World Rugby, typically:
- After each international match window
- On a scheduled basis (often weekly/monthly updates)
- Following major tournaments

Check the `effective` timestamp to determine when rankings were last updated.

---

## Rate Limiting

No specific rate limit information is documented. Assume standard API rate limiting applies. Space requests appropriately if making multiple calls.

---

## Caching

Given the infrequent updates to rankings, it is recommended to:
- Cache responses for extended periods (hours to days)
- Check the `effective` timestamp to determine cache validity
- Implement a refresh mechanism when new match results occur

---

## Authentication

No authentication headers are visible in the provided endpoint. The API appears to be publicly accessible, though this should be confirmed for production use.

---

## Related Endpoints

- `GET /rugby/v3/match` - Retrieve individual match results that affect rankings
- `GET /rugby/v3/event` - Retrieve events that generate ranking points
- `GET /rugby/v3/team` - Retrieve detailed team information (inferred)

---

## Version

API Version: v3

---

## Contact / Support

World Rugby  
https://www.worldrugby.org/rankings

---

## Change Log

- **API Version 3** - Current version documented here
  - Returns complete international ranking lists
  - Includes previous ranking data for tracking movement
  - Effective timestamp for ranking updates

---

## Use Cases

### 1. Display Current Top 10 Rankings

```
GET /rugby/v3/rankings/mru?language=en
```
Filter to entries with `pos` <= 10 after retrieving.

### 2. Track Team Ranking Movement

Calculate the difference between `pos` and `previousPos`:
```javascript
const movementUp = entry.previousPos - entry.pos;  // Positive = moved up
const pointsGained = entry.pts - entry.previousPts;
```

### 3. Monitor Ranking Changes Over Time

Store the `effective` timestamp and compare responses taken at different times to see how rankings have evolved.

### 4. Search for Specific Team Ranking

Filter the entries array by team `name` or `abbreviation`:
```javascript
const team = entries.find(e => e.team.name === "England");
console.log(`England ranking: ${team.pos}, Points: ${team.pts}`);
```

### 5. Get All Teams Below a Certain Threshold

Filter entries where `pts` < specific value to identify lower-ranked teams.

### 6. Compare Multiple Sport Rankings

Make separate requests to `/rankings/mru` and `/rankings/wru` to compare men's and women's rankings side-by-side.

---

## Common Team Abbreviations

| Abbreviation | Team | Sport |
|--------------|------|-------|
| RSA | South Africa | MRU |
| NZL | New Zealand | MRU |
| ENG | England | MRU, WRU |
| IRE | Ireland | MRU, WRU |
| FRA | France | MRU, WRU |
| ARG | Argentina | MRU |
| AUS | Australia | MRU |
| WAL | Wales | MRU |
| SCO | Scotland | MRU |
| ITA | Italy | MRU |
| JPN | Japan | MRU |
| USA | USA | MRU |
| CAN | Canada | MRU |
| URU | Uruguay | MRU |
| FIJ | Fiji | MRU |

---

## Regional Team Groups

### Tier 1 (Top International Teams)
South Africa, New Zealand, England, Ireland, France, Argentina, Australia

### Tier 2 (Strong International Teams)
Wales, Scotland, Italy, Japan, Georgia, Fiji, Uruguay, Spain, USA

### Tier 3 (Regional/Emerging International Teams)
Belgium, Romania, Portugal, Chile, Canada, and teams ranked 20-50

### Tier 4+ (Emerging/Lower-Ranked Teams)
Teams ranked 50+ with developing rugby programs

---

## Notes

- **Data Freshness**: Rankings shown are as of the effective date. For current rankings, check World Rugby's official website
- **Experimental Sport Codes**: The `mrs` and `wrs` codes (sevens formats) have been inferred and not directly tested
- **Language Support**: Only English (`en`) has been confirmed; other languages may require testing
- **Team Changes**: The list of teams and their IDs is subject to change as World Rugby adds or removes unions
