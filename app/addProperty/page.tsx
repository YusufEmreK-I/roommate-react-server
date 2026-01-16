/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Toaster layout'ta var, sadece toast fonksiyonu lazım
import {
  X,
  UploadCloud,
  Star,
  MapPin,
  Home,
  DollarSign,
  Settings,
  Image as ImageIcon,
  CheckCircle2,
  Globe,
} from "lucide-react";

// ⚠️ TopNav'ı sildik (Layout'tan geliyor)

import CustomDatePicker from "../../components/Common/CustomDatePicker";

import {
  getCountriesApi,
  getCitiesApi,
  Country,
  City,
} from "../../services/locationService";
import {
  createPropertyApi,
  CreatePropertyModel,
  uploadPhotosApi,
} from "../../services/propertyService";

// Auth Context
import { useAuth } from "../context/AuthContext";

// --- DİL SÖZLÜĞÜ ---
const translations = {
  tr: {
    pageTitle: "İlan Oluştur",
    pageDesc: "Ev arkadaşını bulmak için detayları doldur.",
    cardBasic: "Temel Bilgiler",
    cardLocation: "Konum",
    cardPhotos: "Fotoğraflar",
    cardDetails: "İlan Detayları",
    cardFeatures: "Özellikler",
    labelTitle: "İlan Başlığı",
    phTitle: "Örn: Kadıköy merkezde ferah oda",
    labelDesc: "Açıklama",
    phDesc:
      "Evin detaylarından, aradığın ev arkadaşı özelliklerinden bahset...",
    labelCountry: "Ülke",
    labelCity: "Şehir",
    labelAddress: "Açık Adres",
    phAddress: "Mahalle, Sokak, No...",
    labelPrice: "Aylık Fiyat",
    labelRoom: "Oda Sayısı",
    labelAvailability: "Müsaitlik",
    phDateStart: "Başlangıç",
    phDateEnd: "Bitiş",
    checkPet: "Evcil Hayvan Dostu",
    checkIntl: "International House (Yabancılara Uygun)",
    noteNationality: "Not: İlanda milliyetiniz otomatik olarak görünecektir.",
    btnSubmit: "İlanı Yayınla",
    btnSubmitting: "Yayınlanıyor...",
    uploadText: "Fotoğrafları buraya sürükle veya seç",
    uploadLimit: "PNG, JPG (Maks. 5 adet)",
    makeCover: "Kapak Yap",
    select: "Seçiniz",
    loading: "Yükleniyor...",
  },
  en: {
    pageTitle: "Create Listing",
    pageDesc: "Fill in the details to find your roommate.",
    cardBasic: "Basic Information",
    cardLocation: "Location",
    cardPhotos: "Photos",
    cardDetails: "Listing Details",
    cardFeatures: "Features",
    labelTitle: "Listing Title",
    phTitle: "Ex: Spacious room in Kadıköy center",
    labelDesc: "Description",
    phDesc: "Describe home details and roommate preferences...",
    labelCountry: "Country",
    labelCity: "City",
    labelAddress: "Full Address",
    phAddress: "Neighborhood, Street, No...",
    labelPrice: "Monthly Price",
    labelRoom: "Room Count",
    labelAvailability: "Availability",
    phDateStart: "Start Date",
    phDateEnd: "End Date",
    checkPet: "Pet Friendly",
    checkIntl: "International House",
    noteNationality: "Note: Your nationality will be shown automatically.",
    btnSubmit: "Publish Listing",
    btnSubmitting: "Publishing...",
    uploadText: "Drag photos here or click to select",
    uploadLimit: "PNG, JPG (Max 5 files)",
    makeCover: "Make Cover",
    select: "Select",
    loading: "Loading...",
  },
};

const AddPropertyPage = () => {
  const router = useRouter();

  // AUTH KONTROLÜ
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();

  // DİL STATE'İ
  const [language, setLanguage] = useState<"tr" | "en">("tr");
  const t = translations[language];

  // DİĞER STATE'LER
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    countryId: "",
    cityId: "",
    address: "",
    roomCount: "1",
    petFriendly: false,
    internationalHouse: false,
    startDate: "",
    endDate: "",
    photos: [] as File[],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Sayfa Yüklenirken Güvenlik Kontrolü
  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      toast.error("İlan vermek için giriş yapmalısınız.", {
        id: "auth-required-error",
      });
      // ✅ URL DÜZELTİLDİ: /pages/login -> /login
      router.push("/login");
    }
  }, [isAuthLoading, isLoggedIn, router]);

  // 2. Ülkeleri Çek
  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountriesApi();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "tr" ? "en" : "tr"));
  };

  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const cId = e.target.value;
    setFormData((prev) => ({ ...prev, countryId: cId, cityId: "" }));
    setCities([]);
    if (cId) {
      setLoadingLocations(true);
      const data = await getCitiesApi(Number(cId));
      setCities(data);
      setLoadingLocations(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const MAX_PHOTOS = 5;

      const validImageFiles = newFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      const currentCount = formData.photos.length;
      if (currentCount + validImageFiles.length > MAX_PHOTOS) {
        toast.error(
          language === "tr"
            ? `En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz.`
            : `You can upload max ${MAX_PHOTOS} photos.`
        );
        return;
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...validImageFiles],
      }));

      const newPreviewUrls = validImageFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSetCover = (indexToMakeCover: number) => {
    if (indexToMakeCover === 0) return;
    const newPhotos = [...formData.photos];
    const selectedPhoto = newPhotos[indexToMakeCover];
    newPhotos.splice(indexToMakeCover, 1);
    newPhotos.unshift(selectedPhoto);

    const newPreviewUrls = [...previewUrls];
    const selectedUrl = newPreviewUrls[indexToMakeCover];
    newPreviewUrls.splice(indexToMakeCover, 1);
    newPreviewUrls.unshift(selectedUrl);

    setFormData((prev) => ({ ...prev, photos: newPhotos }));
    setPreviewUrls(newPreviewUrls);
    toast.success(
      language === "tr"
        ? "Kapak fotoğrafı güncellendi!"
        : "Cover photo updated!"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.photos.length === 0) {
      toast.error(
        language === "tr"
          ? "En az bir fotoğraf yüklemelisiniz."
          : "You must upload at least one photo."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedCountry =
        countries.find((c) => c.id === Number(formData.countryId))?.name || "";
      const selectedCity =
        cities.find((c) => c.id === Number(formData.cityId))?.name || "";

      const myNationality = user?.nationality || "Unknown";

      const apiData: CreatePropertyModel = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        country: selectedCountry,
        city: selectedCity,
        address: formData.address,
        roomCount: Number(formData.roomCount),
        ownerNationality: myNationality,
        petFriendly: formData.petFriendly,
        internationalHouse: formData.internationalHouse,
        availableFrom: formData.startDate,
        availableTo: formData.endDate,
      };

      const savedProperty = await createPropertyApi(apiData);
      const newUuid = savedProperty.uuid;

      if (formData.photos.length > 0) {
        toast.loading(
          language === "tr"
            ? "Fotoğraflar yükleniyor..."
            : "Uploading photos...",
          { id: "uploading" }
        );
        await uploadPhotosApi(newUuid, formData.photos);
        toast.dismiss("uploading");
      }

      toast.success(
        language === "tr"
          ? "İlan başarıyla yayınlandı!"
          : "Property published successfully!"
      );
      // ✅ URL DÜZELTİLDİ: Anasayfaya git
      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      let errorMessage =
        language === "tr" ? "Bir hata oluştu." : "An error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] relative">
      {/* TopNav Layout'tan geliyor */}

      {/* --- DİL BUTONU --- */}
      <div className="absolute top-20 right-4 z-50 md:right-8 md:top-24">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Globe size={14} className="text-orange-500" />
          {language === "tr" ? "English" : "Türkçe"}
        </button>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {t.pageTitle}
          </h1>
          <p className="text-gray-500 mt-2">{t.pageDesc}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* --- SOL KOLON --- */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. TEMEL BİLGİLER */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <Home size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {t.cardBasic}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t.labelTitle}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={t.phTitle}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t.labelDesc}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder={t.phDesc}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-medium resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* 2. KONUM */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {t.cardLocation}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      {t.labelCountry}
                    </label>
                    <select
                      name="countryId"
                      value={formData.countryId}
                      onChange={handleCountryChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none cursor-pointer"
                    >
                      <option value="">{t.select}</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      {t.labelCity}
                    </label>
                    <select
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleChange}
                      required
                      disabled={!formData.countryId}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {loadingLocations ? t.loading : t.select}
                      </option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                    {t.labelAddress}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t.phAddress}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  />
                </div>
              </section>

              {/* 3. FOTOĞRAFLAR */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                    <ImageIcon size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {t.cardPhotos}
                  </h2>
                </div>

                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-100 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-orange-500">
                      <UploadCloud size={32} />
                    </div>
                    <p className="text-gray-700 font-medium">{t.uploadText}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {t.uploadLimit}
                    </p>
                  </div>
                </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-2">
                    {previewUrls.map((url, index) => (
                      <div
                        key={url}
                        className={`relative aspect-square rounded-xl overflow-hidden group border-2 ${
                          index === 0
                            ? "border-orange-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> KAPAK
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(index)}
                              className="bg-white/20 hover:bg-white text-white hover:text-orange-600 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
                            >
                              {t.makeCover}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* --- SAĞ KOLON (AYARLAR) --- */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
              {/* 4. DETAYLAR */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                  <Settings size={18} className="text-gray-400" />
                  {t.cardDetails}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      {t.labelPrice}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <DollarSign size={16} />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      {t.labelRoom}
                    </label>
                    <input
                      type="number"
                      name="roomCount"
                      value={formData.roomCount}
                      onChange={handleChange}
                      min={1}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 mt-2">
                      {t.labelAvailability}
                    </label>
                    <div className="space-y-2">
                      <CustomDatePicker
                        selectedDate={formData.startDate}
                        onChange={(d) =>
                          setFormData((p) => ({ ...p, startDate: d }))
                        }
                        placeholder={t.phDateStart}
                      />
                      <CustomDatePicker
                        selectedDate={formData.endDate}
                        onChange={(d) =>
                          setFormData((p) => ({ ...p, endDate: d }))
                        }
                        minDate={formData.startDate || "today"}
                        placeholder={t.phDateEnd}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. ÖZELLİKLER */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                  <CheckCircle2 size={18} className="text-gray-400" />
                  {t.cardFeatures}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors group">
                    <input
                      type="checkbox"
                      name="petFriendly"
                      checked={formData.petFriendly}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">
                      {t.checkPet}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group">
                    <input
                      type="checkbox"
                      name="internationalHouse"
                      checked={formData.internationalHouse}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                      {t.checkIntl}
                    </span>
                  </label>

                  <div className="text-xs text-gray-400 p-2 bg-gray-50 rounded-lg">
                    {t.noteNationality} <br />
                    <span className="font-bold text-gray-600">
                      ({user?.nationality || "Bilinmiyor"})
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.btnSubmitting : t.btnSubmit}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddPropertyPage;
