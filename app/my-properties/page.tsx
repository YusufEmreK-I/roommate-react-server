"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Bileşenler & Servisler
import PropertyCard from "../../components/properties/PropertyCard";
import EmptyState from "../../components/Common/EmptyState";
import {
  getMyPropertiesApi,
  PropertyModel,
} from "../../services/propertyService";
import { useAuth } from "../context/AuthContext";

const MyPropertiesPage = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // 1. Auth Kontrolü
    if (!authLoading && !user) return router.push("/login");

    // 2. Veri Çekme (Sadece user varsa)
    if (user) {
      getMyPropertiesApi()
        .then(setProperties)
        .catch(() => toast.error("İlanlar yüklenirken hata oluştu."))
        .finally(() => setDataLoading(false));
    }
  }, [user, authLoading, router]);

  // Yükleniyor Ekranı (Hem Auth hem Data için ortak)
  if (authLoading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  // Silme Fonksiyonu
  const handleDelete = (uuid: string) => {
    if (confirm("Bu ilanı silmek istediğinize emin misiniz?")) {
      console.log("Silinecek:", uuid);
      toast.success("Silme işlemi yakında aktif olacak.");
    }
  };

  return (
    // 👇 'bg-gray-50' ile siyah ekran sorununu çözdük
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* --- BAŞLIK ALANI --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              İlanlarım
            </h1>
            <p className="text-gray-500 font-medium">
              Yönetmek istediğiniz ilanlarınız.
            </p>
          </div>
          <Link
            href="/addProperty"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all hover:-translate-y-1"
          >
            <Plus size={20} /> Yeni İlan
          </Link>
        </div>

        {/* --- İÇERİK --- */}
        {properties.length === 0 ? (
          <EmptyState
            title="Henüz ilanınız yok"
            description="Ev arkadaşı aramaya başlamak için hemen ilk ilanınızı oluşturun."
            actionLabel="Hemen İlan Oluştur"
            actionHref="/addProperty"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {properties.map((property) => (
              <PropertyCard
                key={property.uuid}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyPropertiesPage;
