"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  ChevronDown,
  // 'Home' ikonunu sildik çünkü kullanmıyoruz ve uyarı veriyordu.
} from "lucide-react";

const TopNav = () => {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    router.push("/login");
  };

  // ✅ İSİM GÖSTERME MANTIĞI BURADA
  // Eğer firstName varsa onu göster, yoksa email'i, o da yoksa "Misafir" yaz.
  const getDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.email || "Misafir";
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm h-16 md:h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-orange-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-xl">R</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-gray-800 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
              RoomMate
            </span>
            <span className="text-[10px] font-bold text-orange-400 tracking-widest">
              FIND YOUR HOME
            </span>
          </div>
        </Link>

        {/* MASAÜSTÜ MENÜ (SAĞ) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/addProperty"
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold transition-colors text-sm"
          >
            <PlusCircle size={18} />
            İlan Ver
          </Link>

          {isLoggedIn ? (
            // --- GİRİŞ YAPMIŞ KULLANICI ---
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-all group"
              >
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>

                {/* 👇 İŞTE DÜZELTTİĞİMİZ KISIM BURASI 👇 */}
                <span className="font-bold text-gray-700 text-sm group-hover:text-orange-700">
                  {getDisplayName()}
                </span>

                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* DROPDOWN MENÜ */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Hesabım
                    </p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    href="/my-properties"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    İlanlarım
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            // --- MİSAFİR KULLANICI ---
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 text-sm"
              >
                Giriş Yap
              </Link>
            </div>
          )}
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBİL MENÜ İÇERİĞİ */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  {/* MOBİLDE DE İSMİ DÜZELTTİK */}
                  <p className="font-bold text-gray-800">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Link
                href="/my-properties"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
              >
                <LayoutDashboard size={20} /> İlanlarım
              </Link>
              <Link
                href="/addProperty"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
              >
                <PlusCircle size={20} /> İlan Ver
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium"
              >
                <LogOut size={20} /> Çıkış Yap
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl text-center"
              >
                Giriş Yap
              </Link>
              <Link
                href="/login?tab=signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-center"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default TopNav;
