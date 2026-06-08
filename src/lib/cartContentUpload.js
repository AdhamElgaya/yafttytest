import { bookingAuthHeaders } from './bookingClient';

/** Upload cart content to R2 only when submitting a booking request. */
export async function uploadBookingContentFile(file) {
  if (!file) return [];
  const formData = new FormData();
  formData.append('content', file);
  const headers = await bookingAuthHeaders();
  const res = await fetch('/api/booking/upload-content', {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to upload content');
  }
  return data.contentUrls || [];
}
