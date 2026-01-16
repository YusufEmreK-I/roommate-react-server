import axios from "axios";

// API URL tanımlaması
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/roommate";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------------------------------------------
// 1. REQUEST INTERCEPTOR (Giden isteğe Token ekler)
// -------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // Sadece tarayıcı tarafındaysak token'a bak (Next.js SSR hatasını önler)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------
// 2. RESPONSE INTERCEPTOR (Gelen cevabı kontrol eder) - YENİ KISIM!
// -------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    // Cevap başarılıysa (200, 201 vs.) aynen devam et
    return response;
  },
  (error) => {
    // Eğer hata varsa buraya düşer
    if (error.response && error.response.status === 401) {
      // Backend '401 Unauthorized' döndü. Demek ki Token geçersiz veya süresi dolmuş.

      // Sadece tarayıcı tarafındaysak işlem yap
      if (typeof window !== "undefined") {
        // 1. Ölü Token'ı temizle
        localStorage.removeItem("token");

        // 2. Kullanıcıya haber ver (alert yerine toast kütüphanesi daha şık olur ama bu çalışır)
        // Sonsuz döngüye girmemesi için login sayfasında değilsek uyarı verelim
        if (!window.location.pathname.includes("/auth/login")) {
          alert("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
          // 3. Login sayfasına yönlendir
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- API FONKSİYONLARI ---

export const loginApi = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerApi = async (
  firstName: string,
  lastName: string,
  email: string,
  nationality: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
    nationality,
    password,
  });
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export default api;
