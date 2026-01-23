// Multilingual support for the application
export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

export interface TranslationStrings {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    submit: string;
    save: string;
    close: string;
  };
  
  // Navigation
  nav: {
    dashboard: string;
    training: string;
    scenarios: string;
    settings: string;
    logout: string;
  };
  
  // Scenarios
  scenarios: {
    title: string;
    difficulty: string;
    easy: string;
    medium: string;
    hard: string;
    score: string;
    accuracy: string;
    correct: string;
    incorrect: string;
    reportPhishing: string;
    markLegitimate: string;
    clickLink: string;
    ignoreMessage: string;
    nextScenario: string;
    backToScenarios: string;
    aiInsight: string;
    hint: string;
    guidedReasoning: string;
    validateAnswer: string;
    redFlags: string;
    trustIndicators: string;
    telegramBlocked: string;
    telegramBlockedDesc: string;
  };
  
  // Training
  training: {
    title: string;
    modules: string;
    progress: string;
    complete: string;
    quiz: string;
    passRequired: string;
    quizPassed: string;
    quizFailed: string;
    tryAgain: string;
    moduleComplete: string;
    completed: string;
    learningContent: string;
    whyItMatters: string;
    quizRequired: string;
    passToComplete: string;
    takeQuiz: string;
    nextModule: string;
    markComplete: string;
    completeQuizFirst: string;
    modulesCompleted: string;
    overallProgress: string;
  };
  
  // Email delivery
  email: {
    sendToDevice: string;
    enterEmail: string;
    emailSent: string;
    emailError: string;
  };
  
  // AI Insight
  aiInsight: {
    hintMode: string;
    hintModeDesc: string;
    guidedMode: string;
    guidedModeDesc: string;
    validateMode: string;
    validateModeDesc: string;
    getHint: string;
    getGuidance: string;
    validateAnswer: string;
  };
}

const translations: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      save: 'Save',
      close: 'Close',
    },
    nav: {
      dashboard: 'Dashboard',
      training: 'Training',
      scenarios: 'Scenarios',
      settings: 'Settings',
      logout: 'Log Out',
    },
    scenarios: {
      title: 'Attack Simulator',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      score: 'Score',
      accuracy: 'Accuracy',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      reportPhishing: 'Report as Phishing',
      markLegitimate: 'Mark as Legitimate',
      clickLink: 'Click Link',
      ignoreMessage: 'Ignore',
      nextScenario: 'Next Scenario',
      backToScenarios: 'Back to Scenarios',
      aiInsight: 'AI Insight',
      hint: 'Hint',
      guidedReasoning: 'Guided Reasoning',
      validateAnswer: 'Validate Answer',
      redFlags: 'Red Flags',
      trustIndicators: 'Trust Indicators',
      telegramBlocked: 'Known Fraud Pattern Detected',
      telegramBlockedDesc: 'This interaction has been blocked. This is a known Telegram scam pattern.',
    },
    training: {
      title: 'Training Center',
      modules: 'Modules',
      progress: 'Progress',
      complete: 'Mark Complete',
      quiz: 'Quiz',
      passRequired: '70% required to pass',
      quizPassed: 'Quiz Passed!',
      quizFailed: 'Quiz Failed',
      tryAgain: 'Review the material and try again.',
      moduleComplete: 'Module Completed',
      completed: 'Completed',
      learningContent: 'Learning Content',
      whyItMatters: 'Why It Matters',
      quizRequired: 'Quiz Required',
      passToComplete: 'Pass the quiz (70%) to complete this module',
      takeQuiz: 'Take Quiz',
      nextModule: 'Next Module',
      markComplete: 'Mark as Complete (+50 XP)',
      completeQuizFirst: 'Complete the quiz to unlock module completion',
      modulesCompleted: 'modules completed',
      overallProgress: 'Overall Progress',
    },
    email: {
      sendToDevice: 'Send to Your Device',
      enterEmail: 'Enter your email address',
      emailSent: 'Simulation email sent! Check your inbox.',
      emailError: 'Failed to send email. Please try again.',
    },
    aiInsight: {
      hintMode: 'Hint Mode',
      hintModeDesc: 'Get subtle hints about suspicious indicators',
      guidedMode: 'Guided Reasoning',
      guidedModeDesc: 'Step-by-step analysis help',
      validateMode: 'Answer Validation',
      validateModeDesc: 'Explain why your answer was correct or incorrect',
      getHint: 'Get a Hint',
      getGuidance: 'Guide Me',
      validateAnswer: 'Explain My Answer',
    },
  },
  hi: {
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफल',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      back: 'वापस',
      next: 'अगला',
      submit: 'जमा करें',
      save: 'सहेजें',
      close: 'बंद करें',
    },
    nav: {
      dashboard: 'डैशबोर्ड',
      training: 'प्रशिक्षण',
      scenarios: 'परिदृश्य',
      settings: 'सेटिंग्स',
      logout: 'लॉग आउट',
    },
    scenarios: {
      title: 'हमला सिम्युलेटर',
      difficulty: 'कठिनाई',
      easy: 'आसान',
      medium: 'मध्यम',
      hard: 'कठिन',
      score: 'स्कोर',
      accuracy: 'सटीकता',
      correct: 'सही!',
      incorrect: 'गलत',
      reportPhishing: 'फ़िशिंग के रूप में रिपोर्ट करें',
      markLegitimate: 'वैध के रूप में चिह्नित करें',
      clickLink: 'लिंक पर क्लिक करें',
      ignoreMessage: 'अनदेखा करें',
      nextScenario: 'अगला परिदृश्य',
      backToScenarios: 'वापस जाएं',
      aiInsight: 'AI अंतर्दृष्टि',
      hint: 'संकेत',
      guidedReasoning: 'मार्गदर्शित तर्क',
      validateAnswer: 'उत्तर सत्यापित करें',
      redFlags: 'चेतावनी संकेत',
      trustIndicators: 'विश्वास संकेतक',
      telegramBlocked: 'ज्ञात धोखाधड़ी पैटर्न पाया गया',
      telegramBlockedDesc: 'यह इंटरैक्शन ब्लॉक कर दिया गया है। यह एक ज्ञात टेलीग्राम स्कैम पैटर्न है।',
    },
    training: {
      title: 'प्रशिक्षण केंद्र',
      modules: 'मॉड्यूल',
      progress: 'प्रगति',
      complete: 'पूर्ण करें',
      quiz: 'प्रश्नोत्तरी',
      passRequired: 'पास करने के लिए 70% आवश्यक',
      quizPassed: 'प्रश्नोत्तरी पास!',
      quizFailed: 'प्रश्नोत्तरी असफल',
      tryAgain: 'सामग्री की समीक्षा करें और पुनः प्रयास करें।',
      moduleComplete: 'मॉड्यूल पूर्ण',
      completed: 'पूर्ण',
      learningContent: 'शिक्षण सामग्री',
      whyItMatters: 'यह क्यों मायने रखता है',
      quizRequired: 'प्रश्नोत्तरी आवश्यक',
      passToComplete: 'इस मॉड्यूल को पूरा करने के लिए प्रश्नोत्तरी (70%) पास करें',
      takeQuiz: 'प्रश्नोत्तरी लें',
      nextModule: 'अगला मॉड्यूल',
      markComplete: 'पूर्ण के रूप में चिह्नित करें (+50 XP)',
      completeQuizFirst: 'मॉड्यूल पूर्णता अनलॉक करने के लिए प्रश्नोत्तरी पूरी करें',
      modulesCompleted: 'मॉड्यूल पूर्ण',
      overallProgress: 'समग्र प्रगति',
    },
    email: {
      sendToDevice: 'अपने डिवाइस पर भेजें',
      enterEmail: 'अपना ईमेल पता दर्ज करें',
      emailSent: 'सिमुलेशन ईमेल भेजा गया! अपना इनबॉक्स जांचें।',
      emailError: 'ईमेल भेजने में विफल। कृपया पुनः प्रयास करें।',
    },
    aiInsight: {
      hintMode: 'संकेत मोड',
      hintModeDesc: 'संदिग्ध संकेतकों के बारे में सूक्ष्म संकेत प्राप्त करें',
      guidedMode: 'मार्गदर्शित तर्क',
      guidedModeDesc: 'चरण-दर-चरण विश्लेषण सहायता',
      validateMode: 'उत्तर सत्यापन',
      validateModeDesc: 'समझाएं कि आपका उत्तर सही या गलत क्यों था',
      getHint: 'संकेत लें',
      getGuidance: 'मुझे मार्गदर्शन करें',
      validateAnswer: 'मेरा उत्तर समझाएं',
    },
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      submit: 'Enviar',
      save: 'Guardar',
      close: 'Cerrar',
    },
    nav: {
      dashboard: 'Panel',
      training: 'Entrenamiento',
      scenarios: 'Escenarios',
      settings: 'Configuración',
      logout: 'Cerrar sesión',
    },
    scenarios: {
      title: 'Simulador de Ataques',
      difficulty: 'Dificultad',
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      score: 'Puntuación',
      accuracy: 'Precisión',
      correct: '¡Correcto!',
      incorrect: 'Incorrecto',
      reportPhishing: 'Reportar como Phishing',
      markLegitimate: 'Marcar como Legítimo',
      clickLink: 'Hacer clic en enlace',
      ignoreMessage: 'Ignorar',
      nextScenario: 'Siguiente Escenario',
      backToScenarios: 'Volver a Escenarios',
      aiInsight: 'Perspectiva IA',
      hint: 'Pista',
      guidedReasoning: 'Razonamiento Guiado',
      validateAnswer: 'Validar Respuesta',
      redFlags: 'Señales de Alerta',
      trustIndicators: 'Indicadores de Confianza',
      telegramBlocked: 'Patrón de Fraude Conocido Detectado',
      telegramBlockedDesc: 'Esta interacción ha sido bloqueada. Es un patrón conocido de estafa de Telegram.',
    },
    training: {
      title: 'Centro de Entrenamiento',
      modules: 'Módulos',
      progress: 'Progreso',
      complete: 'Marcar Completo',
      quiz: 'Cuestionario',
      passRequired: '70% requerido para aprobar',
      quizPassed: '¡Cuestionario Aprobado!',
      quizFailed: 'Cuestionario Fallido',
      tryAgain: 'Revisa el material e intenta de nuevo.',
      moduleComplete: 'Módulo Completado',
      completed: 'Completado',
      learningContent: 'Contenido de Aprendizaje',
      whyItMatters: 'Por Qué Importa',
      quizRequired: 'Cuestionario Requerido',
      passToComplete: 'Aprueba el cuestionario (70%) para completar este módulo',
      takeQuiz: 'Realizar Cuestionario',
      nextModule: 'Siguiente Módulo',
      markComplete: 'Marcar como Completo (+50 XP)',
      completeQuizFirst: 'Completa el cuestionario para desbloquear la finalización del módulo',
      modulesCompleted: 'módulos completados',
      overallProgress: 'Progreso General',
    },
    email: {
      sendToDevice: 'Enviar a tu Dispositivo',
      enterEmail: 'Ingresa tu correo electrónico',
      emailSent: '¡Correo de simulación enviado! Revisa tu bandeja de entrada.',
      emailError: 'Error al enviar correo. Por favor, inténtalo de nuevo.',
    },
    aiInsight: {
      hintMode: 'Modo Pista',
      hintModeDesc: 'Obtén pistas sutiles sobre indicadores sospechosos',
      guidedMode: 'Razonamiento Guiado',
      guidedModeDesc: 'Ayuda de análisis paso a paso',
      validateMode: 'Validación de Respuesta',
      validateModeDesc: 'Explica por qué tu respuesta fue correcta o incorrecta',
      getHint: 'Obtener Pista',
      getGuidance: 'Guíame',
      validateAnswer: 'Explica Mi Respuesta',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      back: 'Retour',
      next: 'Suivant',
      submit: 'Soumettre',
      save: 'Sauvegarder',
      close: 'Fermer',
    },
    nav: {
      dashboard: 'Tableau de bord',
      training: 'Formation',
      scenarios: 'Scénarios',
      settings: 'Paramètres',
      logout: 'Déconnexion',
    },
    scenarios: {
      title: 'Simulateur d\'Attaques',
      difficulty: 'Difficulté',
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      score: 'Score',
      accuracy: 'Précision',
      correct: 'Correct !',
      incorrect: 'Incorrect',
      reportPhishing: 'Signaler comme Phishing',
      markLegitimate: 'Marquer comme Légitime',
      clickLink: 'Cliquer sur le lien',
      ignoreMessage: 'Ignorer',
      nextScenario: 'Scénario Suivant',
      backToScenarios: 'Retour aux Scénarios',
      aiInsight: 'Aperçu IA',
      hint: 'Indice',
      guidedReasoning: 'Raisonnement Guidé',
      validateAnswer: 'Valider la Réponse',
      redFlags: 'Signaux d\'Alerte',
      trustIndicators: 'Indicateurs de Confiance',
      telegramBlocked: 'Modèle de Fraude Connu Détecté',
      telegramBlockedDesc: 'Cette interaction a été bloquée. C\'est un modèle d\'arnaque Telegram connu.',
    },
    training: {
      title: 'Centre de Formation',
      modules: 'Modules',
      progress: 'Progrès',
      complete: 'Marquer Terminé',
      quiz: 'Quiz',
      passRequired: '70% requis pour réussir',
      quizPassed: 'Quiz Réussi !',
      quizFailed: 'Quiz Échoué',
      tryAgain: 'Révisez le matériel et réessayez.',
      moduleComplete: 'Module Terminé',
      completed: 'Terminé',
      learningContent: 'Contenu d\'Apprentissage',
      whyItMatters: 'Pourquoi C\'est Important',
      quizRequired: 'Quiz Requis',
      passToComplete: 'Réussissez le quiz (70%) pour terminer ce module',
      takeQuiz: 'Passer le Quiz',
      nextModule: 'Module Suivant',
      markComplete: 'Marquer comme Terminé (+50 XP)',
      completeQuizFirst: 'Terminez le quiz pour débloquer la complétion du module',
      modulesCompleted: 'modules terminés',
      overallProgress: 'Progrès Global',
    },
    email: {
      sendToDevice: 'Envoyer à Votre Appareil',
      enterEmail: 'Entrez votre adresse e-mail',
      emailSent: 'E-mail de simulation envoyé ! Vérifiez votre boîte de réception.',
      emailError: 'Échec de l\'envoi de l\'e-mail. Veuillez réessayer.',
    },
    aiInsight: {
      hintMode: 'Mode Indice',
      hintModeDesc: 'Obtenez des indices subtils sur les indicateurs suspects',
      guidedMode: 'Raisonnement Guidé',
      guidedModeDesc: 'Aide à l\'analyse étape par étape',
      validateMode: 'Validation de Réponse',
      validateModeDesc: 'Expliquez pourquoi votre réponse était correcte ou incorrecte',
      getHint: 'Obtenir un Indice',
      getGuidance: 'Guidez-moi',
      validateAnswer: 'Expliquer Ma Réponse',
    },
  },
  de: {
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      back: 'Zurück',
      next: 'Weiter',
      submit: 'Absenden',
      save: 'Speichern',
      close: 'Schließen',
    },
    nav: {
      dashboard: 'Dashboard',
      training: 'Schulung',
      scenarios: 'Szenarien',
      settings: 'Einstellungen',
      logout: 'Abmelden',
    },
    scenarios: {
      title: 'Angriffssimulator',
      difficulty: 'Schwierigkeit',
      easy: 'Einfach',
      medium: 'Mittel',
      hard: 'Schwer',
      score: 'Punktzahl',
      accuracy: 'Genauigkeit',
      correct: 'Richtig!',
      incorrect: 'Falsch',
      reportPhishing: 'Als Phishing melden',
      markLegitimate: 'Als legitim markieren',
      clickLink: 'Link anklicken',
      ignoreMessage: 'Ignorieren',
      nextScenario: 'Nächstes Szenario',
      backToScenarios: 'Zurück zu Szenarien',
      aiInsight: 'KI-Einblick',
      hint: 'Hinweis',
      guidedReasoning: 'Geführtes Denken',
      validateAnswer: 'Antwort validieren',
      redFlags: 'Warnzeichen',
      trustIndicators: 'Vertrauensindikatoren',
      telegramBlocked: 'Bekanntes Betrugsmuster erkannt',
      telegramBlockedDesc: 'Diese Interaktion wurde blockiert. Dies ist ein bekanntes Telegram-Betrugsmuster.',
    },
    training: {
      title: 'Schulungszentrum',
      modules: 'Module',
      progress: 'Fortschritt',
      complete: 'Als abgeschlossen markieren',
      quiz: 'Quiz',
      passRequired: '70% zum Bestehen erforderlich',
      quizPassed: 'Quiz bestanden!',
      quizFailed: 'Quiz nicht bestanden',
      tryAgain: 'Überprüfen Sie das Material und versuchen Sie es erneut.',
      moduleComplete: 'Modul Abgeschlossen',
      completed: 'Abgeschlossen',
      learningContent: 'Lerninhalt',
      whyItMatters: 'Warum Es Wichtig Ist',
      quizRequired: 'Quiz Erforderlich',
      passToComplete: 'Bestehen Sie das Quiz (70%) um dieses Modul abzuschließen',
      takeQuiz: 'Quiz Starten',
      nextModule: 'Nächstes Modul',
      markComplete: 'Als Abgeschlossen Markieren (+50 XP)',
      completeQuizFirst: 'Schließen Sie das Quiz ab um den Modulabschluss freizuschalten',
      modulesCompleted: 'Module abgeschlossen',
      overallProgress: 'Gesamtfortschritt',
    },
    email: {
      sendToDevice: 'An Ihr Gerät senden',
      enterEmail: 'Geben Sie Ihre E-Mail-Adresse ein',
      emailSent: 'Simulations-E-Mail gesendet! Überprüfen Sie Ihren Posteingang.',
      emailError: 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
    },
    aiInsight: {
      hintMode: 'Hinweismodus',
      hintModeDesc: 'Erhalten Sie subtile Hinweise zu verdächtigen Indikatoren',
      guidedMode: 'Geführtes Denken',
      guidedModeDesc: 'Schrittweise Analysehilfe',
      validateMode: 'Antwortvalidierung',
      validateModeDesc: 'Erklären Sie, warum Ihre Antwort richtig oder falsch war',
      getHint: 'Hinweis erhalten',
      getGuidance: 'Führe mich',
      validateAnswer: 'Meine Antwort erklären',
    },
  },
};

export const getTranslations = (lang: SupportedLanguage): TranslationStrings => {
  return translations[lang] || translations.en;
};

// Get language from localStorage
export const getStoredLanguage = (): SupportedLanguage => {
  const stored = localStorage.getItem('app_language');
  if (stored && SUPPORTED_LANGUAGES.some(l => l.code === stored)) {
    return stored as SupportedLanguage;
  }
  return 'en';
};

// Set language in localStorage
export const setStoredLanguage = (lang: SupportedLanguage): void => {
  localStorage.setItem('app_language', lang);
};
