import { Database } from './database.types';
import { CommunityMember, User } from './types';
import { isSupabaseConfigured, supabase } from './supabase';
import { mockCommunityMembers } from './mockData';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type CommunityRow = Database['public']['Tables']['community_members']['Row'];

function mapProfile(profile: ProfileRow): User {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url || undefined,
    role: profile.role,
    createdAt: profile.created_at,
  };
}

export async function fetchProfiles() {
  if (!isSupabaseConfigured) {
    return mockCommunityMembers
      .map((member) => member.user)
      .filter((user) => user.role !== 'admin');
  }

  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data
    .map(mapProfile)
    .filter((user) => user.role !== 'admin');
}

export async function fetchAdminProfiles() {
  if (!isSupabaseConfigured) {
    return mockCommunityMembers
      .map((member) => member.user)
      .filter((user) => user.role === 'admin');
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'admin').order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapProfile);
}

export async function fetchCommunityMembers() {
  if (!isSupabaseConfigured) {
    return mockCommunityMembers;
  }

  const [communityResult, profilesResult] = await Promise.all([
    supabase.from('community_members').select('*').order('joined_at', { ascending: false }),
    supabase.from('profiles').select('*'),
  ]);

  if (communityResult.error) {
    throw communityResult.error;
  }

  if (profilesResult.error) {
    throw profilesResult.error;
  }

  const profileMap = new Map(profilesResult.data.map((profile) => [profile.id, profile]));

  return communityResult.data
    .map((member): CommunityMember | null => {
      const profile = profileMap.get(member.user_id);

      if (!profile) {
        return null;
      }

      return {
        id: member.id,
        userId: member.user_id,
        user: mapProfile(profile),
        bio: member.bio || undefined,
        interests: member.interests,
        joinedAt: member.joined_at,
      };
    })
    .filter((member): member is CommunityMember => Boolean(member));
}