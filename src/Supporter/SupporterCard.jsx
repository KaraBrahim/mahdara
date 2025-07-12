import React from "react";
import {
  Edit,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Briefcase,
  GraduationCap,
  Activity,
  Book,
  Users,
  Building,
  Star,
  Award,
  X,
} from "lucide-react";

const SupporterCard = ({ supporter, onClose, onEdit }) => {
  return (
    <div
      className="bg-gradient-to-r from-[#F5FFFC] to-gray-50 font-sans mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      dir="rtl"
    >
      {/* Header Section */}
      <div className="relative p-8">
        <div className="flex justify-between items-start">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
          <button
            onClick={onEdit}
            className="bg-[#1b9174] hover:bg-green-700 text-white px-3 py-1 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Edit size={16} />
            تعديل
          </button>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 mt-4">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#1b9174] shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-[#1b9174] to-green-600 flex items-center justify-center">
                <User size={80} className="text-white opacity-80" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-[#b8ac8c] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              مساعد
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center lg:text-right">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {supporter.name}
              </h1>
              <p className="text-xl text-[#1b9174] font-medium">
                {supporter.branchCenter}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">رقم العضوية</span>
                  <span>{supporter.memerNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">الايميل</span>
                  <span>{supporter.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">المدينة الحالية</span>
                  <span>{supporter.currentCity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">الجامعة</span>
                  <span>{supporter.studentUniversity || "/"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">رقم الهاتف</span>
                  <span>{supporter.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">رقم الهاتف 2</span>
                  <span>{supporter.phone2 || "/"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">نوع العمل</span>
                  <span>{supporter.jobType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">طبيعة العمل</span>
                  <span>{supporter.workerNature}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="w-16 h-0.5 bg-gray-300 rounded-full"></div>
      </div>

      {/* Stats Section */}
      <div className="px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-gray-600 text-sm">سنة الاستظهار</div>
            <div className="text-3xl font-bold text-[#b8ac8c] mb-1">
              {supporter.memerYear}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 text-sm">الحضور هذه السنة</div>
            <div className="text-2xl font-bold text-[#b8ac8c] mb-1">
              {supporter.attendanceThisYear ? "نعم" : "لا"}
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="text-xl font-bold mb-1">النشاط الميداني</div>
          <div className="text-3xl font-bold text-green-800">
            {supporter.fieldActivity}
          </div>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="w-16 h-0.5 bg-gray-300 rounded-full"></div>
      </div>

      {/* Detailed Info Section */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-xl p-6 ring-1 ring-[#b8ac8c]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="text-green-600" size={20} />
                معلومات شخصية ومهنية
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المستوى الدراسي الأخير</span>
                  <span>{supporter.lastEducation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الوظيفة الحالية</span>
                  <span>{supporter.workerJob || "/"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">العنوان</span>
                  <span>{supporter.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl p-6 ring-1 ring-[#b8ac8c]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Book className="text-green-600" size={20} />
                معلومات المحضرة
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">مركز الاستظهار</span>
                  <span>{supporter.memCenter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">معلم الاستظهار</span>
                  <span>{supporter.memTeacher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">النشاط في المحضرة</span>
                  <span>{supporter.activityInMahdhara}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupporterCard;