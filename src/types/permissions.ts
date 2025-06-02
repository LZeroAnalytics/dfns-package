export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  actions: string[];
  conditions?: any;
}

export interface UserPermission {
  userId: string;
  permissionId: string;
  grantedBy: string;
  dateGranted: string;
  expiresAt?: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  grantedBy: string;
  dateGranted: string;
}
