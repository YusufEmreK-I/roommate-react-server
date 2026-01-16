// Backend URL'i
const API_BASE_URL = "http://localhost:8081/roommate/locations";

// Backend'den gelen veri tipleri (Entity'lerin aynası)
export interface Country {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
}

export interface City {
  id: number;
  name: string;
  countryId: number;
}

// --- API FONKSİYONLARI ---

// 1. Tüm Ülkeleri Getir
export const getCountriesApi = async (): Promise<Country[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Ülkeler çekilemedi");
    return await response.json();
  } catch (error) {
    console.error("Location Service Error:", error);
    return [];
  }
};

// 2. Seçilen Ülkenin Şehirlerini Getir
export const getCitiesApi = async (countryId: number): Promise<City[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/${countryId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Şehirler çekilemedi");
    return await response.json();
  } catch (error) {
    console.error("Location Service Error:", error);
    return [];
  }
};
