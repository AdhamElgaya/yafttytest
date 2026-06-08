export const en = {
  // Navigation
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    help: 'Help',
    map: 'Map',
    login: 'Sign In',
    signup: 'Sign Up',
    profile: 'Profile',
    dashboard: 'Dashboard',
    logout: 'Logout',
    openMenu: 'Open menu',
    closeMenu: 'Close menu'
  },

  // Common
  common: {
    loading: 'Loading',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    view: 'View',
    add: 'Add',
    remove: 'Remove',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information'
  },

  // Messages
  messages: {
    // Success messages
    loginSuccessful: 'Login successful!',
    accountCreatedSuccessfully: 'Account created successfully!',
    loggedOutSuccessfully: 'Logged out successfully',
    switchedToAccount: 'Switched to {accountType} account',
    profileUpdatedSuccessfully: 'Profile updated successfully!',
    verificationSuccessful: 'Verification successful!',
    passwordResetEmailSent: 'Password reset email sent!',
    loggedInWithGoogle: 'Logged in with Google!',
    bannerAddedSuccessfully: 'Banner added successfully!',
    bannerUpdatedSuccessfully: 'Banner updated successfully!',
    bannerDeletedSuccessfully: 'Banner deleted successfully!',
    bookingRequestSentSuccessfully: 'Booking request sent successfully!',
    requestApprovedSuccessfully: 'Request approved successfully!',
    requestRejectedSuccessfully: 'Request rejected successfully!',
    bookingRequestDeletedSuccessfully: 'Booking request deleted successfully!',
    bookingRequestRemovedSuccessfully: 'Booking request removed successfully!',
    verificationCodeSent: 'Verification code sent to your email',
    passwordResetSuccessfully: 'Password reset successfully!',
    codeSentToEmail: 'A new code has been sent to your email.',
    bankAccountUpdated: 'Bank account updated',
    codeSentToEmail2: 'Code sent to your email',
    passwordChangedSuccessfully: 'Password changed successfully!',
    twoFactorCodeSent: '2FA code sent to your email',
    twoFactorEnabled: 'Two-factor authentication enabled!',
    twoFactorDisabled: 'Two-factor authentication disabled!',
    receiptUploadedSuccessfully: 'Receipt uploaded successfully!',
    
    // Error messages
    loginFailedMissingData: 'Login failed: missing user data.',
    loginFailedCheckCredentials: 'Login failed. Please check your credentials.',
    cannotConnectToServer: 'Cannot connect to server. Please make sure the backend is running.',
    signupFailedTryAgain: 'Signup failed. Please try again.',
    notLoggedInPleaseLogin: 'You are not logged in. Please log in again.',
    failedToSwitchAccount: 'Failed to switch account type',
    profileUpdateFailed: 'Profile update failed. Please try again.',
    verificationFailedCheckCode: 'Verification failed. Please check your code.',
    passwordResetFailed: 'Password reset failed. Please try again.',
    googleSignInFailed: 'Google sign-in failed.',
    failedToLoadBanners: 'Failed to load banners',
    failedToAddBanner: 'Failed to add banner',
    failedToUpdateBanner: 'Failed to update banner',
    failedToDeleteBanner: 'Failed to delete banner',
    failedToBookBanner: 'Failed to book banner',
    failedToDeleteBookingRequest: 'Failed to delete booking request. Please try again.',
    failedToCancelBookingRequest: 'Failed to cancel booking request. Please try again.',
    failedToRespondToBookingRequest: 'Failed to respond to booking request: {message}',
    errorRespondingToBookingRequest: 'Error responding to booking request. Please try again.',
    errorDeletingBanner: 'Error deleting banner. Please try again.',
    failedToUpdateBankAccount: 'Failed to update bank account',
    failedToSwitchOrCreateAccount: 'Failed to switch or create account',
    enterCurrentPassword: 'Enter your current password',
    failedToSendCode: 'Failed to send code',
    fillInAllFields: 'Fill in all fields',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordMustBe8Characters: 'Password must be at least 8 characters',
    failedToChangePassword: 'Failed to change password',
    failedToEnable2FA: 'Failed to enable 2FA',
    failedToDisable2FA: 'Failed to disable 2FA',
    enterTheCode: 'Enter the code',
    mustTypeToConfirm: 'You must type "deletemyaccount" to confirm.',
    selectAccountTypesToDelete: 'Please select which account type(s) to delete.',
    authenticationRequired: 'Authentication required. Please log in again.',
    failedToDeleteAccount: 'Failed to delete account.',
    pleaseEnterEmail: 'Please enter your email address',
    failedToSendVerificationCode: 'Failed to send verification code',
    pleaseEnterVerificationCode: 'Please enter the verification code',
    pleaseEnter6DigitCode: 'Please enter a 6-digit verification code',
    pleaseEnterOtpCode: 'Please enter the {length}-digit verification code',
    invalidCode: 'Invalid code',
    missingEmailOrAccountType: 'Missing email or account type.',
    pleaseFillAllFields: 'Please fill in all fields',
    passwordMustBe8CharactersLong: 'Password must be at least 8 characters long',
    failedToResetPassword: 'Failed to reset password',
    pleaseSelectReceiptFile: 'Please select a receipt file first.',
    failedToUploadReceipt: 'Failed to upload receipt. Please try again.',
    networkErrorTryAgain: 'Network error. Please try again.',
    pleaseProvideRejectionReason: 'Please provide a reason for rejection',
             googleSignInNotConfigured: 'Google sign-in is not configured. Please set REACT_APP_GOOGLE_CLIENT_ID.',

         // Confirmation messages
         areYouSureDeleteBooking: 'Are you sure you want to delete this booking request?',
         bookingRequestApproved: 'Booking request approved successfully!',
         bookingRequestRejected: 'Booking request rejected successfully!',

         // Admin messages
         requestApprovedSuccessfully: 'Request approved successfully!',
         requestRejectedSuccessfully: 'Request rejected successfully!',
         errorApprovingRequest: 'Error approving request',
         errorRejectingRequest: 'Error rejecting request'
  },

  // Home page
  home: {
    hero: {
      badge: 'Fast. Easy. Secure.',
      title: 'Outdoor Advertising Platform',
      subtitle: 'Discover, book, and manage outdoor advertising spaces with ease',
      cta: 'Get Started',
      learnMore: 'Learn More',
      scrollHint: 'Scroll to learn more about Yaftty',
      scrollLabel: 'Scroll'
    },
    features: {
      title: 'Why Choose Yaftty?',
      discover: {
        title: 'Discover Spaces',
        description: 'Find the perfect advertising location for your brand'
      },
      book: {
        title: 'Easy Booking',
        description: 'Book advertising spaces with just a few clicks'
      },
      manage: {
        title: 'Manage Campaigns',
        description: 'Track and manage your advertising campaigns effectively'
      }
    },
    content: {
      advertisers: {
        title: 'For Advertisers',
        description: 'Find the perfect location for your campaign, see availability, and book your preferred banner. Track your bookings and performance in one place.'
      },
      owners: {
        title: 'For Banner Owners',
        description: 'List your banners, manage bookings, and get paid. Reach more advertisers and maximize your revenue with Yaftty.'
      }
    },
    steps: {
      title: 'Steps to Get Started',
      advertisers: {
        title: 'For Advertisers',
        steps: [
          'Register as an advertiser.',
          'Browse the interactive map to find available banners.',
          'Book your preferred banner and upload your ad content.',
          'Track your bookings and campaign performance.'
        ]
      },
      owners: {
        title: 'For Banner Owners',
        steps: [
          'Register as a banner owner.',
          'Add banner documents and Bank Account ID to get paid.',
          'List your banner with location, size, and price.',
          'Manage bookings and approve advertiser requests.',
          'Get paid quickly and grow your business.'
        ]
      }
    }
  },

  // About page
  about: {
    title: 'About Yaftty',
    subtitle: 'Revolutionizing Outdoor Advertising',
    description: 'Yaftty is a comprehensive platform that connects advertisers with outdoor advertising spaces, making it easier than ever to reach your target audience.',
    badge: 'About Us',
    hero: {
      title1: 'Connecting',
      title2: 'Advertisers',
      title3: 'Banner Owners',
      description: 'Yaftty is revolutionizing outdoor advertising in Egypt by creating a seamless platform that bridges the gap between advertisers and banner owners through innovative technology and user-friendly solutions.'
    },
    mission: {
      title: 'Our Mission',
      description: 'To revolutionize outdoor advertising by creating a seamless platform that connects advertisers with banner owners, making outdoor advertising accessible, efficient, and profitable for everyone involved.'
    },
    vision: {
      title: 'Our Vision',
      description: 'To become the leading platform for outdoor advertising in the region, fostering innovation and growth in the industry.'
    },
    features: {
      smartLocation: 'Smart Location',
      instantBooking: 'Near Instant Booking',
      securePayments: 'Secure Payments'
    },
    values: {
      title: 'Our Values',
      coreValues: 'Our Core Values',
      description: 'These principles guide everything we do at Yaftty',
      innovation: {
        title: 'Innovation',
        description: 'Continuously improving our platform with cutting-edge technology and user-friendly solutions that make outdoor advertising smarter and more accessible.',
        highlight: 'Cutting-edge Technology'
      },
      transparency: {
        title: 'Transparency',
        description: 'Building trust through clear communication, honest pricing, and transparent processes that ensure everyone knows exactly what they\'re getting.',
        highlight: 'Trust & Security'
      },
      community: {
        title: 'Community',
        description: 'Fostering a strong community of advertisers and banner owners who grow together, supporting each other\'s success in the outdoor advertising industry.',
        highlight: 'Growing Together'
      }
    },
    cta: {
      readyToGetStarted: 'Ready to Get Started?',
      joinThousands: 'Join Thousands of Successful Advertisers',
      description: 'Join thousands of advertisers and banner owners who trust Yaftty for their outdoor advertising needs. Start your journey today and experience the future of outdoor advertising.',
      getStarted: 'Get Started',
      exploreServices: 'Explore Services'
    }
  },

  // Services page
  services: {
    title: 'Our Services',
    subtitle: 'Comprehensive Advertising Solutions',
    badge: 'Our Services',
    hero: {
      title1: 'Comprehensive',
      title2: 'Advertising Solutions',
      description: 'Discover powerful tools and features designed to connect advertisers with banner owners, creating a seamless outdoor advertising experience.'
    },
    advertisers: {
      badge: 'For Advertisers',
      title: 'Powerful Tools for Your Campaigns',
      description: 'Everything you need to find, book, and manage your outdoor advertising campaigns.'
    },
    owners: {
      badge: 'For Banner Owners',
      title: 'Maximize Your Revenue',
      description: 'Turn your banners into profitable assets with our comprehensive management tools.'
    },
    advertiserServices: {
      mapBrowsing: {
        title: 'Interactive Map Browsing',
        description: 'Explore available banners on our interactive map with real-time availability and pricing.',
        highlight: 'Real-time Data'
      },
      instantBooking: {
        title: 'Instant Booking',
        description: 'Book your preferred banner instantly with secure payment processing and instant confirmation.',
        highlight: 'Quick & Easy'
      },
      campaignManagement: {
        title: 'Campaign Management',
        description: 'Track your bookings, manage campaigns, and monitor performance all in one place.',
        highlight: 'Full Control'
      },
      support: {
        title: 'Continuous Support',
        description: 'Get help whenever you need it with our round-the-clock customer support team.',
        highlight: 'Always Available'
      }
    },
    ownerServices: {
      bannerManagement: {
        title: 'Banner Management',
        description: 'List and manage your banners with detailed location, size, and pricing information.',
        highlight: 'Easy Management'
      },
      revenueOptimization: {
        title: 'Revenue Optimization',
        description: 'Maximize your earnings with smart pricing and automated booking management.',
        highlight: 'Higher Profits'
      },
      analyticsDashboard: {
        title: 'Analytics Dashboard',
        description: 'Track performance, view analytics, and optimize your banner placement strategy.',
        highlight: 'Data Insights'
      },
      quickPayments: {
        title: 'Quick Payments',
        description: 'Receive payments quickly and securely with our automated payment processing system.',
        highlight: 'Fast Payments'
      }
    },
    bannerAdvertising: {
      title: 'Banner Advertising',
      description: 'High-impact outdoor banners for maximum visibility'
    },
    digitalDisplays: {
      title: 'Digital Displays',
      description: 'Dynamic digital advertising solutions'
    },
    billboards: {
      title: 'Billboards',
      description: 'Large-scale advertising for maximum reach'
    },
    cta: {
      readyToGetStarted: 'Ready to Get Started?',
      joinThousands: 'Join Thousands of Successful Users',
      description: 'Start your journey with Yaftty and experience the future of outdoor advertising. Whether you\'re an advertiser or banner owner, we have the tools you need to succeed.',
      exploreMap: 'Explore Map',
      getStarted: 'Get Started'
    }
  },

  // Help page
  help: {
    title: 'Help Center',
    subtitle: 'Get the support you need',
    badge: 'Help Center',
    hero: {
      title1: 'How can we',
      title2: 'help you?',
      description: 'Find answers to common questions, get support, and learn how to make the most of Yaftty.'
    },
    search: {
      placeholder: 'Search for help articles, FAQs, and guides...',
      results: {
        title: 'Search Results',
        for: 'Results for',
        noResults: 'No results found. Try a different keyword.'
      }
    },
    categories: {
      title: 'Browse by Category',
      subtitle: 'Find answers organized by topic',
      general: 'General',
      account: 'Account',
      booking: 'Booking',
      payment: 'Payment',
      technical: 'Technical',
      faqs: 'FAQs'
    },
    aiAssistant: {
      button: 'Ask AI Assistant',
      description: 'Get instant answers from our AI assistant'
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Quick answers to common questions',
      general: {
        whatIsYaftty: {
          question: 'What is Yaftty?',
          answer: 'Yaftty is an online platform that connects advertisers with banner owners through an interactive map. We make outdoor advertising accessible, efficient, and profitable for everyone involved.'
        },
        howDoesItWork: {
          question: 'How does Yaftty work?',
          answer: 'Advertisers browse available banners on our interactive map, book their preferred locations, and manage their campaigns. Banner owners list their banners, manage bookings, and receive payments automatically.'
        },
        availability: {
          question: 'Is Yaftty available in my city?',
          answer: 'Yaftty is currently available in major cities across Egypt. We\'re continuously expanding our coverage. Check our map to see available banners in your area.'
        },
        costs: {
          question: 'What are the costs involved?',
          answer: 'There are no hidden fees. Advertisers pay only for banner bookings and a platform fee, and banner owners receive the full amount. All pricing is transparent and displayed upfront.'
        }
      },
      account: {
        createAccount: {
          question: 'How do I create an account?',
          answer: 'Click \'Sign Up\' or \'Get Started\' on our homepage and choose whether you\'re an advertiser or banner owner. Fill in your details, verify your email/phone, and you\'re ready to start!'
        },
        bothAccountTypes: {
          question: 'Can I have both account types?',
          answer: 'Yes! You can have both advertiser and banner owner accounts under the same email. Simply switch between account types in your dashboard settings.'
        },
        addBanner: {
          question: 'How Can I Add My Banner? (Banner Owners)',
          answer: 'To add your banner, you need to go to the map page and click on the plus icon on the left bottom corner(if you don\'t see it , make sure you are logged in as a banner owner). Then you can add your banner details and upload your banner image and documents (proof of purchase and advertising permit). then our team will review your banner and approve/reject it.'
        },
        forgotPassword: {
          question: 'What if I forget my password?',
          answer: 'Click \'Forgot Password\' on the login page. Enter your email, and we\'ll send you a secure link to reset your password.'
        }
      },
      booking: {
        howToBook: {
          question: 'How do I book a banner?',
          answer: 'Browse our interactive map, find an available banner, click on it to see details, and use the \'Check Avilability\' button. Upload your ad content and wait for banner owner to approve your booking. and then you can pay for the booking.'
        },
        cancelBooking: {
          question: 'Can I cancel a booking?',
          answer: 'Yes, you can cancel bookings if the banner owner didn\'t review it yet. If the banner owner accepted it, you can\'t cancel the booking.'
        },
        approvalTime: {
          question: 'How long does booking approval take?',
          answer: 'booking really depends on the banner owner. Some banner owners are very fast and approve bookings instantly, while others may take a few hours or even days.'
        },
        adFormats: {
          question: 'What ad formats are supported?',
          answer: 'We support JPG and PNG (Image) and MP4 (Video) formats. Recommended dimensions are provided for each banner. Our system will automatically resize your content to fit.'
        }
      },
      payment: {
        paymentMethods: {
          question: 'What payment methods are accepted?',
          answer: 'We accept credit cards, debit cards, and bank transfers. All payments are processed securely through our trusted payment partners.'
        },
        whenPaid: {
          question: 'When do banner owners get paid?',
          answer: 'Banner owners receive payments within 3-5 business days after the campaign ends. Payments are processed automatically to your registered bank account.'
        },
        hiddenFees: {
          question: 'Are there any hidden fees?',
          answer: 'No hidden fees! All costs are clearly displayed before booking. Advertisers see the total price, and banner owners see exactly what they\'ll receive.'
        },
        security: {
          question: 'Is my payment information secure?',
          answer: 'Absolutely! We use industry-standard encryption and never store your full payment details. All transactions are processed through secure, certified payment gateways.'
        }
      },
      technical: {
        mapNotLoading: {
          question: 'The map isn\'t loading properly',
          answer: 'Try refreshing the page or clearing your browser cache. Ensure you have a stable internet connection. If the issue persists, contact our support team.'
        },
        cantUpload: {
          question: 'I can\'t upload my ad content',
          answer: 'Check that your file is in JPG, PNG (Image), or MP4 (video) format and under 20MB. Ensure the dimensions match the banner requirements. Try a different browser if needed.'
        },
        bookingStuck: {
          question: 'The booking process is stuck',
          answer: 'This usually happens due to a slow internet connection or server issues. Try refreshing the page and starting over. If the problem continues, contact support with your booking ID.'
        },
        noEmails: {
          question: 'I\'m not receiving verification emails',
          answer: 'Check your spam folder first. If you still don\'t receive emails, try using a different email address or contact our support team for assistance.'
        }
      }
    },
    contact: {
      title: 'Contact Us',
      stillNeedHelp: 'Still Need Help?',
      getInTouch: 'Get in Touch',
      description: 'Our support team is here to help you succeed',
      phone: {
        title: 'Phone Support',
        description: 'Call us anytime'
      },
      email: {
        title: 'Email Support',
        description: 'Get detailed responses'
      },
      liveChat: {
        title: 'Live Chat',
        description: 'Instant help available',
        action: 'Start Chat'
      }
    }
  },

  // Map page
  map: {
    title: 'Advertising Map',
    subtitle: 'Find the perfect location for your campaign',
    filters: {
      title: 'Filters',
      location: 'Location',
      price: 'Price Range',
      type: 'Type',
      availability: 'Availability',
      city: 'City',
      allCities: 'All cities',
      sizeCategory: 'Size',
      clearAll: 'Clear all',
      showingCount: 'Showing {count} banners',
      types: {
        rgb: 'RGB',
        paper: 'Paper',
      },
      sizeCategories: {
        horizontalSmall: 'Horizontal small',
        verticalSmall: 'Vertical small',
        squareSmall: 'Square small',
        horizontalLarge: 'Horizontal large',
        verticalLarge: 'Vertical large',
        horizontalSmallHint: 'Small horizontal: 3:1 (e.g. 1200×400)',
        verticalSmallHint: 'Small vertical: 1:3 (e.g. 400×1200)',
        squareSmallHint: 'Small square: 1:1 (e.g. 800×800)',
        horizontalLargeHint: 'Large horizontal: 3:1, 4:1, 16:9 (e.g. 3000×1000, 4000×1000, 1920×1080)',
        verticalLargeHint: 'Large vertical: 1:2, 9:16, 2:3 (e.g. 1000×2000, 1080×1920, 1200×1800)',
      },
    },
    noResults: 'No advertising spaces found in this area',
    viewDetails: 'View Details',
    bookNow: 'Book Now',
    banner: {
      details: 'Banner Details',
      information: 'Banner Information',
      bookThisBanner: 'Book This Banner',
      viewFullSize: 'View Full Size',
      location: 'Location',
      size: 'Size',
      type: 'Type',
      traffic: 'Traffic',
      pricePerMonth: 'Price per month',
      availableFrom: 'Available from',
      checkAvailability: 'Check Availability',
      startDate: 'Start Date',
      endDate: 'End Date',
      campaignDescription: 'Campaign Description',
      optional: 'Optional',
      validation: {
        selectStartDate: 'Please select a start date',
        selectEndDate: 'Please select an end date',
        endBeforeStart: 'End date must be after start date'
      },
      addToCart: 'Add to cart',
      addedToCart: 'Added to cart',
      alreadyInCart: 'Updated cart item',
      viewCart: 'View cart',
      submitRequest: 'Submit request',
      messages: {
        contentUploaded: 'Content uploaded successfully!',
        bookingSubmitted: 'Banner booking request submitted successfully! The banner owner has been notified and will review your request.',
        uploadFailed: 'Failed to upload content',
        uploadError: 'Failed to upload content. Please try again.',
        bookingFailed: 'Failed to submit booking request',
        bookingError: 'Failed to submit booking request. Please try again.'
      },
      trafficLevels: {
        low: 'Low',
        moderate: 'Moderate',
        high: 'High',
        notSpecified: 'Not specified'
      },
      notAvailable: 'N/A',
      added: 'Added'
    }
  },

  cart: {
    title: 'Booking cart',
    subtitle: 'Review your banners, then send booking requests to owners for approval.',
    emptyTitle: 'Your cart is empty',
    emptyMessage: 'Browse the map and add banners you want to book.',
    browseMap: 'Browse map',
    remove: 'Remove',
    submitAll: 'Submit all booking requests',
    submitting: 'Submitting…',
    itemCount: '{count} banner(s) in cart',
    dates: 'Dates',
    continueShopping: 'Continue on map',
    loginRequired: 'Sign in as an advertiser to book banners.',
    submitSuccess: 'Booking requests sent to banner owners. You will be notified when they respond.',
    submitFailed: 'Could not submit bookings. Please try again.',
    priceForPeriod: 'Total for selected dates',
    viewDetails: 'View banner details',
    detailsTitle: 'Banner details',
    closeDetails: 'Close',
    size: 'Banner size',
    pricePerMonth: 'Price per month',
    periodTotal: 'Total for selected period',
    monthsCount: '({count} month(s) estimated)',
    bannerPhoto: 'Banner photo',
    uploadedContent: 'Your uploaded content',
    contentTempNote: 'Preview only — file is uploaded when you submit your booking request.',
    noUploadedContent: 'No content file added yet.',
    bookIndividually: 'Book this banner only',
    bookingIndividual: 'Booking…',
  },

  checkout: {
    title: 'Checkout',
    subtitle: 'Review totals before payment.',
    contact: 'Contact',
    signIn: 'Sign in',
    email: 'Email',
    emailOffers: 'Email me with news and offers',
    billing: 'Billing details',
    country: 'Country/Region',
    egypt: 'Egypt',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone',
    saveInfo: 'Save this information for next time',
    payment: 'Payment',
    secureNote: 'All transactions are secure and encrypted.',
    instapay: 'Instapay',
    bankTransfer: 'Bank transfer',
    instapayHint: 'Transfer to this Instapay number, then upload your receipt after payment.',
    bankHint: 'Transfer to this account, then upload your receipt after payment.',
    instapayNumber: 'Instapay number',
    accountNumber: 'Account number',
    copy: 'Copy',
    copied: 'Copied',
    payNow: 'Pay now',
    subtotal: 'Subtotal',
    discountCode: 'Discount code',
    apply: 'Apply',
    campaignTotal: 'Campaign total',
    platformFee: 'Platform fee',
    totalDue: 'Total',
    trialNotice: 'No platform fees during Yaftty’s launch period (first 3 months).',
    multiBannerFeeNote: 'One platform fee applies to this multi-banner order.',
    singleBannerFeeNote: 'Platform fee for a single-banner order.',
    bannersInOrder: 'Banners in this order',
    awaitingOwnerApproval: 'Waiting for banner owner approval. You can pay here once all owners have accepted your requests.',
    orderCancelled: 'This order can no longer be checked out because one or more booking requests were rejected.',
    paymentComingSoon: 'Online payment will be available here soon. Use the details above to pay manually for now.',
    backToCart: 'Back to cart',
    loading: 'Loading checkout…',
    notFound: 'Order not found.',
    perMonth: '/ month',
    bannerBooking: 'Banner booking',
  },

  // Authentication
  auth: {
    login: {
      title: 'Sign In',
      subtitle: 'Welcome back to Yaftty',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      googleSignIn: 'Sign in with Google',
      welcomeBack: 'Welcome Back',
      rememberMe: 'Remember Me',
      or: 'or',
      fillAllFields: 'Please fill in all fields'
    },
    signup: {
      title: 'Create Your Account',
      subtitle: 'Join Yaftty today',
      firstName: 'First Name',
      lastName: 'Last Name',
      company: 'Company (optional)',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      agreeToTerms: 'I agree to Terms & policy',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in',
      signUp: 'Sign Up',
      or: 'or',
      importantNotice: 'Important Notice',
      passwordConsistency: 'If you already have an account with a different type (advertiser/banner owner), you must use the same password for both accounts.',
      advertiser: 'Advertiser',
      advertiserDescription: 'Book banners and manage campaigns',
      bannerOwner: 'Banner Owner',
      bannerOwnerDescription: 'List banners and earn revenue',
      bankAccountDetails: 'Bank Account Details',
      bankAccountDescription: 'Provide your bank account details to receive payments automatically when advertisers book your banners.',
      bankName: 'Bank Name *',
      accountNumber: 'Account Number *',
      accountHolderName: 'Account Holder Name *',
      branchCode: 'Branch Code (optional)',
      swiftCode: 'SWIFT Code (optional)',
      iban: 'IBAN (optional)',
      fillRequiredFields: 'Please fill in all required fields.',
      validEmail: 'Please enter a valid email address.',
      passwordRequirements: 'Password must be at least 6 characters with at least one uppercase and one lowercase letter.',
      fillBankFields: 'Please fill in all required bank account fields (Bank Name, Account Number, and Account Holder Name).',
      agreeToTermsPolicy: 'You must agree to the Terms & policy to sign up.',
      signupFailed: 'Sign-up failed',
      signupFailedTryAgain: 'Sign-up failed. Please try again.',
      bothAccountsInfo: 'You now have both {existing} and {new} accounts with the same email.',
      googleSignUp: 'Sign up with Google'
    },
    chooseAccountType: {
      title: 'Choose Your Account Type',
      advertiser: 'Advertiser',
      advertiserDescription: 'Book banners and manage campaigns',
      bannerOwner: 'Banner Owner',
      bannerOwnerDescription: 'List banners and earn revenue',
      failedToSetAccountType: 'Failed to set account type'
    },
    forgotPassword: {
      title: 'Forgot Password',
      subtitle: 'Enter your email to reset your password',
      email: 'Email',
      resetPassword: 'Reset Password',
      backToLogin: 'Back to Login'
    },
    verify: {
      title: 'Verify Your Email',
      enterCode: 'Enter the {length}-digit code we sent to your email to complete your registration.',
      verifying: 'Verifying...',
      submit: 'Verify',
      resending: 'Resending...',
      resend: 'Resend Code',
      success: 'Verification successful! Redirecting...',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    stats: {
      activeCampaigns: 'Active Campaigns',
      totalSpent: 'Total Spent',
      impressions: 'Impressions',
      clicks: 'Clicks'
    },
    recentActivity: 'Recent Activity',
    upcomingBookings: 'Upcoming Bookings',
    bannerOwnerDashboard: 'Banner Owner Dashboard',
    advertiserDashboard: 'Advertiser Dashboard',
    welcomeToYaftty: 'Welcome to Yaftty!',
    getStartedMessage: 'Get started by adding your first banner and start earning from advertisers.',
    startAdvertisingJourney: 'Start your advertising journey by booking your first banner and reaching your target audience.',
    bookingRequests: 'Booking Requests',
    manageRequests: 'Manage requests from advertisers for your banners',
    request: 'Request',
    requests: 'Requests',
    loadingBookingRequests: 'Loading Booking Requests...',
    fetchingBookingRequests: 'Fetching booking requests for your banners...',
    noBookingRequestsYet: 'No Booking Requests Yet',
    noBookingRequestsMessage: 'You\'ll see booking requests here once advertisers start booking your banners.',
    approved: 'Approved',
    rejected: 'Rejected',
    moreInfo: 'More Info',
    yourBanners: 'Your Banners',
    manageAndTrackBanners: 'Manage and track your banner listings',
    banner: 'Banner',
    banners: 'Banners',
    addNewBanner: 'Add a new banner',
    loadingYourBanners: 'Loading Your Banners...',
    fetchingBannerInformation: 'Fetching your banner information...',
    noBannersYet: 'No Banners Yet',
    noBannersMessage: 'You haven\'t added any banners yet. Start earning by listing your first banner and connecting with advertisers.',
    addYourFirstBanner: 'Add Your First Banner',
    manageBannerBookings: 'Manage your banner bookings',
    loadingYourBookings: 'Loading your bookings...',
    noBookingsYet: 'No Bookings Yet',
    noBookingsMessage: 'You haven\'t booked any banners yet. Start your first campaign and reach your target audience!',
    bookYourFirstBanner: 'Book Your First Banner',
    yourBookingRequests: 'Your Booking Requests',
    trackBookingRequests: 'Track your banner booking requests and their status',
    unknownBanner: 'Unknown Banner',
    unknownAdvertiser: 'Unknown Advertiser',
    tableHeaders: {
      id: 'ID',
      banner: 'Banner',
      advertiser: 'Advertiser',
      location: 'Location',
      startDate: 'Start Date',
      endDate: 'End Date',
      date: 'Date',
      status: 'Status',
      actions: 'Actions'
    },
    pending: 'Pending',
    view: 'View',
    cancelled: 'Cancelled',
    bookingDetails: 'Booking Details',
    bookingRequestDetails: 'Booking Request Details',
    bannerInformation: 'Banner Information',
    advertiserInformation: 'Advertiser Information',
    campaignDetails: 'Campaign Details',
    name: 'Name',
    email: 'Email',
    size: 'Size',
    type: 'Type',
    unknown: 'Unknown',
    contentFiles: 'Content Files',
    viewFull: 'View Full',
    contentPreview: 'Content Preview',
    filePreview: 'File Preview',
    cannotPreviewFile: 'This file type cannot be previewed',
    downloadFile: 'Download File',
    fileN: 'File {n}',
    approveRequest: 'Approve Request',
    rejectRequest: 'Reject Request',
    reasonForRejection: 'Reason for Rejection',
    rejectionPlaceholder: 'Please provide a reason for rejection (e.g., selected dates are not available, uploaded content is not suitable, etc.)',
    confirmRejection: 'Confirm Rejection',
    bannerLocation: 'Banner Location',
    campaignPeriod: 'Campaign Period',
    campaignDescription: 'Campaign Description',
    rejectionReason: 'Rejection Reason',
    ownerResponse: 'Owner Response',
    proceedToPayment: 'Proceed To Payment',
    cancelBooking: 'Cancel Booking',
    deleteBooking: 'Delete Booking',
    close: 'Close',
    deleteBookingRequest: 'Delete Booking Request?',
    deleteBookingConfirmation: 'Are you sure you want to delete this booking request?',
    warning: 'Warning',
    deleteBookingWarning: 'This action will permanently remove the booking request from the system.',
    deleteBookingWarningFull: 'Warning: This action will permanently remove the booking request from the system.',
    cancel: 'Cancel'
  },

  // Profile
  profile: {
    title: 'Profile',
    welcomeUser: 'Welcome, {username}',
    personalInfo: 'Personal Information',
    accountSettings: 'Account Settings',
    changePassword: 'Change Password',
    notifications: 'Notifications',
    privacy: 'Privacy Settings',
    manageAccount: 'Manage your account information and settings',
    switching: 'Switching...',
    bannerOwner: 'Banner Owner',
    advertiser: 'Advertiser',
    logout: 'Logout',
    dashboard: 'Dashboard',
    profile: 'Profile',
    security: 'Security',
    preferences: 'Preferences',
    profileInformation: 'Profile Information',
    updatePersonalInfo: 'Update your personal information',
    firstName: 'First Name',
    enterFirstName: 'Enter your first name',
    notProvided: 'Not provided',
    lastName: 'Last Name',
    enterLastName: 'Enter your last name',
    email: 'Email',
    company: 'Company',
    enterCompanyName: 'Enter your company name',
    accountType: 'Account Type',
    payoutBankDetails: 'Payout Bank Details',
    onlyVisibleToYou: 'Only visible to you',
    bankName: 'Bank Name',
    accountHolderName: 'Account Holder Name',
    accountNumber: 'Account Number',
    iban: 'IBAN',
    saving: 'Saving...',
    save: 'Save',
    bankInfoRequired: 'This info is required for payments. Banner owners see their signup values here and can update.',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    securitySettings: 'Security Settings',
    manageAccountSecurity: 'Manage your account security',
    changePassword: 'Change Password',
    updateAccountPassword: 'Update your account password',
    update: 'Update',
    currentPassword: 'Current Password',
    forgotPassword: 'Forgot Password?',
    sending: 'Sending...',
    sendCode: 'Send Code',
    verificationCode: 'Verification Code',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    changing: 'Changing...',
    twoFactorAuthentication: 'Two-Factor Authentication',
    addExtraSecurity: 'Add an extra layer of security',
    disabling: 'Disabling...',
    disable: 'Disable',
    enable: 'Enable',
    enableTwoFactorAuthentication: 'Enable Two-Factor Authentication',
    enter6DigitCode: 'Enter 6-digit code',
    verifying: 'Verifying...',
    verify: 'Verify',
    deleteAccount: 'Delete Account',
    deleteWarning1: 'You will lose all your data for the selected account type(s).',
    deleteWarning2: 'All your banners will be deleted from your profile and the public map.',
    deleteWarning3: 'All bookings and history will be permanently removed.',
    deleteWarning4: 'This action cannot be undone.',
    delete: 'Delete',
    both: 'Both',
    typeToConfirm: 'Type',
    toConfirm: 'to confirm',
    deleting: 'Deleting...',
    customizeExperience: 'Customize your experience',
    language: 'Language',
    languageDescription: 'Choose English or Arabic for the site',
    emailNotifications: 'Email Notifications',
    manageEmailPreferences: 'Manage your email preferences',
    configure: 'Configure',
    emailNotificationSettings: 'Email Notification Settings',
    notifyMeWithUpdates: 'Notify me with updates',
    privacySettings: 'Privacy Settings',
    controlPrivacyOptions: 'Control your privacy options',
    manage: 'Manage',
    permanentlyDeleteAccount: 'Permanently delete your account'
  },

  // Payment
  payment: {
    title: 'Payment',
    subtitle: 'Complete your booking',
    cardDetails: 'Card Details',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    cardholderName: 'Cardholder Name',
    billingAddress: 'Billing Address',
    total: 'Total',
    payNow: 'Pay Now'
  },

  // Admin
  admin: {
    language: 'Language',
    notAvailable: 'N/A',
    unknown: 'Unknown',
    close: 'Close',
    loading: 'Loading banner requests…',
    title: 'Admin Dashboard',
    subtitle: 'Review and manage banner verification requests',
    bannerPeriods: 'Banner Periods',
    adminChat: 'Admin Chat',
    navLabel: 'Admin tools',
    statTotal: 'Total',
    statPending: 'Pending',
    statApproved: 'Approved',
    statRejected: 'Rejected',
    requestsTitle: 'Banner verification requests ({count})',
    secretLabel: 'Admin API secret (from ADMIN_API_SECRET in .env)',
    secretPlaceholder: 'Enter admin secret',
    unlockDashboard: 'Unlock dashboard',
    emptyFixError: 'Fix the issue above to load requests.',
    emptyNoRequests: 'No banner requests found.',
    requestTitle: 'Request #{id}',
    submitted: 'Submitted {date}',
    location: 'Location',
    size: 'Size',
    type: 'Type',
    viewDetails: 'View details',
    approve: 'Approve',
    reject: 'Reject',
    requestInfo: 'Request information',
    email: 'Email',
    firstName: 'First name',
    lastName: 'Last name',
    companyName: 'Company name',
    status: 'Status',
    submittedLabel: 'Submitted',
    bannerImage: 'Banner image',
    bannerPreviewAlt: 'Banner preview',
    viewFullSize: 'View full size',
    documents: 'Documents',
    documentN: 'Document {n}',
    view: 'View',
    approveRequest: 'Approve request',
    rejectRequest: 'Reject request',
    cancel: 'Cancel',
    rejectReasonPrompt: 'Please provide a reason for rejection:',
    loadDetailsFailed: 'Could not load request details.',
    errors: {
      secretRequired: 'Admin secret required',
      loadFailed: 'Failed to load banner requests',
      apiUnreachable: 'Cannot reach admin API. Is the dev server running?',
    },
    statusLabels: {
      unknown: 'Unknown',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  },

  // Footer
  footer: {
    description: 'Yaftty is the leading platform for outdoor advertising, connecting advertisers with premium advertising spaces.',
    quickLinks: 'Quick Links',
    support: 'Support',
    legal: 'Legal',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    copyright: '© 2024 Yaftty. All rights reserved.',
    language: 'Language',
  }
};
