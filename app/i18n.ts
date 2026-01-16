import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      // --- AUTH & GENEL ---
      brandSlogan:
        "The most modern way to find your dream home and the perfect roommate.",
      copyright: "© 2025 RoomMate Inc.",
      backHome: "Home",
      tabLogin: "Log In",
      tabSignup: "Sign Up",
      titleLogin: "Welcome Back!",
      titleSignup: "Create Account",
      descLogin: "Please enter your details to continue.",
      descSignup: "Your new roommate awaits, join us now.",
      orEmail: "or with email",
      labelName: "Full Name",
      phName: "Your Full Name",
      labelEmail: "Email Address",
      phEmail: "example@email.com",
      labelNationality: "Nationality / Country",
      phNationality: "Select your country",
      labelPassword: "Password",
      forgotPass: "Forgot Password?",
      btnShow: "SHOW",
      btnHide: "HIDE",
      btnSubmitLogin: "Log In",
      btnSubmitSignup: "Sign Up",
      processing: "Processing...",
      toastLogin: "Welcome back! Logged in.",
      toastSignup: "Account created! Welcome aboard.",
      loginFail: "Login failed: No token received.",
      opFailed: "Operation failed.",

      // --- HOME PAGE ---
      heroTitle: "Find rental homes with people from your own country.",
      heroDesc:
        "Search in detail or find the home that best suits your culture in seconds with Smart Search.",
      tabStandard: "Standard Search",
      tabSmart: "Smart Search",
      labelCountry: "WHERE? (COUNTRY)",
      labelCity: "WHICH CITY?",
      labelDate: "WHEN?",
      select: "Select",
      checkIn: "Check-in",
      checkOut: "Check-out",
      btnSearch: "Search",
      searching: "Searching...",
      searchError: "Search failed.",
      noResultsFound: "No listings found matching criteria.",

      // --- SMART SEARCH ---
      smartOptionNational: "Same Nationality",
      smartDescNational:
        "Listings from hosts who share your nationality and culture.",
      smartOptionInternational: "International",
      smartDescInternational:
        "International environment to meet people from all over.",
      smartBtnNational: "Find My People",
      smartBtnInternational: "Find Global Homes",
      lockTitle: "Login to Unlock This Feature",
      lockDesc:
        "Smart search analyzes your profile to find the best roommate match. Please log in to continue.",
      btnLogin: "Log In",
      btnSignup: "Sign Up",
      nationalityMissing: "Nationality information is missing in your profile.",
      smartSearchError: "Smart Search error.",

      // --- PROPERTY DETAILS PAGE (YENİ EKLENENLER) ---
      loadingDetails: "Loading listing details...",
      errorTitle: "We're Sorry",
      adNotFound: "Listing not found.",
      fetchError: "An error occurred while fetching listing data.",
      defaultError: "This listing is currently unavailable.",
      backToList: "Back to List",
      viewAllPhotos: "View All Photos",
      host: "Host",
      hidden: "Hidden",
      room: "Room",
      availableFromDate: "onwards",
      aboutHouse: "About the House",
      noDescription: "No description provided for this listing.",
      amenitiesTitle: "Amenities & Features",
      petFriendly: "Pet Friendly",
      internationalEnvironment: "International Environment",
      wifi: "Wi-Fi Connection",
      kitchen: "Fully Equipped Kitchen",
      washingMachine: "Washing Machine",
      perMonth: "month",
      availability: "Availability",
      contactBtn: "Contact Host",
      noCreditCard: "No credit card required.",
    },
  },
  tr: {
    translation: {
      // --- AUTH & GENEL ---
      brandSlogan:
        "Hayalindeki evi ve kafa dengi ev arkadaşını bulmanın en modern yolu.",
      copyright: "© 2025 RoomMate Inc.",
      backHome: "Anasayfa",
      tabLogin: "Giriş Yap",
      tabSignup: "Kayıt Ol",
      titleLogin: "Tekrar Hoşgeldin!",
      titleSignup: "Hesap Oluştur",
      descLogin: "Devam etmek için lütfen bilgilerinizi giriniz.",
      descSignup: "Yeni ev arkadaşın seni bekliyor, hemen katıl.",
      orEmail: "veya e-posta ile",
      labelName: "Ad Soyad",
      phName: "Adınız ve Soyadınız",
      labelEmail: "E-Posta Adresi",
      phEmail: "ornek@email.com",
      labelNationality: "Milliyet / Ülke",
      phNationality: "Ülkenizi Seçiniz",
      labelPassword: "Şifre",
      forgotPass: "Şifremi Unuttum?",
      btnShow: "GÖSTER",
      btnHide: "GİZLE",
      btnSubmitLogin: "Giriş Yap",
      btnSubmitSignup: "Hesap Oluştur",
      processing: "İşleniyor...",
      toastLogin: "Hoşgeldin! Giriş yapıldı.",
      toastSignup: "Hesap oluşturuldu! Aramıza hoşgeldin.",
      loginFail: "Giriş başarısız: Token alınamadı.",
      opFailed: "İşlem başarısız.",

      // --- HOME PAGE ---
      heroTitle: "Kendi kültüründen insanlarla ev arkadaşı ol.",
      heroDesc:
        "İster detaylı arama yap, istersen Smart Search ile kültürüne en uygun evi saniyeler içinde bul.",
      tabStandard: "Standart Arama",
      tabSmart: "Smart Search",
      labelCountry: "NEREYE? (ÜLKE)",
      labelCity: "HANGİ ŞEHİR?",
      labelDate: "NE ZAMAN?",
      select: "Seçiniz",
      checkIn: "Giriş",
      checkOut: "Çıkış",
      btnSearch: "Ara",
      searching: "Aranıyor...",
      searchError: "Arama yapılamadı.",
      noResultsFound: "Kriterlere uygun ilan bulunamadı.",

      // --- SMART SEARCH ---
      smartOptionNational: "Kendi Milletim",
      smartDescNational:
        "Seninle aynı kültürden gelen ev sahiplerinin ilanları.",
      smartOptionInternational: "International",
      smartDescInternational:
        "Farklı kültürlerle tanışabileceğin uluslararası bir ortam.",
      smartBtnNational: "Vatandaşlarımı Bul",
      smartBtnInternational: "Global Evleri Bul",
      lockTitle: "Bu Özelliği Açmak İçin Giriş Yapın",
      lockDesc:
        "Akıllı arama özelliği, size en uygun ev arkadaşını bulmak için profilinizi analiz eder. Devam etmek için lütfen giriş yapın.",
      btnLogin: "Giriş Yap",
      btnSignup: "Hesap Oluştur",
      nationalityMissing: "Profilinizde milliyet bilgisi eksik.",
      smartSearchError: "Smart Search hatası.",

      // --- PROPERTY DETAILS PAGE (YENİ EKLENENLER) ---
      loadingDetails: "İlan detayları yükleniyor...",
      errorTitle: "Üzgünüz",
      adNotFound: "İlan bulunamadı.",
      fetchError: "İlan verileri yüklenirken bir sorun oluştu.",
      defaultError: "Bu ilana şu an ulaşılamıyor.",
      backToList: "Listeye Geri Dön",
      viewAllPhotos: "Tüm Fotoğrafları Gör",
      host: "Ev Sahibi",
      hidden: "Gizli",
      room: "Oda",
      availableFromDate: "tarihinden itibaren",
      aboutHouse: "Ev Hakkında",
      noDescription: "Bu ilan için bir açıklama girilmemiştir.",
      amenitiesTitle: "İmkanlar & Özellikler",
      petFriendly: "Evcil Hayvan Dostu",
      internationalEnvironment: "Uluslararası Ortam",
      wifi: "Wifi Bağlantısı",
      kitchen: "Tam Donanımlı Mutfak",
      washingMachine: "Çamaşır Makinesi",
      perMonth: "ay",
      availability: "Müsaitlik",
      contactBtn: "İletişime Geç",
      noCreditCard: "Kredi kartı bilgisi gerekmez.",
    },
  },
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,

    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
