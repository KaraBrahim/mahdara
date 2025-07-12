import React, { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const ProfileCard = ({ student, onClose, onEdit }) => {
  const [ref, inView] = useInView({
    threshold: 0.4,
  });

  // Use passed student data or fallback to default values
  const [profileData, setProfileData] = useState({
    id: 0,
    fullName: student?.fullName || "كارة إبراهيم بن حمو",
    name: student?.name,
    branchCenter: student?.branchCenter || "بابا السعد",
    jobType: "طالب",
    birthDate: student?.birthDate || "27/01/2003",
    email: student?.email || "karabrahim4@gmail.com",
    city: student?.city || student?.currentCity || "قسنطينة",
    phone: student?.phone || "0783072430",
    phone2: student?.phone2 || "",
    address: student?.address || "4 ممر بن شريف",

    work: student?.work ?? true,
    study: student?.study ?? false,

    jobNature: student?.jobNature || "الأقمشة",
    jobActivity: student?.jobActivity || "التجارة",
    jobAddress: student?.jobAddress || "بابا السعد",
    currentJob: "",

    facebook: student?.facebook || "Brahim Ka",

    mahdaraActivity: student?.mahdaraActivity || "أستاذ | أستاذ التجويد",
    SocialActivity: student?.SocialActivity || "إمام",
    lastEducation: student?.lastEducation || "ماستر 1",
    memerDate: student?.memerDate || "18/04/2020",
    memTeacher: student?.memTeacher || "طباخ محمد",
    memerYear: student?.memerYear || 2020,
    memerNumber: student?.memerNumber || 208,
    tartilMemYear: student?.tartilMemYear,
    memCenter: student?.memCenter || "موسى بوكراع",
    Speciality: student?.Speciality || student?.Speciality || "/",
    profileImage: student?.profileImage || null,
    profileUrl: student?.profileUrl || null,
    attendance2025: true,
    studentUniversity: student?.studentUniversity || "جامعة عبد الحميد مهري",
  });


  useEffect(() => {
    const currentJob =
      profileData.work == 'TRUE'
        ? `${profileData.jobActivity} | ${profileData.jobNature} | ${profileData.jobAddress}`
        : profileData.study === true
        ? `${profileData.lastEducation} | ${profileData.Speciality} | ${profileData.studentUniversity}`
        : "";
        console.log(profileData);
    setProfileData((prev) => ({ ...prev, currentJob }));
  }, [student]);
  const renderWorkStudyInfo = () => {
    if (profileData.isStudent) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <GraduationCap className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">طالب جامعي</h3>
              <p className="text-blue-600 text-sm">{profileData.year}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Book size={14} className="text-blue-500" />
                <span className="text-gray-600">المستوى:</span>
                <span className="font-medium">
                  {profileData.educationLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-500" />
                <span className="text-gray-600">التخصص:</span>
                <span className="font-medium">
                  {profileData.studentSpeciality}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building size={14} className="text-blue-500" />
                <span className="text-gray-600">المؤسسة:</span>
                <span className="font-medium">{profileData.institution}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" />
                <span className="text-gray-600">المكان:</span>
                <span className="font-medium">{profileData.address}</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">عامل</h3>
              <p className="text-green-600 text-sm">نشط في سوق العمل</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-green-500" />
                <span className="text-gray-600">طبيعة العمل:</span>
                <span className="font-medium">{profileData.jobNature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book size={14} className="text-green-500" />
                <span className="text-gray-600">نشاط العمل:</span>
                <span className="font-medium">{profileData.jobActivity}</span>
              </div>
              {profileData.position && (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-green-500" />
                  <span className="text-gray-600">المنصب:</span>
                  <span className="font-medium">{profileData.position}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {profileData.company && (
                <div className="flex items-center gap-2">
                  <Building size={14} className="text-green-500" />
                  <span className="text-gray-600">الشركة:</span>
                  <span className="font-medium">{profileData.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-green-500" />
                <span className="text-gray-600">مكان العمل:</span>
                <span className="font-medium">{profileData.jobAddress}</span>
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {profileData.jobNature} | {profileData.jobActivity} |{" "}
                {profileData.jobAddress}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="bg-gradient-to-r from-[#F5FFFC] to-gray-50 font-tajwal mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
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
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1b9174] to-green-600 flex items-center justify-center">
                  <User size={80} className="text-white opacity-80" />
                </div>
              )}
            </div>
            <div className="absolute -top-2 -right-2 bg-[#b8ac8c] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              مستظهر
            </div>
            <button className="absolute bottom-2 left-2 bg-[#1b9174] hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors">
              <Camera size={16} />
            </button>
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center lg:text-right">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {profileData.name}
              </h1>
              <p className="text-xl text-[#1b9174] font-medium">
                {profileData.branchCenter}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">الاسم الكامل</span>
                  <span>{profileData.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">تاريخ الميلاد</span>
                  <span>{profileData.birthDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">الايميل</span>
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">المدينة الحالية</span>
                  <span>{profileData.city}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span  className="text-gray-500">
                    رقم الهاتف
                  </span>

                  <span dir="ltr" className="ltr text-left">{profileData.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span  className=" text-gray-500">
                    رقم الهاتف 2
                  </span>
                  <span dir="ltr" className="ltr text-left">{profileData.phone2 || "/"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">عنوان السكن</span>
                  <span>{profileData.address}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">
                    {profileData.work
                      ? `الوظيفة الحالية`
                      : profileData.study
                      ? `المستوى الحالي`
                      : ""}
                  </span>
                  <span>{profileData.currentJob}</span>
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
      <div className="px-8 py-6" ref={ref}>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 lg:gap-20">
          <div className="text-center">
            <div className="text-gray-600 text-md">مستظهر سنة</div>
            <div className="text-4xl font-bold text-[#b8ac8c] mb-1">
              {inView && (
                <CountUp
                  start={profileData.memerYear - 1000}
                  end={profileData.memerYear}
                  duration={2}
                  delay={0}
                  separator=""
                />
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 text-sm">المستظهر رقم</div>
            <div className="text-3xl font-bold text-[#b8ac8c] mb-1">
              {inView && (
                <CountUp
                  start={0}
                  end={profileData.memerNumber}
                  duration={2}
                  delay={0}
                />
              )}
            </div>
            <div className="text-gray-600 text-sm">في تاريخ المحضرة</div>
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="text-xl font-bold mb-1">فرع المحضرة</div>
          <div className="text-3xl font-bold text-green-800">
            {profileData.branchCenter}
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
                معلومات شخصية
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المستوى الدراسي الأخير</span>
                  <span>{profileData.lastEducation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">التخصص</span>
                  <span>{profileData.Speciality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">النشاط في المحضرة</span>
                  <span>{profileData.mahdaraActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">النشاط الميداني</span>
                  <span>{profileData.SocialActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">حساب فيسبوك</span>
                  <span>{profileData.facebook}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl p-6 ring-1 ring-[#b8ac8c]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Book className="text-green-600" size={20} />
                معلومات الاستظهار
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ الاستظهار</span>
                  <span>{profileData.memerYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">المستظهر عنده</span>
                  <span>{profileData.memTeacher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">مركز الاستظهار</span>
                  <span>{profileData.memCenter || "بن ساشو"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الاستظهار الترتيلي سنة</span>
                  <span>{profileData.tartilMemYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
