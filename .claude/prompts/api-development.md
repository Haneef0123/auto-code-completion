# API Development Prompt

## Overview
Guidelines for creating API routes and Server Actions in Next.js 16 App Router.

## Route Handlers (API Routes)

### Basic Structure
```typescript
// app/api/route-name/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Handle GET request
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input
    if (!isValidBody(body)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    // Process request
    const result = await processData(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Dynamic Routes
```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getUserById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## Server Actions

### Basic Server Action
```typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache';

interface CreateUserData {
  name: string;
  email: string;
}

interface ActionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function createUser(
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!name || !email) {
      return {
        success: false,
        error: 'Name and email are required'
      };
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Create user
    const user = await db.user.create({
      data: { name, email }
    });

    // Revalidate relevant paths
    revalidatePath('/users');

    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error('Create user error:', error);
    return {
      success: false,
      error: 'Failed to create user'
    };
  }
}
```

### Server Action with Type-Safe Data
```typescript
'use server'

import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).optional()
});

type UserInput = z.infer<typeof userSchema>;

export async function createUserTypeSafe(
  input: UserInput
): Promise<ActionResult> {
  try {
    // Validate with Zod
    const validated = userSchema.parse(input);

    // Create user
    const user = await db.user.create({
      data: validated
    });

    revalidatePath('/users');

    return {
      success: true,
      data: user
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors
      };
    }
    return {
      success: false,
      error: 'Failed to create user'
    };
  }
}
```

## API Best Practices

### 1. Input Validation
```typescript
function validateInput(data: unknown): data is ValidType {
  // Runtime validation
  if (!data || typeof data !== 'object') return false;
  // Check required fields
  // Return type guard
  return true;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!validateInput(body)) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }
  // Process validated data
}
```

### 2. Error Handling
```typescript
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleAPIRequest(handler: () => Promise<unknown>) {
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 3. Authentication
```typescript
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Proceed with authenticated request
}
```

### 4. Rate Limiting
```typescript
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute

  const timestamps = rateLimiter.get(ip) || [];
  const recentRequests = timestamps.filter(t => now - t < windowMs);

  if (recentRequests.length >= limit) {
    return false;
  }

  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Process request
}
```

### 5. Response Types
```typescript
interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

function successResponse<T>(data: T): NextResponse<APIResponse<T>> {
  return NextResponse.json({ data });
}

function errorResponse(
  error: string,
  status: number = 400
): NextResponse<APIResponse> {
  return NextResponse.json({ error }, { status });
}
```

## API Checklist

### Route Handlers
- [ ] Proper HTTP methods (GET, POST, PUT, DELETE)
- [ ] Input validation
- [ ] Error handling with appropriate status codes
- [ ] TypeScript types for request/response
- [ ] Authentication/authorization
- [ ] Rate limiting if needed
- [ ] CORS headers if needed
- [ ] Proper logging

### Server Actions
- [ ] 'use server' directive
- [ ] FormData or typed input
- [ ] Input validation
- [ ] Error handling
- [ ] revalidatePath/revalidateTag for cache
- [ ] Return type-safe results
- [ ] Handle edge cases
- [ ] Proper logging

## HTTP Status Codes

### Success (2xx)
- `200` - OK (GET, PUT, DELETE)
- `201` - Created (POST)
- `204` - No Content (DELETE)

### Client Errors (4xx)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limited)

### Server Errors (5xx)
- `500` - Internal Server Error
- `503` - Service Unavailable

## Security Considerations

### 1. Input Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}
```

### 2. SQL Injection Prevention
```typescript
// Use parameterized queries
const user = await db.user.findUnique({
  where: { id: userId } // Parameterized
});

// DON'T use string concatenation
// const query = `SELECT * FROM users WHERE id = ${userId}`; // ❌
```

### 3. CSRF Protection
```typescript
// Use Server Actions (built-in CSRF protection)
// Or implement CSRF tokens for API routes
```

### 4. Environment Variables
```typescript
// Access secrets only on server
const apiKey = process.env.API_KEY;
// Never expose secrets to client
```

## Testing APIs

### Example Test
```typescript
import { GET } from './route';
import { NextRequest } from 'next/server';

describe('GET /api/users', () => {
  it('returns users list', async () => {
    const request = new NextRequest('http://localhost:3000/api/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
```

## Performance Tips

1. Use Server Components for data fetching
2. Implement caching strategies
3. Use revalidatePath/revalidateTag
4. Optimize database queries
5. Implement pagination
6. Use streaming for large responses
7. Add appropriate cache headers
