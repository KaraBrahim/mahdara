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
  Loader2,
  Check,
} from "lucide-react";
import { updateStudent, uploadImageToCloudinary } from "../googleSheetApi";

const ProfileForm = ({
  student,
  onSave,
  onCancel,
  branches,
  activities,
  fieldActivities,
  jobTypes,
  educationLevels,
  workerNatures,
  memoryCenters,
  specialities,
}) => {
  // Initialize with default values to prevent undefined
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    fullName: "",
    birthDate: "",
    email: "",
    city: "",
    phone: "",
    phone2: "",
    address: "",
    jobType: "عامل",
    workerJob: "",
    workerNature: "",
    workerLocation: "",
    studentSpeciality: "",
    studentUniversity: "",
    facebook: "",
    activity: [],
    fieldActivity: [],
    lastEducation: "",
    graduationDate: "",
    memTeacher: "",
    branchCenter: [],
    memerYear: "",
    tartilMemYear: "",
    memCenter: "",
    Speciality: "",
    profileImage: "",
    profileImageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      // Ensure all values are defined with fallbacks
      setFormData({
        id: student.id || "",
        name: student.name || "",
        fullName: student.fullName || "",
        birthDate: student.birthDate || "",
        email: student.email || "",
        city: student.city || "",
        phone: student.phone || "",
        phone2: student.phone2 || "",
        address: student.address || "",
        jobType: student.jobType || "عامل",
        workerJob: student.workerJob || "",
        workerNature: student.workerNature || "",
        workerLocation: student.workerLocation || "",
        studentSpeciality: student.studentSpeciality || "",
        studentUniversity: student.studentUniversity || "",
        facebook: student.facebook || "",
        activity: student.mahdaraActivity
          ? student.mahdaraActivity.split(", ")
          : [],
        fieldActivity: student.SocialActivity
          ? student.SocialActivity.split(", ")
          : [],
        lastEducation: student.lastEducation || "",
        graduationDate: student.graduationDate || "",
        memTeacher: student.memTeacher || "",
        branchCenter: student.branchCenter
          ? student.branchCenter.split(", ")
          : [],
        memerYear: student.memerYear || "",
        tartilMemYear: student.tartilMemYear || "",
        memCenter: student.memCenter || "",
        Speciality: student.Speciality || "",
        profileImage: student.profileImage || "",
        profileImageUrl: student.profileImageUrl || "",
      });

      if (student.profileImage) {
        setImagePreview(student.profileImage);
      }
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "", // Ensure value is never undefined
    }));

    // Clear error if field is filled
    if (errors[name] && value) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
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
      profileImage: "",
      profileImageUrl: "",
    }));
    const imageInput = document.getElementById("imageInput");
    if (imageInput) {
      imageInput.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    /*    if (!formData.birthDate) newErrors.birthDate = "تاريخ الميلاد مطلوب";
    if (!formData.phone?.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.email?.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }
    if (!formData.city?.trim()) newErrors.city = "المدينة مطلوبة";
    if (!formData.address?.trim()) newErrors.address = "العنوان مطلوب";
    if (!formData.jobType) newErrors.jobType = "نوع العمل مطلوب";
    if (!formData.graduationDate)
      newErrors.graduationDate = "تاريخ الاستظهار مطلوب";
    if (!formData.memTeacher?.trim())
      newErrors.memTeacher = "المستظهر عنده مطلوب";
    if (!formData.memCenter) newErrors.memCenter = "مركز الاستظهار مطلوب";
    if (!formData.branchCenter || formData.branchCenter.length === 0)
      newErrors.branchCenter = "يجب اختيار فرع واحد على الأقل";
 */
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      let updatedFormData = { ...formData };

      // Upload new image if exists
      if (formData.profileImage && typeof formData.profileImage !== "string") {
        const imageUrl = await uploadImageToCloudinary(formData.profileImage);
        updatedFormData.profileImageUrl = imageUrl;
      }

      // Update student in Google Sheets
      const updatedStudent = await updateStudent(updatedFormData);

      // Show success animation
      setIsSuccess(true);

      // Wait for animation to complete before calling onSave and closing
      setTimeout(() => {
        onSave(updatedStudent);
        // Close the form after successful save
        onCancel();
      }, 1500); // 1.5 seconds for success animation
    } catch (error) {
      console.error("Error updating student:", error);
      alert("حدث خطأ أثناء تحديث البيانات. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  };

  const inputClasses = (error) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1b9174] focus:border-transparent transition-all duration-200 text-right bg-white ${
      error ? "border-red-300" : "border-gray-200"
    }`;

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
                مستظهر المحضرة
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
                  <label className={labelClasses}>الاسم</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.name)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>الاسم الكامل *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.fullName)}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>تاريخ الميلاد *</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.birthDate)}
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>البريد الإلكتروني *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>المدينة الحالية *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.city)}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>رقم الهاتف *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.phone)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>رقم الهاتف الثاني</label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2 || ""}
                    onChange={handleInputChange}
                    className={inputClasses()}
                  />
                </div>

                <div>
                  <label className={labelClasses}>عنوان السكن *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.address)}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>حساب فيسبوك</label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook || ""}
                    onChange={handleInputChange}
                    className={inputClasses()}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional and Educational Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Job Type and Professional Info */}
            <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="text-[#1b9174]" size={20} />
                معلومات مهنية وتعليمية
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>نوع العمل *</label>
                  <select
                    name="jobType"
                    value={formData.jobType || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.jobType)}
                  >
                    <option value="">اختر نوع العمل</option>
                    {jobTypes?.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.jobType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobType}
                    </p>
                  )}
                </div>

                {formData.jobType === "عامل" && (
                  <>
                    <div>
                      <label className={labelClasses}>المهنة</label>
                      <input
                        type="text"
                        name="workerJob"
                        value={formData.workerJob || ""}
                        onChange={handleInputChange}
                        className={inputClasses()}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>طبيعة العمل</label>
                      <select
                        name="workerNature"
                        value={formData.workerNature || ""}
                        onChange={handleInputChange}
                        className={inputClasses()}
                      >
                        <option value="">اختر طبيعة العمل</option>
                        {workerNatures?.map((nature) => (
                          <option key={nature} value={nature}>
                            {nature}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClasses}>مكان العمل</label>
                      <input
                        type="text"
                        name="workerLocation"
                        value={formData.workerLocation || ""}
                        onChange={handleInputChange}
                        className={inputClasses()}
                      />
                    </div>
                  </>
                )}

                {formData.jobType === "طالب" && (
                  <>
                    <div>
                      <label className={labelClasses}>التخصص</label>
                      <input
                        type="text"
                        name="studentSpeciality"
                        value={formData.studentSpeciality || ""}
                        onChange={handleInputChange}
                        className={inputClasses()}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>الجامعة</label>
                      <input
                        type="text"
                        name="studentUniversity"
                        value={formData.studentUniversity || ""}
                        onChange={handleInputChange}
                        className={inputClasses()}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className={labelClasses}>
                    المستوى الدراسي الأخير *
                  </label>
                  <select
                    name="lastEducation"
                    value={formData.lastEducation || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.lastEducation)}
                  >
                    <option value="">اختر المستوى</option>
                    {educationLevels?.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.lastEducation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastEducation}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>التخصص الدراسي</label>
                  <input
                    type="text"
                    name="Speciality"
                    value={formData.Speciality || ""}
                    onChange={handleInputChange}
                    className={inputClasses()}
                  />
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <GraduationCap className="text-[#1b9174]" size={20} />
                الأنشطة والمشاركات
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>النشاط في المحضرة</label>
                  <div className="grid grid-cols-2 gap-2">
                    {activities?.map((activity) => (
                      <label
                        key={activity}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.activity?.includes(activity) || false
                          }
                          onChange={() =>
                            handleMultiSelectChange("activity", activity)
                          }
                          className="w-4 h-4 text-[#1b9174] bg-gray-100 border-gray-300 rounded focus:ring-[#1b9174] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">
                          {activity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>النشاط الميداني</label>
                  <div className="grid grid-cols-2 gap-2">
                    {fieldActivities?.map((fieldActivity) => (
                      <label
                        key={fieldActivity}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.fieldActivity?.includes(fieldActivity) ||
                            false
                          }
                          onChange={() =>
                            handleMultiSelectChange(
                              "fieldActivity",
                              fieldActivity
                            )
                          }
                          className="w-4 h-4 text-[#1b9174] bg-gray-100 border-gray-300 rounded focus:ring-[#1b9174] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">
                          {fieldActivity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Memorization Information */}
          <div className="mb-8">
            <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Book className="text-[#1b9174]" size={24} />
                معلومات الاستظهار
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>تاريخ الاستظهار *</label>
                  <input
                    type="date"
                    name="graduationDate"
                    value={formData.graduationDate || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.graduationDate)}
                  />
                  {errors.graduationDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.graduationDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>المستظهر عنده *</label>
                  <input
                    type="text"
                    name="memTeacher"
                    value={formData.memTeacher || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.memTeacher)}
                  />
                  {errors.memTeacher && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.memTeacher}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>فرع المحضرة *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {branches?.map((branch) => (
                      <label
                        key={branch}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.branchCenter?.includes(branch) || false
                          }
                          onChange={() =>
                            handleMultiSelectChange("branchCenter", branch)
                          }
                          className="w-4 h-4 text-[#1b9174] bg-gray-100 border-gray-300 rounded focus:ring-[#1b9174] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{branch}</span>
                      </label>
                    ))}
                  </div>
                  {errors.branchCenter && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.branchCenter}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>مستظهر سنة</label>
                  <input
                    type="text"
                    name="memerYear"
                    value={formData.memerYear || ""}
                    onChange={handleInputChange}
                    className={inputClasses()}
                  />
                </div>

                <div>
                  <label className={labelClasses}>الاستظهار الترتيلي</label>
                  <input
                    type="text"
                    name="tartilMemYear"
                    value={formData.tartilMemYear || ""}
                    onChange={handleInputChange}
                    className={inputClasses()}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>مركز الاستظهار *</label>
                  <select
                    name="memCenter"
                    value={formData.memCenter || ""}
                    onChange={handleInputChange}
                    className={inputClasses(errors.memCenter)}
                  >
                    <option value="">اختر المركز</option>
                    {memoryCenters?.map((center) => (
                      <option key={center} value={center}>
                        {center}
                      </option>
                    ))}
                  </select>
                  {errors.memCenter && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.memCenter}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-4 pb-8">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`px-6 py-3 rounded-xl transition-all duration-500 font-medium shadow-lg flex items-center gap-2 min-w-[140px] justify-center ${
                isSuccess
                  ? "bg-green-500 text-white transform scale-105 shadow-xl"
                  : isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1b9174] to-green-600 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="animate-bounce" size={18} />
                  تم الحفظ بنجاح!
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save size={18} />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
