"use client";
import React, { useId } from "react"; // 1. useId EKLENDİ
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tr } from "date-fns/locale/tr";
import { Calendar } from "lucide-react";

registerLocale("tr", tr);

interface CustomDatePickerProps {
  selectedDate: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  minDate?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onChange,
  placeholder = "Tarih Seçiniz",
  minDate,
}) => {
  // 2. Rastgele sayı yerine React'in güvenli ID üreticisini kullanıyoruz
  const uniqueId = useId();

  const dateValue = selectedDate ? new Date(selectedDate) : null;
  const minDateValue =
    minDate === "today" ? new Date() : minDate ? new Date(minDate) : undefined;

  return (
    <div className="relative w-full">
      <DatePicker
        selected={dateValue}
        onChange={(date: Date | null) => {
          if (date) {
            const dateString = date.toLocaleDateString("en-CA");
            onChange(dateString);
          } else {
            onChange("");
          }
        }}
        dateFormat="dd/MM/yyyy"
        locale="tr"
        placeholderText={placeholder}
        minDate={minDateValue}
        // --- SAFARI AYARLARI ---
        autoComplete="off"
        // 3. Math.random() yerine uniqueId değişkenini veriyoruz
        id={uniqueId}
        name={uniqueId} // Name alanına da verebiliriz
        className="w-full p-3 pl-4 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
        wrapperClassName="w-full"
        onKeyDown={(e) => e.preventDefault()}
      />

      <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
        <Calendar size={18} />
      </div>
    </div>
  );
};

export default CustomDatePicker;
