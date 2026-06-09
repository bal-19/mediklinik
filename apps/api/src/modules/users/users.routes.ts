import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { UsersService } from './users.service';

const usersService = new UsersService();

export function registerUserRoutes(router: ApiRouter) {
  router.get('/users/me', () => ok(usersService.getCurrentUser()));
  router.put('/users/me/profile', () => ok(usersService.getCurrentUser(), 'Profil berhasil diperbarui'));
}
