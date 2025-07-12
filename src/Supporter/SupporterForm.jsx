import React, { useState, useEffect } from "react";
import {
  Save,
  Camera,
  User,
  Book,
  Upload,
  X,
  Undo2,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const SupporterForm = ({
  supporter,
  onSave,
  onCancel,
  branches,
  activities,
  jobTypes,
  educationLevels,
  workerNatures,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    phone2: "",
    email: "",
    branchCenter: "",
    memerYear: "",
    memerNumber: "",
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
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (supporter) {
      setFormData(supporter);
      if (supporter.profileImage) {
        setImagePreview(supporter.profileImage);
      }
    }
  }, [supporter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      profileImage: "",
    }));
    document.getElementById("imageInput").value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    onSave(formData);
    setIsUploading(false);
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all duration-200 text-right bg-white";
  const labelClasses =
    "block text-sm font-medium text-gray-700 mb-2 text-right";

  return (
    <div
      className="bg-gradient-to-r from-[#F5FFFC] to-gray-50 font-sans mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      dir="rtl"
    >
      {/* Header Section */}

      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

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
                  <User size={80} className="text-gray-400" />
                )}
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <div className="absolute -top-2 left-2 bg-[#b8ac8c] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                مساعد المحضرة
              </div>
            </div>
            <div className="flex gap-3">
              <label
                htmlFor="imageInput"
                className="bg-[#1b9174] hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
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
        </div>

        {/* Basic Information Section */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-[#1b9174]" size={24} />
                المعلومات الأساسية
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>الاسم الكامل</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    رقم الهاتف الثاني (اختياري)
                  </label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>المدينة الحالية</label>
                  <input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>الجامعة (إن وجدت)</label>
                  <input
                    type="text"
                    name="studentUniversity"
                    value={formData.studentUniversity}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>العنوان</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional and Educational Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Professional/Educational Info */}
            <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="text-[#1b9174]" size={20} />
                معلومات مهنية وتعليمية
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>نوع العمل</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">اختر نوع العمل</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>المستوى الدراسي الأخير</label>
                  <select
                    name="lastEducation"
                    value={formData.lastEducation}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">اختر المستوى</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>طبيعة العمل</label>
                  <select
                    name="workerNature"
                    value={formData.workerNature}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">اختر طبيعة العمل</option>
                    {workerNatures.map((nature) => (
                      <option key={nature} value={nature}>
                        {nature}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>الوظيفة الحالية</label>
                  <input
                    type="text"
                    name="workerJob"
                    value={formData.workerJob}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Madhara Information */}
            <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Book className="text-[#1b9174]" size={20} />
                معلومات المحضرة
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>فرع المحضرة</label>
                  <select
                    name="branchCenter"
                    value={formData.branchCenter}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>سنة الاستظهار</label>
                  <input
                    type="text"
                    name="memerYear"
                    value={formData.memerYear}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>مركز الاستظهار</label>
                  <input
                    type="text"
                    name="memCenter"
                    value={formData.memCenter}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>معلم الاستظهار</label>
                  <input
                    type="text"
                    name="memTeacher"
                    value={formData.memTeacher}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>النشاط الميداني</label>
                  <select
                    name="fieldActivity"
                    value={formData.fieldActivity}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">اختر النشاط الميداني</option>
                    {activities.map((activity) => (
                      <option key={activity} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>النشاط في المحضرة</label>
                  <textarea
                    name="activityInMahdhara"
                    value={formData.activityInMahdhara}
                    onChange={handleInputChange}
                    className={inputClasses}
                    rows="3"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                نشط هذه السنة
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="attendanceThisYear"
                  checked={formData.attendanceThisYear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      attendanceThisYear: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isUploading}
              className={`${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1b9174] to-green-600 hover:from-green-700 hover:to-green-800"
              } text-white px-8 py-4 rounded-xl flex items-center gap-3 text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              <Save size={20} />
              {isUploading ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupporterForm;
