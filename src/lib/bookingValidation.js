/**
 * Validate booking dates against banner contract window.
 * @returns {string|null} Error message or null if valid
 */
export function validateBookingDates(banner, startDate, endDate, t) {
  if (!startDate) {
    return t?.('map.banner.validation.selectStartDate') || 'Please select a start date.';
  }
  if (!endDate) {
    return t?.('map.banner.validation.selectEndDate') || 'Please select an end date.';
  }

  const bookingStart = new Date(startDate);
  const bookingEnd = new Date(endDate);

  if (bookingEnd < bookingStart) {
    return t?.('map.banner.validation.endBeforeStart') || 'End date must be after start date.';
  }

  if (banner?.start_date) {
    const contractStart = new Date(banner.start_date);
    contractStart.setHours(0, 0, 0, 0);
    bookingStart.setHours(0, 0, 0, 0);
    if (bookingStart < contractStart) {
      return `Booking start must be on or after ${contractStart.toLocaleDateString()}.`;
    }
  }

  if (banner?.end_date) {
    const contractEnd = new Date(banner.end_date);
    contractEnd.setHours(23, 59, 59, 999);
    bookingEnd.setHours(23, 59, 59, 999);
    if (bookingEnd > contractEnd) {
      return `Booking end must be on or before ${new Date(banner.end_date).toLocaleDateString()}.`;
    }
  }

  return null;
}
