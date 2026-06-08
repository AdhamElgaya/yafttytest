'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatEgpAmount } from '../lib/money';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle, 
  Shield, 
  Clock, 
  AlertCircle, 
  X, 
  Copy, 
  Smartphone, 
  Building2,
  Upload,
  Check,
  Loader2,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const Payment = () => {
  const { bookingId } = useParams();
  const { currentLanguage } = useLanguage();
  const router = useRouter();
  
  // State management
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('instapay');
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copied, setCopied] = useState({ instapay: false, bank: false });
  const [isFirstPayment, setIsFirstPayment] = useState(false);

  useEffect(() => {
    console.log('Payment component mounted, bookingId:', bookingId);
    // Simulate loading for testing
    setTimeout(() => {
      setLoading(false);
      setBooking({
        banner: {
          location: 'Test Location',
          owner: { fullName: 'Test Owner' }
        },
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'approved'
      });
      setPayment({
        campaignAmount: 20000,
        platformFee: 0,
        totalAmount: 20000
      });
      setIsFirstPayment(true);
    }, 1000);
  }, [bookingId]);

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [key]: true }));
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile) {
      toast.error('Please select a receipt file');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploadSuccess(true);
      setUploading(false);
      toast.success('Receipt uploaded successfully!');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#123a8f] via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#123a8f] border-t-[#123a8f] mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <motion.p 
            className="text-gray-600 text-lg font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading payment details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-red-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || 'Booking not found'}</p>
            <motion.button
              onClick={() => router.push('/advertiser-dashboard')}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#123a8f] via-white to-purple-50">
      {/* Header */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.button
              onClick={() => router.push('/advertiser-dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-300 group"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} className="mr-2 group-hover:text-[#123a8f]" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-[#123a8f] to-purple-600 bg-clip-text text-transparent"
              style={{ color: '#1F2937' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Complete Payment
            </motion.h1>
            <div className="w-32"></div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Booking Summary */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 sticky top-28 overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#123a8f] via-[#123a8f] to-purple-700 p-8 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="relative">
                  <motion.div 
                    className="flex items-center gap-4 mb-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle size={28} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Booking Confirmed</h2>
                  </motion.div>
                  <motion.p 
                    className="text-[#123a8f] text-sm"
                    style={{ color: '#123a8f' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Your campaign is ready to go live
                  </motion.p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Sparkles size={24} />
                </div>
                <div className="absolute bottom-4 left-4 opacity-20">
                  <Star size={20} />
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-8 space-y-6">
                <motion.div 
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-[#123a8f] rounded-xl border border-gray-100"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(18, 58, 143, 0.05)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-[#123a8f] rounded-lg">
                    <MapPin className="text-[#123a8f]" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium" style={{ color: '#6B7280' }}>Location</p>
                    <p className="font-bold text-gray-900" style={{ color: '#111827' }}>{booking.banner?.location || 'N/A'}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-100"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium" style={{ color: '#6B7280' }}>Duration</p>
                    <p className="font-bold text-gray-900" style={{ color: '#111827' }}>
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-100"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="text-green-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium" style={{ color: '#6B7280' }}>Owner</p>
                    <p className="font-bold text-gray-900" style={{ color: '#111827' }}>{booking.banner?.owner?.fullName || 'N/A'}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium" style={{ color: '#6B7280' }}>Status</p>
                    <p className="font-bold text-green-600 capitalize" style={{ color: '#059669' }}>{booking.status}</p>
                  </div>
                </motion.div>
              </div>

              {/* Cost Breakdown */}
              <div className="p-8 bg-gradient-to-br from-gray-50 to-[#123a8f] border-t border-gray-200">
                <motion.h3 
                  className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-lg"
                  style={{ color: '#111827' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="p-2 bg-[#123a8f] rounded-lg">
                    <DollarSign size={20} className="text-[#123a8f]" />
                  </div>
                  Cost Breakdown
                </motion.h3>
                <div className="space-y-4">
                  <motion.div 
                    className="flex justify-between items-center p-3 bg-white/70 rounded-xl border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="text-gray-600 font-medium" style={{ color: '#6B7280' }}>Campaign Cost</span>
                    <span className="font-bold text-gray-900 text-lg" style={{ color: '#111827' }}>EGP {formatEgpAmount(payment?.campaignAmount ?? 0, currentLanguage)}</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between items-center p-3 bg-white/70 rounded-xl border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium" style={{ color: '#6B7280' }}>Platform Fee</span>
                      {isFirstPayment && (
                        <motion.span 
                          className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs rounded-full font-bold border border-green-200"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                        >
                          FREE
                        </motion.span>
                      )}
                    </div>
                    <span className={`font-bold text-lg ${isFirstPayment ? 'text-green-600' : 'text-gray-900'}`} style={{ color: isFirstPayment ? '#059669' : '#111827' }}>
                      EGP {formatEgpAmount(payment?.platformFee ?? 0, currentLanguage)}
                    </span>
                  </motion.div>
                  <motion.div 
                    className="border-t-2 border-gray-200 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#123a8f] to-purple-50 rounded-xl border border-[#123a8f]">
                      <span className="text-xl font-bold text-gray-900" style={{ color: '#111827' }}>Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#123a8f] to-purple-600 bg-clip-text text-transparent" style={{ color: '#123a8f' }}>
                        EGP {formatEgpAmount(payment?.totalAmount ?? 0, currentLanguage)}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Payment Process */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            
            {/* First Time User Banner */}
            {isFirstPayment && (
              <motion.div 
                className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center border-2 border-green-200"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="text-green-600" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-green-900 text-lg" style={{ color: '#065F46' }}>Welcome to Yaftty! 🎉</h3>
                    <p className="text-green-700" style={{ color: '#047857' }}>No platform fees during Yaftty’s launch period!</p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="ml-auto"
                  >
                    <Sparkles className="text-green-500" size={24} />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Payment Methods */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-[#123a8f]">
                <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ color: '#111827' }}>Choose Payment Method</h2>
                <p className="text-gray-600" style={{ color: '#6B7280' }}>Select your preferred payment option below</p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Instapay Option */}
                  <motion.div
                    onClick={() => setSelectedMethod('instapay')}
                    className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${
                      selectedMethod === 'instapay'
                        ? 'border-[#123a8f] bg-gradient-to-br from-[#123a8f] to-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-[#123a8f] hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    {selectedMethod === 'instapay' && (
                      <motion.div 
                        className="absolute top-4 right-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="text-[#123a8f]" size={24} />
                      </motion.div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Smartphone className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg" style={{ color: '#111827' }}>Instapay</h3>
                        <p className="text-gray-600" style={{ color: '#6B7280' }}>Phone Payment</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-[#123a8f] rounded-xl p-4 border border-gray-100">
                      <p className="text-sm text-gray-600 mb-2 font-medium" style={{ color: '#6B7280' }}>Phone Number</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-900 text-lg" style={{ color: '#111827' }}>+201222524672</span>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard('+201222524672', 'instapay');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#123a8f] to-purple-600 text-white rounded-lg text-sm font-medium hover:from-[#123a8f] hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {copied.instapay ? <Check size={16} /> : <Copy size={16} />}
                          {copied.instapay ? 'Copied' : 'Copy'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bank Transfer Option */}
                  <motion.div
                    onClick={() => setSelectedMethod('bank')}
                    className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${
                      selectedMethod === 'bank'
                        ? 'border-[#123a8f] bg-gradient-to-br from-[#123a8f] to-indigo-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-[#123a8f] hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    {selectedMethod === 'bank' && (
                      <motion.div 
                        className="absolute top-4 right-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="text-[#123a8f]" size={24} />
                      </motion.div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#123a8f] via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Building2 className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg" style={{ color: '#111827' }}>Bank Transfer</h3>
                        <p className="text-gray-600" style={{ color: '#6B7280' }}>Account Transfer</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-sm text-gray-600 mb-2 font-medium" style={{ color: '#6B7280' }}>Account Number</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-900 text-lg" style={{ color: '#111827' }}>0890001080892</span>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard('0890001080892', 'bank');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#123a8f] to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-[#123a8f] hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {copied.bank ? <Check size={16} /> : <Copy size={16} />}
                          {copied.bank ? 'Copied' : 'Copy'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Payment Instructions */}
                <motion.div 
                  className="bg-gradient-to-r from-[#123a8f] via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-[#123a8f] shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <h4 className="font-bold text-[#123a8f] mb-4 flex items-center gap-3 text-lg" style={{ color: '#123a8f' }}>
                    <div className="p-2 bg-[#123a8f] rounded-lg">
                      <Shield size={20} className="text-[#123a8f]" />
                    </div>
                    Payment Instructions
                  </h4>
                  <div className="text-sm text-[#123a8f] space-y-3" style={{ color: '#123a8f' }}>
                    <motion.div 
                      className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-[#123a8f]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      <div className="w-6 h-6 bg-[#123a8f] text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <p>Use the {selectedMethod === 'instapay' ? 'phone number' : 'account number'} above</p>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-[#123a8f]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 }}
                    >
                      <div className="w-6 h-6 bg-[#123a8f] text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <p>Transfer the exact amount: <span className="font-bold text-lg">EGP {formatEgpAmount(payment?.totalAmount ?? 0, currentLanguage)}</span></p>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-[#123a8f]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                    >
                      <div className="w-6 h-6 bg-[#123a8f] text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <p>Upload your payment receipt below</p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Receipt Upload */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-green-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ color: '#111827' }}>Upload Payment Receipt</h2>
                <p className="text-gray-600" style={{ color: '#6B7280' }}>Take a screenshot or photo of your payment confirmation</p>
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {!uploadSuccess ? (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-[#123a8f] transition-all duration-300 bg-gradient-to-br from-gray-50 to-[#123a8f]"
                        whileHover={{ scale: 1.02 }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.7 }}
                      >
                        <input 
                          type="file" 
                          accept="image/*,application/pdf" 
                          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="receipt-upload"
                          disabled={uploading}
                        />
                        <label 
                          htmlFor="receipt-upload" 
                          className="cursor-pointer block"
                        >
                          <motion.div 
                            className="text-gray-400 mb-6"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Upload size={64} className="mx-auto" />
                          </motion.div>
                          <p className="text-gray-600 font-medium mb-2 text-lg" style={{ color: '#6B7280' }}>
                            {receiptFile ? receiptFile.name : 'Click to select file or drag and drop'}
                          </p>
                          <p className="text-gray-400" style={{ color: '#9CA3AF' }}>PNG, JPG, PDF up to 10MB</p>
                        </label>
                      </motion.div>
                      
                      {receiptFile && (
                        <motion.div 
                          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="text-green-600" size={24} />
                              </div>
                              <div>
                                <p className="font-bold text-green-900 text-lg" style={{ color: '#065F46' }}>File Selected</p>
                                <p className="text-green-700" style={{ color: '#047857' }}>{receiptFile.name}</p>
                              </div>
                            </div>
                            <motion.button 
                              onClick={() => setReceiptFile(null)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={24} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                      
                      <motion.button 
                        onClick={handleUploadReceipt} 
                        disabled={!receiptFile || uploading}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                          !receiptFile || uploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                        }`}
                        whileHover={!receiptFile || uploading ? {} : { scale: 1.02 }}
                        whileTap={!receiptFile || uploading ? {} : { scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 }}
                      >
                        {uploading ? (
                          <div className="flex items-center justify-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Uploading...
                          </div>
                        ) : (
                          'Submit Receipt'
                        )}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-200"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="text-green-600" size={40} />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-900 mb-3" style={{ color: '#065F46' }}>Receipt Submitted Successfully!</h3>
                      <p className="text-green-700 mb-6 text-lg" style={{ color: '#047857' }}>Your payment receipt has been uploaded and is being reviewed.</p>
                      <motion.div 
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-left shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="font-bold text-green-900 mb-4 text-lg" style={{ color: '#065F46' }}>What happens next?</p>
                        <ul className="text-green-700 space-y-3" style={{ color: '#047857' }}>
                          <motion.li 
                            className="flex items-center gap-3 p-3 bg-white/70 rounded-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Clock size={18} className="text-green-600" />
                            We'll verify your payment within 24 hours
                          </motion.li>
                          <motion.li 
                            className="flex items-center gap-3 p-3 bg-white/70 rounded-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <CheckCircle size={18} className="text-green-600" />
                            You'll receive an email confirmation
                          </motion.li>
                          <motion.li 
                            className="flex items-center gap-3 p-3 bg-white/70 rounded-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Shield size={18} className="text-green-600" />
                            Your campaign will be activated
                          </motion.li>
                        </ul>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex items-center justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
              <motion.button 
                onClick={() => router.push('/advertiser-dashboard')} 
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 px-8 rounded-2xl font-bold text-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </motion.button>
              <motion.button
                onClick={() => window.open('https://wa.me/201222524672', '_blank')}
                className="px-8 py-4 rounded-2xl font-bold text-lg text-[#123a8f] bg-gradient-to-r from-[#123a8f] to-indigo-100 hover:from-[#123a8f] hover:to-indigo-200 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HelpCircle size={20} />
                Need Help?
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => window.open('https://wa.me/201222524672', '_blank')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#123a8f] to-purple-600 hover:from-[#123a8f] hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V9h2v4zm4 4h-2v-2h2v2zm0-4h-2V9h2v4z"/>
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default Payment;