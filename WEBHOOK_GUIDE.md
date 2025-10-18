# Webhook API Guide for n8n Integration

## Endpoint

**URL:** `POST /api/webhook/new-post`

**Full URL (local):** `http://localhost:3001/api/webhook/new-post`

**Full URL (production):** `https://your-domain.com/api/webhook/new-post`

## Request Format

### Headers
```
Content-Type: application/json
```

### Body (JSON)

```json
{
  "title": "Your Post Title",
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "Your post content here"
            }
          ]
        }
      ]
    }
  },
  "excerpt": "Optional excerpt/description",
  "featured_image": "https://example.com/image.jpg",
  "status": "published"
}
```

### Field Descriptions

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | ✅ Yes | - | Post title |
| `content` | object | ✅ Yes | - | Lexical editor JSON format |
| `excerpt` | string | ❌ No | null | Short description/summary |
| `featured_image` | string | ❌ No | null | URL to featured image |
| `status` | string | ❌ No | "draft" | "draft" or "published" |

## Response Format

### Success (200)

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "uuid-here",
    "title": "Your Post Title",
    "slug": "your-post-title",
    "content": {...},
    "excerpt": "Optional excerpt",
    "featured_image": null,
    "status": "published",
    "published_at": "2025-10-18T20:13:47.985Z",
    "created_at": "2025-10-18T20:13:48.033Z",
    "updated_at": "2025-10-18T20:13:48.033Z"
  }
}
```

### Error (400)

```json
{
  "success": false,
  "error": "Title is required and must be a string"
}
```

### Error (500)

```json
{
  "success": false,
  "error": "Failed to create post",
  "message": "Database connection error"
}
```

## n8n Configuration

### Step 1: HTTP Request Node

1. Add an **HTTP Request** node to your workflow
2. Configure:
   - **Method:** POST
   - **URL:** `http://localhost:3001/api/webhook/new-post` (or your production URL)
   - **Authentication:** None (or add auth if you implement it)
   - **Body Content Type:** JSON
   - **Specify Body:** Using Fields Below

### Step 2: Body Parameters

Add these fields in the HTTP Request node:

```javascript
{
  "title": "{{ $json.title }}", // From previous node
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "{{ $json.content }}"
            }
          ]
        }
      ]
    }
  },
  "excerpt": "{{ $json.excerpt }}",
  "status": "published"
}
```

### Step 3: Handle Response

The webhook returns the created post. You can:
- Check `success` field to verify creation
- Use `data.slug` to get the post URL
- Store `data.id` for future updates

## Testing with curl

### Minimal Request (Title + Content only)

```bash
curl -X POST http://localhost:3001/api/webhook/new-post \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": {
      "root": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "text": "This is a test post"
              }
            ]
          }
        ]
      }
    }
  }'
```

### Full Request (All Fields)

```bash
curl -X POST http://localhost:3001/api/webhook/new-post \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Test Post",
    "content": {
      "root": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "text": "This is a complete test with all fields"
              }
            ]
          }
        ]
      }
    },
    "excerpt": "A complete test post with all optional fields",
    "featured_image": "https://via.placeholder.com/800x400",
    "status": "published"
  }'
```

## Features

✅ **Automatic Slug Generation** - Creates URL-friendly slugs from titles  
✅ **Duplicate Handling** - Adds timestamp to duplicate slugs  
✅ **Input Validation** - Validates all fields before insertion  
✅ **Error Handling** - Returns clear error messages  
✅ **Flexible Status** - Support for both "draft" and "published" posts  
✅ **Optional Fields** - Only title and content are required  

## Post URL

After creating a post, it will be available at:

```
http://localhost:3001/blog/[slug]
```

Example: `http://localhost:3001/blog/test-post`

## Security Recommendations

For production use, consider:

1. **Authentication** - Add API key or Bearer token validation
2. **Rate Limiting** - Prevent abuse with rate limits
3. **CORS** - Configure allowed origins
4. **Webhook Secrets** - Verify webhook signatures
5. **Input Sanitization** - Additional content validation

## Example n8n Workflow

```
[Trigger] → [AI Generate Content] → [HTTP Request (Webhook)] → [Success Handler]
```

Where:
- **Trigger**: Schedule, Manual, or Webhook trigger
- **AI Generate**: OpenAI/Claude node to generate content
- **HTTP Request**: Sends to your webhook
- **Success Handler**: Log, notify, or update external system

