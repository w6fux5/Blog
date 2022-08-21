export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResponseUser extends Omit<AuthUser, 'password'> {
  _id: string;
  profilePhoto: string;
  isAdmin: string;
  token: string;
}

export interface FormProps {
  loading?: boolean;
}
