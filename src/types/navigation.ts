import type {PersonType} from './registration';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  SelectPersonType: undefined;
  PersonForm: {registrationId?: string; step?: number} | undefined;
  CompanyForm: {registrationId?: string; step?: number} | undefined;
  RegistrationDetails: {registrationId: string};
  Filters: {
    type?: 'ALL' | 'PF' | 'PJ';
    documentationStatus?: 'ALL' | 'complete' | 'pending';
  };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Registrations: undefined;
  NewRegistration: undefined;
  Settings: undefined;
};

export type FormRouteParams = {
  type: PersonType;
  registrationId?: string;
};
