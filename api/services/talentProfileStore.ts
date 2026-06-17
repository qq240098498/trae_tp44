import type { HighPerformerProfile } from '../../shared/types';
import { highPerformerProfiles as defaultProfiles } from '../data/mockData';

interface TalentProfileStoreConfig {
  enablePersistence?: boolean;
  storageKey?: string;
}

class TalentProfileStore {
  private profiles: Map<string, HighPerformerProfile>;
  private config: Required<TalentProfileStoreConfig>;

  constructor(config: TalentProfileStoreConfig = {}) {
    this.config = {
      enablePersistence: config.enablePersistence ?? false,
      storageKey: config.storageKey ?? 'talent_profiles',
    };
    this.profiles = new Map();
    this.initialize();
  }

  private initialize(): void {
    if (this.config.enablePersistence) {
      this.loadFromStorage();
    }
    if (this.profiles.size === 0) {
      this.loadDefaults();
    }
  }

  private loadDefaults(): void {
    defaultProfiles.forEach(profile => {
      this.profiles.set(profile.id, { ...profile });
    });
  }

  private loadFromStorage(): void {
    try {
      if (typeof process !== 'undefined' && process.env) {
        const envProfiles = process.env.TALENT_PROFILES;
        if (envProfiles) {
          const parsed = JSON.parse(envProfiles) as HighPerformerProfile[];
          parsed.forEach(profile => {
            this.profiles.set(profile.id, profile);
          });
          return;
        }
      }
    } catch {
      console.warn('Failed to load talent profiles from environment, using defaults');
    }
  }

  getAll(): HighPerformerProfile[] {
    return Array.from(this.profiles.values());
  }

  getById(id: string): HighPerformerProfile | undefined {
    return this.profiles.get(id);
  }

  getByDepartment(department: string): HighPerformerProfile[] {
    return this.getAll().filter(p => p.department === department);
  }

  getByPosition(position: string): HighPerformerProfile[] {
    return this.getAll().filter(p =>
      p.position.toLowerCase().includes(position.toLowerCase()) ||
      position.toLowerCase().includes(p.position.toLowerCase())
    );
  }

  create(profile: Omit<HighPerformerProfile, 'id'> & { id?: string }): HighPerformerProfile {
    const id = profile.id || `perf-${Date.now()}`;
    if (this.profiles.has(id)) {
      throw new Error(`Profile with id ${id} already exists`);
    }
    const newProfile: HighPerformerProfile = {
      ...profile,
      id,
    } as HighPerformerProfile;
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  update(id: string, updates: Partial<Omit<HighPerformerProfile, 'id'>>): HighPerformerProfile {
    const existing = this.profiles.get(id);
    if (!existing) {
      throw new Error(`Profile with id ${id} not found`);
    }
    const updated: HighPerformerProfile = {
      ...existing,
      ...updates,
      id,
    };
    this.profiles.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.profiles.delete(id);
  }

  bulkCreate(profiles: Array<Omit<HighPerformerProfile, 'id'> & { id?: string }>): HighPerformerProfile[] {
    return profiles.map(p => this.create(p));
  }

  bulkDelete(ids: string[]): number {
    return ids.filter(id => this.delete(id)).length;
  }

  clear(): void {
    this.profiles.clear();
    this.loadDefaults();
  }

  replaceAll(profiles: HighPerformerProfile[]): void {
    this.profiles.clear();
    profiles.forEach(p => this.profiles.set(p.id, p));
  }

  count(): number {
    return this.profiles.size;
  }
}

export const talentProfileStore = new TalentProfileStore({
  enablePersistence: true,
});

export function getTalentProfiles(): HighPerformerProfile[] {
  return talentProfileStore.getAll();
}

export function getTalentProfileById(id: string): HighPerformerProfile | undefined {
  return talentProfileStore.getById(id);
}

export function getTalentProfilesByDepartment(department: string): HighPerformerProfile[] {
  return talentProfileStore.getByDepartment(department);
}
