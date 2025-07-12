import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Users,
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  CheckCircle,
  Link,
  Copy,
} from "lucide-react";

import {
  loadGoogleApi,
  isSignedIn,
  fetchStudents,
  updateStudentAttendance,
  initializeAttendanceColumn,
} from "../googleSheetApi";

import MahdaraNavbar from "../MahdaraNavbar";
import ProfileForm from "./ProfileForm";
import ProfileCard from "./ProfileCard";
import AddStudentForm from "./AddStudentForm";
import StudentData from "./Students.json";
import { useAuth } from "../AuthContext";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const StudentManagement = ({ setNavBarShown }) => {
  const [Statistics, inView] = useInView({
    threshold: 0.4,
  });
  // Sample data
  const [students, setStudents] = useState([]);
  /*   useEffect(() => {
    setStudents(StudentData);
  }, []); */

  // Define fetchAndSetStudents function
  const fetchAndSetStudents = async () => {
    try {
      if (typeof window === "undefined") return;

      if (typeof gapi === "undefined") {
        await loadGoogleApi();
      }

      if (!isSignedIn()) {
        console.log("User not signed in. Please sign in first.");
        setStudents(StudentData);
        return;
      }

      const studentsFromSheets = await fetchStudents();
      console.log("Fetched students from Google Sheets:", studentsFromSheets);

      const studentsWithAttendance = studentsFromSheets.map((student) => ({
        ...student,
        attendanceThisYear: student.attendance2025 === "نعم" ? true : false,
      }));

      setStudents(studentsWithAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
      console.log("Falling back to local student data");
      setStudents(StudentData);
    }
  };

  // Define initializeAttendance function
  const initializeAttendance = async () => {
    try {
      if (isSignedIn()) {
        await initializeAttendanceColumn();
        console.log("✅ Attendance column initialized");
      }
    } catch (error) {
      console.error("❌ Error initializing attendance column:", error);
    }
  };

  /*  useEffect(() => {
    const fetchAndSetStudents = async () => {
      try {
        if (typeof window === "undefined") return;

        if (typeof gapi === "undefined") {
          await loadGoogleApi();
        }

        if (!isSignedIn()) {
          console.log("User not signed in. Please sign in first.");
          setStudents(StudentData);
          return;
        }

        const studentsFromSheets = await fetchStudents();
        console.log("Fetched students from Google Sheets:", studentsFromSheets);

        // Map attendance data from the sheet (assuming it's in the correct column)
        const studentsWithAttendance = studentsFromSheets.map((student) => ({
          ...student,
          attendanceThisYear: student.attendance2025 === "نعم" ? true : false,
        }));

        setStudents(studentsWithAttendance);
      } catch (error) {
        console.error("Error fetching students:", error);
        console.log("Falling back to local student data");
        setStudents(StudentData);
      }
    };

    fetchAndSetStudents();
  }, []);

  useEffect(() => {
    const initializeAttendance = async () => {
      try {
        if (isSignedIn()) {
          await initializeAttendanceColumn();
          console.log("✅ Attendance column initialized");
        }
      } catch (error) {
        console.error("❌ Error initializing attendance column:", error);
      }
    };

    // Call this only once when component mounts and user is signed in
    initializeAttendance();
    // Call the function
    fetchAndSetStudents();
  }, []);
 */

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;
  const { user, signIn, signOut } = useAuth();

  /*  */
  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    email: "",
    branchCenter: "",
    memerYear: "",
    attendanceThisYear: true,
  });

  const activities = ["نشاط 1", "نشاط 2", "نشاط 3"];
  const jobTypes = ["وظيفة 1", "وظيفة 2", "وظيفة 3"];
  const educationLevels = ["مستوى 1", "مستوى 2", "مستوى 3"];
  const workerNatures = ["متفرغ", "متطوع"];
  const memoryCenters = ["موسى وكراع", "بن ساشو"];
  const branches = [
    "بابا السعد",
    "فرع كركورة ",
    "الشواهين",
    "فرع قسنطينة ",
    "فرع باييزي ",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchAndSetStudents = async () => {
      try {
        if (typeof window === "undefined") return;

        if (typeof gapi === "undefined") {
          await loadGoogleApi();
        }

        if (!isSignedIn()) {
          console.log("User not signed in. Please sign in first.");
          setStudents(StudentData);
          return;
        }

        const studentsFromSheets = await fetchStudents();
        console.log("Fetched students from Google Sheets:", studentsFromSheets);

        const studentsWithAttendance = studentsFromSheets.map((student) => ({
          ...student,
          attendanceThisYear: student.attendance2025 === "نعم" ? true : false,
        }));

        setStudents(studentsWithAttendance);
      } catch (error) {
        console.error("Error fetching students:", error);
        console.log("Falling back to local student data");
        setStudents(StudentData);
      }
    };

    const initializeAttendance = async () => {
      try {
        if (isSignedIn()) {
          await initializeAttendanceColumn();
          console.log("✅ Attendance column initialized");
        }
      } catch (error) {
        console.error("❌ Error initializing attendance column:", error);
      }
    };

    fetchAndSetStudents();
    initializeAttendance();
  }, []);

  const toggleStudentAttendance = async (studentId) => {
    try {
      setAttendanceLoading((prev) => new Set(prev).add(studentId));

      const currentStudent = students.find((s) => s.id === studentId);
      if (!currentStudent) {
        console.error("Student not found");
        return;
      }

      const newAttendanceStatus = !currentStudent.attendanceThisYear;

      console.log(
        `🔄 Updating attendance for student ${studentId} to ${newAttendanceStatus}`
      );

      await updateStudentAttendance(studentId, newAttendanceStatus);

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? { ...student, attendanceThisYear: newAttendanceStatus }
            : student
        )
      );

      console.log(
        `✅ Successfully updated attendance for student ${studentId}`
      );
    } catch (error) {
      console.error("❌ Error updating attendance:", error);
      alert("حدث خطأ في تحديث الحضور. يرجى المحاولة مرة أخرى.");
    } finally {
      setAttendanceLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  const AttendanceToggle = ({
    isAttending,
    onChange,
    disabled = false,
    loading = false,
  }) => {
    return (
      <button
        onClick={() => !disabled && !loading && onChange(!isAttending)}
        disabled={disabled || loading}
        dir="rtl"
        className={`
        relative inline-flex items-center h-9 w-20 rounded-full p-1 transition-all duration-300 ease-in-out
        ${
          disabled || loading
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
        ${loading ? "animate-pulse" : ""}
      `}
      >
        {/* Background effect */}
        <div
          className={`absolute inset-1 rounded-full transition-all duration-300 ${
            isAttending ? "bg-white/20" : "bg-black/10"
          }`}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Labels */}
        <div
          className={`relative w-full h-full flex items-center justify-between px-2 text-sm font-bold ${
            loading ? "opacity-50" : ""
          }`}
        >
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

        {/* Toggle circle */}
        <div
          className={`
          absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out
          ${isAttending ? "right-2" : "right-[50px]"}
        `}
        ></div>
      </button>
    );
  };

  const [attendanceLoading, setAttendanceLoading] = useState(new Set());
  const handleSaveStudent = () => {};

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);

    const matchesBranch =
      filterBranch === "" || student.branchCenter === filterBranch;
    const matchesYear = filterYear === "" || student.memerYear === filterYear;

    return matchesSearch && matchesBranch && matchesYear;
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Statistics
  const thisYearStudents = students.filter(
    (s) => s.memerYear === currentYear.toString()
  ).length;
  const attendingThisYear = students.filter((s) => s.attendanceThisYear).length;
  const tartilMemNumber = students.filter((s) =>
    Number(s.tartilMemYear)
  ).length;
  const handleAddStudent = () => {
    const id = Math.max(...students.map((s) => s.id)) + 1;
    setStudents([
      ...students,
      {
        ...newStudent,
        id,
        memerNumber: id + 200,
        profileImage: "",
      },
    ]);
    setShowAddModal(false);
    setNewStudent({
      name: "",
      phone: "",
      email: "",
      branchCenter: "",
      memerYear: "",
      attendanceThisYear: true,
    });
    setNavBarShown(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستظهر؟")) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
    setNavBarShown(false);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
    setNavBarShown(false);
  };

  const handleUpdateStudent = (updatedStudent) => {
    setStudents(
      students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setShowEditModal(false);
    setSelectedStudent(null);
    setNavBarShown(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="font-tajwal min-h-screen bg-gradient-to-br from-[#F5FFFC] to-gray-50"
      dir="rtl"
    >
      {/* Main Content */}
      {showAddModal || showEditModal || showProfileModal ? (
        <>
          {/* Add Student Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="no-scrollbar bg-gradient-to-br from-[#F5FFFC] to-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <AddStudentForm
                  onSave={(newStudent) => {
                    const id = Math.max(...students.map((s) => s.id)) + 1;
                    setStudents([
                      ...students,
                      {
                        ...newStudent,
                        id,
                        memerNumber: id + 200,
                        profileImage: "",
                      },
                    ]);
                    setShowAddModal(false);
                    setNavBarShown(true);
                  }}
                  onCancel={() => {
                    setShowAddModal(false);
                    setNavBarShown(true);
                  }}
                  branches={branches}
                />
              </div>
            </div>
          )}

          {/* Profile View Modal */}
          {showProfileModal && selectedStudent && (
            <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 flex items-center justify-center z-50">
              <div className="no-scrollbar bg-gradient-to-br from-[#F5FFFC] to-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="">
                  <ProfileCard
                    student={selectedStudent}
                    /* toggleEditMode={() => {
                      setShowProfileModal(false);
                      setShowEditModal(true);
                    }} */
                    onClose={() => {
                      setShowProfileModal(false);
                      setNavBarShown(true);
                    }}
                    onEdit={() => {
                      setShowProfileModal(false);
                      setShowEditModal(true);
                      setNavBarShown(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Profile Edit Modal */}
          {showEditModal && selectedStudent && (
            <div className="fixed inset-0 bg-gradient-to-br from-[#F5FFFC] to-gray-50 flex items-center justify-center z-50">
              <div className="no-scrollbar bg-gradient-to-br from-[#F5FFFC] to-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div>
                  <ProfileForm
                    student={selectedStudent}
                    onSave={handleSaveStudent}
                    onCancel={() => {
                      setShowEditModal(false);
                      setNavBarShown(true);
                    }}
                    branches={branches}
                    activities={activities}
                    jobTypes={jobTypes}
                    educationLevels={educationLevels}
                    workerNatures={workerNatures}
                    memoryCenters={memoryCenters}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  إدارة المستظهرين
                </h1>
                <p className="text-gray-600">
                  إدارة وتتبع جميع المستظهرين في المحضرة
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
                  إضافة مستظهر جديد
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div
            ref={Statistics}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-50 text-[#1b9174]">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {inView && (
                      <CountUp
                        start={0}
                        end={students.length}
                        duration={2}
                        delay={0}
                        separator=""
                      />
                    )}
                  </p>
                  <p className="text-gray-600 text-sm">إجمالي المستظهرين</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {inView && (
                      <CountUp
                        start={0}
                        end={thisYearStudents}
                        duration={2}
                        delay={0}
                      />
                    )}
                  </p>
                  <p className="text-gray-600 text-sm">المستظهرون هذه السنة</p>
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
                    {inView && (
                      <CountUp
                        start={0}
                        end={attendingThisYear}
                        duration={2}
                        delay={0}
                      />
                    )}
                  </p>
                  <p className="text-gray-600 text-sm">الحاضرون هذه السنة</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#b8ac8c] bg-opacity-20 text-[#b8ac8c]">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {inView && (
                      <CountUp
                        start={0}
                        end={tartilMemNumber}
                        duration={2}
                        delay={0}
                      />
                    )}
                  </p>
                  <p className="text-gray-600 text-sm">المستظهرون ترتيليا</p>
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

              {/* Year Filter */}
              <div className="relative">
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">مستظهر سنة</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
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

          {/* Students Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100 hidden sm:table-header-group">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                      المستظهر
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                      معلومات الاتصال
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                      الفرع
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                      سنة الاستظهار
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                      حاضر هذه السنة
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors block sm:table-row mb-4 sm:mb-0 border-b border-gray-100 last:border-0"
                    >
                      {/* Student Name - Always visible */}
                      <td className="px-6 py-3 block sm:table-cell w-full sm:w-auto">
                        <div className="flex items-center gap-3 justify-between sm:justify-start">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1b9174] to-green-600 flex items-center justify-center">
                              <User className="text-white" size={14} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
                                {student.fullName}
                              </p>
                              <p className="text-xs text-gray-500 hidden sm:block">
                                رقم {student.memerNumber}
                              </p>
                            </div>
                          </div>
                          <div className="sm:hidden flex items-center gap-1">
                            <button
                              onClick={() => handleViewStudent(student)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="عرض التفاصيل"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="p-1.5 text-[#1b9174] hover:bg-green-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
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

                      {/* Contact Info - Hidden on mobile */}
                      <td className="px-6 py-3 hidden sm:table-cell">
                        <div className="space-y-1">
                          <div
                            dir="ltr"
                            className=" ltr text-left flex items-center gap-2 text-xs"
                          >
                            <span className="text-gray-400">📞</span>
                            <span>{student.phone}</span>
                          </div>
                          <div
                            dir="ltr"
                            className="ltr text-left flex items-center gap-2 text-xs text-gray-500"
                          >
                            <span className="text-gray-400">✉️</span>
                            <span className="truncate max-w-40">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Branch - Hidden on mobile */}
                      <td className="px-6 py-3 hidden sm:table-cell text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#b8ac8c] bg-opacity-20 text-white font-medium">
                          {student.branchCenter}
                        </span>
                      </td>

                      {/* Year - Hidden on mobile */}
                      <td className="px-6 py-3 hidden sm:table-cell text-center">
                        <span className="text-gray-800 font-medium text-sm">
                          {student.memerYear}
                        </span>
                      </td>

                      {/* Attendance - Stacked on mobile */}
                      <td className="px-6 py-3 block sm:table-cell w-full sm:w-auto">
                        <div className="flex justify-between items-center sm:justify-center">
                          <span className="text-sm text-gray-600 sm:hidden">
                            حاضر هذه السنة:
                          </span>
                          <AttendanceToggle
                            isAttending={student.attendanceThisYear}
                            onChange={() => toggleStudentAttendance(student.id)}
                            loading={attendanceLoading.has(student.id)}
                          />
                        </div>
                      </td>

                      {/* Actions - Hidden on mobile (shown inline with name) */}
                      <td className="px-6 py-3 hidden sm:table-cell ">
                        <div className="flex items-center gap-1 justify-center">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-1.5 text-[#1b9174] hover:bg-green-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteStudent(student.id)}
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
                  عرض {indexOfFirstStudent + 1} إلى{" "}
                  {Math.min(indexOfLastStudent, filteredStudents.length)} من{" "}
                  {filteredStudents.length} مستظهر
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Page Numbers */}
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
        </main>
      )}
    </div>
  );
};

export default StudentManagement;
