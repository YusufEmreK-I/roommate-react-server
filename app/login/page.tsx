"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Globe,
  Flag,
  ChevronDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import "../i18n"; // i18n dosyanızın yolunu kontrol edin (örn: ../i18n veya ../../i18n)

// --- SERVİSLER ---
import { loginApi, registerApi } from "../../services/authService";
import { getCountriesApi, Country } from "../../services/locationService";

// --- AUTH CONTEXT ---
import { useAuth } from "../context/AuthContext";

// --- i18n ---
import { useTranslation } from "react-i18next";

// --- İÇERİK BİLEŞENİ ---
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // ✅ i18n Hook
  const { t, i18n } = useTranslation();

  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nationality, setNationality] = useState("");

  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "signup" || tabParam === "login") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountriesApi();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  // ✅ Dil Değiştirme (Global i18n üzerinden)
  const toggleLanguage = () => {
    const newLang = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(newLang);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        // --- GİRİŞ YAP ---
        const response = await loginApi(email, password);
        const token = response.token || response.access_token;
        const userData = response.user;

        if (token) {
          login(token, userData);
          toast.success(t("toastLogin"));
          setTimeout(() => router.push("/"), 500);
        } else {
          toast.error(t("loginFail"));
        }
      } else {
        // --- KAYIT OL ---
        const parts = fullName.trim().split(" ");
        const firstName = parts[0] || "User";
        const lastName = parts.slice(1).join(" ") || "";

        await registerApi(firstName, lastName, email, nationality, password);

        toast.success(t("toastSignup"));
        setActiveTab("login");
      }
    } catch (error: unknown) {
      console.error("Auth Error:", error);

      let msg = t("opFailed"); // Varsayılan hata mesajı

      if (error instanceof AxiosError) {
        const data = error.response?.data as { message?: string };
        msg = data?.message || error.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full min-h-[650px] relative">
      {/* SOL TARAF */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 w-5/12 bg-gradient-to-br from-orange-500 to-orange-700 text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center">
          <Link
            href="/"
            className="inline-block mb-8 hover:scale-105 transition-transform"
          >
            <div className="bg-white text-orange-600 p-4 rounded-3xl shadow-lg mb-4 inline-flex items-center justify-center w-24 h-24">
              <span className="text-4xl font-extrabold">R</span>
            </div>
          </Link>
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
            RoomMate
          </h2>
          <p className="text-orange-50 text-lg font-medium leading-relaxed">
            {t("brandSlogan")}
          </p>
        </div>
        <div className="absolute bottom-8 text-orange-100/70 text-sm">
          {t("copyright")}
        </div>
      </div>

      {/* SAĞ TARAF */}
      <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white relative">
        <div className="absolute top-8 right-8 flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
          >
            <Globe size={14} className="text-orange-500" />
            {i18n.language === "tr" ? "ENGLISH" : "TÜRKÇE"}
          </button>
          <Link
            href="/"
            className="text-gray-400 hover:text-orange-600 transition-colors text-sm font-bold flex items-center gap-1"
          >
            {t("backHome")} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex mb-10 bg-gray-100 p-1 rounded-2xl w-fit mx-auto md:mx-0 mt-8 md:mt-0">
          <button
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "login"
                ? "bg-white text-orange-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            {t("tabLogin")}
          </button>
          <button
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "signup"
                ? "bg-white text-orange-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            {t("tabSignup")}
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            {activeTab === "login" ? t("titleLogin") : t("titleSignup")}
          </h1>
          <p className="text-gray-500">
            {activeTab === "login" ? t("descLogin") : t("descSignup")}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {activeTab === "signup" && (
            <>
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                  {t("labelName")}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 rounded-xl outline-none font-medium transition-all"
                    placeholder={t("phName")}
                  />
                </div>
              </div>
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                  {t("labelNationality")}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Flag size={20} />
                  </div>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 rounded-xl outline-none font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="">{t("phNationality")}</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
              {t("labelEmail")}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 rounded-xl outline-none font-medium transition-all"
                placeholder={t("phEmail")}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">
                {t("labelPassword")}
              </label>
              {activeTab === "login" && (
                <a
                  href="#"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  {t("forgotPass")}
                </a>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 rounded-xl outline-none font-medium transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                {showPassword ? t("btnHide") : t("btnShow")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {t("processing")}
              </span>
            ) : activeTab === "login" ? (
              t("btnSubmitLogin")
            ) : (
              t("btnSubmitSignup")
            )}
          </button>
        </form>

        <p className="md:hidden text-center text-gray-400 text-xs mt-8">
          {t("copyright")}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] items-center justify-center p-4 md:p-6">
      <Toaster position="top-center" />
      <Suspense
        fallback={<div className="text-orange-600 font-bold">Loading...</div>}
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
