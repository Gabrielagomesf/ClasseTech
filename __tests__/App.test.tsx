/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

jest.mock('../src/navigation', () => ({
  RootNavigator: () => null,
}));

jest.mock('../src/context/UserProfileContext', () => ({
  UserProfileProvider: ({children}: {children: React.ReactNode}) => children,
  useUserProfile: () => ({
    ready: true,
    profile: {
      displayName: '',
      email: '',
      jobTitle: '',
      sexo: '',
      updatedAt: new Date(0).toISOString(),
    },
    firstName: '',
    initials: '?',
    hasProfile: false,
    refresh: jest.fn(),
    save: jest.fn(),
  }),
}));

jest.mock('../src/context/RegistrationsContext', () => ({
  RegistrationsProvider: ({children}: {children: React.ReactNode}) => children,
  useRegistrations: () => ({
    ready: true,
    loading: false,
    error: null,
    items: [],
    stats: {total: 0, pf: 0, pj: 0, pending: 0, recent: []},
    refresh: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    clearLocalData: jest.fn(),
  }),
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
