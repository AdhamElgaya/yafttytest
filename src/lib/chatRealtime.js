import { supabase, isSupabaseConfigured } from './supabase';
import { toClientMessage } from './chatMessageFormat';

/**
 * Subscribe to new messages for a chat (no polling).
 * Returns cleanup function. Calls onStatus when subscription state changes.
 */
export function subscribeToChatMessages(chatId, { onInsert, onStatus } = {}) {
  if (!chatId || !isSupabaseConfigured()) {
    onStatus?.('UNSUPPORTED');
    return () => {};
  }

  const channel = supabase
    .channel(`chat-messages-${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        if (payload?.new) onInsert?.(toClientMessage(payload.new));
      }
    )
    .subscribe((status) => {
      onStatus?.(status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
