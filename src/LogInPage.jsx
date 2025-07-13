import React from "react";
import logo from "./images/logoT.png";
import { ChevronRight, LogIn } from "lucide-react";
import { signIn } from "./googleSheetApi";

function LogInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 max-w-4xl w-full">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-b from-white from-30% to-[#a1c4bc] rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <img
            src={logo}
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-md"
          />
        </div>

        <div className="space-y-4 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
            مرحباً بك في نظام محضرة الشيخ باسعيد وعلي
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            يرجى تسجيل الدخول للوصول إلى جميع الخدمات والمميزات المتاحة
          </p>
        </div>

        {/* Centered Button */}
        <div className="flex justify-center w-full pt-4">
          <button
            onClick={() => signIn()}
            className="group bg-gradient-to-r from-[#b8ac8c] to-[#1b9174] text-white font-bold 
                   py-3 px-6 sm:py-4 sm:px-8 
                   rounded-2xl hover:shadow-2xl 
                   transition-all duration-300 transform hover:scale-105 
                   flex items-center justify-center gap-3 
                   text-base sm:text-lg
                   w-full max-w-xs sm:max-w-sm
                   touch-manipulation"
          >
            <LogIn
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300 sm:w-6 sm:h-6"
            />
            <span className="flex-1 text-center">تسجيل الدخول</span>
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300 sm:w-5 sm:h-5"
            />
          </button>
        </div>
      </div>

      {/* Decorative elements - Hidden on mobile for cleaner look */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none sm:block">
        <div className="absolute max-sm:top-20 max-sm:right-10 top-20 max-sm:w-10 max-sm:h-10 right-20 w-20 h-20 bg-[#b8ac8c] opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute max-sm:bottom-40 bottom-32 left-32 w-16 h-16 bg-[#1b9174] opacity-10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute max-sm:top-45 max-sm:left-10 top-1/2 left-20 w-12 h-12 bg-[#b8ac8c] opacity-10 rounded-full animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}

export default LogInPage;
