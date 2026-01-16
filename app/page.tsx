"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "./i18n"; // i18n konfigürasyon dosyanızın import edildiğinden emin olun

// --- BİLEŞENLER ---
import AdList from "../components/AdList/AdList";
import CustomDatePicker from "../components/Common/CustomDatePicker";

// --- İKONLAR ---
import {
  ChevronDown,
  Globe,
  MapPin,
  Search,
  Users,
  Globe2,
  Sparkles,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";

// --- SERVİSLER ---
import {
  searchPropertiesApi,
  PropertyModel,
} from "../services/propertyService";
import {
  getCountriesApi,
  getCitiesApi,
  Country,
  City,
} from "../services/locationService";

// --- CONTEXT ---
import { useAuth } from "./context/AuthContext";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const router = useRouter();

  // ✅ i18n Hook: t fonksiyonu ve i18n objesi (dil değiştirmek için)
  const { t, i18n } = useTranslation();

  // ✅ AUTH CONTEXT
  const { isLoggedIn, user } = useAuth();
  const userNationality = user?.nationality;

  // --- STATE ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [searchResults, setSearchResults] = useState<PropertyModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [activeTab, setActiveTab] = useState("standard");
  const [smartSelection, setSmartSelection] = useState<
    "national" | "international" | null
  >(null);

  // 1. Ülkeleri Çek
  useEffect(() => {
    const init = async () => {
      const countryData = await getCountriesApi();
      setCountries(countryData);
    };
    init();
  }, []);

  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const countryId = e.target.value;
    setSelectedCountryId(countryId);
    setSelectedCityName("");
    setCities([]);
    if (countryId) {
      const cityData = await getCitiesApi(Number(countryId));
      setCities(cityData);
    }
  };

  // ✅ Dil Değiştirme Fonksiyonu (i18n üzerinden)
  const toggleLanguage = () => {
    const newLang = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(newLang);
  };

  // --- STANDART ARAMA ---
  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(false);
    const selectedCountryObj = countries.find(
      (c) => c.id === Number(selectedCountryId)
    );
    const searchCriteria = {
      country: selectedCountryObj?.name,
      city: selectedCityName,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const data = await searchPropertiesApi(searchCriteria);
      setSearchResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
      toast.error(t("searchError")); // "Arama yapılamadı" yerine
    } finally {
      setIsLoading(false);
    }
  };

  // --- SMART ARAMA ---
  const handleSmartSearch = async () => {
    if (!isLoggedIn) return;
    if (!smartSelection) return;

    setIsLoading(true);
    setHasSearched(false);

    try {
      const allProperties = await searchPropertiesApi({});
      let filteredData = allProperties;

      if (smartSelection === "international") {
        filteredData = allProperties.filter(
          (p: PropertyModel) => p.internationalHouse === true
        );
      } else if (smartSelection === "national") {
        if (!userNationality) {
          toast.error(t("nationalityMissing"));
          setIsLoading(false);
          return;
        }
        filteredData = allProperties.filter(
          (p: PropertyModel) => p.ownerNationality === userNationality
        );
      }

      setSearchResults(filteredData);
      setHasSearched(true);

      if (filteredData.length === 0) {
        toast(t("noResultsFound"), { icon: "ℹ️" });
      }
    } catch (error) {
      console.error(error);
      toast.error(t("smartSearchError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <Toaster position="top-center" />

      {/* Dil Butonu */}
      <div className="absolute top-20 right-4 z-50 md:right-8 md:top-24">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Globe size={14} className="text-orange-500" />
          {i18n.language === "tr" ? "English" : "Türkçe"}
        </button>
      </div>

      <main className="flex-grow container mx-auto p-4 md:p-8 relative">
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row items-center justify-between text-center md:text-left pt-12 pb-8">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight tracking-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg text-gray-500 font-medium">
              {t("heroDesc")}
            </p>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 relative h-[300px] md:h-[400px] w-full max-w-[650px]">
            <Image
              src="/map.png"
              alt="Harita"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl shadow-2xl transform md:rotate-1 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </section>

        {/* --- ARAMA PANELİ --- */}
        <section className="flex flex-col items-center mt-10 relative z-10 px-2">
          <div className="w-full max-w-6xl">
            <div className="p-1 bg-white rounded-[2rem] shadow-xl border border-gray-100">
              <div className="bg-white p-6 md:p-8 rounded-[1.8rem]">
                {/* TABLAR */}
                <div className="flex gap-8 mb-8 border-b border-gray-100 px-2">
                  <button
                    className={`pb-3 text-sm font-bold uppercase tracking-wide transition-all border-b-2 ${
                      activeTab === "standard"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => setActiveTab("standard")}
                  >
                    {t("tabStandard")}
                  </button>
                  <button
                    className={`pb-3 text-sm font-bold uppercase tracking-wide transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === "smart"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => setActiveTab("smart")}
                  >
                    <Sparkles size={16} />
                    {t("tabSmart")}
                    {!isLoggedIn && (
                      <Lock size={14} className="text-orange-400" />
                    )}
                  </button>
                </div>

                {/* --- STANDARD SEARCH --- */}
                {activeTab === "standard" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="lg:col-span-3 group relative">
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-4">
                        {t("labelCountry")}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Globe size={18} />
                        </div>
                        <select
                          value={selectedCountryId}
                          onChange={handleCountryChange}
                          className="w-full pl-11 pr-10 py-4 appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                        >
                          <option value="">{t("select")}</option>
                          {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 group relative">
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-4">
                        {t("labelCity")}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <MapPin size={18} />
                        </div>
                        <select
                          value={selectedCityName}
                          onChange={(e) => setSelectedCityName(e.target.value)}
                          disabled={!selectedCountryId}
                          className="w-full pl-11 pr-10 py-4 appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer disabled:opacity-50"
                        >
                          <option value="">{t("select")}</option>
                          {cities.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4">
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                        {t("labelDate")}
                      </label>
                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <CustomDatePicker
                            selectedDate={startDate}
                            onChange={setStartDate}
                            placeholder={t("checkIn")}
                          />
                        </div>
                        <div className="w-1/2">
                          <CustomDatePicker
                            selectedDate={endDate}
                            onChange={setEndDate}
                            minDate={startDate}
                            placeholder={t("checkOut")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-orange-300 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 h-[56px]"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Search size={20} /> {t("btnSearch")}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* --- SMART SEARCH --- */}
                {activeTab === "smart" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {!isLoggedIn ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                        <div className="bg-orange-100 p-4 rounded-full mb-4">
                          <Lock size={40} className="text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {t("lockTitle")}
                        </h3>
                        <p className="text-gray-500 max-w-md mb-8">
                          {t("lockDesc")}
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => router.push("/login?tab=login")}
                            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                          >
                            <LogIn size={18} /> {t("btnLogin")}
                          </button>
                          <button
                            onClick={() => router.push("/login?tab=signup")}
                            className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors flex items-center gap-2"
                          >
                            <UserPlus size={18} /> {t("btnSignup")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* NATIONAL OPTION */}
                          <div
                            onClick={() => setSmartSelection("national")}
                            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group ${
                              smartSelection === "national"
                                ? "border-orange-500 bg-orange-50 shadow-orange-100 ring-2 ring-orange-200"
                                : "border-gray-100 bg-gray-50 hover:border-orange-200 hover:bg-white"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                smartSelection === "national"
                                  ? "bg-orange-500 text-white"
                                  : "bg-white text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-50"
                              }`}
                            >
                              <Users size={24} />
                            </div>
                            <div>
                              <h3
                                className={`text-lg font-bold mb-1 ${
                                  smartSelection === "national"
                                    ? "text-orange-900"
                                    : "text-gray-800"
                                }`}
                              >
                                {t("smartOptionNational")}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {t("smartDescNational")}
                              </p>
                            </div>
                            {smartSelection === "national" && (
                              <div className="absolute top-4 right-4 text-orange-500">
                                <Sparkles size={20} fill="currentColor" />
                              </div>
                            )}
                          </div>

                          {/* INTERNATIONAL OPTION */}
                          <div
                            onClick={() => setSmartSelection("international")}
                            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group ${
                              smartSelection === "international"
                                ? "border-blue-500 bg-blue-50 shadow-blue-100 ring-2 ring-blue-200"
                                : "border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-white"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                smartSelection === "international"
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50"
                              }`}
                            >
                              <Globe2 size={24} />
                            </div>
                            <div>
                              <h3
                                className={`text-lg font-bold mb-1 ${
                                  smartSelection === "international"
                                    ? "text-blue-900"
                                    : "text-gray-800"
                                }`}
                              >
                                {t("smartOptionInternational")}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {t("smartDescInternational")}
                              </p>
                            </div>
                            {smartSelection === "international" && (
                              <div className="absolute top-4 right-4 text-blue-500">
                                <Sparkles size={20} fill="currentColor" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-center mt-2">
                          <button
                            onClick={handleSmartSearch}
                            disabled={!smartSelection || isLoading}
                            className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center gap-3 ${
                              !smartSelection
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : smartSelection === "national"
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-105"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105"
                            }`}
                          >
                            {isLoading ? (
                              t("searching")
                            ) : (
                              <>
                                {smartSelection === "national" ? (
                                  <Users size={20} />
                                ) : smartSelection === "international" ? (
                                  <Globe2 size={20} />
                                ) : (
                                  <Search size={20} />
                                )}{" "}
                                {smartSelection === "national"
                                  ? t("smartBtnNational")
                                  : smartSelection === "international"
                                  ? t("smartBtnInternational")
                                  : t("btnSearch")}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SONUÇLAR */}
        {hasSearched && (
          <div className="mt-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <AdList properties={searchResults} />
          </div>
        )}
      </main>
      <footer className="p-8 text-center text-gray-400 text-sm border-t bg-white mt-auto">
        {t("footerCopyright")}
      </footer>
    </div>
  );
};

export default HomePage;
