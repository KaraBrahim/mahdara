import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Book,
  GraduationCap,
  Award,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  RefreshCw,
  Database,
  UserPlus,
  UsersRound,
  Plus,
  Sparkles,
  Smile,
  LogIn,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import logo from "./images/logoT.png";
import CountUp from "react-countup";
import MahdaraNavbar from "./MahdaraNavbar";
import AddStudentForm from "./Student/AddStudentForm";
import AddSupporterForm from "./Supporter/AddSupporterForm";
import { useAuth } from "./AuthContext";

const MahdaraHomePage = ({
  setNavBarShown,
  navBarShown,
  setCurrentPage,
  currentPageFace,
  networkMode,
}) => {
  const { user, signIn, signOut, isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddSupporterModal, setShowAddSupporterModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [ref, inView] = useInView({
    threshold: 0.5,
  });

  const stats = [
    {
      icon: Users,
      number: "2,845",
      label: "المساندون النشطون",
      color: "text-[#b8ac8c]",
    },
    {
      icon: Book,
      number: "156",
      label: "الفروع المسجلة",
      color: "text-[#b8ac8c]",
    },
    {
      icon: GraduationCap,
      number: "12,340",
      label: "المستظهرون المسجلون",
      color: "text-[#b8ac8c]",
    },
    {
      icon: Award,
      number: "89%",
      label: "معدل النجاح",
      color: "text-[#b8ac8c]",
    },
  ];

  const recentUpdates = [
    {
      name: "سفيان الشيهاني",
      photo: "",
      branchCenter: "الشواهين",
      time: "منذ ساعتين",
    },
    {
      name: "بافو علي",
      photo: "",
      branchCenter: "فرع باييزي ",
      time: "منذ 4 ساعات",
    },
    {
      name: "محمد عبد الرحمن",
      photo: "",
      branchCenter: "فرع باييزي ",
      time: "أمس",
    },
  ];

  const mainActions = [
    {
      icon: Users,
      title: "إدارة المساندين",
      color: "from-[#b8ac8c] to-[#1b9174]",
      onClick: () => setCurrentPage("supporter"),
    },
    {
      icon: GraduationCap,
      title: "إدارة المستظهرين",
      color: "from-[#b8ac8c] to-[#1b9174]",
      onClick: () => setCurrentPage("student"),
    },
    {
      icon: RefreshCw,
      title: "إدارة عمليات التحديث",
      color: "from-[#b8ac8c] to-[#1b9174]",
      onClick: () => {}, // Add functionality as needed
    },
    {
      icon: Database,
      title: "إدارة تنسيق المعلومات",
      color: "from-[#b8ac8c] to-[#1b9174]",
      onClick: () => {}, // Add functionality as needed
    },
  ];

  const principalActions = [
    {
      icon: UserPlus,
      title: "إضافة مستظهر جديد",
      description: "تسجيل طالب جديد في المحضرة",
      color: "from-emerald-500 to-teal-600",
      bgPattern: "bg-emerald-600",
      textColor: "text-emerald-600",
      onClick: () => {
        setShowAddStudentModal(true);
        setNavBarShown(false);
      },
    },
    {
      icon: UsersRound,
      title: "إضافة مساند جديد للمحضرة",
      description: "تسجيل مساند جديد للمساعدة في التعليم",
      color: "from-[#b8ac8c] to-yellow-900",
      bgPattern: "bg-[#b8ac8c]",
      textColor: "text-[#94896c]",
      onClick: () => {
        setShowAddSupporterModal(true);
        setNavBarShown(false);
      },
    },
  ];

  // Sample data for forms
  const branches = [
    "بابا السعد",
    "فرع كركورة",
    "الشواهين",
    "فرع قسنطينة",
    "فرع باييزي ",
  ];

  const handleAddStudent = (newStudent) => {
    // Handle adding student logic here
    console.log("Adding new student:", newStudent);
    setShowAddStudentModal(false);
    setNavBarShown(true);
    // You can add logic to save the student data or redirect to student management
  };

  const handleAddSupporter = (newSupporter) => {
    // Handle adding supporter logic here
    console.log("Adding new supporter:", newSupporter);
    setShowAddSupporterModal(false);
    setNavBarShown(true);
    // You can add logic to save the supporter data or redirect to supporter management
  };

  const handleCloseModal = () => {
    setShowAddStudentModal(false);
    setShowAddSupporterModal(false);
    setNavBarShown(true);
  };

  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isLoggedIn = user && isSignedIn();

  return (
    <div
      className="font-tajwal min-h-screen bg-gradient-to-br from-[#F5FFFC] to-gray-50 font-sans"
      dir="rtl"
    >
      {/* Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="no-scrollbar bg-gradient-to-br from-[#F5FFFC] to-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddStudentForm
              onSave={handleAddStudent}
              onCancel={handleCloseModal}
              branches={branches}
            />
          </div>
        </div>
      )}

      {/* Supporter Modal */}
      {showAddSupporterModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="no-scrollbar bg-gradient-to-br from-[#F5FFFC] to-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddSupporterForm
              onSave={handleAddSupporter}
              onCancel={handleCloseModal}
              branches={branches}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoggedIn ? (
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
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
              <div className="absolute top-20 right-20 w-20 h-20 bg-[#b8ac8c] opacity-10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-32 left-32 w-16 h-16 bg-[#1b9174] opacity-10 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-20 w-12 h-12 bg-[#b8ac8c] opacity-10 rounded-full animate-pulse delay-2000"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Principal Functionalities Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {principalActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.onClick}
                    className={`group relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-3 border border-gray-100`}
                  >
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-5">
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 ${action.bgPattern} rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`}
                      ></div>
                      <div
                        className={`absolute bottom-0 left-0 w-24 h-24 ${action.bgPattern} rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700`}
                      ></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with animated background */}
                      <div className="relative mb-6">
                        <div
                          className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                        >
                          <action.icon className="text-white" size={32} />
                          <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>
                        {/* Plus icon indicator */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 group-hover:scale-125 transition-transform duration-300">
                          <Plus className={action.textColor} size={16} />
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="text-right">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#1b9174] transition-colors duration-300">
                          {action.title}
                        </h3>
                        {/* Action button */}
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-2 ${action.textColor} group-hover:gap-4 transition-all duration-300`}
                          >
                            <span className="font-bold text-lg">ابدأ الآن</span>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-current group-hover:to-current group-hover:text-white flex items-center justify-center transition-all duration-300">
                              <ChevronRight
                                size={18}
                                className="transform group-hover:-translate-x-1 transition-transform duration-300"
                              />
                            </div>
                          </div>

                          {/* Animated dots */}
                          <div className="flex gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${action.bgPattern} group-hover:scale-150 transition-transform duration-300 delay-100`}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${action.bgPattern} group-hover:scale-150 transition-transform duration-300 delay-200`}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${action.bgPattern} group-hover:scale-150 transition-transform duration-300 delay-300`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div
              ref={ref}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-lg bg-gray-50 ${stat.color} flex-shrink-0`}
                    >
                      <stat.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-800 mb-0.5 leading-tight">
                        {inView && (
                          <CountUp
                            start={0}
                            end={parseInt(stat.number) || stat.number}
                            duration={2}
                            delay={0}
                          />
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">
                        {stat.label}
                      </p>
                    </div>
                    <ChevronRight
                      className="text-gray-400 flex-shrink-0"
                      size={16}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Actions */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mainActions.map((action, index) => (
                    <div
                      key={index}
                      onClick={action.onClick}
                      className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                    >
                      {/* Background pattern */}
                      <div className="absolute top-0 left-0 w-full h-full opacity-5">
                        <div className="absolute top-2 right-2 w-8 h-8 border border-gray-300 rounded-full"></div>
                        <div className="absolute bottom-2 left-2 w-6 h-6 border border-gray-300 rounded-full"></div>
                      </div>

                      <div className="relative z-10">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                        >
                          <action.icon className="text-white" size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-[#1b9174] transition-colors leading-tight">
                          {action.title}
                        </h4>
                        <div className="flex items-center text-[#1b9174] group-hover:gap-2 transition-all duration-300">
                          <span className="text-sm font-semibold">
                            ابدأ الآن
                          </span>
                          <ChevronRight
                            size={16}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Updates */}
              <div>
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    عمليات التحديثات الأخيرة
                  </h3>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {recentUpdates.map((update, index) => (
                    <div
                      key={index}
                      className={`p-3 hover:bg-gray-50 transition-colors ${
                        index !== recentUpdates.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {/*  <img
                            src={update.photo}
                            alt={update.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          /> */}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-gray-800 mb-1 truncate">
                            {update.name}
                          </h4>
                          <p className="text-sm text-[#1b9174] font-medium mb-1">
                            {update.branchCenter}
                          </p>
                          <p className="text-xs text-gray-500">{update.time}</p>
                        </div>
                        <div className="text-gray-400">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer - Only show when logged in */}
      {isLoggedIn && (
        <footer className="bg-white border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <img
                  src={logo}
                  alt="شعار المحضرة"
                  className="w-10 h-10 rounded-xl object-contain"
                />
                <h3 className="text-xl font-bold text-gray-800">
                  محضرة الشيخ باسعيد وعلي
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                © 2025 جميع الحقوق محفوظة - محضرة الشيخ باسعيد وعلي
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MahdaraHomePage;
