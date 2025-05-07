
// Re-export all auth utilities from this index file
import { getCurrentUser, getCurrentUserSync, isAuthenticated, isAuthenticatedSync } from './user';
import { login, register, logout } from './authentication';
import { hasRole, hasRoleSync } from './roles';
import { createGroundOwner } from './groundOwner';

export {
  getCurrentUser,
  getCurrentUserSync,
  isAuthenticated,
  isAuthenticatedSync,
  login,
  register,
  logout,
  hasRole,
  hasRoleSync,
  createGroundOwner,
};
