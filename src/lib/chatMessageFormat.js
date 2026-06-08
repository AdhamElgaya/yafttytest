/** Shared shape for chat UI (client + server). */

export function toClientMessage(row) {
  return {
    _id: row.id,
    id: row.id,
    message: row.content,
    text: row.content,
    isFromSupport: row.sender === 'admin' || row.sender === 'bot',
    createdAt: row.created_at,
    timestamp: row.created_at,
    attachments: [],
  };
}
