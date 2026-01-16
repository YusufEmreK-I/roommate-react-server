import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Gerçek bir uygulamada, burada veritabanı sorgusu veya 
    // kimlik doğrulama işlemi yapılırdı.
    if (email === 'test@example.com' && password === 'password123') {
      return NextResponse.json({ success: true, message: 'Giriş başarılı!' });
    } else {
      return NextResponse.json({ success: false, message: 'Geçersiz e-posta veya şifre.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Bir hata oluştu.' }, { status: 500 });
  }
}