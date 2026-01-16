"use client";
import React, { useState } from "react";
// Servisimizi import ediyoruz
import {
  searchPropertiesApi,
  PropertyModel,
} from "../../services/propertyService";

export default function TestSearchPage() {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleTestSearch = async () => {
    setIsLoading(true);
    setError("");
    setProperties([]);
    setHasSearched(false);

    try {
      // Backend'e test verisi gönderiyoruz: Turkey, Ankara
      const data = await searchPropertiesApi({
        country: "Turkey",
        city: "Ankara",
        startDate: "2025-06-01",
      });

      setProperties(data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError("Veri çekilemedi. Backend (Quarkus) çalışıyor mu?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 container mx-auto bg-white min-h-screen text-gray-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4 text-gray-900">
        Görev: API Test Sayfası
      </h1>

      <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">Test Senaryosu</h3>
        <p className="text-blue-700 mb-4 text-sm">
          {/* DÜZELTME 1: Backend'e yerine Backend&apos;e yazdık */}
          Butona bastığında sistem Backend&apos;e bağlanacak ve{" "}
          <b>Turkey/Ankara</b> sorgusu atacak.
        </p>

        <button
          onClick={handleTestSearch}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Yükleniyor...
            </>
          ) : (
            // DÜZELTME 2: Backend'i yerine Backend&apos;i yazdık
            <span>Backend&apos;i Test Et</span>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200 font-medium">
            {error}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase">
                Başlık
              </th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase">
                Fiyat
              </th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase">
                Konum
              </th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase">
                Tarih
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500">
                  {hasSearched ? (
                    <span className="flex flex-col items-center gap-2">
                      ❌ Kayıt bulunamadı. DBeaver&apos;dan veriyi kontrol et.
                    </span>
                  ) : (
                    "Henüz sorgu yapılmadı. Butona basın."
                  )}
                </td>
              </tr>
            ) : (
              properties.map((item) => (
                <tr
                  key={item.uuid}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="py-4 px-6 text-green-600 font-bold">
                    {item.price} TL
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {item.city}, {item.country}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {item.availableFrom}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
