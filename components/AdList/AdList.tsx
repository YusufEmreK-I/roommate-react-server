/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { PropertyModel } from "../../services/propertyService";
import { getPhotoUrl } from "../../services/apiConfig";

// --- DEĞİŞİKLİK BURADA ---
// Artık internet linki değil, projenin içindeki dosya yolunu veriyoruz.
// Next.js'te public klasöründeki dosyalar "/" ile başlar.
const DEFAULT_PLACEHOLDER = "/placeholder-house.svg";

interface AdListProps {
  properties: PropertyModel[];
}

const AdList = ({ properties }: AdListProps) => {
  // --- Hata Yönetimi ---
  // Sonsuz döngü koruması hala gerekli (eğer yerel dosyayı yanlış isimlendirirsen döngüye girmesin diye)
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;

    // Eğer yüklenemeyen resim zaten bizim yerel resmimizse dur.
    // (Dosya isminin url içinde geçip geçmediğine bakıyoruz)
    if (target.src.includes("placeholder-house.svg")) {
      return;
    }

    target.src = DEFAULT_PLACEHOLDER;
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <MapPin size={40} className="text-orange-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Sonuç Bulunamadı
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Aradığınız kriterlere uygun ilan şu an sistemde kayıtlı değil.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {properties.map((property) => (
          <Link
            href={`/properties/${property.uuid}`}
            key={property.uuid}
            className="group block"
          >
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <img
                  src={
                    property.coverPhotoUrl
                      ? getPhotoUrl(property.coverPhotoUrl)
                      : property.photoUrls && property.photoUrls.length > 0
                      ? getPhotoUrl(property.photoUrls[0])
                      : DEFAULT_PLACEHOLDER // <-- Yerel dosya yolunu kullanır
                  }
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={handleImageError}
                />

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/50">
                  <span className="text-gray-900 font-bold text-lg">
                    {property.price} ₺
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                  <MapPin size={12} /> {property.country}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-1">
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} className="text-orange-500" />
                    <span className="truncate">{property.city}</span>
                  </p>
                </div>
                <div className="border-t border-gray-100 my-4"></div>
                <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-xs font-medium">
                      {property.availableFrom}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 font-medium text-xs group-hover:underline">
                    Detaylar <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdList;
