/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "../../i18n"; // i18n import

// Servis ve Modeller
import {
  getPropertyApi,
  PropertyModel,
} from "../../../services/propertyService";

// URL oluşturucu fonksiyon
import { getPhotoUrl } from "../../../services/apiConfig";

// İkonlar
import {
  MapPin,
  User,
  Calendar,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowLeft,
  Globe, // Dil butonu için eklendi
} from "lucide-react";

// i18n Hook
import { useTranslation } from "react-i18next";

// --- SABİT DEĞİŞKENLER ---
const DEFAULT_PLACEHOLDER =
  "https://placehold.co/600x400/orange/white?text=RoomMate+No+Image";
const LOCAL_PLACEHOLDER = "/placeholder-house.jpg";

const PropertyDetailsPage = () => {
  const params = useParams();
  const { t, i18n } = useTranslation(); // Hook kullanımı

  const uuid = (params?.id || params?.uuid) as string;

  // --- STATE ---
  const [property, setProperty] = useState<PropertyModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Dil Değiştirme Fonksiyonu
  const toggleLanguage = () => {
    const newLang = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(newLang);
  };

  // 1. VERİ ÇEKME
  useEffect(() => {
    if (!uuid) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getPropertyApi(uuid);
        if (data) {
          setProperty(data);
        } else {
          setError(t("adNotFound")); // Çeviri anahtarı
        }
      } catch (err) {
        console.error("Detay sayfası hatası:", err);
        setError(t("fetchError")); // Çeviri anahtarı
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    // Dil değiştiğinde hata mesajlarını güncellemek için t'yi dependency'e ekleyebiliriz
    // ancak fetch tekrar çalışmasın diye sadece mount'ta çalıştırıyoruz.
    // Dinamik hata mesajları için UI render kısmında t() kullanmak daha sağlıklıdır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  // 2. SCROLL LOCK YÖNETİMİ
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  // --- RESİM URL YÖNETİMİ ---
  const photos =
    property?.photoUrls && property.photoUrls.length > 0
      ? property.photoUrls
      : ["placeholder"];

  const getImageUrlByIndex = (index: number) => {
    if (photos[0] === "placeholder") return LOCAL_PLACEHOLDER;
    return getPhotoUrl(photos[index]);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    if (target.src.includes("placehold.co")) return;

    if (target.src.includes(LOCAL_PLACEHOLDER)) {
      target.src = DEFAULT_PLACEHOLDER;
    } else {
      target.src = LOCAL_PLACEHOLDER;
    }
  };

  // --- GALERİ KONTROLLERİ ---
  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNextPhoto = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentPhotoIndex((prev) =>
        prev === photos.length - 1 ? 0 : prev + 1
      );
    },
    [photos.length]
  );

  const handlePrevPhoto = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? photos.length - 1 : prev - 1
      );
    },
    [photos.length]
  );

  // Klavye olayları
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNextPhoto, handlePrevPhoto]);

  // --- YÜKLENİYOR DURUMU ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span className="text-gray-500 font-medium animate-pulse">
            {t("loadingDetails")}
          </span>
        </div>
      </div>
    );
  }

  // --- HATA DURUMU ---
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col relative">
        {/* Dil Butonu */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Globe size={14} className="text-orange-500" />
            {i18n.language === "tr" ? "English" : "Türkçe"}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-gray-600 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-gray-800">
              {t("errorTitle")} 😔
            </h2>
            <p className="mb-6 text-lg">{error || t("defaultError")}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1"
            >
              <ArrowLeft size={20} /> {t("backHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasMultiplePhotos = photos.length > 1;
  const sidePhotoIndices = photos.slice(1, 5).map((_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      {/* Dil Butonu (TopNav olmadığı için) */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-gray-200 text-sm font-bold text-gray-700 hover:bg-white transition-all"
        >
          <Globe size={14} className="text-orange-500" />
          {i18n.language === "tr" ? "English" : "Türkçe"}
        </button>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
        {/* GERİ BUTONU */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> {t("backToList")}
        </Link>

        {/* BAŞLIK VE KONUM */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-500 font-medium">
            <MapPin size={18} className="mr-2 text-orange-600" />
            <span>
              {property.city}, {property.country}
            </span>
          </div>
        </div>

        {/* --- GALERİ GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[300px] md:h-[450px] mb-10 rounded-2xl overflow-hidden relative shadow-sm">
          {/* ANA RESİM */}
          <div
            onClick={() => openLightbox(0)}
            className={`relative h-full bg-gray-100 cursor-pointer group overflow-hidden ${
              hasMultiplePhotos
                ? "md:col-span-2 md:row-span-2"
                : "md:col-span-4 md:row-span-2"
            }`}
          >
            <img
              src={getImageUrlByIndex(0)}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Maximize2
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md transform scale-75 group-hover:scale-100 duration-300"
                size={48}
              />
            </div>
          </div>

          {/* YAN RESİMLER */}
          {hasMultiplePhotos &&
            sidePhotoIndices.map((photoIndex) => (
              <div
                key={photoIndex}
                onClick={() => openLightbox(photoIndex)}
                className="relative bg-gray-100 hidden md:block cursor-pointer group overflow-hidden"
              >
                <img
                  src={getImageUrlByIndex(photoIndex)}
                  alt={`Görsel ${photoIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>
            ))}

          {photos.length > 5 && (
            <button
              onClick={() => openLightbox(4)}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg font-bold text-sm shadow-lg backdrop-blur-sm transition-all hidden md:block"
            >
              {t("viewAllPhotos")} ({photos.length})
            </button>
          )}
        </div>

        {/* --- DETAYLAR VE FİYAT KARTI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* SOL TARAF: DETAYLAR */}
          <div className="lg:col-span-2 space-y-10">
            {/* Ev Sahibi Bilgisi */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {t("host")}: {property.ownerNationality || t("hidden")}
                  <CheckCircle
                    size={16}
                    className="text-white bg-blue-500 rounded-full"
                  />
                </h3>
                <p className="text-gray-500 mt-1">
                  {property.roomCount || "1"} {t("room")} •{" "}
                  <span className="text-orange-600 font-medium">
                    {property.availableFrom}
                  </span>{" "}
                  {t("availableFromDate")}
                </p>
              </div>
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <User size={28} />
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t("aboutHouse")}
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {property.description || t("noDescription")}
              </p>
            </div>

            {/* İmkanlar */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-5">
                {t("amenitiesTitle")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.petFriendly && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl text-green-800">
                    <CheckCircle size={20} />{" "}
                    <span className="font-medium">{t("petFriendly")}</span>
                  </div>
                )}
                {property.internationalHouse && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-800">
                    <CheckCircle size={20} />{" "}
                    <span className="font-medium">
                      {t("internationalEnvironment")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-700">
                  <CheckCircle size={20} className="text-gray-400" />{" "}
                  {t("wifi")}
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-700">
                  <CheckCircle size={20} className="text-gray-400" />{" "}
                  {t("kitchen")}
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-700">
                  <CheckCircle size={20} className="text-gray-400" />{" "}
                  {t("washingMachine")}
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ TARAF: FİYAT KARTI */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-50">
                <div>
                  <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {property.price} €
                  </span>
                  <span className="text-gray-500 font-medium">
                    {" "}
                    / {t("perMonth")}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Calendar size={20} className="text-orange-500" />
                  <span className="font-medium text-sm">
                    {t("availability")}: {property.availableFrom}
                  </span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-200 active:scale-95 text-lg">
                {t("contactBtn")}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">{t("noCreditCard")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- LIGHTBOX MODAL --- */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
            >
              <X size={32} />
            </button>

            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50 hover:scale-110"
            >
              <ChevronLeft size={40} />
            </button>

            <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
              <img
                src={getImageUrlByIndex(currentPhotoIndex)}
                alt={`Galeri Görünümü ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded shadow-2xl select-none"
                onClick={(e) => e.stopPropagation()}
                onError={handleImageError}
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </div>

            <button
              onClick={handleNextPhoto}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50 hover:scale-110"
            >
              <ChevronRight size={40} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertyDetailsPage;
