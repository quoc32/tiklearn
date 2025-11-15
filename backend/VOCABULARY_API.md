# Vocabulary Generation API

## Setup

1. Get your Gemini API key from: https://makersuite.google.com/app/apikey

2. Add the API key to `application.properties`:

```properties
gemini.api.key=YOUR_ACTUAL_API_KEY
```

## API Endpoints

### 1. Generate vocabularies for a specific topic

```
POST /admin/vocabularies/generate?topic=Animals&count=10
```

Response:

```json
{
  "success": true,
  "message": "Generated 10 vocabularies for topic: Animals",
  "vocabularies": [
    {
      "id": 1,
      "word": "elephant",
      "definition": "A large mammal with a trunk and tusks",
      "exampleSentence": "The elephant is the largest land animal.",
      "topic": "Animals",
      "createdAt": "2025-11-15T14:30:00"
    }
  ]
}
```

### 2. Generate vocabularies for ALL topics in database

```
POST /admin/vocabularies/generate-all?countPerTopic=5
```

This will:

- Fetch all topics from the database
- Generate `countPerTopic` vocabularies for each topic
- Save all vocabularies to database
- Return the complete list

Response:

```json
{
  "success": true,
  "message": "Generated 50 vocabularies for 10 topics",
  "vocabularies": [...],
  "topicsProcessed": 10,
  "countPerTopic": 5
}
```

### 3. Get all vocabularies

```
GET /admin/vocabularies
```

### 4. Get vocabularies by topic

```
GET /admin/vocabularies/topic/Animals
```

### 5. Delete a vocabulary

```
DELETE /admin/vocabularies/{id}
```

## Example: Generate 50 vocabularies

If you have 10 topics in database and want 50 total vocabularies (5 per topic):

```bash
curl -X POST "http://localhost:8080/admin/vocabularies/generate-all?countPerTopic=5"
```

Or use the test.rest file:

```
POST http://localhost:8080/admin/vocabularies/generate-all?countPerTopic=5
```

## Notes

- The API uses a 2-second delay between topics to avoid rate limiting
- Make sure you have topics in the database before calling `/generate-all`
- The Gemini API key must be valid and have quota available
