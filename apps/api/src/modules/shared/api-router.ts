import type { ApiError, ApiSuccess } from '@mediklinik/types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Handler = (context?: unknown) => ApiSuccess<unknown> | ApiError;

interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: Handler;
  meta?: Record<string, unknown>;
}

export class ApiRouter {
  private readonly routes: RouteDefinition[] = [];

  get(path: string, handler: Handler, meta?: Record<string, unknown>) {
    this.routes.push({ method: 'GET', path, handler, meta });
  }

  post(path: string, handler: Handler, meta?: Record<string, unknown>) {
    this.routes.push({ method: 'POST', path, handler, meta });
  }

  put(path: string, handler: Handler, meta?: Record<string, unknown>) {
    this.routes.push({ method: 'PUT', path, handler, meta });
  }

  patch(path: string, handler: Handler, meta?: Record<string, unknown>) {
    this.routes.push({ method: 'PATCH', path, handler, meta });
  }

  listRoutes() {
    return this.routes;
  }
}
