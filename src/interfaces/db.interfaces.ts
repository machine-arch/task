interface Users {
  id: number;
  name: string;
  lastName: string;
  agency: string;
  position: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface Permissions {
  tabs: number[];
  users: number[];
}

interface Roles {
  id: number;
  name: string;
  description: string;
  permissions: Permissions;
  createdAt: string;
  updatedAt: string;
}
