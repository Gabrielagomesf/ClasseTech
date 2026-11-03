import type {PersonType} from './registration';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  SelectPersonType: undefined;
  PersonForm: {registrationId?: string; step?: number} | undefined;
  CompanyForm: {registrationId?: string; step?: number} | undefined;
  RegistrationDetails: {registrationId: string};
};

export type MainTabParamList = {
  Dashboard: undefined;
  Registrations:
    | {
        documentationStatus?: 'ALL' | 'complete' | 'pending' | 'issue';
      }
    | undefined;
  NewRegistration: undefined;
  Reports: undefined;
  Settings: undefined;
};

export type FormRouteParams = {
  type: PersonType;
  registrationId?: string;
};
