import type { ApiError, ApiSuccess } from '@mediklinik/types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RouteMeta {
  summary?: string;
  description?: string;
  tags?: string[];
  auth?: 'bearer' | 'public';
  operationId?: string;
  requestBody?: Record<string, unknown>;
  responses?: Record<string, unknown>;
}

export interface RequestContext {
  request: Request;
  params: Record<string, string>;
  query: URLSearchParams;
  body?: unknown;
}

type HandlerResult = ApiSuccess<unknown> | ApiError | Response | string | Record<string, unknown>;
type Handler = (context: RequestContext) => HandlerResult | Promise<HandlerResult>;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: Handler;
  meta?: RouteMeta;
}

export class ApiRouter {
  private readonly routes: RouteDefinition[] = [];

  get(path: string, handler: Handler, meta?: RouteMeta) {
    this.routes.push({ method: 'GET', path, handler, meta });
  }

  post(path: string, handler: Handler, meta?: RouteMeta) {
    this.routes.push({ method: 'POST', path, handler, meta });
  }

  put(path: string, handler: Handler, meta?: RouteMeta) {
    this.routes.push({ method: 'PUT', path, handler, meta });
  }

  patch(path: string, handler: Handler, meta?: RouteMeta) {
    this.routes.push({ method: 'PATCH', path, handler, meta });
  }

  listRoutes() {
    return this.routes;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    for (const route of this.routes) {
      if (route.method !== request.method) {
        continue;
      }

      const params = matchPath(route.path, pathname);
      if (!params) {
        continue;
      }

      const body = await parseBody(request);
      const result = await route.handler({
        request,
        params,
        query: url.searchParams,
        body,
      });

      if (result instanceof Response) {
        return result;
      }

      if (typeof result === 'string') {
        return new Response(result, {
          headers: {
            'content-type': 'text/html; charset=utf-8',
          },
        });
      }

      return Response.json(result);
    }

    return Response.json(
      {
        success: false,
        message: `Route ${request.method} ${pathname} tidak ditemukan.`,
      },
      { status: 404 },
    );
  }
}

function matchPath(routePath: string, pathname: string) {
  const routeSegments = routePath.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);

  if (routeSegments.length !== pathSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (const [index, routeSegment] of routeSegments.entries()) {
    const pathSegment = pathSegments[index];
    if (!pathSegment) {
      return null;
    }

    if (routeSegment.startsWith(':')) {
      params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
      continue;
    }

    if (routeSegment !== pathSegment) {
      return null;
    }
  }

  return params;
}

async function parseBody(request: Request) {
  if (request.method === 'GET' || request.method === 'DELETE') {
    return undefined;
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await request.json();
    } catch {
      return undefined;
    }
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  return undefined;
}
