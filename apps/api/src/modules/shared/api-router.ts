import type { ApiError, ApiSuccess } from '@mediklinik/types';
import type { AuthContext } from './auth-context';
import { parseAccessToken } from './token';
import { runWithAuthContext } from './request-context';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RouteMeta {
  summary?: string;
  description?: string;
  tags?: string[];
  auth?: 'bearer' | 'public';
  subscriptionRequired?: boolean;
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

  delete(path: string, handler: Handler, meta?: RouteMeta) {
    this.routes.push({ method: 'DELETE', path, handler, meta });
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

      const authContext = resolveAuthContext(request);
      const accessError = validateRouteAccess(route, authContext);
      if (accessError) {
        return accessError;
      }

      const body = await parseBody(request);
      let result: HandlerResult;
      try {
        result = await runWithAuthContext(authContext, () =>
          route.handler({ request, params, query: url.searchParams, body }),
        );
      } catch (error) {
        return Response.json({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan internal.' }, { status: 400 });
      }

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

function validateRouteAccess(route: RouteDefinition, authContext: AuthContext | null) {
  if (route.meta?.auth === 'bearer' && !authContext) {
    return Response.json(
      {
        success: false,
        message: 'Unauthorized. Bearer token valid dibutuhkan untuk endpoint ini.',
      },
      { status: 401 },
    );
  }

  if (route.meta?.subscriptionRequired && authContext) {
    if (authContext.subscriptionStatus !== 'TRIAL' && authContext.subscriptionStatus !== 'ACTIVE') {
      return Response.json(
        {
          success: false,
          message: 'Masa langganan Anda telah berakhir. Perpanjang untuk melanjutkan.',
        },
        { status: 403 },
      );
    }
  }

  return null;
}

function resolveAuthContext(request: Request): AuthContext | null {
  const authorizationHeader = request.headers.get('authorization');
  if (authorizationHeader?.startsWith('Bearer ')) {
    const token = authorizationHeader.slice('Bearer '.length).trim();
    const payload = parseAccessToken(token);
    if (payload?.sub && payload.email && payload.role && payload.clinicId) {
      return {
        userId: payload.sub,
        clinicId: payload.clinicId,
        role: payload.role,
        subscriptionStatus: payload.subscriptionStatus ?? 'TRIAL',
      };
    }
  }

  const clinicId = request.headers.get('x-clinic-id');
  if (clinicId) {
    return {
      userId: request.headers.get('x-user-id') ?? 'user_header',
      clinicId,
      role: (request.headers.get('x-role') as AuthContext['role']) ?? 'ADMIN',
      subscriptionStatus:
        (request.headers.get('x-subscription-status') as AuthContext['subscriptionStatus']) ?? 'TRIAL',
    };
  }

  return null;
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
  if (request.method === 'GET') {
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
