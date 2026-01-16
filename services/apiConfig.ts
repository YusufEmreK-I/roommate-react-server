// Ortam değişkeninden (ENV) oku, yoksa varsayılanı kullan
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/roommate";

// Bu fonksiyon, Backend'den gelen UUID'yi alıp tam resim linkine çevirecek
export const getPhotoUrl = (photoUuid: string) => {
  if (!photoUuid) return "/placeholder-house.jpg";

  // Eğer veri zaten http ile başlıyorsa (eski veri kalıntısı) bozma, aynen dön
  if (photoUuid.startsWith("http")) return photoUuid;

  // Yeni yapı: BaseURL + /photos/ + uuid
  return `${API_BASE_URL}/photos/${photoUuid}`;
};
