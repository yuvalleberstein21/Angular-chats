export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export const DEFAULT_USER: User = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
};
