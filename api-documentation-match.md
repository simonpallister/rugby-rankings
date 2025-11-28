# World Rugby RIMS Match API Documentation

## Endpoint

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match
```

## Base URL

`https://api.wr-rims-prod.pulselive.com`

## Description

Retrieves rugby match data from the World Rugby RIMS (Rugby Information Management System) database, returning paginated results of matches within a specified date range.

---

## Query Parameters

### Required Parameters

| Parameter   | Type                | Description                             | Example      |
| ----------- | ------------------- | --------------------------------------- | ------------ |
| `startDate` | string (YYYY-MM-DD) | Start date for match search (inclusive) | `2025-11-17` |
| `endDate`   | string (YYYY-MM-DD) | End date for match search (inclusive)   | `2025-12-01` |

### Optional Parameters

| Parameter     | Type                  | Default | Description                                      | Example                                |
| ------------- | --------------------- | ------- | ------------------------------------------------ | -------------------------------------- |
| `sport`       | string                | all     | Filter by sport code (mru, wru, mrs, wrs)        | `mru`                                  |
| `event`       | string (UUID)         | none    | Filter matches by event ID                       | `03cdc8d6-d13d-4e47-962e-3c0663306cb3` |
| `competition` | string                | none    | Filter by competition name                       | `Autumn Nations Series 2025`           |
| `team`        | string (UUID or name) | none    | Filter matches by team ID or name                | `England` or `34`                      |
| `venue`       | string (UUID or name) | none    | Filter matches by venue ID or name               | `Twickenham Stadium`                   |
| `status`      | string                | all     | Filter by match status (C=Completed, U=Upcoming) | `C`                                    |
| `page`        | integer               | `0`     | Zero-indexed page number for pagination          | `0`                                    |
| `pageSize`    | integer               | `100`   | Number of results per page                       | `100`                                  |
| `sort`        | string                | `desc`  | Sort order for results (`asc` or `desc`)         | `asc`                                  |

**Note on Parameters**: The `sport`, `event`, `competition`, `team`, `venue`, and `status` parameters have been inferred from the response structure but have not been directly tested/confirmed. The `page`, `pageSize`, and `sort` parameters have been confirmed to work.

---

## Response Format

### Success Response (HTTP 200)

The API returns a JSON object with the following structure:

```json
{
  "pageInfo": {
    "page": 0,
    "numPages": 2,
    "pageSize": 100,
    "numEntries": 109
  },
  "content": [
    {
      "matchId": "uuid",
      "matchAltId": "uuid",
      "description": "string or null",
      "eventPhase": "string or null",
      "eventPhaseId": "object or null",
      "venue": {
        "id": "string",
        "altId": "uuid",
        "name": "string",
        "city": "string",
        "country": "string"
      },
      "time": {
        "millis": 1764399480000,
        "gmtOffset": 4.0,
        "label": "2025-11-29"
      },
      "attendance": "integer or null",
      "teams": [
        {
          "id": "string",
          "altId": "uuid",
          "name": "string",
          "abbreviation": "string or null",
          "countryCode": "string or null",
          "annotations": "string or null",
          "metadata": {}
        },
        {
          "id": "string",
          "altId": "uuid",
          "name": "string",
          "abbreviation": "string or null",
          "countryCode": "string or null",
          "annotations": "string or null",
          "metadata": {}
        }
      ],
      "scores": [0, 0],
      "kc": "string or null",
      "status": "string",
      "clock": {
        "secs": 0,
        "label": "00:00"
      },
      "outcome": "string or null",
      "events": [
        {
          "id": "uuid",
          "altId": "uuid",
          "label": "string",
          "sport": "string",
          "start": {
            "millis": 1764374400000,
            "gmtOffset": 4.0,
            "label": "2025-11-29"
          },
          "end": {
            "millis": 1764460800000,
            "gmtOffset": 4.0,
            "label": "2025-11-30"
          },
          "abbr": "string or null",
          "winningTeam": "string or null",
          "eventStatus": {
            "eventStatusID": 1,
            "eventStatusName": "string"
          },
          "seriesId": "string or null",
          "seriesAltId": "string or null",
          "rankingsWeight": 0.0,
          "metadata": {},
          "impactPlayers": "object or null",
          "teamPerformances": "object or null"
        }
      ],
      "sport": "string",
      "competition": "string",
      "weather": "object or null",
      "rankingsWeight": "number or null"
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

#### Match Object (in content array)

| Field            | Type            | Description                                                                                                                         |
| ---------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `matchId`        | string (UUID)   | Unique match identifier                                                                                                             |
| `matchAltId`     | string (UUID)   | Alternative match identifier                                                                                                        |
| `description`    | string or null  | Match description (e.g., "Match 5", "Match 1")                                                                                      |
| `eventPhase`     | string or null  | Phase within the event (e.g., "League", "Pool A")                                                                                   |
| `eventPhaseId`   | object or null  | Structured phase information with `type` and `subType`                                                                              |
| `venue`          | object          | Match venue details                                                                                                                 |
| `time`           | object          | Match time information with millisecond timestamp                                                                                   |
| `attendance`     | integer or null | Crowd attendance (null if not recorded)                                                                                             |
| `teams`          | array           | Array of two team objects                                                                                                           |
| `scores`         | array[integer]  | Array of two score values [team1_score, team2_score]                                                                                |
| `kc`             | string or null  | Additional match classification field                                                                                               |
| `status`         | string          | Match status ("C" = Completed, "U" = Upcoming)                                                                                      |
| `clock`          | object          | Match time/clock state                                                                                                              |
| `outcome`        | string or null  | Match outcome ("A" = team 1 won, "B" = team 2 won, "D" = Draw, "N" = Not played)                                                    |
| `events`         | array           | Array of event objects the match belongs to                                                                                         |
| `sport`          | string          | Sport code (e.g., "MRU" = Men's Rugby Union, "WRU" = Women's Rugby Union, "MRS" = Men's Rugby Sevens, "WRS" = Women's Rugby Sevens) |
| `competition`    | string          | Competition name (e.g., "Autumn Nations Series 2025")                                                                               |
| `weather`        | object or null  | Weather conditions if available                                                                                                     |
| `rankingsWeight` | number or null  | Weight applied to rankings calculations                                                                                             |

#### Venue Object

| Field     | Type          | Description                    |
| --------- | ------------- | ------------------------------ |
| `id`      | string        | Venue identifier               |
| `altId`   | string (UUID) | Alternative venue identifier   |
| `name`    | string        | Venue name                     |
| `city`    | string        | City where venue is located    |
| `country` | string        | Country where venue is located |

#### Team Object

| Field          | Type           | Description                            |
| -------------- | -------------- | -------------------------------------- |
| `id`           | string         | Team identifier                        |
| `altId`        | string (UUID)  | Alternative team identifier            |
| `name`         | string         | Team name                              |
| `abbreviation` | string or null | Team abbreviation (e.g., "NZL", "ENG") |
| `countryCode`  | string or null | ISO country code                       |
| `annotations`  | string or null | Additional annotations                 |
| `metadata`     | object         | Additional metadata                    |

#### Event Object

| Field              | Type           | Description                        |
| ------------------ | -------------- | ---------------------------------- |
| `id`               | string (UUID)  | Event identifier                   |
| `altId`            | string (UUID)  | Alternative event identifier       |
| `label`            | string         | Event name                         |
| `sport`            | string         | Sport code                         |
| `start`            | object         | Event start date/time              |
| `end`              | object         | Event end date/time                |
| `abbr`             | string or null | Event abbreviation                 |
| `winningTeam`      | string or null | ID of winning team (if applicable) |
| `eventStatus`      | object         | Event status information           |
| `seriesId`         | string or null | Series identifier                  |
| `seriesAltId`      | string or null | Alternative series identifier      |
| `rankingsWeight`   | number         | Weight for ranking calculations    |
| `metadata`         | object         | Additional metadata                |
| `impactPlayers`    | object or null | Player impact data                 |
| `teamPerformances` | object or null | Team performance metrics           |

---

## Filtering

### By Sport

Filter matches by rugby format:

```
?sport=mru     # Men's Rugby Union only
?sport=wru     # Women's Rugby Union only
?sport=mrs     # Men's Rugby Sevens only
?sport=wrs     # Women's Rugby Sevens only
```

### By Event

Filter to matches within a specific event/tournament:

```
?event=03cdc8d6-d13d-4e47-962e-3c0663306cb3   # Autumn Nations Series 2025
```

### By Competition

Filter by competition name (exact or partial match):

```
?competition=Autumn%20Nations%20Series%202025
?competition=Top%2014%202026
```

### By Team

Filter to matches involving a specific team (by ID or name):

```
?team=34                    # England (by team ID)
?team=England               # England (by team name)
?team=New%20Zealand         # New Zealand
```

### By Venue

Filter to matches at a specific venue (by ID or name):

```
?venue=Twickenham%20Stadium
?venue=3                    # Twickenham Stadium (by venue ID)
```

### By Match Status

Filter by match completion status:

```
?status=C      # Completed matches only
?status=U      # Upcoming matches only
```

### By Date Range

Filter matches within a specific period:

```
?startDate=2025-11-01&endDate=2025-11-30
```

### Combined Filtering

Parameters can be combined to create complex queries:

```
?startDate=2025-11-17&endDate=2025-12-01&sport=mru&competition=Autumn%20Nations%20Series%202025&status=C
?startDate=2025-11-01&endDate=2025-11-30&team=England&status=C
```

**Note**: Parameter combinations (sport, event, competition, team, venue, status) have not been directly confirmed as functional. They are inferred from the API response structure. Test parameters before relying on them in production code.

---

## Status Codes

| Code | Status       | Meaning                              |
| ---- | ------------ | ------------------------------------ |
| 200  | OK           | Successful request                   |
| 400  | Bad Request  | Invalid query parameters             |
| 401  | Unauthorized | Authentication required              |
| 404  | Not Found    | No matches found for specified dates |
| 500  | Server Error | Internal server error                |

---

## Examples

### Example Request

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=2025-11-17&endDate=2025-12-01&sort=asc&pageSize=100&page=0
```

### Additional Example Requests (with inferred parameters)

**Filter by sport:**

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=2025-11-01&endDate=2025-12-31&sport=mru&pageSize=100
```

**Filter by sport and competition:**

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=2025-11-01&endDate=2025-11-30&sport=mru&competition=Autumn%20Nations%20Series%202025&sort=asc&pageSize=50
```

**Filter by team:**

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=2025-11-01&endDate=2025-12-31&team=England&status=C&pageSize=100
```

**Filter by event ID:**

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=2025-11-01&endDate=2025-11-30&event=03cdc8d6-d13d-4e47-962e-3c0663306cb3
```

**Filter by venue:**

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=2025-11-01&endDate=2025-12-31&venue=Twickenham%20Stadium&status=C
```

**Filter by match status (completed only):**

```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=2025-11-01&endDate=2025-11-30&status=C&sort=desc&pageSize=100
```

_Note: The filtering parameters (sport, event, competition, team, venue, status) in the additional examples above are inferred from the API response structure and patterns observed in the event endpoint. Direct confirmation has not been possible due to network restrictions. Test these in your environment before relying on them in production._

### Example Response (Abbreviated)

```json
{
  "pageInfo": {
    "page": 0,
    "numPages": 2,
    "pageSize": 100,
    "numEntries": 109
  },
  "content": [
    {
      "matchId": "2c0cd1eb-4310-48f6-908c-4306d02304fe",
      "description": "Match 5",
      "venue": {
        "name": "The Sevens 2",
        "city": "Dubai",
        "country": "United Arab Emirates"
      },
      "time": {
        "label": "2025-11-18"
      },
      "teams": [
        {
          "name": "Namibia",
          "abbreviation": "NAM"
        },
        {
          "name": "Brazil",
          "abbreviation": "BRA"
        }
      ],
      "scores": [40, 31],
      "status": "C",
      "outcome": "A",
      "sport": "MRU",
      "competition": "Men's Rugby World Cup Qualifying 2025"
    }
  ]
}
```

---

## Sport Codes

| Code | Description          |
| ---- | -------------------- |
| MRU  | Men's Rugby Union    |
| WRU  | Women's Rugby Union  |
| MRS  | Men's Rugby Sevens   |
| WRS  | Women's Rugby Sevens |

---

## Match Status Codes

| Code | Meaning                 |
| ---- | ----------------------- |
| C    | Completed               |
| U    | Upcoming                |
| P    | In Progress             |
| P2   | Second half in progress |

---

## Match Outcome Codes

| Code | Meaning                |
| ---- | ---------------------- |
| A    | Team 1 won             |
| B    | Team 2 won             |
| D    | Draw                   |
| N    | Not played / Cancelled |

---

## Pagination

The API uses offset-based pagination. To retrieve results beyond the first page:

1. Check `pageInfo.numPages` to see total pages available
2. Increment the `page` parameter (e.g., `page=1`, `page=2`)
3. Keep other parameters consistent

### Pagination Example

```
# Page 1 (first 100 results)
?page=0&pageSize=100

# Page 2 (next 100 results)
?page=1&pageSize=100

# Page 3 (next 100 results)
?page=2&pageSize=100
```

---

## Rate Limiting

No specific rate limit information is documented. However, assume standard API rate limiting applies. Space requests appropriately if making multiple calls.

---

## Timeouts

Connection timeouts typically occur after 30 seconds of inactivity. For large result sets, consider implementing streaming or pagination.

---

## Implementation Notes

1. **Timestamps** are provided in milliseconds since epoch (UTC) in the `millis` field
2. **Timezone Offset** is included in `gmtOffset` field for local time conversion
3. **Null Values** are common for optional fields like `attendance`, `weather`, `description`
4. **Team Arrays** always contain exactly 2 elements (home and away teams)
5. **Score Arrays** correspond to team order in teams array
6. **Events Array** can contain multiple events; matches can belong to multiple competitions
7. **Date Format** in query parameters uses `YYYY-MM-DD` format (no time component)
8. **Status Codes**: "C" = Completed, "U" = Upcoming, "P" = In Progress (inferred)
9. **Outcome Codes**: "A" = team 1 won, "B" = team 2 won, "D" = Draw, "N" = Not played
10. **Inferred Parameters**: The parameters `sport`, `event`, `competition`, `team`, `venue`, and `status` are inferred from the response structure and API patterns with the event endpoint. Direct confirmation through successful API calls with these parameters has not been possible due to network restrictions, but they likely follow similar patterns to the event API.

---

## Authentication

No authentication headers are visible in the provided endpoint. The API appears to be publicly accessible, though this should be confirmed for production use.

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
