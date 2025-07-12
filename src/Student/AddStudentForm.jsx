import React, { useState } from "react";
import {
  X,
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  Award,
  Activity,
  Book,
  Upload,
  Loader2,
} from "lucide-react";
import { addStudent, uploadImageToCloudinary } from "../googleSheetApi"; // Update the import path

const AddStudentForm = ({
  onSave,
  onCancel,
  branches = [],
  activities = [],
  fieldActivities = [],
  jobTypes = [],
  educationLevels = [],
  workerNatures = [],
  memoryCenters = [],
  specialities = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    birthDate: "",
    phone: "",
    phone2: "",
    email: "",
    city: "",
    address: "",
    facebook: "",
    jobType: "طالب",
    // Student fields
    studentSpeciality: "",
    studentUniversity: "",
    // Worker fields
    workerJob: "",
    workerNature: "",
    workerLocation: "",
    lastEducation: "",
    Speciality: "",
    activity: [],
    fieldActivity: [],
    branchCenter: [],
    graduationDate: "",
    memTeacher: "",
    memerYear: "",
    /*     memerNumber: "", */
    tartilMemYear: "",
    memCenter: "",
    profileImage: null,
    profileImageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default values if not provided as props
  const usedBranches =
    branches.length > 0
      ? branches
      : [
          "بابا السعد",
          "فرع كركورة ",
          "الشواهين",
          "فرع قسنطينة ",
          "فرع باييزي ",
        ];

  const usedActivities =
    activities.length > 0
      ? activities
      : ["أستاذ", "أستاذ التجويد", "إمام", "مؤذن", "خطيب", "مدرس", "محفظ"];

  const usedFieldActivities =
    fieldActivities.length > 0
      ? fieldActivities
      : ["إمام", "مؤذن", "خطيب", "مدرس", "محفظ", "واعظ", "مرشد"];

  const usedJobTypes =
    jobTypes.length > 0
      ? jobTypes
      : ["طالب", "موظف", "طبيب", "معلم", "مهندس", "تاجر", "ربة منزل", "محامي"];

  const usedEducationLevels =
    educationLevels.length > 0
      ? educationLevels
      : ["أساسي", "متوسط", "ثانوي", "ليسانس", "ماستر 1", "ماستر 2", "دكتوراه"];

  const usedWorkerNatures =
    workerNatures.length > 0 ? workerNatures : ["متطوع", "متفرغ", "عقد مؤقت"];

  const usedMemoryCenters =
    memoryCenters.length > 0 ? memoryCenters : ["بن ساشو", "موسى بوكراع"];

  const usedSpecialities =
    specialities.length > 0
      ? specialities
      : ["إعلام آلي", "هندسة", "طب", "علوم شرعية"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [name]: newValues,
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      profileImageUrl: "",
    }));
    document.getElementById("imageInput").value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    /* if (!formData.name.trim()) newErrors.name = "الاسم مطلوب"; */
    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    /* if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"; */
    /* if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    } */
    if (!formData.birthDate) newErrors.birthDate = "تاريخ الميلاد مطلوب";
    /* if (!formData.city.trim()) newErrors.city = "المدينة مطلوبة";
    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";
    if (!formData.jobType) newErrors.jobType = "نوع العمل مطلوب"; */

    /* if (formData.jobType === "طالب") {
      if (!formData.studentSpeciality.trim())
        newErrors.studentSpeciality = "التخصص مطلوب";
      if (!formData.studentUniversity.trim())
        newErrors.studentUniversity = "الجامعة مطلوبة";
    }

    if (!formData.lastEducation)
      newErrors.lastEducation = "المستوى الدراسي مطلوب";
    if (!formData.Speciality.trim())
      newErrors.Speciality = "التخصص الدراسي مطلوب"; */
    if (!formData.graduationDate)
      newErrors.graduationDate = "تاريخ الاستظهار مطلوب";
   /*  if (!formData.memTeacher.trim())
      newErrors.memTeacher = "المستظهر عنده مطلوب";
    if (!formData.memCenter) newErrors.memCenter = "مركز الاستظهار مطلوب";
    if (formData.branchCenter.length === 0)
      newErrors.branchCenter = "يجب اختيار فرع واحد على الأقل";
 */
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Upload image if exists
      let imageUrl = "";
      if (formData.profileImage) {
        imageUrl = await uploadImageToCloudinary(formData.profileImage);
      }

      // Prepare student data
      const studentData = {
        ...formData,
        profileImageUrl:
          imageUrl ||
          "https://res.cloudinary.com/ds4qqawzr/image/upload/v1749917257/pfp_tncrll.jpg",
      };

      // Add student to Google Sheets
      const createdStudent = await addStudent(studentData);

      // Call onSave with the created student data
      onSave(createdStudent);
    } catch (error) {
      console.error("Error saving student:", error);
      alert("حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-tajwal bg-white" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1b9174] to-green-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              إضافة طالب جديد
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Section */}
          <div className="rounded-2xl p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1b9174] shadow-xl bg-gray-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <label
                htmlFor="imageInput"
                className="bg-[#1b9174] hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-colors text-sm"
              >
                <Upload size={16} />
                {imagePreview ? "تغيير الصورة" : "رفع صورة شخصية"}
              </label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-[#1b9174]" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                المعلومات الشخصية
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل الاسم"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.fullName ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل الاسم الكامل"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الميلاد *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      pattern="\d{4}/\d{2}/\d{2}" // Enforces format
                      placeholder="YYYY/MM/DD"
                      value={formData.birthDate}
                      onChange={(e) =>
                        handleInputChange("birthDate", e.target.value)
                      }
                      className={`w-full pl-4 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.birthDate ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة الحالية *
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.city ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="أدخل المدينة الحالية"
                    />
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.address ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل العنوان الكامل"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حساب فيسبوك
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) =>
                      handleInputChange("facebook", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                    placeholder="أدخل رابط حساب فيسبوك"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                معلومات الاتصال
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.phone ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف الثاني (اختياري)
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      value={formData.phone2}
                      onChange={(e) =>
                        handleInputChange("phone2", e.target.value)
                      }
                      className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                      placeholder="أدخل رقم هاتف إضافي"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Education & Work Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                التعليم والعمل
              </h3>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع العمل *
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white ${
                    errors.jobType ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value="">اختر نوع العمل</option>
                  {usedJobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                {errors.jobType && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>
                )}
              </div>

              {formData.jobType === "طالب" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التخصص *
                    </label>
                    <input
                      type="text"
                      value={formData.studentSpeciality}
                      onChange={(e) =>
                        handleInputChange("studentSpeciality", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.studentSpeciality
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder="أدخل التخصص"
                    />
                    {errors.studentSpeciality && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.studentSpeciality}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الجامعة *
                    </label>
                    <input
                      type="text"
                      value={formData.studentUniversity}
                      onChange={(e) =>
                        handleInputChange("studentUniversity", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.studentUniversity
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder="أدخل اسم الجامعة"
                    />
                    {errors.studentUniversity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.studentUniversity}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {formData.jobType !== "طالب" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المهنة
                    </label>
                    <div className="relative">
                      <Briefcase
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formData.workerJob}
                        onChange={(e) =>
                          handleInputChange("workerJob", e.target.value)
                        }
                        className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                        placeholder="أدخل المهنة"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      طبيعة العمل
                    </label>
                    <select
                      value={formData.workerNature}
                      onChange={(e) =>
                        handleInputChange("workerNature", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="">اختر طبيعة العمل</option>
                      {usedWorkerNatures.map((nature) => (
                        <option key={nature} value={nature}>
                          {nature}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مكان العمل
                    </label>
                    <input
                      type="text"
                      value={formData.workerLocation}
                      onChange={(e) =>
                        handleInputChange("workerLocation", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                      placeholder="أدخل مكان العمل"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى الدراسي الأخير *
                  </label>
                  <select
                    value={formData.lastEducation}
                    onChange={(e) =>
                      handleInputChange("lastEducation", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white ${
                      errors.lastEducation
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="">اختر المستوى الدراسي</option>
                    {usedEducationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  {errors.lastEducation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastEducation}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التخصص الدراسي *
                  </label>
                  <input
                    type="text"
                    value={formData.Speciality}
                    onChange={(e) =>
                      handleInputChange("Speciality", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.Speciality ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل التخصص الدراسي"
                  />
                  {errors.Speciality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Speciality}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Memory Information Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Book className="text-teal-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                معلومات الاستظهار
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الاستظهار *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      pattern="\d{4}/\d{2}/\d{2}" // Enforces format
                      value={formData.graduationDate}
                      onChange={(e) => {
                        const value = e.target.value;

                        const filteredValue = value.replace(/[^\d/]/g, "");

                        // Format the input as YYYY/MM/DD
                        let formattedValue = filteredValue;
                        if (
                          filteredValue.length >= 4 &&
                          filteredValue.charAt(4) !== "-"
                        ) {
                          formattedValue =
                            filteredValue.slice(0, 4) +
                            "-" +
                            filteredValue.slice(4);
                        }
                        if (
                          filteredValue.length >= 7 &&
                          filteredValue.charAt(7) !== "-"
                        ) {
                          formattedValue =
                            formattedValue.slice(0, 7) +
                            "-" +
                            formattedValue.slice(7);
                        }

                        if (formattedValue.length <= 10) {
                          handleInputChange("graduationDate", formattedValue);

                          if (formattedValue.length === 10) {
                            const [year, month, day] = formattedValue
                              .split("-")
                              .map(Number);

                            if (
                              year &&
                              month >= 1 &&
                              month <= 12 &&
                              day >= 1 &&
                              day <= 31
                            ) {
                              // Create date object to validate
                              const dateObj = new Date(year, month - 1, day);

                              if (
                                dateObj.getFullYear() === year &&
                                dateObj.getMonth() === month - 1 &&
                                dateObj.getDate() === day
                              ) {
                                handleInputChange("memerYear", year);
                              }
                            }
                          }
                        }

                        console.log(formData);
                      }}
                      className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.graduationDate
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.graduationDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.graduationDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستظهر عنده *
                  </label>
                  <input
                    type="text"
                    value={formData.memTeacher}
                    onChange={(e) =>
                      handleInputChange("memTeacher", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.memTeacher ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل اسم المعلم"
                  />
                  {errors.memTeacher && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.memTeacher}
                    </p>
                  )}
                </div>

                {/*  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنة الاستظهار *
                  </label>
                  <input
                    type="text"
                    value={formData.memerYear}
                    onChange={(e) => handleInputChange("memerYear", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.memerYear ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل سنة الاستظهار"
                  />
                  {errors.memerYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.memerYear}</p>
                  )}
                </div> */}

                {/*                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم المستظهر *
                  </label>
                  <input
                    type="text"
                    value={formData.memerNumber}
                    onChange={(e) => handleInputChange("memerNumber", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.memerNumber ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="أدخل رقم المستظهر"
                  />
                  {errors.memerNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.memerNumber}</p>
                  )}
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنة الاستظهار الترتيلي
                  </label>
                  <input
                    type="text"
                    value={formData.tartilMemYear}
                    onChange={(e) =>
                      handleInputChange("tartilMemYear", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                    placeholder="أدخل سنة الاستظهار الترتيلي"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مركز الاستظهار *
                  </label>
                  <select
                    value={formData.memCenter}
                    onChange={(e) =>
                      handleInputChange("memCenter", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white ${
                      errors.memCenter ? "border-red-300" : "border-gray-200"
                    }`}
                  >
                    <option value="">اختر مركز الاستظهار</option>
                    {usedMemoryCenters.map((center) => (
                      <option key={center} value={center}>
                        {center}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  {errors.memCenter && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.memCenter}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activities Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">النشاطات</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  النشاط في المحضرة *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {usedActivities.map((activity) => (
                    <label
                      key={activity}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.activity.includes(activity)}
                        onChange={() =>
                          handleMultiSelectChange("activity", activity)
                        }
                        className="rounded border-gray-300 text-[#1b9174] focus:ring-[#1b9174]"
                      />
                      <span>{activity}</span>
                    </label>
                  ))}
                </div>
                {errors.activity && (
                  <p className="text-red-500 text-sm mt-1">{errors.activity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  النشاط الميداني
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {usedFieldActivities.map((activity) => (
                    <label
                      key={activity}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.fieldActivity.includes(activity)}
                        onChange={() =>
                          handleMultiSelectChange("fieldActivity", activity)
                        }
                        className="rounded border-gray-300 text-[#1b9174] focus:ring-[#1b9174]"
                      />
                      <span>{activity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  الفروع والمراكز *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {usedBranches.map((branch) => (
                    <label
                      key={branch}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.branchCenter.includes(branch)}
                        onChange={() =>
                          handleMultiSelectChange("branchCenter", branch)
                        }
                        className="rounded border-gray-300 text-[#1b9174] focus:ring-[#1b9174]"
                      />
                      <span>{branch}</span>
                    </label>
                  ))}
                </div>
                {errors.branchCenter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.branchCenter}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 ml-2 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          إلغاء
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#1b9174] to-green-600 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              جاري الحفظ...
            </>
          ) : (
            "حفظ الطالب"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddStudentForm;
