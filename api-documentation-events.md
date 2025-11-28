# World Rugby RIMS Event API Documentation

## Endpoint

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event/
```

## Base URL

`https://api.wr-rims-prod.pulselive.com`

## Description

Retrieves rugby event data from the World Rugby RIMS (Rugby Information Management System) database. This endpoint returns paginated information about rugby competitions, tournaments, and series across various rugby formats and regions.

---

## Query Parameters

### Required Parameters

| Parameter   | Type                | Description                             | Example      |
| ----------- | ------------------- | --------------------------------------- | ------------ |
| `startDate` | string (YYYY-MM-DD) | Start date for event search (inclusive) | `2025-01-01` |
| `endDate`   | string (YYYY-MM-DD) | End date for event search (inclusive)   | `2026-01-13` |

### Optional Parameters

| Parameter  | Type          | Default | Description                                                                  | Example                                |
| ---------- | ------------- | ------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `sport`    | string        | all     | Filter by sport code (mru, wru, mrs, wrs)                                    | `mru`                                  |
| `series`   | string (UUID) | none    | Filter events by series ID (returns events within a specific series)         | `f9c35cdd-6618-4815-9113-c4e2309f28a5` |
| `status`   | string        | all     | Filter by event status (case-insensitive: scheduled, in_progress, completed) | `scheduled`                            |
| `page`     | integer       | `0`     | Zero-indexed page number for pagination                                      | `0`                                    |
| `pageSize` | integer       | `50`    | Number of results per page                                                   | `50`                                   |
| `sort`     | string        | `desc`  | Sort order for results (`asc` or `desc`)                                     | `asc`                                  |

---

## Response Format

### Success Response (HTTP 200)

The API returns a JSON object with the following structure:

```json
{
  "pageInfo": {
    "page": 0,
    "numPages": 1,
    "pageSize": 50,
    "numEntries": 20
  },
  "content": [
    {
      "id": "uuid",
      "altId": "uuid",
      "label": "string",
      "sport": "string",
      "start": {
        "millis": 1735689600000,
        "gmtOffset": 0.0,
        "label": "2025-01-01"
      },
      "end": {
        "millis": 1767139200000,
        "gmtOffset": 0.0,
        "label": "2025-12-31"
      },
      "abbr": "string or empty",
      "winningTeam": {
        "id": "string",
        "altId": "uuid",
        "name": "string",
        "abbreviation": "string",
        "countryCode": "string or null",
        "annotations": "string or null",
        "metadata": {}
      } | null,
      "eventStatus": {
        "eventStatusID": 1,
        "eventStatusName": "string"
      },
      "seriesId": "string or null",
      "seriesAltId": "string or null",
      "rankingsWeight": 0.0,
      "metadata": {},
      "impactPlayers": null,
      "teamPerformances": null
    }
  ]
}
```

### Response Fields

#### pageInfo Object

| Field        | Type    | Description                                       |
| ------------ | ------- | ------------------------------------------------- |
| `page`       | integer | Current page number (zero-indexed)                |
| `numPages`   | integer | Total number of available pages                   |
| `pageSize`   | integer | Number of results per page                        |
| `numEntries` | integer | Total number of matching entries across all pages |

#### Event Object (in content array)

| Field              | Type                | Description                                                      |
| ------------------ | ------------------- | ---------------------------------------------------------------- |
| `id`               | string (UUID)       | Unique event identifier                                          |
| `altId`            | string (UUID)       | Alternative event identifier                                     |
| `label`            | string              | Event name/title (e.g., "2025 Six Nations", "Super Rugby 2025")  |
| `sport`            | string              | Sport code (mru, wru, mrs, wrs)                                  |
| `start`            | object              | Event start date/time information with millisecond timestamp     |
| `end`              | object              | Event end date/time information with millisecond timestamp       |
| `abbr`             | string              | Abbreviation or short code for the event (can be empty string)   |
| `winningTeam`      | Team object or null | Team object for the winning team (if applicable/determined)      |
| `eventStatus`      | object              | Event status information                                         |
| `seriesId`         | string or null      | Series identifier (if event is part of a larger series)          |
| `seriesAltId`      | string or null      | Alternative series identifier                                    |
| `rankingsWeight`   | number              | Weight applied to world rankings calculations (0.0 if no impact) |
| `metadata`         | object              | Additional metadata (typically empty object)                     |
| `impactPlayers`    | null                | Reserved for future use; currently always null                   |
| `teamPerformances` | null                | Reserved for future use; currently always null                   |

#### Time Object

| Field       | Type   | Description                                   |
| ----------- | ------ | --------------------------------------------- |
| `millis`    | number | Unix timestamp in milliseconds (UTC)          |
| `gmtOffset` | number | Timezone offset from UTC in hours             |
| `label`     | string | Human-readable date label (YYYY-MM-DD format) |

#### Team Object (Winning Team)

| Field          | Type           | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `id`           | string         | Team identifier                        |
| `altId`        | string (UUID)  | Alternative team identifier            |
| `name`         | string         | Team name                              |
| `abbreviation` | string         | Team abbreviation (e.g., "NZL", "ENG") |
| `countryCode`  | string or null | ISO country code                       |
| `annotations`  | string or null | Additional annotations                 |
| `metadata`     | object         | Additional metadata                    |

#### Event Status Object

| Field             | Type    | Description                                        |
| ----------------- | ------- | -------------------------------------------------- |
| `eventStatusID`   | integer | Numeric status identifier (see status codes below) |
| `eventStatusName` | string  | Human-readable status name                         |

---

## Status Codes

| Code | Status       | Meaning                                              |
| ---- | ------------ | ---------------------------------------------------- |
| 200  | OK           | Successful request                                   |
| 400  | Bad Request  | Invalid query parameters (e.g., invalid date format) |
| 401  | Unauthorized | Authentication required                              |
| 404  | Not Found    | No events found for specified criteria               |
| 500  | Server Error | Internal server error                                |

---

## Event Status Codes

| ID  | Status Name | Meaning                                     |
| --- | ----------- | ------------------------------------------- |
| 1   | Scheduled   | Event is scheduled but has not started      |
| 5   | In Progress | Event is currently ongoing                  |
| 2   | Completed   | Event has finished (inferred from API data) |

---

## Sport Codes

| Code | Description          |
| ---- | -------------------- |
| mru  | Men's Rugby Union    |
| wru  | Women's Rugby Union  |
| mrs  | Men's Rugby Sevens   |
| wrs  | Women's Rugby Sevens |

---

## Examples

### Example Request - All Men's Rugby Events in 2025

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event/?startDate=2025-01-01&endDate=2026-01-13&sport=mru&pageSize=50
```

### Example Response (Abbreviated)

```json
{
  "pageInfo": {
    "page": 0,
    "numPages": 1,
    "pageSize": 50,
    "numEntries": 20
  },
  "content": [
    {
      "id": "1d267a87-3266-402f-aa30-c62365963d61",
      "label": "2025 Men's International",
      "sport": "mru",
      "start": {
        "millis": 1735689600000,
        "gmtOffset": 0.0,
        "label": "2025-01-01"
      },
      "end": {
        "millis": 1767139200000,
        "gmtOffset": 0.0,
        "label": "2025-12-31"
      },
      "abbr": "",
      "winningTeam": null,
      "eventStatus": {
        "eventStatusID": 1,
        "eventStatusName": "Scheduled"
      },
      "rankingsWeight": 0.0
    },
    {
      "id": "62bf5a1b-f6a7-452f-ae17-5a378e77917e",
      "label": "2025 Six Nations",
      "sport": "mru",
      "start": {
        "millis": 1738281600000,
        "gmtOffset": 0.0,
        "label": "2025-01-31"
      },
      "end": {
        "millis": 1741996800000,
        "gmtOffset": 0.0,
        "label": "2025-03-15"
      },
      "abbr": "",
      "winningTeam": null,
      "eventStatus": {
        "eventStatusID": 1,
        "eventStatusName": "Scheduled"
      },
      "rankingsWeight": 0.0
    },
    {
      "id": "03cdc8d6-d13d-4e47-962e-3c0663306cb3",
      "label": "Autumn Nations Series 2025",
      "sport": "mru",
      "start": {
        "millis": 1761955200000,
        "gmtOffset": 0.0,
        "label": "2025-11-01"
      },
      "end": {
        "millis": 1764374400000,
        "gmtOffset": 0.0,
        "label": "2025-11-29"
      },
      "abbr": "ANS 2025",
      "winningTeam": null,
      "eventStatus": {
        "eventStatusID": 1,
        "eventStatusName": "Scheduled"
      },
      "rankingsWeight": 0.0
    }
  ]
}
```

### Example Requests

#### Get all women's rugby events

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event/?startDate=2025-01-01&endDate=2026-01-13&sport=wru
```

#### Get men's sevens events with pagination

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event/?startDate=2025-01-01&endDate=2026-01-13&sport=mrs&page=0&pageSize=50
```

#### Get all rugby events (all sports)

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event/?startDate=2025-01-01&endDate=2026-01-13&pageSize=100
```

#### Get events within a specific series

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event?series=f9c35cdd-6618-4815-9113-c4e2309f28a5&pageSize=50&sort=asc&startDate=2025-10-01&endDate=2025-12-31
```

#### Get upcoming scheduled events

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event/?startDate=2025-01-01&endDate=2026-01-13&status=scheduled&pageSize=50
```

#### Get completed men's rugby events

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/event/?startDate=2025-01-01&endDate=2025-12-31&sport=mru&status=completed
```

---

## Pagination

The API uses offset-based pagination. To retrieve results beyond the first page:

1. Check `pageInfo.numPages` to see total pages available
2. Increment the `page` parameter (e.g., `page=0`, `page=1`, `page=2`)
3. Keep other parameters consistent

### Pagination Example

```
# Page 1 (first 50 results)
?sport=mru&page=0&pageSize=50

# Page 2 (next 50 results)
?sport=mru&page=1&pageSize=50

# Page 3 (next 50 results)
?sport=mru&page=2&pageSize=50
```

---

## Filtering

### By Sport

The `sport` parameter filters results by rugby format:

```
?sport=mru     # Men's Rugby Union only
?sport=wru     # Women's Rugby Union only
?sport=mrs     # Men's Rugby Sevens only
?sport=wrs     # Women's Rugby Sevens only
```

Omit the `sport` parameter to retrieve events from all sports.

### By Series

The `series` parameter filters events to those within a specific series:

```
?series=f9c35cdd-6618-4815-9113-c4e2309f28a5
```

Note: The series parameter accepts a UUID that corresponds to the `seriesId` or `seriesAltId` field of events. When filtering by a series ID that has no matching events within the date range, the API returns an empty result set with `numEntries: 0`.

### By Status

The `status` parameter filters events by their current status:

```
?status=scheduled        # Upcoming or scheduled events
?status=in_progress      # Events currently in progress
?status=completed        # Completed events
```

Status filtering is case-insensitive and matches against the `eventStatus.eventStatusName` field.

### By Date Range

Use `startDate` and `endDate` to narrow results to a specific period. Both parameters are required.

```
?startDate=2025-06-01&endDate=2025-09-30   # Second half of year
```

---

## Notable Events (from sample data)

The API includes events such as:

- **Six Nations** - Annual tournament between 6 European nations
- **Super Rugby** - Southern Hemisphere club competition
- **Rugby Championship** - Southern Hemisphere national championship
- **Autumn Nations Series** - November international matches
- **Pacific Nations Cup** - Pacific island nations competition
- **Currie Cup** - South African provincial championship
- **NPC** - New Zealand provincial championship (Bunnings Warehouse NPC)
- **Asia Rugby Men's Championship** - Asian regional tournament
- **Rugby Africa Cup** - African regional championship
- **British & Irish Lions Tour** - Touring match series
- **Bledisloe Cup** - Australia vs New Zealand rivalry series
- **Sudamericano** - South American championship
- **Rugby World Cup Qualification Tournaments** - World Cup qualifying events

---

## Event Date Ranges

Events typically span multiple weeks or months. The date range provided (`2025-01-01` to `2026-01-13`) covers a full calendar year of rugby, including:

- January - February: Six Nations and early season tournaments
- March - May: Easter tours and regional championships
- June - August: Southern Hemisphere competition, Lions tour
- September - November: Club competitions, international fixtures
- December - January: End of year tours and holiday fixtures

---

## Implementation Notes

1. **Timestamps** are provided in milliseconds since epoch (UTC) in the `millis` field
2. **Timezone Offset** is included in `gmtOffset` field for local time conversion
3. **Date Format** in query parameters uses `YYYY-MM-DD` format (no time component)
4. **Null Values** are common for optional fields like `winningTeam`, `seriesId`, `countryCode`
5. **Empty Abbreviations** may occur (empty string vs null)
6. **Winning Team** is typically populated only for completed events where a clear winner exists
7. **Rankings Weight** indicates whether an event impacts World Rugby rankings (0.0 = no impact)
8. **Status ID 1** appears to represent both "Scheduled" and "Completed" events; use event dates to determine actual status
9. **Series Parameter**: When filtering by series ID with `?series=<uuid>`, ensure the date range includes the event dates. If no events match, the API returns `numEntries: 0` with an empty content array
10. **Status Parameter**: Case-insensitive string matching against event status names (e.g., "scheduled", "in_progress", "completed")

---

## Rate Limiting

No specific rate limit information is documented. Assume standard API rate limiting applies. Space requests appropriately if making multiple sequential calls.

---

## Timeouts

Connection timeouts typically occur after 30 seconds of inactivity. For requests returning large result sets, consider implementing pagination with reasonable page sizes.

---

## Authentication

No authentication headers are visible in the provided endpoint. The API appears to be publicly accessible, though this should be confirmed for production use.

---

## Query Parameter Validation

- **Date Format**: Must be `YYYY-MM-DD` (ISO 8601 date format)
- **Sport Code**: Must be lowercase (`mru`, `wru`, `mrs`, `wrs`)
- **Page**: Non-negative integer
- **PageSize**: Positive integer (tested up to 50 in examples)
- **Sort**: Either `asc` or `desc`

---

## Related Endpoints

- `GET /rugby/v3/match` - Retrieve individual matches within events (see match endpoint documentation)
- `GET /rugby/v3/team` - Retrieve team information (inferred from system structure)

---

## Version

API Version: v3

---

## Contact / Support

World Rugby RIMS Support  
https://www.worldrugby.org/

---

## Change Log

- **API Version 3** - Current version documented here
  - Supports filtering by sport code
  - Includes event status tracking
  - Provides winning team information for completed events

---

## Common Use Cases

### 1. Get all major international tournaments for a year

```
GET /rugby/v3/event/?startDate=2025-01-01&endDate=2025-12-31&sport=mru
```

### 2. Find upcoming events

```
GET /rugby/v3/event/?startDate=2025-01-01&endDate=2026-01-13&status=scheduled
```

### 3. Track in-progress competitions

```
GET /rugby/v3/event/?startDate=2025-01-01&endDate=2025-12-31&status=in_progress
```

### 4. Get events within a specific series

Retrieve all events belonging to a tournament series:

```
GET /rugby/v3/event/?series=f9c35cdd-6618-4815-9113-c4e2309f28a5&startDate=2025-01-01&endDate=2026-01-13
```

### 5. Get all sevens events

```
GET /rugby/v3/event/?startDate=2025-01-01&endDate=2025-12-31&sport=mrs
```

### 6. Monitor women's rugby calendar

```
GET /rugby/v3/event/?startDate=2025-01-01&endDate=2025-12-31&sport=wru
```

### 7. Find completed competitions with results

```
GET /rugby/v3/event/?startDate=2025-01-01&endDate=2025-12-31&status=completed
```
