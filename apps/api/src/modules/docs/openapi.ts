import type { RouteDefinition } from '../shared/api-router';

const apiEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', nullable: true },
    data: { type: 'object', additionalProperties: true },
  },
  required: ['success'],
};

export function createOpenApiDocument(routes: RouteDefinition[]) {
  const paths: Record<string, Record<string, unknown>> = {};

  for (const route of routes) {
    const openApiPath = route.path.replaceAll(/:([A-Za-z0-9_]+)/g, '{$1}');
    const operation = {
      tags: route.meta?.tags ?? ['General'],
      summary: route.meta?.summary ?? route.path,
      description: route.meta?.description,
      operationId: route.meta?.operationId ?? buildOperationId(route.method, route.path),
      security: route.meta?.auth === 'bearer' ? [{ bearerAuth: [] }] : [],
      requestBody: route.meta?.requestBody,
      responses: route.meta?.responses ?? defaultResponses(),
    };

    paths[openApiPath] ??= {};
    paths[openApiPath][route.method.toLowerCase()] = operation;
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'MediKlinik API',
      version: '0.2.0',
      description:
        'Dokumentasi API foundation dan core flow MediKlinik. Gunakan endpoint auth untuk memperoleh access token, lalu kirim token tersebut via Authorization: Bearer <token> pada endpoint yang membutuhkan autentikasi.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check dan utilitas dasar API.' },
      { name: 'Auth', description: 'Login, register, dan refresh token JWT.' },
      { name: 'Clinics', description: 'Registrasi dan pengaturan klinik aktif.' },
      { name: 'Public Clinics', description: 'Halaman publik klinik dan alur daftar antrian pasien.' },
      { name: 'Dashboard', description: 'Ringkasan data operasional untuk dashboard.' },
      { name: 'Queues', description: 'Manajemen antrian realtime klinik.' },
      { name: 'Medical Records', description: 'Rekam medis dan riwayat pemeriksaan pasien.' },
      { name: 'Prescriptions', description: 'Resep dan transaksi pengurangan stok atomik.' },
      { name: 'Medicines', description: 'Data obat, alert stok, dan mutasi stok.' },
      { name: 'Invoices', description: 'Invoice pasien dan pembuatan transaksi online.' },
      { name: 'Reports', description: 'Data agregat kunjungan dan pendapatan.' },
      { name: 'Subscriptions', description: 'Checkout dan webhook subscription SaaS MediKlinik.' },
      { name: 'Payments', description: 'Webhook pembayaran invoice pasien per klinik.' },
      { name: 'Push', description: 'Subscription dan pengiriman Web Push.' },
      { name: 'Users', description: 'Profil user aktif dan update profil.' },
      { name: 'Docs', description: 'OpenAPI JSON dan halaman dokumentasi Scalar.' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Gunakan access token hasil login. Contoh header: Authorization: Bearer <accessToken>',
        },
      },
      schemas: {
        ApiEnvelope: apiEnvelopeSchema,
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'admin@mediklinik.id' },
            password: { type: 'string', example: 'password' },
          },
          required: ['email', 'password'],
        },
        RefreshRequest: {
          type: 'object',
          properties: {
            refreshToken: { type: 'string', example: 'refresh_user_demo' },
          },
          required: ['refreshToken'],
        },
        ClinicRegisterRequest: {
          type: 'object',
          properties: {
            clinicName: { type: 'string', example: 'Klinik Sehat Sentosa' },
            ownerName: { type: 'string', example: 'Nadia' },
            email: { type: 'string', example: 'owner@klinik.id' },
            password: { type: 'string', example: 'password' },
          },
          required: ['clinicName', 'ownerName', 'email', 'password'],
        },
      },
    },
    'x-auth-guide': {
      login: 'POST /auth/login untuk mendapatkan accessToken dan refreshToken.',
      refresh: 'POST /auth/refresh untuk rotasi access token.',
      protectedRoutes:
        'Endpoint dengan ikon gembok / bearerAuth membutuhkan header Authorization: Bearer <accessToken>.',
    },
    paths,
  };
}

function buildOperationId(method: string, path: string) {
  const normalized = path
    .replaceAll('/', '_')
    .replaceAll(':', '')
    .replaceAll('-', '_')
    .replace(/^_+|_+$/g, '');

  return `${method.toLowerCase()}_${normalized || 'root'}`;
}

function defaultResponses() {
  return {
    '200': {
      description: 'Response berhasil',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ApiEnvelope',
          },
        },
      },
    },
  };
}
