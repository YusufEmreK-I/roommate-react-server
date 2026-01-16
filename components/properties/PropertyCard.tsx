"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, MapPin } from "lucide-react";
import { PropertyModel } from "../../services/propertyService";
import { getPhotoUrl } from "../../services/apiConfig";

interface PropertyCardProps {
  property: PropertyModel;
  onDelete: (uuid: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDelete }) => {
  const router = useRouter();

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      {/* RESİM ALANI */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            property.coverPhotoUrl
              ? getPhotoUrl(property.coverPhotoUrl)
              : property.photoUrls && property.photoUrls.length > 0
              ? getPhotoUrl(property.photoUrls[0])
              : "/placeholder-house.svg"
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm text-gray-800">
          {property.price} ₺
        </div>
      </div>

      {/* İÇERİK */}
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg mb-1 truncate group-hover:text-green-700 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={14} className="mr-1 text-orange-500" />
          <span className="truncate">
            {property.city}, {property.country}
          </span>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors text-sm border border-blue-100"
            // ⚠️ URL GÜNCELLENDİ: /pages/... yok artık
            onClick={() => router.push(`/properties/${property.uuid}`)}
          >
            <Edit size={16} /> Düzenle
          </button>
          <button
            onClick={() => onDelete(property.uuid)}
            className="flex items-center justify-center w-12 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
            title="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
