import React, { useState } from "react";
import { User, Menu, X, Search, Bell, Settings, LogIn, ChevronRight } from "lucide-react";
import logo from "./images/logo.png";
import { useAuth } from "./AuthContext";
import { isSignedIn } from "./googleSheetApi";
const MahdaraNavbar = ({ setCurrentPage, currentPageFace }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();
  return (
    <header
      dir="rtl"
      className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="شعار المحضرة"
              className="w-10 h-10 rounded-xl object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">
                محضرة الشيخ باسعيد وعلي
              </h1>
              <p className="text-xs text-gray-500">نظام إدارة مساندي المحضرة</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <span
              onClick={() => setCurrentPage("home")}
              className={`cursor-pointer text-gray-700 hover:text-[#1b9174] transition-colors font-medium ${
                currentPageFace === "home"
                  ? "relative text-[#1b9174] after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-100 after:bg-[#1b9174] after:rounded-full after:shadow-[0_0_8px_#1b9174] after:transition-transform after:duration-300"
                  : "after:scale-x-0 after:transition-transform after:duration-300 relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[3px] after:bg-[#1b9174] after:origin-left after:rounded-full after:shadow-[0_0_8px_#1b9174]"
              }`}
            >
              الرئيسية
            </span>

            <span
              onClick={() => {
                setCurrentPage("student"), console.log(currentPageFace);
              }}
              className={`cursor-pointer text-gray-700 hover:text-[#1b9174] transition-colors font-medium ${
                currentPageFace === "student"
                  ? "relative text-[#1b9174] after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-100 after:bg-[#1b9174] after:rounded-full after:shadow-[0_0_8px_#1b9174] after:transition-transform after:duration-300"
                  : "after:scale-x-0 after:transition-transform after:duration-300 relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[3px] after:bg-[#1b9174] after:origin-left after:rounded-full after:shadow-[0_0_8px_#1b9174]"
              }`}
            >
              المستظهرون
            </span>

            <span
              onClick={() => setCurrentPage("supporter")}
              className={`cursor-pointer text-gray-700 hover:text-[#1b9174] transition-colors font-medium ${
                currentPageFace === "supporter"
                  ? "relative text-[#1b9174] after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-100 after:bg-[#1b9174] after:rounded-full after:shadow-[0_0_8px_#1b9174] after:transition-transform after:duration-300"
                  : "after:scale-x-0 after:transition-transform after:duration-300 relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[3px] after:bg-[#1b9174] after:origin-left after:rounded-full after:shadow-[0_0_8px_#1b9174]"
              }`}
            >
              المساندون
            </span>

            <span
              onClick={() => setCurrentPage("report")}
              className={`cursor-pointer text-gray-700 hover:text-[#1b9174] transition-colors font-medium ${
                currentPageFace === "report"
                  ? "relative text-[#1b9174] after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-100 after:bg-[#1b9174] after:rounded-full after:shadow-[0_0_8px_#1b9174] after:transition-transform after:duration-300"
                  : "after:scale-x-0 after:transition-transform after:duration-300 relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[3px] after:bg-[#1b9174] after:origin-left after:rounded-full after:shadow-[0_0_8px_#1b9174]"
              }`}
            >
              التقارير
            </span>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden md:block p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span> */}
            </button>
            <button className="hidden md:block p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={20} />
            </button>

            {/* Profile */}
            {user && isSignedIn() ? (
              <div className="hidden sm:flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-r border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-r from-[#1b9174] to-green-600 rounded-full flex items-center justify-center  overflow-hidden">
                  <img
                    src={user.getImageUrl()}
                    alt={user.getName()}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      // Fallback to a default avatar if image fails to load
                      e.target.src =
                        "https://via.placeholder.com/32x32/1b9174/white?text=" +
                        user.getName().charAt(0);
                    }}
                  />
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {" "}
                    {user.getName()}{" "}
                  </p>
                  <p className="text-xs text-gray-500">مدير النظام</p>
                </div>
              </div>
            ) : (
              <button
                  onClick={() => signIn()}
                  className="group bg-white text-[#1b9174] font-bold 
                   py-1 px-2 sm:py-2 sm:px-4 
                   rounded-2xl hover:shadow-2xl 
                   transition-all duration-300 transform hover:scale-105 
                   flex items-center justify-center gap-1 
                   text-base sm:text-sm
                   w-full max-w-xs sm:max-w-sm
                   touch-manipulation border-1 border-[#1b9174]"
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
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl">
          <nav className="px-6 py-6">
            {/* Navigation Items */}
            <div className="space-y-1 mb-6">
              <div
                onClick={() => {
                  setCurrentPage("home");
                  setIsMenuOpen(false);
                }}
                className={`group cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPageFace === "home"
                    ? "bg-gradient-to-r from-[#1b9174]/10 to-green-50 text-[#1b9174] shadow-sm border-l-4 border-[#1b9174]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#1b9174] hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentPageFace === "home"
                      ? "bg-[#1b9174] shadow-lg shadow-[#1b9174]/30"
                      : "bg-gray-100 group-hover:bg-[#1b9174]/10"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      currentPageFace === "home"
                        ? "text-white"
                        : "text-gray-600 group-hover:text-[#1b9174]"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-base">الرئيسية</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    الصفحة الرئيسية
                  </p>
                </div>
                {currentPageFace === "home" && (
                  <div className="w-2 h-2 bg-[#1b9174] rounded-full animate-pulse"></div>
                )}
              </div>

              <div
                onClick={() => {
                  setCurrentPage("student");
                  setIsMenuOpen(false);
                }}
                className={`group cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPageFace === "student"
                    ? "bg-gradient-to-r from-[#1b9174]/10 to-green-50 text-[#1b9174] shadow-sm border-l-4 border-[#1b9174]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#1b9174] hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentPageFace === "student"
                      ? "bg-[#1b9174] shadow-lg shadow-[#1b9174]/30"
                      : "bg-gray-100 group-hover:bg-[#1b9174]/10"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      currentPageFace === "student"
                        ? "text-white"
                        : "text-gray-600 group-hover:text-[#1b9174]"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-base">المستظهرون</span>
                  <p className="text-xs text-gray-500 mt-0.5">إدارة الطلاب</p>
                </div>
                {currentPageFace === "student" && (
                  <div className="w-2 h-2 bg-[#1b9174] rounded-full animate-pulse"></div>
                )}
              </div>

              <div
                onClick={() => {
                  setCurrentPage("supporter");
                  setIsMenuOpen(false);
                }}
                className={`group cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPageFace === "supporter"
                    ? "bg-gradient-to-r from-[#1b9174]/10 to-green-50 text-[#1b9174] shadow-sm border-l-4 border-[#1b9174]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#1b9174] hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentPageFace === "supporter"
                      ? "bg-[#1b9174] shadow-lg shadow-[#1b9174]/30"
                      : "bg-gray-100 group-hover:bg-[#1b9174]/10"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      currentPageFace === "supporter"
                        ? "text-white"
                        : "text-gray-600 group-hover:text-[#1b9174]"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-base">المساندون</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    المساعدون والدعم
                  </p>
                </div>
                {currentPageFace === "supporter" && (
                  <div className="w-2 h-2 bg-[#1b9174] rounded-full animate-pulse"></div>
                )}
              </div>

              <div
                onClick={() => setCurrentPage("report")}
                className={`group cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPageFace === "report"
                    ? "bg-gradient-to-r from-[#1b9174]/10 to-green-50 text-[#1b9174] shadow-sm border-l-4 border-[#1b9174]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#1b9174] hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentPageFace === "report"
                      ? "bg-[#1b9174] shadow-lg shadow-[#1b9174]/30"
                      : "bg-gray-100 group-hover:bg-[#1b9174]/10"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      currentPageFace === "report"
                        ? "text-white"
                        : "text-gray-600 group-hover:text-[#1b9174]"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-base">التقارير</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    التقارير والإحصائيات
                  </p>
                </div>
                {currentPageFace === "report" && (
                  <div className="w-2 h-2 bg-[#1b9174] rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

            {/* User Profile Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 mb-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1b9174] to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#1b9174] to-green-600 rounded-full flex items-center justify-center  overflow-hidden">
                  <img
                    src={user.getImageUrl()}
                    alt={user.getName()}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      // Fallback to a default avatar if image fails to load
                      e.target.src =
                        "https://via.placeholder.com/32x32/1b9174/white?text=" +
                        user.getName().charAt(0);
                    }}
                  />
                </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                  {user.getName()}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    مدير النظام - متصل
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#1b9174] hover:bg-gray-50 rounded-xl transition-all duration-300 group">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#1b9174]/10 rounded-lg flex items-center justify-center transition-all duration-300">
                  <Search
                    className="group-hover:text-[#1b9174] text-gray-600"
                    size={16}
                  />
                </div>
                <span className="font-medium">البحث</span>
                <div className="mr-auto text-gray-400 group-hover:text-[#1b9174] transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#1b9174] hover:bg-gray-50 rounded-xl transition-all duration-300 group">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#1b9174]/10 rounded-lg flex items-center justify-center transition-all duration-300">
                  <Settings
                    className="group-hover:text-[#1b9174] text-gray-600"
                    size={16}
                  />
                </div>
                <span className="font-medium">الإعدادات</span>
                <div className="mr-auto text-gray-400 group-hover:text-[#1b9174] transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MahdaraNavbar;
