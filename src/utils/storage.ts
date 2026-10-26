import { UserProfile, ContactRequest } from '../types';
import { INITIAL_PROFILES, INITIAL_REQUESTS } from '../data/initialData';

const PROFILES_STORAGE_KEY = 'nikah_niger_profiles_v1';
const REQUESTS_STORAGE_KEY = 'nikah_niger_requests_v1';

export function getStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading profiles from storage', e);
    return INITIAL_PROFILES;
  }
}

export function saveStoredProfiles(profiles: UserProfile[]) {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles to storage', e);
  }
}

export function getStoredRequests(): ContactRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading requests from storage', e);
    return INITIAL_REQUESTS;
  }
}

export function saveStoredRequests(requests: ContactRequest[]) {
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving requests to storage', e);
  }
}
