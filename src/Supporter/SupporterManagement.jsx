import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Users,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  X,
  MapPin,
  User,
  CheckCircle,
  Award,
  Star,
} from "lucide-react";
import supportersData from "./json.json";
import SupporterForm from "./SupporterForm";
import SupporterCard from "./SupporterCard";
import AddSupporterForm from "./AddSupporterForm";
import LogInPage from "../LogInPage";
import { useAuth } from "../AuthContext";

// Sample data for dropdowns
const branches = ["فرع 1", "فرع 2", "فرع 3"];
const activities = ["نشاط 1", "نشاط 2", "نشاط 3"];
const jobTypes = ["وظيفة 1", "وظيفة 2", "وظيفة 3"];
const educationLevels = ["مستوى 1", "مستوى 2", "مستوى 3"];
const workerNatures = ["متفرغ", "متطوع"];

const SupporterManagement = ({ setNavBarShown, navBarShown }) => {
  const { user, signIn, signOut, isSignedIn } = useAuth();
  const [supporters, setSupporters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterActivity, setFilterActivity] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const supportersPerPage = 4;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  useEffect(() => {
    setSupporters(supportersData);
  }, []);

  const toggleSupporterAttendance = (supporterId) => {
    setSupporters((prevSupporters) =>
      prevSupporters.map((supporter) =>
        supporter.id === supporterId
          ? { ...supporter, attendanceThisYear: !supporter.attendanceThisYear }
          : supporter
      )
    );
  };

  const AttendanceToggle = ({ isAttending, onChange, disabled = false }) => {
    return (
      <button
        onClick={() => !disabled && onChange(!isAttending)}
        disabled={disabled}
        dir="rtl"
        className={`
        relative inline-flex items-center h-9 w-20 rounded-full p-1 transition-all duration-300 ease-in-out
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:shadow-lg"
        }
        ${
          isAttending
            ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200"
            : "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-200"
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isAttending ? "focus:ring-green-500" : "focus:ring-gray-400"}
        transform hover:scale-105 active:scale-95
      `}
      >
        <div
          className={`absolute inset-1 rounded-full transition-all duration-300 ${
            isAttending ? "bg-white/20" : "bg-black/10"
          }`}
        />

        <div className="relative w-full h-full flex items-center justify-between px-2 text-sm font-bold">
          <span
            className={`${
              isAttending ? "text-white scale-100" : "text-white/70 scale-90"
            } transition-all`}
          >
            لا
          </span>
          <span
            className={`${
              isAttending ? "text-white/70 scale-90" : "text-white scale-100"
            } transition-all`}
          >
            {isAttending ? "نعم" : ""}
          </span>
        </div>

        <div
          className={`
          absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out
          ${isAttending ? "right-2" : "right-[50px]"}
        `}
        ></div>
      </button>
    );
  };

  // Filter supporters
  const filteredSupporters = supporters.filter((supporter) => {
    const matchesSearch =
      supporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supporter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supporter.phone.includes(searchTerm) ||
      (supporter.phone2 && supporter.phone2.includes(searchTerm));

    const matchesBranch =
      filterBranch === "" || supporter.branchCenter === filterBranch;
    const matchesYear = filterYear === "" || supporter.memerYear === filterYear;
    const matchesActivity =
      filterActivity === "" || supporter.fieldActivity === filterActivity;

    return matchesSearch && matchesBranch && matchesYear && matchesActivity;
  });

  // Pagination
  const indexOfLastSupporter = currentPage * supportersPerPage;
  const indexOfFirstSupporter = indexOfLastSupporter - supportersPerPage;
  const currentSupporters = filteredSupporters.slice(
    indexOfFirstSupporter,
    indexOfLastSupporter
  );
  const totalPages = Math.ceil(filteredSupporters.length / supportersPerPage);

  // Statistics
  const activeSupporters = supporters.filter(
    (s) => s.attendanceThisYear
  ).length;
  const fullTimeSupporters = supporters.filter(
    (s) => s.workerNature === "متفرغ"
  ).length;
  const volunteers = supporters.filter(
    (s) => s.workerNature === "متطوع"
  ).length;

  const handleDeleteSupporter = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المساعد؟")) {
      setSupporters(supporters.filter((supporter) => supporter.id !== id));
    }
  };

  const handleViewSupporter = (supporter) => {
    setSelectedSupporter(supporter);
    setShowProfileModal(true);
    setNavBarShown(false);
  };

  const handleEditSupporter = (supporter) => {
    setSelectedSupporter(supporter);
    setShowEditModal(true);
    setNavBarShown(false);
  };

  const handleUpdateSupporter = (updatedSupporter) => {
    setSupporters(
      supporters.map((s) =>
        s.id === updatedSupporter.id ? updatedSupporter : s
      )
    );
    setShowEditModal(false);
    setSelectedSupporter(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  /* 
  useEffect(()=> {
    setNavBarShown(!navBarShown)
  } , [showAddModal , showEditModal , showProfileModal]); */

  const isLoggedIn = user && isSignedIn();
  return (
    <div
      className="font-tajwal min-h-screen bg-gradient-to-br from-[#F5FFFC] to-gray-50"
      dir="rtl"
    >
      {/* Show modals or main content */}
      {showAddModal || showEditModal || showProfileModal ? (
        <>
          {/* Profile View Modal */}
          {showProfileModal && selectedSupporter && (
            <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-[#F5FFFC] to-gray-50 no-scrollbar rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <SupporterCard
                  supporter={selectedSupporter}
                  onClose={() => {
                    setShowProfileModal(false);
                    setNavBarShown(true);
                  }}
                  onEdit={() => {
                    setShowProfileModal(false);
                    setShowEditModal(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* Profile Edit Modal */}
          {showEditModal && selectedSupporter && (
            <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="no-scrollbar bg-gradient-to-br from-[#F5FFFC] to-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <SupporterForm
                  supporter={selectedSupporter}
                  onSave={handleUpdateSupporter}
                  onCancel={() => {
                    setShowEditModal(false);
                    setNavBarShown(true);
                  }}
                  branches={branches}
                  activities={activities}
                  jobTypes={jobTypes}
                  educationLevels={educationLevels}
                  workerNatures={workerNatures}
                />
              </div>
            </div>
          )}

          {/* Add Supporter Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="no-scrollbar bg-gradient-to-br from-[#F5FFFC] to-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <AddSupporterForm
                  onSave={(newSupporter) => {
                    const id = Math.max(...supporters.map((s) => s.id)) + 1;
                    setSupporters([
                      ...supporters,
                      {
                        ...newSupporter,
                        id,
                        memerNumber: id + 100,
                      },
                    ]);
                    setShowAddModal(false);
                    setNavBarShown(true);
                  }}
                  onCancel={() => {
                    setShowAddModal(false), setNavBarShown(true);
                  }}
                  branches={branches}
                  activities={activities}
                  jobTypes={jobTypes}
                  educationLevels={educationLevels}
                  workerNatures={workerNatures}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Page Header */}
            {!isLoggedIn ? <LogInPage /> : 
            <>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    إدارة المساندين
                  </h1>
                  <p className="text-gray-600">
                    إدارة وتتبع جميع المساندين في المحضرة
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowAddModal(true);
                      setNavBarShown(false);
                    }}
                    className="bg-gradient-to-r from-[#1b9174] to-green-600 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Plus size={20} />
                    إضافة مساند جديد للمحضرة
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50 text-[#1b9174]">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {supporters.length}
                    </p>
                    <p className="text-gray-600 text-sm">إجمالي المساندين</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {fullTimeSupporters}
                    </p>
                    <p className="text-gray-600 text-sm">
                      عدد الأساتذة الدائمين
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {activeSupporters}
                    </p>
                    <p className="text-gray-600 text-sm">
                      عدد الأساتذة الزائرين
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="البحث بالاسم، الايميل، أو رقم الهاتف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                  />
                </div>

                {/* Branch Filter */}
                <div className="relative">
                  <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">جميع الفروع</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>

                {/* Activity Filter */}
                <div className="relative">
                  <select
                    value={filterActivity}
                    onChange={(e) => setFilterActivity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">جميع الأنشطة</option>
                    {activities.map((activity) => (
                      <option key={activity} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Download size={20} />
                    تصدير
                  </button>
                  <button className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Upload size={20} />
                    استيراد
                  </button>
                </div>
              </div>
            </div>

            {/* Supporters Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100 hidden sm:table-header-group">
                    <tr>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 ">
                        المساعد
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                        معلومات الاتصال
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                        النشاط الميداني
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                        سنة الاستظهار
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                        نشط هذه السنة
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentSupporters.map((supporter) => (
                      <tr
                        key={supporter.id}
                        className="hover:bg-gray-50 transition-colors block sm:table-row mb-4 sm:mb-0 border-b border-gray-100 last:border-0"
                      >
                        <td className="px-6 py-3 block sm:table-cell w-full sm:w-auto">
                          <div className="flex items-center gap-3 justify-between sm:justify-start">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1b9174] to-green-600 flex items-center justify-center">
                                <User className="text-white" size={14} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {supporter.name}
                                </p>
                                <p className="text-xs text-gray-500 hidden sm:block">
                                  رقم {supporter.memerNumber}
                                </p>
                              </div>
                            </div>
                            <div className="sm:hidden flex items-center gap-1">
                              <button
                                onClick={() => handleViewSupporter(supporter)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="عرض التفاصيل"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleEditSupporter(supporter)}
                                className="p-1.5 text-[#1b9174] hover:bg-green-50 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSupporter(supporter.id)
                                }
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 size={14} />
                              </button>
                              <button
                                onClick={() => handleViewStudent(student)}
                                className="p-1.5 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                                title="Copy!"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className=" px-6 py-3 hidden sm:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-400">📞</span>
                              <span>{supporter.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="text-gray-400">✉️</span>
                              <span className="truncate max-w-32">
                                {supporter.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-3 hidden sm:table-cell text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#b8ac8c] bg-opacity-20 text-white font-medium">
                            {supporter.fieldActivity}
                          </span>
                        </td>

                        <td className="px-6 py-3 hidden text-center sm:table-cell">
                          <span className="text-gray-800 font-medium text-sm">
                            {supporter.memerYear}
                          </span>
                        </td>

                        <td className="text-center px-6 py-3 block sm:table-cell w-full sm:w-auto">
                          <div className="flex justify-between items-center sm:justify-center">
                            <span className="text-sm text-gray-600 sm:hidden">
                              نشط هذه السنة:
                            </span>
                            <AttendanceToggle
                              isAttending={supporter.attendanceThisYear}
                              onChange={() =>
                                toggleSupporterAttendance(supporter.id)
                              }
                            />
                          </div>
                        </td>

                        <td className="text-center px-6 py-3 hidden sm:table-cell">
                          <div className="flex items-center gap-1 justify-center">
                            <button
                              onClick={() => handleViewSupporter(supporter)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="عرض التفاصيل"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleEditSupporter(supporter)}
                              className="p-1.5 text-[#1b9174] hover:bg-green-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSupporter(supporter.id)
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={14} />
                            </button>

                            <button
                              onClick={() => handleViewStudent(student)}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                              title="Copy!"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    عرض {indexOfFirstSupporter + 1} إلى{" "}
                    {Math.min(indexOfLastSupporter, filteredSupporters.length)}{" "}
                    من {filteredSupporters.length} مساعد
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-[#1b9174] text-white"
                              : "border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            </>}
            
          </main>
        </>
      )}
    </div>
  );
};

export default SupporterManagement;
