import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getUserProfile,
  saveUserProfile,
} from '../repositories/profileRepository';
import {validateUserProfile} from '../services/validation/profileValidation';
import type {UserProfile} from '../types/userProfile';
import {emptyUserProfile} from '../types/userProfile';
import {getProfileFirstName, getProfileInitials} from '../utils/profileDisplay';

type UserProfileContextValue = {
  ready: boolean;
  profile: UserProfile;
  firstName: string;
  initials: string;
  hasProfile: boolean;
  refresh: () => Promise<void>;
  save: (next: UserProfile) => Promise<{ok: true} | {ok: false; errors: Record<string, string>}>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({children}: {children: React.ReactNode}) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(emptyUserProfile());

  const refresh = useCallback(async () => {
    const data = await getUserProfile();
    setProfile(data);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refresh();
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const save = useCallback(async (next: UserProfile) => {
    const result = validateUserProfile(next);
    if (!result.ok) {
      return {ok: false as const, errors: result.errors};
    }
    const saved = await saveUserProfile(next);
    setProfile(saved);
    return {ok: true as const};
  }, []);

  const firstName = getProfileFirstName(profile.displayName);
  const initials = getProfileInitials(profile.displayName);
  const hasProfile = profile.displayName.trim().length > 0;

  const value = useMemo(
    () => ({
      ready,
      profile,
      firstName,
      initials,
      hasProfile,
      refresh,
      save,
    }),
    [ready, profile, firstName, initials, hasProfile, refresh, save],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return ctx;
}
