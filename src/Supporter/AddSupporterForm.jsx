import React, { useState } from 'react';
import { X, ChevronDown, User, Phone, Mail, MapPin, Briefcase, GraduationCap, Calendar, FileText, Award } from 'lucide-react';

const AddSupporterForm = ({ 
  onSave, 
  onCancel, 
  branches = [],
  activities = [],
  jobTypes = [],
  educationLevels = [],
  workerNatures = []
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    email: "",
    branchCenter: "",
    memerYear: "",
    currentCity: "",
    studentUniversity: "",
    jobType: "",
    lastEducation: "",
    workerNature: "",
    fieldActivity: "",
    workerJob: "",
    address: "",
    memCenter: "",
    memTeacher: "",
    activityInMahdhara: "",
    attendanceThisYear: true,
  });

  const [errors, setErrors] = useState({});

  const defaultBranches = [
    "بابا السعد",
    "فرع كركورة ",
    "فرع السعادة",
    "فرع قسنطينة ",
    "فرع باييزي ",
  ];

  const defaultActivities = [
    "مساعد إداري",
    "الإشراف التربوي",
    "التدريس",
    "التقنية والمعلومات",
    "الخدمات اللوجستية",
    "التنظيم المالي",
    "الإعلام والتواصل",
    "الإشراف القانوني",
  ];

  const defaultJobTypes = [
    "موظف",
    "طبيب",
    "معلم",
    "مهندس",
    "تاجر",
    "طالب",
    "ربة منزل",
    "محامي",
  ];

  const defaultEducationLevels = ["باكالوريا", "ليسانس", "ماستر", "دكتوراه"];
  const defaultWorkerNatures = ["متطوع", "متفرغ", "عقد مؤقت"];

  const usedBranches = branches.length > 0 ? branches : defaultBranches;
  const usedActivities = activities.length > 0 ? activities : defaultActivities;
  const usedJobTypes = jobTypes.length > 0 ? jobTypes : defaultJobTypes;
  const usedEducationLevels = educationLevels.length > 0 ? educationLevels : defaultEducationLevels;
  const usedWorkerNatures = workerNatures.length > 0 ? workerNatures : defaultWorkerNatures;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم الكامل مطلوب';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف الأساسي مطلوب';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.branchCenter) {
      newErrors.branchCenter = 'الفرع مطلوب';
    }
    
    if (!formData.memerYear.trim()) {
      newErrors.memerYear = 'سنة الاستظهار مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="font-tajwal bg-white" dir="rtl" >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1b9174] to-green-600 flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              إضافة مساعد جديد
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
        <div className="space-y-8">
          {/* Personal Information Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-[#1b9174]" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">المعلومات الشخصية</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="أدخل الاسم الكامل"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة الحالية
                  </label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.currentCity}
                      onChange={(e) => handleInputChange('currentCity', e.target.value)}
                      className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                      placeholder="أدخل المدينة الحالية"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                    placeholder="أدخل العنوان الكامل"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">معلومات الاتصال</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف الأساسي *
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف الثانوي (اختياري)
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.phone2}
                      onChange={(e) => handleInputChange('phone2', e.target.value)}
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
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Education & Work Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">التعليم والعمل</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الجامعة (إن وجدت)
                  </label>
                  <input
                    type="text"
                    value={formData.studentUniversity}
                    onChange={(e) => handleInputChange('studentUniversity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                    placeholder="أدخل اسم الجامعة"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى الدراسي
                  </label>
                  <select
                    value={formData.lastEducation}
                    onChange={(e) => handleInputChange('lastEducation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">اختر المستوى الدراسي</option>
                    {usedEducationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع العمل
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">اختر نوع العمل</option>
                    {usedJobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    طبيعة العمل
                  </label>
                  <select
                    value={formData.workerNature}
                    onChange={(e) => handleInputChange('workerNature', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">اختر طبيعة العمل</option>
                    {usedWorkerNatures.map((nature) => (
                      <option key={nature} value={nature}>
                        {nature}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوظيفة الحالية
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.workerJob}
                      onChange={(e) => handleInputChange('workerJob', e.target.value)}
                      className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                      placeholder="أدخل الوظيفة الحالية"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Madhara Information Section */}
          <div className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-teal-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">معلومات المحضرة</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفرع *
                  </label>
                  <select
                    value={formData.branchCenter}
                    onChange={(e) => handleInputChange('branchCenter', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white ${
                      errors.branchCenter ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">اختر فرع المحضرة</option>
                    {usedBranches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400" size={20} />
                  {errors.branchCenter && <p className="text-red-500 text-sm mt-1">{errors.branchCenter}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنة الاستظهار *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.memerYear}
                      onChange={(e) => handleInputChange('memerYear', e.target.value)}
                      className={`w-full pr-10 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all ${
                        errors.memerYear ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="أدخل سنة الاستظهار"
                    />
                  </div>
                  {errors.memerYear && <p className="text-red-500 text-sm mt-1">{errors.memerYear}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مركز الاستظهار
                  </label>
                  <input
                    type="text"
                    value={formData.memCenter}
                    onChange={(e) => handleInputChange('memCenter', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                    placeholder="أدخل مركز الاستظهار"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معلم الاستظهار
                  </label>
                  <input
                    type="text"
                    value={formData.memTeacher}
                    onChange={(e) => handleInputChange('memTeacher', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all"
                    placeholder="أدخل اسم المعلم"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النشاط الميداني
                </label>
                <select
                  value={formData.fieldActivity}
                  onChange={(e) => handleInputChange('fieldActivity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">اختر النشاط الميداني</option>
                  {usedActivities.map((activity) => (
                    <option key={activity} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النشاط في المحضرة
                </label>
                <div className="relative">
                  <FileText className="absolute right-3 top-3 text-gray-400" size={18} />
                  <textarea
                    value={formData.activityInMahdhara}
                    onChange={(e) => handleInputChange('activityInMahdhara', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all resize-none"
                    placeholder="صف النشاط الذي يقوم به المساعد في المحضرة"
                    rows="3"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.attendanceThisYear}
                      onChange={(e) => handleInputChange('attendanceThisYear', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      formData.attendanceThisYear 
                        ? 'bg-[#1b9174] border-[#1b9174]' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {formData.attendanceThisYear && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    نشط هذه السنة
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 mt-8 -mx-6 -mb-6 rounded-b-3xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#1b9174] to-green-600 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            حفظ المساند
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSupporterForm;