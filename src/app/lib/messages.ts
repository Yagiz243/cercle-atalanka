import { Database } from './database.types';
import { Message, User } from './types';
import { isSupabaseConfigured, supabase } from './supabase';

type MessageRow = Database['public']['Tables']['messages']['Row'];

const DEFAULT_USER_AVATAR = 'https://ui-avatars.com/api/?name=User&size=32&background=6b7280&color=fff';
const DEFAULT_ADMIN_AVATAR = 'https://ui-avatars.com/api/?name=Admin&size=32&background=7c3aed&color=fff';

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase n\'est pas configuré. Renseignez les variables d\'environnement.');
  }
}

function mapMessageRow(row: MessageRow): Message {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.sender_name || 'Inconnu',
    userAvatar: row.sender_avatar || DEFAULT_USER_AVATAR,
    message: row.message,
    isAdminReply: row.is_admin_reply,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function getCurrentUserConversation(currentUser: User) {
  assertConfigured();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map(mapMessageRow);
}

export async function sendUserMessage(currentUser: User, content: string) {
  assertConfigured();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      user_id: currentUser.id,
      message: content,
      is_admin_reply: false,
      read: false,
      sender_name: currentUser.fullName || 'Utilisateur',
      sender_avatar: currentUser.avatarUrl || DEFAULT_USER_AVATAR,
    })
    .select()
    .single();

  if (error) throw error;

  return mapMessageRow(data);
}

export async function getAdminConversations() {
  assertConfigured();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map(mapMessageRow);
}

export async function markConversationAsRead(userId: string) {
  assertConfigured();

  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('is_admin_reply', false)
    .eq('read', false);

  if (error) throw error;
}

export async function sendAdminReply(userId: string, content: string) {
  assertConfigured();

  // Récupérer l'utilisateur connecté (admin)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Impossible de récupérer l\'utilisateur connecté.');
  }

  // Récupérer son profil
  const { data: adminProfile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  // Fallback en cas d'absence de profil ou d'erreur
  const adminName = adminProfile?.full_name || 'Administrateur';
  const adminAvatar = adminProfile?.avatar_url || DEFAULT_ADMIN_AVATAR;

  const { data, error } = await supabase
    .from('messages')
    .insert({
      user_id: userId,
      message: content,
      is_admin_reply: true,
      read: false,
      sender_name: adminName,
      sender_avatar: adminAvatar,
    })
    .select()
    .single();

  if (error) throw error;

  return mapMessageRow(data);
}

export async function deleteConversation(userId: string) {
  assertConfigured();

  // ⚠️ Supprime tous les messages d'un utilisateur – à utiliser avec précaution
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}