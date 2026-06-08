'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useBookingCart } from '../contexts/BookingCartContext';
import { useAuth } from '../contexts/AuthContext';
import './BookingCartFab.css';

export default function BookingCartFab() {
  const { items, itemCount, hydrated } = useBookingCart();
  const { user } = useAuth();

  const isAdvertiser =
    user &&
    (user.accountType === 'advertiser' || user.accountType === 'advertiser');

  if (!hydrated || !isAdvertiser || itemCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="booking-cart-fab"
      aria-label={`Booking cart, ${itemCount} items`}
    >
      <ShoppingCart size={22} />
      <span className="booking-cart-fab-badge">{itemCount > 9 ? '9+' : itemCount}</span>
    </Link>
  );
}
