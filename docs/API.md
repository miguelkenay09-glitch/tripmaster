# 📚 TripMaster API Documentation

## Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.tripmaster.com/api/v1
```

## Authentication

All endpoints (except `/health`) require JWT token in header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

## Response Format

All responses follow this format:

```json
{
  "data": { /* actual data */ },
  "status": "success|error",
  "message": "Operation description",
  "timestamp": "2026-05-27T22:57:25Z"
}
```

## POIs Endpoints

### List all POIs
```http
GET /pois
```

**Query Parameters:**
- `category` (string) - Filter by category (castle, museum, beach, etc)
- `country` (string) - Filter by country (Italy, France, Spain, etc)
- `city` (string) - Filter by city
- `limit` (number) - Results per page (default: 50)
- `offset` (number) - Pagination offset (default: 0)

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/pois?country=Italy&city=Rome&limit=10"
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Colosseum",
      "description": "Ancient amphitheater...",
      "category": "historical",
      "country": "Italy",
      "city": "Rome",
      "latitude": 41.8902,
      "longitude": 12.4924,
      "rating": 4.8,
      "reviews_count": 15000,
      "entrance_fee": 18.50,
      "images": ["url1", "url2"],
      "historical_context": {
        "period": "70-80 AD",
        "history": "Built during the reign of the Flavian emperors...",
        "curiosities": ["Could hold 50,000 spectators", "Made of travertine stone"]
      }
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}
```

### Get POI Details
```http
GET /pois/:id
```

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/pois/550e8400-e29b-41d4-a716-446655440000"
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Colosseum",
    "description": "Ancient amphitheater in Rome...",
    "category": "historical",
    "country": "Italy",
    "city": "Rome",
    "latitude": 41.8902,
    "longitude": 12.4924,
    "address": "Piazza del Colosseo, 1, Rome",
    "opening_hours": {
      "Monday": "08:30-19:15",
      "Tuesday": "08:30-19:15",
      "Wednesday": "08:30-19:15",
      "Thursday": "08:30-19:15",
      "Friday": "08:30-19:15",
      "Saturday": "08:30-19:15",
      "Sunday": "08:30-19:15"
    },
    "entrance_fee": 18.50,
    "rating": 4.8,
    "reviews_count": 15000,
    "images": ["url1", "url2", "url3"],
    "historical_context": {
      "period": "70-80 AD",
      "history": "Built during the reign of the Flavian emperors...",
      "curiosities": ["Could hold 50,000 spectators"],
      "architecture": "Roman engineering marvel"
    },
    "accessibility": {
      "wheelchair": true,
      "parking": true,
      "public_transport": true
    }
  }
}
```

### Get Nearby POIs
```http
GET /pois/nearby/:latitude/:longitude
```

**Query Parameters:**
- `radius` (number) - Search radius in kilometers (default: 10)

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/pois/nearby/41.8902/12.4924?radius=5"
```

**Response:**
```json
{
  "data": [
    { /* POI 1 */ },
    { /* POI 2 */ },
    { /* POI 3 */ }
  ]
}
```

## Restaurants Endpoints

### List Restaurants
```http
GET /restaurants
```

**Query Parameters:**
- `city` (string) - Filter by city
- `country` (string) - Filter by country
- `priceRange` (string) - Filter by price ($, $$, $$$, $$$$)
- `michelin` (number) - Filter by Michelin stars (1, 2, 3)
- `limit` (number) - Results per page (default: 50)
- `offset` (number) - Pagination offset

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/restaurants?country=France&city=Paris&michelin=1&limit=10"
```

### Get Nearby Restaurants
```http
GET /restaurants/nearby/:latitude/:longitude
```

**Query Parameters:**
- `radius` (number) - Search radius in kilometers (default: 5)

## Hotels Endpoints

### List Hotels
```http
GET /hotels
```

**Query Parameters:**
- `city` (string) - Filter by city
- `country` (string) - Filter by country
- `minPrice` (number) - Minimum price per night
- `maxPrice` (number) - Maximum price per night
- `starRating` (number) - Filter by star rating (1-5)
- `limit` (number) - Results per page (default: 50)

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/hotels?country=Spain&city=Barcelona&minPrice=50&maxPrice=200&limit=20"
```

### Get Nearby Hotels
```http
GET /hotels/nearby/:latitude/:longitude
```

**Query Parameters:**
- `radius` (number) - Search radius in kilometers (default: 5)

## Weather Endpoints

### Get Current Weather
```http
GET /weather/:latitude/:longitude
```

**Query Parameters:**
- `units` (string) - Temperature units: metric, imperial (default: metric)

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/weather/41.8902/12.4924"
```

**Response:**
```json
{
  "data": {
    "temperature": 22.5,
    "feels_like": 21.0,
    "humidity": 65,
    "pressure": 1013,
    "wind_speed": 3.5,
    "cloudiness": 20,
    "description": "Partly cloudy",
    "icon": "02d",
    "visibility": 10000,
    "sunrise": 1685098800,
    "sunset": 1685151600
  }
}
```

### Get Weather Forecast
```http
GET /weather/forecast/:latitude/:longitude
```

**Query Parameters:**
- `units` (string) - Temperature units: metric, imperial (default: metric)

## Error Responses

### Error Format
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2026-05-27T22:57:25Z"
}
```

### Common Errors

**400 - Bad Request**
```json
{
  "status": "error",
  "message": "Invalid query parameters",
  "code": "INVALID_QUERY"
}
```

**401 - Unauthorized**
```json
{
  "status": "error",
  "message": "Missing or invalid JWT token",
  "code": "UNAUTHORIZED"
}
```

**404 - Not Found**
```json
{
  "status": "error",
  "message": "POI not found",
  "code": "NOT_FOUND"
}
```

**429 - Too Many Requests**
```json
{
  "status": "error",
  "message": "Rate limit exceeded",
  "code": "RATE_LIMIT"
}
```

**500 - Server Error**
```json
{
  "status": "error",
  "message": "Internal server error",
  "code": "SERVER_ERROR"
}
```

## Rate Limiting

- **Free Tier**: 100 requests/minute
- **Premium Tier**: 1000 requests/minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1685184425
```

## Code Examples

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get POIs
const response = await api.get('/pois', {
  params: {
    country: 'Italy',
    city: 'Rome',
    limit: 10
  }
});

const pois = response.data.data;
```

### Python
```python
import requests

headers = {'Authorization': f'Bearer {token}'}

response = requests.get(
    'http://localhost:3000/api/v1/pois',
    params={
        'country': 'Italy',
        'city': 'Rome',
        'limit': 10
    },
    headers=headers
)

pois = response.json()['data']
```

### cURL
```bash
curl -X GET 'http://localhost:3000/api/v1/pois?country=Italy&city=Rome&limit=10' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```
