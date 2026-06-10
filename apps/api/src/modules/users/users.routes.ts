import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { UsersService } from './users.service';

const usersService = new UsersService();

export function registerUserRoutes(router: ApiRouter) {
  router.get('/users/me', async () => ok(await usersService.getCurrentUser()), {
    summary: 'Get current user',
    tags: ['Users'],
    auth: 'bearer',
  });
  router.put('/users/me/profile', async () => ok(await usersService.getCurrentUser(), 'Profil berhasil diperbarui'), {
    summary: 'Update current profile',
    tags: ['Users'],
    auth: 'bearer',
  });
}
