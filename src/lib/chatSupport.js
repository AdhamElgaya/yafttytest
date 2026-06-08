import { getSupabaseAdmin } from './supabaseAdmin';
import { toClientMessage } from './chatMessageFormat';

export { toClientMessage };

function requireAdmin() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      'Chat is not configured. Add SUPABASE_SERVICE_ROLE_KEY to website/.env and restart the dev server.'
    );
  }
  return supabase;
}

export function toClientChat(row) {
  return {
    _id: row.id,
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function resolveProfileIdForUser(authUserId, preferredProfileId) {
  const supabase = requireAdmin();

  if (preferredProfileId) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', preferredProfileId)
      .eq('auth_id', authUserId)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', authUserId)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) throw error;
  return profiles?.[0]?.id ?? null;
}

export async function getProfileIdsForAuthUser(authUserId) {
  const supabase = requireAdmin();
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', authUserId);

  if (error) throw error;
  return (data || []).map((p) => p.id);
}

/** One support thread per login — use the most recently updated chat across all profiles */
export async function findLatestChatForAuthUser(authUserId) {
  const profileIds = await getProfileIdsForAuthUser(authUserId);
  if (!profileIds.length) return null;

  const supabase = requireAdmin();
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .in('user_id', profileIds)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getOrCreateUserChat(profileId) {
  const supabase = requireAdmin();

  const { data: existing, error: findError } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', profileId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from('chats')
    .insert({ user_id: profileId, status: 'open' })
    .select('*')
    .single();

  if (createError) throw createError;
  return created;
}

export async function fetchUserConversation(authUserId, preferredProfileId) {
  const profileId = await resolveProfileIdForUser(authUserId, preferredProfileId);
  if (!profileId) {
    throw new Error('No profile found for this account. Complete signup or run Supabase migrations.');
  }

  let chat = await findLatestChatForAuthUser(authUserId);
  if (!chat) {
    chat = await getOrCreateUserChat(profileId);
  }

  const supabase = requireAdmin();

  const { data: rows, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_id', chat.id)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return {
    chat: toClientChat(chat),
    messages: (rows || []).map(toClientMessage),
  };
}

export async function sendUserMessage(authUserId, { message, chatId, profileId }) {
  const text = String(message || '').trim();
  if (!text) {
    throw new Error('Message is required');
  }

  const resolvedProfileId = await resolveProfileIdForUser(authUserId, profileId);
  if (!resolvedProfileId) {
    throw new Error('No profile found for this account');
  }

  const supabase = requireAdmin();
  const profileIds = await getProfileIdsForAuthUser(authUserId);
  let chat;

  if (chatId) {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .in('user_id', profileIds)
      .maybeSingle();
    if (error) throw error;
    chat =
      data ||
      (await findLatestChatForAuthUser(authUserId)) ||
      (await getOrCreateUserChat(resolvedProfileId));
  } else {
    chat = (await findLatestChatForAuthUser(authUserId)) || (await getOrCreateUserChat(resolvedProfileId));
  }

  const { data: inserted, error: insertError } = await supabase
    .from('chat_messages')
    .insert({
      chat_id: chat.id,
      sender: 'user',
      content: text,
    })
    .select('*')
    .single();

  if (insertError) throw insertError;

  await supabase
    .from('chats')
    .update({ updated_at: new Date().toISOString(), status: 'open' })
    .eq('id', chat.id);

  return {
    chat: toClientChat(chat),
    message: toClientMessage(inserted),
  };
}

function profileToChatUser(profile, guestEmail) {
  if (profile) {
    return {
      fullName: profile.full_name?.trim() || profile.email || 'User',
      email: profile.email || '—',
    };
  }
  return {
    fullName: guestEmail || 'Guest',
    email: guestEmail || '—',
  };
}

async function latestMessageByChatIds(chatIds) {
  if (!chatIds.length) return new Map();

  const supabase = requireAdmin();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('chat_id, content, sender, created_at')
    .in('chat_id', chatIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const map = new Map();
  for (const row of data || []) {
    if (!map.has(row.chat_id)) map.set(row.chat_id, row);
  }
  return map;
}

export function toAdminListChat(row, lastMsg) {
  const profile = row.user;
  return {
    _id: row.id,
    id: row.id,
    status: row.status,
    lastMessage: lastMsg?.created_at || row.updated_at,
    needsReply: lastMsg?.sender === 'user',
    user: profileToChatUser(profile, row.guest_email),
  };
}

export async function listAdminChats({ status = 'all' } = {}) {
  const supabase = requireAdmin();

  let query = supabase
    .from('chats')
    .select(
      'id, status, created_at, updated_at, guest_email, user_id, user:profiles!user_id(id, email, full_name)'
    )
    .order('updated_at', { ascending: false });

  if (status === 'open' || status === 'closed') {
    query = query.eq('status', status);
  }

  const { data: rows, error } = await query;
  if (error) throw error;

  const chatIds = (rows || []).map((r) => r.id);
  const lastByChat = await latestMessageByChatIds(chatIds);

  let chats = (rows || []).map((row) => toAdminListChat(row, lastByChat.get(row.id)));

  if (status === 'waiting') {
    chats = chats.filter((c) => c.needsReply && c.status === 'open');
  }

  return chats;
}

export async function fetchAdminChatMessages(chatId) {
  const supabase = requireAdmin();

  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select(
      'id, status, created_at, updated_at, guest_email, user_id, user:profiles!user_id(id, email, full_name)'
    )
    .eq('id', chatId)
    .maybeSingle();

  if (chatError) throw chatError;
  if (!chat) throw new Error('Chat not found');

  const { data: rows, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  const lastMsg = rows?.length ? rows[rows.length - 1] : null;

  return {
    chat: toAdminListChat(chat, lastMsg),
    messages: (rows || []).map(toClientMessage),
  };
}

export async function sendAdminReply(chatId, message) {
  const text = String(message || '').trim();
  if (!text) throw new Error('Message is required');

  const supabase = requireAdmin();

  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select('id')
    .eq('id', chatId)
    .maybeSingle();

  if (chatError) throw chatError;
  if (!chat) throw new Error('Chat not found');

  const { data: inserted, error: insertError } = await supabase
    .from('chat_messages')
    .insert({
      chat_id: chatId,
      sender: 'admin',
      content: text,
    })
    .select('*')
    .single();

  if (insertError) throw insertError;

  const now = new Date().toISOString();
  await supabase.from('chats').update({ updated_at: now, status: 'open' }).eq('id', chatId);

  return toClientMessage(inserted);
}

export async function updateAdminChatStatus(chatId, status) {
  const normalized = status === 'waiting' ? 'open' : status;
  if (!['open', 'closed'].includes(normalized)) {
    throw new Error('Status must be open or closed');
  }

  const supabase = requireAdmin();
  const { data, error } = await supabase
    .from('chats')
    .update({ status: normalized, updated_at: new Date().toISOString() })
    .eq('id', chatId)
    .select(
      'id, status, created_at, updated_at, guest_email, user_id, user:profiles!user_id(id, email, full_name)'
    )
    .single();

  if (error) throw error;
  if (!data) throw new Error('Chat not found');

  const lastByChat = await latestMessageByChatIds([chatId]);
  return toAdminListChat(data, lastByChat.get(chatId));
}

/** Deletes chat + all messages (cascade). Customer widget will show empty thread on next load. */
export async function deleteAdminChat(chatId) {
  const supabase = requireAdmin();

  const { data: existing, error: findError } = await supabase
    .from('chats')
    .select('id')
    .eq('id', chatId)
    .maybeSingle();

  if (findError) throw findError;
  if (!existing) throw new Error('Chat not found');

  const { error: deleteError } = await supabase.from('chats').delete().eq('id', chatId);
  if (deleteError) throw deleteError;

  return { deleted: true, chatId };
}
