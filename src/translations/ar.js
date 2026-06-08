export const ar = {
  // Navigation
  nav: {
    home: 'الرئيسية',
    about: 'حول',
    services: 'الخدمات',
    help: 'المساعدة',
    map: 'الخريطة',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    profile: 'الملف الشخصي',
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل الخروج',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة'
  },

  // Common
  common: {
    loading: 'جاري التحميل',
    submit: 'إرسال',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    close: 'إغلاق',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    view: 'عرض',
    add: 'إضافة',
    remove: 'إزالة',
    confirm: 'تأكيد',
    yes: 'نعم',
    no: 'لا',
    ok: 'موافق',
    error: 'خطأ',
    success: 'نجح',
    warning: 'تحذير',
    info: 'معلومات'
  },

  // Messages
  messages: {
    // Success messages
    loginSuccessful: 'تم تسجيل الدخول بنجاح!',
    accountCreatedSuccessfully: 'تم إنشاء الحساب بنجاح!',
    loggedOutSuccessfully: 'تم تسجيل الخروج بنجاح',
    switchedToAccount: 'تم التبديل إلى حساب {accountType}',
    profileUpdatedSuccessfully: 'تم تحديث الملف الشخصي بنجاح!',
    verificationSuccessful: 'تم التحقق بنجاح!',
    passwordResetEmailSent: 'تم إرسال بريد إعادة تعيين كلمة المرور!',
    loggedInWithGoogle: 'تم تسجيل الدخول بجوجل!',
    bannerAddedSuccessfully: 'تم إضافة اليافطة بنجاح!',
    bannerUpdatedSuccessfully: 'تم تحديث اليافطة بنجاح!',
    bannerDeletedSuccessfully: 'تم حذف اليافطة بنجاح!',
    bookingRequestSentSuccessfully: 'تم إرسال طلب الحجز بنجاح!',
    requestApprovedSuccessfully: 'تم الموافقة على الطلب بنجاح!',
    requestRejectedSuccessfully: 'تم رفض الطلب بنجاح!',
    bookingRequestDeletedSuccessfully: 'تم حذف طلب الحجز بنجاح!',
    bookingRequestRemovedSuccessfully: 'تم إزالة طلب الحجز بنجاح!',
    verificationCodeSent: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
    passwordResetSuccessfully: 'تم إعادة تعيين كلمة المرور بنجاح!',
    codeSentToEmail: 'تم إرسال رمز جديد إلى بريدك الإلكتروني.',
    bankAccountUpdated: 'تم تحديث الحساب البنكي',
    codeSentToEmail2: 'تم إرسال الرمز إلى بريدك الإلكتروني',
    passwordChangedSuccessfully: 'تم تغيير كلمة المرور بنجاح!',
    twoFactorCodeSent: 'تم إرسال رمز المصادقة الثنائية إلى بريدك الإلكتروني',
    twoFactorEnabled: 'تم تفعيل المصادقة الثنائية!',
    twoFactorDisabled: 'تم تعطيل المصادقة الثنائية!',
    receiptUploadedSuccessfully: 'تم رفع الإيصال بنجاح!',
    
    // Error messages
    loginFailedMissingData: 'فشل تسجيل الدخول: بيانات المستخدم مفقودة.',
    loginFailedCheckCredentials: 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.',
    cannotConnectToServer: 'لا يمكن الاتصال بالخادم. يرجى التأكد من تشغيل الخادم الخلفي.',
    signupFailedTryAgain: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    notLoggedInPleaseLogin: 'أنت غير مسجل الدخول. يرجى تسجيل الدخول مرة أخرى.',
    failedToSwitchAccount: 'فشل في تبديل نوع الحساب',
    profileUpdateFailed: 'فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.',
    verificationFailedCheckCode: 'فشل التحقق. يرجى التحقق من الرمز.',
    passwordResetFailed: 'فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.',
    googleSignInFailed: 'فشل تسجيل الدخول بجوجل.',
    failedToLoadBanners: 'فشل في تحميل اليافطات',
    failedToAddBanner: 'فشل في إضافة اليافطة',
    failedToUpdateBanner: 'فشل في تحديث اليافطة',
    failedToDeleteBanner: 'فشل في حذف اليافطة',
    failedToBookBanner: 'فشل في حجز اليافطة',
    failedToDeleteBookingRequest: 'فشل في حذف طلب الحجز. يرجى المحاولة مرة أخرى.',
    failedToCancelBookingRequest: 'فشل في إلغاء طلب الحجز. يرجى المحاولة مرة أخرى.',
    failedToRespondToBookingRequest: 'فشل في الرد على طلب الحجز: {message}',
    errorRespondingToBookingRequest: 'خطأ في الرد على طلب الحجز. يرجى المحاولة مرة أخرى.',
    errorDeletingBanner: 'خطأ في حذف اليافطة. يرجى المحاولة مرة أخرى.',
    failedToUpdateBankAccount: 'فشل في تحديث الحساب البنكي',
    failedToSwitchOrCreateAccount: 'فشل في تبديل أو إنشاء الحساب',
    enterCurrentPassword: 'أدخل كلمة المرور الحالية',
    failedToSendCode: 'فشل في إرسال الرمز',
    fillInAllFields: 'املأ جميع الحقول',
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
    passwordMustBe8Characters: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
    failedToChangePassword: 'فشل في تغيير كلمة المرور',
    failedToEnable2FA: 'فشل في تفعيل المصادقة الثنائية',
    failedToDisable2FA: 'فشل في تعطيل المصادقة الثنائية',
    enterTheCode: 'أدخل الرمز',
    mustTypeToConfirm: 'يجب عليك كتابة "deletemyaccount" للتأكيد.',
    selectAccountTypesToDelete: 'يرجى تحديد نوع الحساب (الحسابات) المراد حذفه.',
    authenticationRequired: 'المصادقة مطلوبة. يرجى تسجيل الدخول مرة أخرى.',
    failedToDeleteAccount: 'فشل في حذف الحساب.',
    pleaseEnterEmail: 'يرجى إدخال عنوان بريدك الإلكتروني',
    failedToSendVerificationCode: 'فشل في إرسال رمز التحقق',
    pleaseEnterVerificationCode: 'يرجى إدخال رمز التحقق',
    pleaseEnter6DigitCode: 'يرجى إدخال رمز تحقق من 6 أرقام',
    pleaseEnterOtpCode: 'يرجى إدخال رمز التحقق المكون من {length} أرقام',
    invalidCode: 'رمز غير صالح',
    missingEmailOrAccountType: 'البريد الإلكتروني أو نوع الحساب مفقود.',
    pleaseFillAllFields: 'يرجى ملء جميع الحقول',
    passwordMustBe8CharactersLong: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
    failedToResetPassword: 'فشل في إعادة تعيين كلمة المرور',
    pleaseSelectReceiptFile: 'يرجى اختيار ملف الإيصال أولاً.',
    failedToUploadReceipt: 'فشل في رفع الإيصال. يرجى المحاولة مرة أخرى.',
    networkErrorTryAgain: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
    pleaseProvideRejectionReason: 'يرجى تقديم سبب الرفض',
             googleSignInNotConfigured: 'تسجيل الدخول بجوجل غير مُعد. يرجى تعيين REACT_APP_GOOGLE_CLIENT_ID.',

         // Confirmation messages
         areYouSureDeleteBooking: 'هل أنت متأكد من أنك تريد حذف طلب الحجز هذا؟',
         bookingRequestApproved: 'تم الموافقة على طلب الحجز بنجاح!',
         bookingRequestRejected: 'تم رفض طلب الحجز بنجاح!',

         // Admin messages
         requestApprovedSuccessfully: 'تم الموافقة على الطلب بنجاح!',
         requestRejectedSuccessfully: 'تم رفض الطلب بنجاح!',
         errorApprovingRequest: 'خطأ في الموافقة على الطلب',
         errorRejectingRequest: 'خطأ في رفض الطلب'
  },

  // Home page
  home: {
    hero: {
      badge: 'سهل. سريع. آمن.',
      title: 'منصة الإعلانات<br>الخارجية',
      subtitle: 'اكتشف واحجز وأدير مساحات الإعلانات الخارجية بسهولة',
      cta: 'ابدأ الآن',
      learnMore: 'اعرف المزيد',
      scrollHint: 'مرّر لأسفل لمعرفة المزيد عن يافطتي',
      scrollLabel: 'مرّر'
    },
    features: {
      title: 'لماذا تختار يافطتي؟',
      discover: {
        title: 'اكتشف المساحات',
        description: 'اعثر على الموقع الإعلاني المثالي لعلامتك التجارية'
      },
      book: {
        title: 'حجز سهل',
        description: 'احجز مساحات الإعلانات بنقرات قليلة'
      },
      manage: {
        title: 'إدارة الحملات',
        description: 'تتبع وأدير حملاتك الإعلانية بفعالية'
      }
    },
    content: {
      advertisers: {
        title: 'للمعلنين',
        description: 'اعثر على الموقع المثالي لأعلانك، تحقق من التوفر، واحجز فوراً. تتبع حجوزاتك والأداء في مكان واحد.'
      },
      owners: {
        title: 'لأصحاب اللَّافتات',
        description: 'اعرض لافتتك، ادر الحجوزات، واحصل على الدفع بسرعة. احصل علي المزيد من المعلنين وزد إيراداتك مع يافطتي.'
      }
    },
    steps: {
      title: 'خطوات البدء',
      advertisers: {
        title: 'للمعلنين',
        steps: [
          'سجل كمعلن.',
          'تصفح الخريطة التفاعلية للعثور على اليافطات المتاحة.',
          'احجز اليافطة المفضل لديك وارفع محتوى إعلانك.',
          'تتبع حجوزاتك وأداء أعلانك.'
        ]
      },
      owners: {
        title: 'لأصحاب اليافطات',
        steps: [
          'سجل كصاحب لافتة.',
          'أضف مستندات اللافتة وبيانات الحساب البنكي للحصول على المدفوعات.',
          'اعرض لافتتك مع الموقع والحجم والسعر.',
          'ادر الحجوزات ووافق على طلبات المعلنين.',
          'احصل على المدفوعات ونم أعمالك.'
        ]
      }
    }
  },

  // About page
  about: {
    title: 'حول يافطتي',
    subtitle: 'ثورة في الإعلانات الخارجية',
    description: 'يافطتي هي منصة شاملة تربط المعلنين بمساحات الإعلانات الخارجية، مما يجعل الوصول إلى جمهورك المستهدف أسهل من أي وقت مضى.',
    badge: 'حولنا',
    hero: {
      title1: 'ربط',
      title2: 'المعلنين',
      title3: 'أصحاب اليافطات',
      description: 'يافطتي تقوم بثورة في الإعلانات الخارجية في مصر من خلال إنشاء منصة سلسة تربط الفجوة بين المعلنين وأصحاب اليافطات من خلال التكنولوجيا المبتكرة والحلول سهلة الاستخدام.'
    },
    mission: {
      title: 'مهمتنا',
      description: 'ثورة في الإعلانات الخارجية من خلال إنشاء منصة سلسة تربط المعلنين بأصحاب اليافطات، مما يجعل الإعلانات الخارجية سهلة الوصول وفعالة ومربحة للجميع.'
    },
    vision: {
      title: 'رؤيتنا',
      description: 'أن نصبح المنصة الرائدة للإعلانات الخارجية في المنطقة، وتعزيز الابتكار والنمو في الصناعة.'
    },
    features: {
      smartLocation: 'موقع ذكي',
      instantBooking: 'حجز فوري',
      securePayments: 'مدفوعات آمنة'
    },
    values: {
      title: 'قيمنا',
      coreValues: 'قيمنا الأساسية',
      description: 'هذه المبادئ توجه كل ما نقوم به في يافطتي',
      innovation: {
        title: 'الابتكار',
        description: 'نحسن منصتنا باستمرار من خلال التكنولوجيا المتطورة والحلول سهلة الاستخدام التي تجعل الإعلانات الخارجية أكثر ذكاءً وسهولة في الوصول.',
        highlight: 'تكنولوجيا متطورة'
      },
      transparency: {
        title: 'الشفافية',
        description: 'بناء الثقة من خلال التواصل الواضح والتسعير الصادق والعمليات الشفافة التي تضمن أن الجميع يعرف بالضبط ما يحصلون عليه.',
        highlight: 'الثقة والأمان'
      },
      community: {
        title: 'المجتمع',
        description: 'تعزيز مجتمع قوي من المعلنين وأصحاب اليافطات الذين ينمون معاً، ويدعمون نجاح بعضهم البعض في صناعة الإعلانات الخارجية.',
        highlight: 'النمو معاً'
      }
    },
    cta: {
      readyToGetStarted: 'هل أنت مستعد للبدء؟',
      joinThousands: 'انضم إلى آلاف المعلنين الناجحين',
      description: 'انضم إلى آلاف المعلنين وأصحاب اليافطات الذين يثقون بيافطتي لاحتياجاتهم الإعلانية الخارجية. ابدأ رحلتك اليوم واختبر مستقبل الإعلانات الخارجية.',
      getStarted: 'ابدأ الآن',
      exploreServices: 'استكشف الخدمات'
    }
  },

  // Services page
  services: {
    title: 'خدماتنا',
    subtitle: 'حلول إعلانية شاملة',
    badge: 'خدماتنا',
    hero: {
      title1: 'حلول',
      title2: 'إعلانية شاملة',
      description: 'اكتشف أدوات وميزات قوية مصممة لربط المعلنين بأصحاب اليافطات، مما يخلق تجربة إعلانات خارجية سلسة.'
    },
    advertisers: {
      badge: 'للمعلنين',
      title: 'أدوات قوية لحملاتك',
      description: 'كل ما تحتاجه للعثور على الإعلانات الخارجية وحجزها وإدارتها.'
    },
    owners: {
      badge: 'لأصحاب اليافطات',
      title: 'زد إيراداتك',
      description: 'حول يافطاتك إلى أصول مربحة مع أدوات الإدارة الشاملة لدينا.'
    },
    advertiserServices: {
      mapBrowsing: {
        title: 'تصفح الخريطة التفاعلية',
        description: 'استكشف اليافطات المتاحة على خريطتنا التفاعلية مع التوفر والأسعار في الوقت الفعلي.',
        highlight: 'بيانات فورية'
      },
      instantBooking: {
        title: 'حجز فوري',
        description: 'احجز اليافطة المفضل لديك فوراً مع معالجة الدفع الآمنة والتأكيد الفوري.',
        highlight: 'سريع وسهل'
      },
      campaignManagement: {
        title: 'إدارة الحملات',
        description: 'تتبع حجوزاتك، ادر الحملات، وراقب الأداء في مكان واحد.',
        highlight: 'تحكم كامل'
      },
      support: {
        title: 'دعم 24/7',
        description: 'احصل على المساعدة متى احتجت إليها مع فريق الدعم على مدار الساعة.',
        highlight: 'متاح دائماً'
      }
    },
    ownerServices: {
      bannerManagement: {
        title: 'إدارة اليافطات',
        description: 'اعرض وادر يافطاتك مع معلومات مفصلة عن الموقع والحجم والسعر.',
        highlight: 'إدارة سهلة'
      },
      revenueOptimization: {
        title: 'تحسين الإيرادات',
        description: 'زد أرباحك مع التسعير الذكي وإدارة الحجز الآلية.',
        highlight: 'أرباح أعلى'
      },
      analyticsDashboard: {
        title: 'لوحة التحليلات',
        description: 'تتبع الأداء، شاهد التحليلات، وحسن استراتيجية وضع اليافطات.',
        highlight: 'رؤى البيانات'
      },
      quickPayments: {
        title: 'مدفوعات سريعة',
        description: 'احصل على المدفوعات بسرعة وأمان مع نظام معالجة الدفع الآلي.',
        highlight: 'مدفوعات سريعة'
      }
    },
    bannerAdvertising: {
      title: 'إعلانات اليافطة',
      description: 'يافطات خارجية عالية التأثير لأقصى وضوح'
    },
    digitalDisplays: {
      title: 'الشاشات الرقمية',
      description: 'حلول إعلانية رقمية ديناميكية'
    },
    billboards: {
      title: 'اللوحات الإعلانية',
      description: 'إعلانات واسعة النطاق لأقصى وصول'
    },
    cta: {
      readyToGetStarted: 'هل أنت مستعد للبدء؟',
      joinThousands: 'انضم إلى آلاف المستخدمين الناجحين',
      description: 'ابدأ رحلتك مع يافطتي واختبر مستقبل الإعلانات الخارجية. سواء كنت معلناً أو صاحب يافطة، لدينا الأدوات التي تحتاجها للنجاح.',
      exploreMap: 'استكشف الخريطة',
      getStarted: 'ابدأ الآن'
    }
  },

  // Help page
  help: {
    title: 'مركز المساعدة',
    subtitle: 'احصل على الدعم الذي تحتاجه',
    badge: 'مركز المساعدة',
    hero: {
      title1: 'كيف يمكننا',
      title2: 'مساعدتك؟',
      description: 'اعثر على إجابات للأسئلة الشائعة، واحصل على الدعم، وتعلم كيفية الاستفادة القصوى من يافطتي.'
    },
    search: {
      placeholder: 'ابحث عن مقالات المساعدة والأسئلة الشائعة والأدلة...',
      results: {
        title: 'نتائج البحث',
        for: 'نتائج البحث عن',
        noResults: 'لم يتم العثور على نتائج. جرب كلمة مفتاحية مختلفة.'
      }
    },
    categories: {
      title: 'تصفح حسب الفئة',
      subtitle: 'اعثر على إجابات منظمة حسب الموضوع',
      general: 'عام',
      account: 'الحساب',
      booking: 'الحجز',
      payment: 'الدفع',
      technical: 'تقني',
      faqs: 'الأسئلة الشائعة'
    },
    aiAssistant: {
      button: 'اسأل المساعد الذكي',
      description: 'احصل على إجابات فورية من مساعدنا الذكي'
    },
    faq: {
      title: 'الأسئلة الشائعة',
      subtitle: 'إجابات سريعة للأسئلة الشائعة',
      general: {
        whatIsYaftty: {
          question: 'ما هو يافطتي؟',
          answer: 'يافطتي هو منصة إلكترونية تربط المعلنين بأصحاب اليافطات من خلال خريطة تفاعلية. نجعل الإعلانات الخارجية سهلة الوصول وفعالة ومربحة للجميع.'
        },
        howDoesItWork: {
          question: 'كيف يعمل يافطتي؟',
          answer: 'يتصفح المعلنون اليافطات المتاحة على خريطتنا التفاعلية، يحجزون المواقع المفضلة لديهم، ويديرون حملاتهم. يعرض أصحاب اليافطات يافطاتهم، يدرون الحجوزات، ويحصلون على المدفوعات تلقائياً.'
        },
        availability: {
          question: 'هل يافطتي متاح في مدينتي؟',
          answer: 'يافطتي متاح حالياً في المدن الرئيسية في مصر. نحن نوسع تغطيتنا باستمرار. تحقق من خريطتنا لرؤية اليافطات المتاحة في منطقتك.'
        },
        costs: {
          question: 'ما هي التكاليف المطلوبة؟',
          answer: 'لا توجد رسوم خفية. يدفع المعلنون فقط لحجز اليافطات ورسوم المنصة، ويحصل أصحاب اليافطات على المبلغ الكامل. جميع الأسعار شفافة ومعروضة مسبقاً.'
        }
      },
      account: {
        createAccount: {
          question: 'كيف أنشئ حساباً؟',
          answer: 'انقر على "إنشاء حساب" أو "ابدأ الآن" في الصفحة الرئيسية واختر ما إذا كنت معلناً أو صاحب يافطة. املأ تفاصيلك، تحقق من بريدك الإلكتروني/هاتفك، وستكون جاهزاً للبدء!'
        },
        bothAccountTypes: {
          question: 'هل يمكنني الحصول على نوعي الحسابات؟',
          answer: 'نعم! يمكنك الحصول على حسابات المعلن وصاحب اليافطة تحت نفس البريد الإلكتروني. ببساطة انتقل بين أنواع الحسابات في إعدادات لوحة التحكم.'
        },
        addBanner: {
          question: 'كيف أضيف يافطتي؟ (أصحاب اليافطات)',
          answer: 'لإضافة يافطتك، تحتاج للذهاب إلى صفحة الخريطة والنقر على أيقونة الزائد في الزاوية السفلية اليسرى (إذا لم ترها، تأكد من تسجيل الدخول كصاحب يافطة). ثم يمكنك إضافة تفاصيل يافطتك ورفع صورة اليافطة والمستندات (إثبات الشراء وتصريح الإعلان). ثم سيراجع فريقنا يافطتك ويوافق عليه/يرفضه.'
        },
        forgotPassword: {
          question: 'ماذا لو نسيت كلمة المرور؟',
          answer: 'انقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول. أدخل بريدك الإلكتروني، وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور.'
        }
      },
      booking: {
        howToBook: {
          question: 'كيف أحجز يافطة؟',
          answer: 'تصفح خريطتنا التفاعلية، اعثر على يافطة متاح، انقر عليه لرؤية التفاصيل، واستخدم زر "تحقق من التوفر". ارفع محتوى إعلانك وانتظر موافقة صاحب اليافطة على حجزك. ثم يمكنك الدفع للحجز.'
        },
        cancelBooking: {
          question: 'هل يمكنني إلغاء الحجز؟',
          answer: 'نعم، يمكنك إلغاء الحجوزات إذا لم يراجعها صاحب اليافطة بعد. إذا وافق صاحب اليافطة عليها، لا يمكنك إلغاء الحجز.'
        },
        approvalTime: {
          question: 'كم من الوقت يستغرق موافقة الحجز؟',
          answer: 'الحجز يعتمد حقاً على صاحب اليافطة. بعض أصحاب اليافطات سريعون جداً ويوافقون على الحجوزات فوراً، بينما قد يستغرق البعض الآخر بضع ساعات أو حتى أيام.'
        },
        adFormats: {
          question: 'ما هي صيغ الإعلانات المدعومة؟',
          answer: 'ندعم صيغ JPG و PNG (صورة) و MP4 (فيديو). الأبعاد الموصى بها متوفرة لكل يافطة. سيعيد نظامنا تحجيم محتواك تلقائياً ليتناسب.'
        }
      },
      payment: {
        paymentMethods: {
          question: 'ما هي طرق الدفع المقبولة؟',
          answer: 'نقبل بطاقات الائتمان والخصم والتحويلات البنكية. جميع المدفوعات تتم معالجتها بأمان من خلال شركاء الدفع الموثوقين.'
        },
        whenPaid: {
          question: 'متى يحصل أصحاب اليافطات على الدفع؟',
          answer: 'يحصل أصحاب اليافطات على المدفوعات خلال 3-5 أيام عمل بعد انتهاء الحملة. تتم معالجة المدفوعات تلقائياً إلى حسابك البنكي المسجل.'
        },
        hiddenFees: {
          question: 'هل توجد رسوم خفية؟',
          answer: 'لا توجد رسوم خفية! جميع التكاليف معروضة بوضوح قبل الحجز. يرى المعلنون السعر الإجمالي، ويرى أصحاب اليافطات بالضبط ما سيتلقونه.'
        },
        security: {
          question: 'هل معلومات الدفع الخاصة بي آمنة؟',
          answer: 'بالتأكيد! نستخدم التشفير القياسي في الصناعة ولا نخزن تفاصيل الدفع الكاملة. جميع المعاملات تتم معالجتها من خلال بوابات دفع آمنة ومعتمدة.'
        }
      },
      technical: {
        mapNotLoading: {
          question: 'الخريطة لا تحمل بشكل صحيح',
          answer: 'جرب تحديث الصفحة أو مسح ذاكرة التخزين المؤقت للمتصفح. تأكد من وجود اتصال إنترنت مستقر. إذا استمرت المشكلة، اتصل بفريق الدعم.'
        },
        cantUpload: {
          question: 'لا يمكنني رفع محتوى إعلاني',
          answer: 'تحقق من أن ملفك بصيغة JPG أو PNG (صورة) أو MP4 (فيديو) وأقل من 20 ميجابايت. تأكد من تطابق الأبعاد مع متطلبات اليافطة. جرب متصفحاً مختلفاً إذا لزم الأمر.'
        },
        bookingStuck: {
          question: 'عملية الحجز عالقة',
          answer: 'هذا يحدث عادة بسبب اتصال إنترنت بطيء أو مشاكل في الخادم. جرب تحديث الصفحة والبدء من جديد. إذا استمرت المشكلة، اتصل بالدعم مع معرف الحجز.'
        },
        noEmails: {
          question: 'لا أتلقى رسائل البريد الإلكتروني للتحقق',
          answer: 'تحقق من مجلد الرسائل غير المرغوب فيها أولاً. إذا كنت لا تزال لا تتلقى رسائل البريد الإلكتروني، جرب استخدام عنوان بريد إلكتروني مختلف أو اتصل بفريق الدعم للمساعدة.'
        }
      }
    },
    contact: {
      title: 'اتصل بنا',
      stillNeedHelp: 'هل ما زلت تحتاج مساعدة؟',
      getInTouch: 'تواصل معنا',
      description: 'فريق الدعم لدينا هنا لمساعدتك على النجاح',
      phone: {
        title: 'الدعم الهاتفي',
        description: 'اتصل بنا في أي وقت'
      },
      email: {
        title: 'الدعم عبر البريد الإلكتروني',
        description: 'احصل على ردود مفصلة'
      },
      liveChat: {
        title: 'الدردشة المباشرة',
        description: 'مساعدة فورية متاحة',
        action: 'ابدأ الدردشة'
      }
    }
  },

  // Map page
  map: {
    title: 'خريطة الإعلانات',
    subtitle: 'اعثر على الموقع المثالي لحملتك',
    filters: {
      title: 'التصنيف حسب',
      location: 'الموقع',
      price: 'نطاق السعر',
      type: 'النوع',
      availability: 'التوفر',
      city: 'المدينة',
      allCities: 'كل المدن',
      sizeCategory: 'الحجم',
      clearAll: 'مسح الكل',
      showingCount: 'عرض {count} يافطة',
      types: {
        rgb: 'RGB',
        paper: 'ورق',
      },
      sizeCategories: {
        horizontalSmall: 'صغير أفقي',
        verticalSmall: 'صغير عمودي',
        squareSmall: 'صغير مربع',
        horizontalLarge: 'كبير أفقي',
        verticalLarge: 'كبير عمودي',
        horizontalSmallHint: 'أفقي صغير: 3:1 (مثل 1200×400)',
        verticalSmallHint: 'عمودي صغير: 1:3 (مثل 400×1200)',
        squareSmallHint: 'مربع صغير: 1:1 (مثل 800×800)',
        horizontalLargeHint: 'أفقي كبير: 3:1، 4:1، 16:9 (مثل 3000×1000، 4000×1000، 1920×1080)',
        verticalLargeHint: 'عمودي كبير: 1:2، 9:16، 2:3 (مثل 1000×2000، 1080×1920، 1200×1800)',
      },
    },
    noResults: 'لم يتم العثور على مساحات إعلانية في هذه المنطقة',
    viewDetails: 'عرض التفاصيل',
    bookNow: 'احجز الآن',
    banner: {
      details: 'تفاصيل اليافطة',
      information: 'معلومات اليافطة',
      bookThisBanner: 'احجز هذه اليافطة',
      viewFullSize: 'عرض الحجم الكامل',
      location: 'الموقع',
      size: 'الحجم',
      type: 'النوع',
      traffic: 'حركة المرور',
      pricePerMonth: 'السعر شهرياً',
      availableFrom: 'متاح من',
      checkAvailability: 'تحقق من التوفر',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      campaignDescription: 'وصف الحملة',
      optional: 'اختياري',
      validation: {
        selectStartDate: 'يرجى اختيار تاريخ البدء',
        selectEndDate: 'يرجى اختيار تاريخ الانتهاء',
        endBeforeStart: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء'
      },
      addToCart: 'أضف إلى السلة',
      addedToCart: 'تمت الإضافة إلى السلة',
      alreadyInCart: 'تم تحديث عنصر السلة',
      viewCart: 'عرض السلة',
      submitRequest: 'إرسال الطلب',
      messages: {
        contentUploaded: 'تم رفع المحتوى بنجاح!',
        bookingSubmitted: 'تم إرسال طلب حجز اليافطة بنجاح! تم إخطار صاحب اليافطة وسيراجع طلبك.',
        uploadFailed: 'فشل في رفع المحتوى',
        uploadError: 'فشل في رفع المحتوى. يرجى المحاولة مرة أخرى.',
        bookingFailed: 'فشل في إرسال طلب الحجز',
        bookingError: 'فشل في إرسال طلب الحجز. يرجى المحاولة مرة أخرى.'
      },
      trafficLevels: {
        low: 'منخفضة',
        moderate: 'متوسطة',
        high: 'عالية',
        notSpecified: 'غير محدد'
      },
      notAvailable: 'غير متاح',
      added: 'تم الإضافة'
    }
  },

  cart: {
    title: 'سلة الحجز',
    subtitle: 'راجع اليافطات ثم أرسل طلبات الحجز إلى أصحابها للموافقة.',
    emptyTitle: 'سلتك فارغة',
    emptyMessage: 'تصفح الخريطة وأضف اليافطات التي تريد حجزها.',
    browseMap: 'تصفح الخريطة',
    remove: 'إزالة',
    submitAll: 'إرسال كل طلبات الحجز',
    submitting: 'جاري الإرسال…',
    itemCount: '{count} يافطة في السلة',
    dates: 'التواريخ',
    continueShopping: 'متابعة على الخريطة',
    loginRequired: 'سجّل الدخول كمعلن لحجز اليافطات.',
    submitSuccess: 'تم إرسال طلبات الحجز إلى أصحاب اليافطات. سنُعلمك عند الرد.',
    submitFailed: 'تعذر إرسال الحجوزات. حاول مرة أخرى.',
    priceForPeriod: 'الإجمالي للفترة المحددة',
    viewDetails: 'عرض تفاصيل اليافطة',
    detailsTitle: 'تفاصيل اليافطة',
    closeDetails: 'إغلاق',
    size: 'حجم اليافطة',
    pricePerMonth: 'السعر شهرياً',
    periodTotal: 'الإجمالي للفترة المحددة',
    monthsCount: '(تقدير {count} شهر)',
    bannerPhoto: 'صورة اليافطة',
    uploadedContent: 'المحتوى المرفوع',
    contentTempNote: 'معاينة فقط — يُرفع الملف عند إرسال طلب الحجز.',
    noUploadedContent: 'لم يُضف ملف محتوى بعد.',
    bookIndividually: 'احجز هذه اليافطة فقط',
    bookingIndividual: 'جاري الحجز…',
  },

  checkout: {
    title: 'الدفع',
    subtitle: 'راجع الإجماليات قبل الدفع.',
    contact: 'التواصل',
    signIn: 'تسجيل الدخول',
    email: 'البريد الإلكتروني',
    emailOffers: 'أرسل لي أخباراً وعروضاً بالبريد',
    billing: 'بيانات الفوترة',
    country: 'الدولة/المنطقة',
    egypt: 'مصر',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'الهاتف',
    saveInfo: 'احفظ هذه البيانات للمرة القادمة',
    payment: 'الدفع',
    secureNote: 'جميع المعاملات آمنة ومشفرة.',
    instapay: 'إنستاباي',
    bankTransfer: 'تحويل بنكي',
    instapayHint: 'حوّل إلى هذا الرقم عبر إنستاباي، ثم ارفع إيصال الدفع بعد التحويل.',
    bankHint: 'حوّل إلى هذا الحساب، ثم ارفع إيصال الدفع بعد التحويل.',
    instapayNumber: 'رقم إنستاباي',
    accountNumber: 'رقم الحساب',
    copy: 'نسخ',
    copied: 'تم النسخ',
    payNow: 'ادفع الآن',
    subtotal: 'المجموع الفرعي',
    discountCode: 'كود خصم',
    apply: 'تطبيق',
    campaignTotal: 'إجمالي الحملة',
    platformFee: 'رسوم المنصة',
    totalDue: 'الإجمالي',
    trialNotice: 'بدون رسوم منصة خلال فترة إطلاق يافطتي (أول 3 أشهر).',
    multiBannerFeeNote: 'رسوم منصة واحدة لطلب عدة يافطات.',
    singleBannerFeeNote: 'رسوم المنصة لطلب يافطة واحدة.',
    bannersInOrder: 'اليافطات في هذا الطلب',
    awaitingOwnerApproval: 'في انتظار موافقة صاحب اليافطة. يمكنك الدفع هنا بعد قبول جميع الطلبات.',
    orderCancelled: 'لا يمكن إتمام هذا الطلب لأن أحد طلبات الحجز تم رفضه.',
    paymentComingSoon: 'الدفع الإلكتروني سيُفعّل قريباً. استخدم البيانات أعلاه للدفع يدوياً حالياً.',
    backToCart: 'العودة لسلة الحجز',
    loading: 'جاري تحميل الدفع…',
    notFound: 'الطلب غير موجود.',
    perMonth: '/ شهر',
    bannerBooking: 'حجز يافطة',
  },

  // Authentication
  auth: {
    login: {
      title: 'تسجيل الدخول',
      subtitle: 'مرحباً بعودتك إلى يافطتي',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      noAccount: 'ليس لديك حساب؟',
      signUp: 'إنشاء حساب',
      googleSignIn: 'تسجيل الدخول بجوجل',
      welcomeBack: 'مرحباً بعودتك',
      rememberMe: 'تذكرني',
      or: 'أو',
      fillAllFields: 'يرجى ملء جميع الحقول'
    },
    signup: {
      title: 'إنشاء حسابك',
      subtitle: 'انضم إلى يافطتي اليوم',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      company: 'الشركة (اختياري)',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      agreeToTerms: 'أوافق على الشروط والسياسة',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      or: 'أو',
      importantNotice: 'إشعار مهم',
      passwordConsistency: 'إذا كان لديك حساب بالفعل بنوع مختلف (معلن/صاحب يافطة)، يجب عليك استخدام نفس كلمة المرور لكلا الحسابين.',
      advertiser: 'معلن',
      advertiserDescription: 'احجز اليافطات وادر الحملات',
      bannerOwner: 'صاحب يافطة',
      bannerOwnerDescription: 'اعرض اليافطات واكسب الإيرادات',
      bankAccountDetails: 'تفاصيل الحساب البنكي',
      bankAccountDescription: 'قدم تفاصيل حسابك البنكي لتلقي المدفوعات تلقائياً عندما يحجز المعلنون يافطاتك.',
      bankName: 'اسم البنك *',
      accountNumber: 'رقم الحساب *',
      accountHolderName: 'اسم صاحب الحساب *',
      branchCode: 'رمز الفرع (اختياري)',
      swiftCode: 'رمز سويفت (اختياري)',
      iban: 'رقم الآيبان (اختياري)',
      fillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة.',
      validEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح.',
      passwordRequirements: 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل مع حرف كبير وحرف صغير واحد على الأقل.',
      fillBankFields: 'يرجى ملء جميع حقول الحساب البنكي المطلوبة (اسم البنك، رقم الحساب، واسم صاحب الحساب).',
      agreeToTermsPolicy: 'يجب عليك الموافقة على الشروط والسياسة لإنشاء حساب.',
      signupFailed: 'فشل إنشاء الحساب',
      signupFailedTryAgain: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
      bothAccountsInfo: 'لديك الآن حسابي {existing} و {new} بنفس البريد الإلكتروني.',
      googleSignUp: 'إنشاء حساب بجوجل'
    },
    chooseAccountType: {
      title: 'اختر نوع حسابك',
      advertiser: 'معلن',
      advertiserDescription: 'احجز اليافطات وادر الحملات',
      bannerOwner: 'صاحب يافطة',
      bannerOwnerDescription: 'اعرض اليافطات واكسب الإيرادات',
      failedToSetAccountType: 'فشل في تعيين نوع الحساب'
    },
    forgotPassword: {
      title: 'نسيت كلمة المرور',
      subtitle: 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور',
      email: 'البريد الإلكتروني',
      resetPassword: 'إعادة تعيين كلمة المرور',
      backToLogin: 'العودة لتسجيل الدخول'
    },
    verify: {
      title: 'تحقق من بريدك الإلكتروني',
      enterCode: 'أدخل الرمز المكون من {length} أرقام الذي أرسلناه إلى بريدك لإكمال التسجيل.',
      verifying: 'جاري التحقق...',
      submit: 'تحقق',
      resending: 'جاري الإرسال...',
      resend: 'إعادة إرسال الرمز',
      success: 'تم التحقق بنجاح! جاري التوجيه...',
    },
  },

  // Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    welcome: 'مرحباً بعودتك',
    stats: {
      activeCampaigns: 'الحملات النشطة',
      totalSpent: 'إجمالي الإنفاق',
      impressions: 'المرات المعروضة',
      clicks: 'النقرات'
    },
    recentActivity: 'النشاط الأخير',
    upcomingBookings: 'الحجوزات القادمة',
    bannerOwnerDashboard: 'لوحة تحكم صاحب اليافطة',
    advertiserDashboard: 'لوحة تحكم المعلن',
    welcomeToYaftty: 'مرحباً بك في يافطتي!',
    getStartedMessage: 'ابدأ بإضافة أول يافطة لك وابدأ في الربح من المعلنين.',
    startAdvertisingJourney: 'ابدأ رحلتك الإعلانية بحجز أول يافطة لك والوصول إلى جمهورك المستهدف.',
    bookingRequests: 'طلبات الحجز',
    manageRequests: 'ادر طلبات المعلنين ليافطاتك',
    request: 'طلب',
    requests: 'طلبات',
    loadingBookingRequests: 'جاري تحميل طلبات الحجز...',
    fetchingBookingRequests: 'جاري جلب طلبات الحجز ليافطاتك...',
    noBookingRequestsYet: 'لا توجد طلبات حجز بعد',
    noBookingRequestsMessage: 'سترى طلبات الحجز هنا بمجرد أن يبدأ المعلنون في حجز يافطاتك.',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    moreInfo: 'المزيد من المعلومات',
    yourBanners: 'اليفط',
    manageAndTrackBanners: 'ادر وتتبع قوائم يافطاتك',
    banner: 'يافطة',
    banners: 'يافطات',
    addNewBanner: 'أضف يافطة جديد',
    loadingYourBanners: 'جاري تحميل يافطاتك...',
    fetchingBannerInformation: 'جاري جلب معلومات اليافطة...',
    noBannersYet: 'لا توجد يافطات بعد',
    noBannersMessage: 'لم يتم العثور علي اليافطات بعد. ابدأ بإضافة أول يافطة لك .',
    addYourFirstBanner: 'أضف أول يافطة لك',
    manageBannerBookings: 'ادر حجوزات يافطاتك',
    loadingYourBookings: 'جاري تحميل حجوزاتك...',
    noBookingsYet: 'لا توجد حجوزات بعد',
    noBookingsMessage: 'لم تحجز أي يافطات بعد. ابدأ حملتك الأولى ووصل إلى جمهورك المستهدف!',
    bookYourFirstBanner: 'احجز أول يافطة لك',
    yourBookingRequests: 'طلبات الحجز الخاصة بك',
    trackBookingRequests: 'تتبع طلبات حجز اليافطات الخاصة بك وحالتها',
    unknownBanner: 'يافطة غير معروف',
    unknownAdvertiser: 'معلن غير معروف',
    tableHeaders: {
      id: 'الرقم',
      banner: 'اللافتة',
      advertiser: 'المعلن',
      location: 'الموقع',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      date: 'التاريخ',
      status: 'الحالة',
      actions: 'الإجراءات'
    },
    pending: 'في الانتظار',
    view: 'عرض',
    cancelled: 'ملغي',
    bookingDetails: 'تفاصيل الحجز',
    bookingRequestDetails: 'تفاصيل طلب الحجز',
    bannerInformation: 'معلومات اللافتة',
    advertiserInformation: 'معلومات المعلن',
    campaignDetails: 'تفاصيل الحملة',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    size: 'الحجم',
    type: 'النوع',
    unknown: 'غير معروف',
    contentFiles: 'ملفات المحتوى',
    viewFull: 'عرض كامل',
    contentPreview: 'معاينة المحتوى',
    filePreview: 'معاينة الملف',
    cannotPreviewFile: 'لا يمكن معاينة نوع الملف هذا',
    downloadFile: 'تحميل الملف',
    fileN: 'ملف {n}',
    approveRequest: 'الموافقة على الطلب',
    rejectRequest: 'رفض الطلب',
    reasonForRejection: 'سبب الرفض',
    rejectionPlaceholder: 'يرجى توضيح سبب الرفض (مثال: التواريخ المحددة غير متاحة، المحتوى المرفوع غير مناسب، إلخ.)',
    confirmRejection: 'تأكيد الرفض',
    bannerLocation: 'موقع اللافتة',
    campaignPeriod: 'فترة الأعلان',
    campaignDescription: 'وصف الحملة',
    rejectionReason: 'سبب الرفض',
    ownerResponse: 'رد صاحب اللافتة',
    proceedToPayment: 'المتابعة للدفع',
    cancelBooking: 'إلغاء الحجز',
    deleteBooking: 'حذف الحجز',
    close: 'إغلاق',
    deleteBookingRequest: 'حذف طلب الحجز؟',
    deleteBookingConfirmation: 'هل أنت متأكد من أنك تريد حذف طلب الحجز هذا؟',
    warning: 'تحذير',
    deleteBookingWarning: 'سيؤدي هذا الإجراء إلى إزالة طلب الحجز نهائياً من النظام.',
    deleteBookingWarningFull: 'تحذير: سيؤدي هذا الإجراء إلى إزالة طلب الحجز نهائياً من النظام.',
    cancel: 'إلغاء'
  },

  // Profile
  profile: {
    title: 'الملف الشخصي',
    welcomeUser: 'اهلا {username}',
    personalInfo: 'المعلومات الشخصية',
    accountSettings: 'إعدادات الحساب',
    changePassword: 'تغيير كلمة المرور',
    notifications: 'الإشعارات',
    privacy: 'إعدادات الخصوصية',
    manageAccount: 'ادر معلومات حسابك وإعداداته',
    switching: 'جاري التبديل...',
    bannerOwner: 'صاحب اللافتة',
    advertiser: 'المعلن',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    security: 'الأمان',
    preferences: 'التفضيلات',
    profileInformation: 'معلومات الملف الشخصي',
    updatePersonalInfo: 'حدث معلوماتك الشخصية',
    firstName: 'الاسم الأول',
    enterFirstName: 'أدخل اسمك الأول',
    notProvided: 'غير محدد',
    lastName: 'اسم العائلة',
    enterLastName: 'أدخل اسم العائلة',
    email: 'البريد الإلكتروني',
    company: 'الشركة',
    enterCompanyName: 'أدخل اسم شركتك',
    accountType: 'نوع الحساب',
    payoutBankDetails: 'تفاصيل البنك للدفع',
    onlyVisibleToYou: 'مرئي لك فقط',
    bankName: 'اسم البنك',
    accountHolderName: 'اسم صاحب الحساب',
    accountNumber: 'رقم الحساب',
    iban: 'رقم الآيبان',
    saving: 'جاري الحفظ...',
    save: 'حفظ',
    bankInfoRequired: 'هذه المعلومات مطلوبة للمدفوعات. أصحاب اليافطات يرون قيم التسجيل هنا ويمكنهم التحديث.',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    securitySettings: 'إعدادات الأمان',
    manageAccountSecurity: 'ادر أمان حسابك',
    changePassword: 'تغيير كلمة المرور',
    updateAccountPassword: 'حدث كلمة مرور حسابك',
    update: 'تحديث',
    currentPassword: 'كلمة المرور الحالية',
    forgotPassword: 'نسيت كلمة المرور؟',
    sending: 'جاري الإرسال...',
    sendCode: 'إرسال الرمز',
    verificationCode: 'رمز التحقق',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    changing: 'جاري التغيير...',
    twoFactorAuthentication: 'المصادقة الثنائية',
    addExtraSecurity: 'أضف طبقة أمان إضافية',
    disabling: 'جاري التعطيل...',
    disable: 'تعطيل',
    enable: 'تفعيل',
    enableTwoFactorAuthentication: 'تفعيل المصادقة الثنائية',
    enter6DigitCode: 'أدخل رمز من 6 أرقام',
    verifying: 'جاري التحقق...',
    verify: 'تحقق',
    deleteAccount: 'حذف الحساب',
    deleteWarning1: 'ستفقد جميع بياناتك للحساب المحدد.',
    deleteWarning2: 'سيتم حذف جميع يافطاتك من ملفك الشخصي والخريطة العامة.',
    deleteWarning3: 'سيتم حذف جميع الحجوزات والتاريخ نهائياً.',
    deleteWarning4: 'لا يمكن التراجع عن هذا الإجراء.',
    delete: 'حذف',
    both: 'كلاهما',
    typeToConfirm: 'اكتب',
    toConfirm: 'للتأكيد',
    deleting: 'جاري الحذف...',
    customizeExperience: 'خصص تجربتك',
    language: 'اللغة',
    languageDescription: 'اختر اللغة للموقع',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    manageEmailPreferences: 'ادر تفضيلات البريد الإلكتروني',
    configure: 'عرض',
    emailNotificationSettings: 'إعدادات إشعارات البريد الإلكتروني',
    notifyMeWithUpdates: 'أخبرني بالتحديثات',
    privacySettings: 'إعدادات الخصوصية',
    controlPrivacyOptions: 'تحكم في خيارات الخصوصية',
    manage: 'إدارة',
    permanentlyDeleteAccount: 'حذف حسابك نهائياً'
  },

  // Payment
  payment: {
    title: 'الدفع',
    subtitle: 'أكمل حجزك',
    cardDetails: 'تفاصيل البطاقة',
    cardNumber: 'رقم البطاقة',
    expiryDate: 'تاريخ الانتهاء',
    cvv: 'رمز الأمان',
    cardholderName: 'اسم حامل البطاقة',
    billingAddress: 'عنوان الفواتير',
    total: 'الإجمالي',
    payNow: 'ادفع الآن'
  },

  // Admin
  admin: {
    language: 'اللغة',
    notAvailable: 'غير متوفر',
    unknown: 'غير معروف',
    close: 'إغلاق',
    loading: 'جاري تحميل طلبات اليافطات…',
    title: 'لوحة تحكم المشرف',
    subtitle: 'مراجعة وإدارة طلبات التحقق من اليافطات',
    bannerPeriods: 'فترات اليافطات',
    adminChat: 'محادثة المشرف',
    navLabel: 'أدوات المشرف',
    statTotal: 'الإجمالي',
    statPending: 'قيد الانتظار',
    statApproved: 'موافق عليه',
    statRejected: 'مرفوض',
    requestsTitle: 'طلبات التحقق من اليافطات ({count})',
    secretLabel: 'مفتاح واجهة المشرف (من ADMIN_API_SECRET في .env)',
    secretPlaceholder: 'أدخل مفتاح المشرف',
    unlockDashboard: 'فتح لوحة التحكم',
    emptyFixError: 'أصلح المشكلة أعلاه لتحميل الطلبات.',
    emptyNoRequests: 'لا توجد طلبات يافطات.',
    requestTitle: 'طلب #{id}',
    submitted: 'تاريخ الإرسال {date}',
    location: 'الموقع',
    size: 'الحجم',
    type: 'النوع',
    viewDetails: 'عرض التفاصيل',
    approve: 'موافقة',
    reject: 'رفض',
    requestInfo: 'معلومات الطلب',
    email: 'البريد الإلكتروني',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    companyName: 'اسم الشركة',
    status: 'الحالة',
    submittedLabel: 'تاريخ الإرسال',
    bannerImage: 'صورة اليافطة',
    bannerPreviewAlt: 'معاينة اليافطة',
    viewFullSize: 'عرض بالحجم الكامل',
    documents: 'المستندات',
    documentN: 'مستند {n}',
    view: 'عرض',
    approveRequest: 'الموافقة على الطلب',
    rejectRequest: 'رفض الطلب',
    cancel: 'إلغاء',
    rejectReasonPrompt: 'يرجى ذكر سبب الرفض:',
    loadDetailsFailed: 'تعذر تحميل تفاصيل الطلب.',
    errors: {
      secretRequired: 'مفتاح المشرف مطلوب',
      loadFailed: 'فشل تحميل طلبات اليافطات',
      apiUnreachable: 'تعذر الاتصال بواجهة المشرف. هل الخادم يعمل؟',
    },
    statusLabels: {
      unknown: 'غير معروف',
      pending: 'قيد الانتظار',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
    },
  },

  // Footer
  footer: {
    description: 'يافطتي هي المنصة الرائدة للإعلانات الخارجية، تربط المعلنين بمساحات الإعلانات المميزة.',
    quickLinks: 'روابط سريعة',
    support: 'الدعم',
    legal: 'القانونية',
    terms: 'شروط الخدمة',
    privacy: 'سياسة الخصوصية',
    cookies: 'سياسة ملفات تعريف الارتباط',
    copyright: '© ٢٠٢٦ يافطتي. جميع الحقوق محفوظة.',
    language: 'اللغة',
  }
};
