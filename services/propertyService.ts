import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Base URL
const API_URL = `${API_BASE_URL}/properties`;

// --- YARDIMCI: TOKEN ALICI ---
// Bu fonksiyon LocalStorage'dan bileti alır ve Header formatına sokar.
const getAuthHeaders = () => {
  // DİKKAT: Login olurken token'ı "token" adıyla kaydettiğini varsayıyoruz.
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Uyarı: Token bulunamadı! İşlem 401 hatası alabilir.");
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// --- TİP TANIMLARI ---
export interface PropertyModel {
  uuid: string;
  title: string;
  price: number;
  country: string;
  city: string;
  address?: string;
  roomCount?: number;
  ownerNationality?: string;
  petFriendly?: boolean;
  internationalHouse?: boolean;
  description?: string;
  availableFrom?: string;
  availableTo?: string;
  coverPhotoUrl?: string;
  photoUrls?: string[];
}

export interface CreatePropertyModel {
  title: string;
  description: string;
  price: number;
  country: string;
  city: string;
  address: string;
  roomCount: number;
  ownerNationality: string;
  petFriendly: boolean;
  internationalHouse: boolean;
  availableFrom: string;
  availableTo: string;
}

export interface SearchCriteria {
  country?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
}

// --- API FONKSİYONLARI ---

// 1. Yeni İlan Oluştur (TOKEN GEREKLİ 🔒)
export const createPropertyApi = async (data: CreatePropertyModel) => {
  const response = await axios.post(API_URL, data, {
    headers: getAuthHeaders(), // <--- ANAHTARI BURADA VERİYORUZ
  });
  return response.data;
};

// 2. İlan Arama (Token Genelde Gerekmez ama backend ayarına bağlı)
export const searchPropertiesApi = async (criteria: SearchCriteria) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: criteria,
    // Arama herkese açıksa header eklemeye gerek yok.
    // Kapalıysa buraya da: headers: getAuthHeaders() ekle.
  });
  return response.data;
};

// 3. Fotoğraf Yükleme (TOKEN GEREKLİ 🔒)
export const uploadPhotosApi = async (propertyUuid: string, photos: File[]) => {
  const formData = new FormData();
  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  const response = await axios.post(
    `${API_URL}/${propertyUuid}/photos`,
    formData,
    {
      headers: {
        // ❌ SİLİNDİ: "Content-Type": "multipart/form-data"
        // ✅ NEDEN? Axios, FormData'yı görünce doğru Content-Type ve Boundary'i kendi ekler.
        // Elle eklersek boundary silinir ve backend hata verir.
        ...getAuthHeaders(),
      },
    }
  );
  return response.data;
};

// 4. Tekil İlan Getir
export const getPropertyApi = async (uuid: string) => {
  const response = await axios.get(`${API_URL}/${uuid}`);
  return response.data;
};

// 5. Kullanıcının Kendi İlanları (TOKEN GEREKLİ 🔒)
export const getMyPropertiesApi = async () => {
  const response = await axios.get(API_URL + "/my", {
    headers: getAuthHeaders(), // <--- ANAHTARI BURADA VERİYORUZ
  });
  return response.data;
};
