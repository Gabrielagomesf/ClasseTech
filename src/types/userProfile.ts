import type {SexOption} from '../constants/catalog';

export type UserProfile = {
  displayName: string;
  email: string;
  jobTitle: string;
  sexo: SexOption | '';
  updatedAt: string;
};

export const emptyUserProfile = (): UserProfile => ({
  displayName: '',
  email: '',
  jobTitle: '',
  sexo: '',
  updatedAt: new Date(0).toISOString(),
});
