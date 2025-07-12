const API_KEY = "AIzaSyAZL8oW4PZZjuhMfsRZuyOw9DP9Xj0nt-M";
const CLIENT_ID =
  "607196946730-cue47gq9kcoim4017revjqflv94n3na9.apps.googleusercontent.com";
const SPREADSHEET_ID = "1sTWgddfNaRwzc63Yexa3ur7EXCpjP1p2fBxEDdI_oyc";
const SCOPES =
  "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";

const SHEETS = {
  MahdaraMemorizedStudent: "mahdara-memorized-students",
  MahdaraHlpers: "mahdara-helpers",
};

// Global variables
let isApiLoaded = false;
let tokenClient = null;

export const fetchStudents = async () => {
  try {
    // Check if Google API is initialized
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    console.log("🔄 Fetching students from Google Sheets...");

    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!A3:AG`,
    });

    const rows = response.result.values || [];

    const students = rows.map((row) => ({
      id: row[0],
      fullName: row[1] || "/",
      name: extractName(row[1]),
      branchCenter: row[2] || "غير محدد",
      jobType: row[0] || "/",
      birthDate: row[3] || "/",
      email: row[11] || "",
      city: row[12] || "/",
      phone: row[8] || "/",
      phone2: row[9] || "/",
      address: row[22] || "/",
      work: row[16] || "/",
      study: row[14] || "/",
      jobNature: row[19] || "/",
      jobActivity: row[20] || "/",
      jobAddress: row[21] || "/",
      currentJob: "",
      facebook: row[10] || "/",
      SocialActivity: row[23] || "/",
      mahdaraActivity: row[24] || "/",
      lastEducation: row[17] || "/",
      memerDate: row[5] || "/",
      memTeacher: row[6] || "/",
      memerYear: row[4] || "/",
      memerNumber: row[27] || "/",
      tartilMemYear: row[7] || "/",
      memCenter: row[25] || "بن ساشو",
      Speciality: row[18] || "/",
      profileImage:
        row[28] ||
        "https://res.cloudinary.com/ds4qqawzr/image/upload/v1749917257/pfp_tncrll.jpg",
      profileUrl: row[29] || "/",
      attendance2025: row[30] || "/",
      studentUniversity: row[21] || "جامعة عبد الحميد مهري",
    }));

    console.log(`✅ Fetched ${students.length} students from Google Sheets`);

    return students;
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    throw error;
  }
};

const initializeGapiClient = () => {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error("Google API not loaded"));
      return;
    }

    window.gapi.load("client", {
      callback: resolve,
      onerror: (error) => {
        console.error("GAPI client load error:", error);
        reject(error);
      },
      timeout: 10000,
      ontimeout: () => {
        reject(new Error("GAPI client load timeout"));
      },
    });
  });
};

// Helper function to configure GAPI client
const configureGapiClient = async () => {
  if (!window.gapi || !window.gapi.client) {
    throw new Error("GAPI client not available");
  }

  await window.gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  });
};

export const loadGoogleApi = async () => {
  if (isApiLoaded) {
    return;
  }

  try {
    await initializeGapiClient();
    await configureGapiClient();
    initializeTokenClient();
    isApiLoaded = true;
    console.log("Google API initialization completed successfully!");
  } catch (error) {
    console.error("Error loading Google API:", error);
    isApiLoaded = false;
    throw error;
  }
};

// Authentication functions remain the same...
export const isSignedIn = () => {
  try {
    if (!window.gapi || !window.gapi.client) {
      return false;
    }
    return window.gapi.client.getToken() !== null;
  } catch (error) {
    console.error("Error checking sign-in status:", error);
    return false;
  }
};

export const signIn = async (checkOnly = false) => {
  if (!tokenClient) {
    throw new Error(
      "Token client not initialized. Please call loadGoogleApi() first."
    );
  }

  const savedToken = sessionStorage.getItem("access_token");
  if (savedToken) {
    window.gapi.client.setToken({ access_token: savedToken });
  }

  const existingToken = window.gapi.client.getToken();

  if (checkOnly && existingToken) {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: { Authorization: `Bearer ${existingToken.access_token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userInfo = await response.json();
      console.log(userInfo);

      return {
        getEmail: () => userInfo.email,
        getName: () => userInfo.name,
        getImageUrl: () => userInfo.picture,
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      sessionStorage.removeItem("access_token");
      window.gapi.client.setToken(null);
      throw error;
    }
  }

  return new Promise((resolve, reject) => {
    const originalCallback = tokenClient.callback;

    tokenClient.callback = async (tokenResponse) => {
      tokenClient.callback = originalCallback;

      if (tokenResponse.error) {
        console.error("Token error:", tokenResponse);
        reject(new Error(`Authentication failed: ${tokenResponse.error}`));
        return;
      }

      try {
        sessionStorage.setItem("access_token", tokenResponse.access_token);
        window.gapi.client.setToken({
          access_token: tokenResponse.access_token,
        });

        const response = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userInfo = await response.json();
        console.log(userInfo);
        resolve({
          getEmail: () => userInfo.email,
          getName: () => userInfo.name,
          getImageUrl: () => userInfo.picture,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        reject(error);
      }
    };

    try {
      if (existingToken) {
        tokenClient.requestAccessToken({ prompt: "" });
      } else {
        tokenClient.requestAccessToken({ prompt: "select_account" });
      }
    } catch (error) {
      tokenClient.callback = originalCallback;
      reject(error);
    }
  });
};

const initializeTokenClient = () => {
  if (!window.google || !window.google.accounts) {
    throw new Error("Google Identity Services not loaded");
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: () => {},
    auto_select: false,
    cancel_on_tap_outside: false,
    use_fedcm_for_prompt: true,
  });
};

export const isTokenValid = async () => {
  const token = window.gapi?.client?.getToken();
  if (!token) return false;

  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token.access_token}`
    );
    if (response.ok) {
      const tokenInfo = await response.json();
      return tokenInfo.expires_in > 0;
    }
    return false;
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};

export const signOut = async () => {
  try {
    const token = window.gapi?.client?.getToken();

    if (token?.access_token) {
      try {
        await window.google.accounts.oauth2.revoke(token.access_token);
      } catch (revokeError) {
        console.warn("Error revoking token:", revokeError);
      }
      window.gapi.client.setToken(null);
    }

    sessionStorage.removeItem("access_token");
    console.log("Sign out completed successfully");
  } catch (error) {
    console.error("Error during sign out:", error);
    sessionStorage.removeItem("access_token");
    throw error;
  }
};

// Add this function to your Google Sheets API file

export const addStudent = async (studentData) => {
  try {
    // Check if Google API is initialized
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    // Check if user is signed in
    if (!isSignedIn()) {
      throw new Error("User not signed in");
    }

    console.log("🔄 Adding student to Google Sheets...");

    // First, get the last student ID to generate the next sequential ID
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!A:A`,
    });

    const rows = response.result.values || [];
    let nextId = 1; // Default starting ID

    // Find the highest numeric ID
    for (let i = 0; i < rows.length; i++) {
      const cellValue = rows[i][0];
      if (cellValue && !isNaN(cellValue)) {
        const numericId = parseInt(cellValue);
        if (numericId >= nextId) {
          nextId = numericId + 1;
        }
      }
    }

    console.log(`📊 Generated next student ID: ${nextId}`);

    // Map form data to the Google Sheets row format
    const row = [
      nextId.toString(), // A: ID (numeric)
      studentData.fullName || null, // B: Full Name
      studentData.branchCenter?.join(", ") || null, // C: Branch Center
      studentData.birthDate || null, // D: Birth Date
      studentData.memerYear || null, // E: Memorization Year
      studentData.graduationDate || null, // F: Graduation Date
      studentData.memTeacher || null, // G: Memory Teacher
      studentData.tartilMemYear || null, // H: Tartil Memory Year
      studentData.phone || null, // I: Phone
      studentData.phone2 || null, // J: Phone 2
      studentData.facebook || null, // K: Facebook
      studentData.email || null, // L: Email
      studentData.city || null, // M: City
      null, // N: Reserved
      null, // O : reserved
      null, // P: Reserved
      null,
      studentData.lastEducation || null, // R: Last Education Level
      studentData.Speciality || null, // S: Speciality
      studentData.workerNature || null, // T: Job Nature
      studentData.activity?.join(", ") || null, // U: Job Activity
      studentData.jobType === "طالب"
        ? studentData.studentUniversity
        : studentData.workerLocation || null, // V: Job Address
      studentData.address || null, // W: Address
      studentData.fieldActivity?.join(", ") || null, // X: Social Activity
      studentData.activity?.join(", ") || null, // Y: Mahdara Activity
      studentData.memCenter || null, // Z: Memory Center
      null, // AA: Reserved
      null, // AB: Memory Number
      studentData.profileImageUrl ||
        "https://res.cloudinary.com/ds4qqawzr/image/upload/v1749917257/pfp_tncrll.jpg", // AC: Profile Image
      null, // AD: Profile URL
      null, // AE: Attendance 2025
      studentData.jobType === "طالب" ? studentData.studentUniversity : null, // AF: Student University
    ];

    // Add the student to the spreadsheet
    const addResponse =
      await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!A:AG`,
        valueInputOption: "RAW",
        resource: {
          values: [row],
        },
      });

    console.log("✅ Student added successfully to Google Sheets");
    console.log("Response:", addResponse);

    // Return the created student object
    return {
      id: nextId.toString(),
      fullName: studentData.fullName,
      name: extractName(studentData.fullName),
      branchCenter: studentData.branchCenter?.join(", ") || "غير محدد",
      jobType: studentData.jobType || "/",
      birthDate: studentData.birthDate || "/",
      email: studentData.email || "/",
      city: studentData.city || "/",
      phone: studentData.phone || "/",
      phone2: studentData.phone2 || "/",
      address: studentData.address || "/",
      work:
        studentData.jobType === "طالب"
          ? `${studentData.studentSpeciality} - ${studentData.studentUniversity}`
          : studentData.workerJob || "/",
      study: studentData.lastEducation || "/",
      jobNature: studentData.workerNature || "/",
      jobActivity: studentData.activity?.join(", ") || "/",
      jobAddress:
        studentData.jobType === "طالب"
          ? studentData.studentUniversity
          : studentData.workerLocation || "/",
      currentJob: "",
      facebook: studentData.facebook || "/",
      SocialActivity: studentData.fieldActivity?.join(", ") || "/",
      mahdaraActivity: studentData.activity?.join(", ") || "/",
      lastEducation: studentData.lastEducation || "/",
      memerDate: studentData.graduationDate || "/",
      memTeacher: studentData.memTeacher || "/",
      memerYear: studentData.memerYear || "/",
      memerNumber: studentData.memerNumber || "/",
      tartilMemYear: studentData.tartilMemYear || "/",
      memCenter: studentData.memCenter || "بن ساشو",
      Speciality: studentData.Speciality || "/",
      profileImage:
        studentData.profileImageUrl ||
        "https://res.cloudinary.com/ds4qqawzr/image/upload/v1749917257/pfp_tncrll.jpg",
      profileUrl: "/",
      attendance2025: "/",
      studentUniversity:
        studentData.jobType === "طالب"
          ? studentData.studentUniversity
          : "جامعة عبد الحميد مهري",
    };
  } catch (error) {
    console.error("❌ Error adding student to Google Sheets:", error);
    throw error;
  }
};

// Helper function to upload image to Cloudinary (if you want to handle image uploads)
export const uploadImageToCloudinary = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "brahim-profiles"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "ds4qqawzr"); // Your Cloudinary cloud name

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/ds4qqawzr/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("brahim-profiles");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

const extractName = (fullName) => {
  if (!fullName || typeof fullName !== "string") {
    return "";
  }

  const benIndex = fullName.indexOf("بن");
  if (benIndex !== -1) {
    return fullName.substring(0, benIndex).trim();
  }

  return fullName.trim();
};

export const updateStudent = async (studentData) => {
  try {
    // Check if Google API is initialized
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    // Check if user is signed in
    if (!isSignedIn()) {
      throw new Error("User not signed in");
    }

    console.log("🔄 Updating student in Google Sheets...");

    // First, find the row where this student exists
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!A:A`,
    });

    const rows = response.result.values || [];
    let rowNumber = -1;

    // Find the row with matching ID
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === studentData.id) {
        rowNumber = i + 1; // +1 because Sheets API is 1-indexed
        break;
      }
    }

    if (rowNumber === -1) {
      throw new Error("Student not found in sheet");
    }

    console.log(`📊 Found student at row ${rowNumber}`);

    // Handle image upload if there's a new image file
    let profileImageUrl = null;
    if (
      studentData.profileImage &&
      typeof studentData.profileImage !== "string" &&
      studentData.profileImage !==
        "https://res.cloudinary.com/ds4qqawzr/image/upload/v1749917257/pfp_tncrll.jpg"
    ) {
      console.log("🖼️ Uploading new profile image to Cloudinary...");
      profileImageUrl = await uploadImageToCloudinary(studentData.profileImage);
      console.log("✅ Image uploaded to Cloudinary:", profileImageUrl);
    }

    // Prepare the update data
    const updateData = [
      studentData.id, // A: ID
      studentData.fullName, // B: Full Name
      studentData.branchCenter?.join(", ") || "", // C: Branch Center
      studentData.birthDate, // D: Birth Date
      studentData.memerYear, // E: Memorization Year
      studentData.graduationDate, // F: Graduation Date
      studentData.memTeacher, // G: Memory Teacher
      studentData.tartilMemYear, // H: Tartil Memory Year
      studentData.phone, // I: Phone
      studentData.phone2, // J: Phone 2
      studentData.facebook, // K: Facebook
      studentData.email, // L: Email
      studentData.city, // M: City
      null, // N: Reserved
      null, // O: Reserved
      null, // P: Reserved
      null, // Q: Reserved
      studentData.lastEducation, // R: Last Education Level
      studentData.Speciality, // S: Speciality
      studentData.workerNature, // T: Job Nature
      studentData.activity?.join(", ") || "", // U: Job Activity
      studentData.jobType === "طالب"
        ? studentData.studentUniversity
        : studentData.workerLocation || "", // V: Job Address
      studentData.address, // W: Address
      studentData.fieldActivity?.join(", ") || "", // X: Social Activity
      studentData.activity?.join(", ") || "", // Y: Mahdara Activity
      studentData.memCenter, // Z: Memory Center
      null, // AA: Reserved
      null, // AB: Memory Number
      profileImageUrl || null, // AC: Profile Image
      null, // AD: Profile URL
      null, // AE: Attendance 2025
      studentData.jobType === "طالب" ? studentData.studentUniversity : null, // AF: Student University
    ];

    // Update the student in the spreadsheet
    const updateResponse =
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!A${rowNumber}:AG${rowNumber}`,
        valueInputOption: "RAW",
        resource: {
          values: [updateData],
        },
      });

    console.log("✅ Student updated successfully in Google Sheets");
    console.log("Response:", updateResponse);

    // Return the updated student object with the new image URL if it was updated
    return {
      ...studentData,
      profileImageUrl: profileImageUrl || studentData.profileImageUrl,
      profileImage: profileImageUrl || studentData.profileImageUrl,
    };
  } catch (error) {
    console.error("❌ Error updating student in Google Sheets:", error);
    throw error;
  }
};

// Add this function to your googleSheetApi.js file

export const updateStudentAttendance = async (studentId, isAttending) => {
  try {
    // Check if Google API is initialized
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    // Check if user is signed in
    if (!isSignedIn()) {
      throw new Error("User not signed in");
    }

    console.log(`🔄 Updating attendance for student ID: ${studentId}`);

    // Get current year
    const currentYear = new Date().getFullYear();

    // First, check if the attendance column header exists (AE1)
    const headerResponse =
      await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!AE1`,
      });

    const headerValue = headerResponse.result.values?.[0]?.[0];
    const expectedHeader = `attendance${currentYear}`;

    // If header doesn't exist or is incorrect, update it
    if (headerValue !== expectedHeader) {
      console.log(`📝 Setting attendance header to: ${expectedHeader}`);
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!AE1`,
        valueInputOption: "RAW",
        resource: {
          values: [[expectedHeader]],
        },
      });
    }

    // Find the student row by ID
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!A3:A`,
    });

    const rows = response.result.values || [];
    let studentRowNumber = -1;

    // Find the row with matching student ID (starting from row 4)
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === studentId.toString()) {
        studentRowNumber = i + 4; // +4 because data starts from row 4
        break;
      }
    }

    if (studentRowNumber === -1) {
      throw new Error(`Student with ID ${studentId} not found in sheet`);
    }

    console.log(`📊 Found student at row ${studentRowNumber}`);

    // Update the attendance value in column AE for this student
    const attendanceValue = isAttending ? "نعم" : "لا";

    const updateResponse =
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!AE${studentRowNumber}`,
        valueInputOption: "RAW",
        resource: {
          values: [[attendanceValue]],
        },
      });

    console.log(
      `✅ Successfully updated attendance for student ${studentId} to: ${attendanceValue}`
    );
    console.log("Update response:", updateResponse);

    return {
      success: true,
      studentId,
      isAttending,
      rowNumber: studentRowNumber,
    };
  } catch (error) {
    console.error("❌ Error updating student attendance:", error);
    throw error;
  }
};

// Helper function to initialize attendance column for all students
export const initializeAttendanceColumn = async () => {
  try {
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    if (!isSignedIn()) {
      throw new Error("User not signed in");
    }

    const currentYear = new Date().getFullYear();
    const headerName = `attendance${currentYear}`;

    console.log(`🔄 Checking attendance column: ${headerName}`);

    // Get the header row to check if attendance column exists
    const headerResponse =
      await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!1:1`,
      });

    const headers = headerResponse.result.values?.[0] || [];

    // Check if attendance column already exists
    const attendanceColumnExists = headers.some(
      (header) =>
        header &&
        header.toString().toLowerCase().includes("attendance") &&
        header.toString().includes(currentYear.toString())
    );

    if (attendanceColumnExists) {
      console.log(`ℹ️ Attendance column already exists for ${currentYear}`);
      return true;
    }

    // Find the next available column (assuming AE is the target column)
    const targetColumn = "AE";
    const targetColumnIndex = headers.length; // This will be the next available column

    // Set the header
    await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!${targetColumn}1`,
      valueInputOption: "RAW",
      resource: {
        values: [[headerName]],
      },
    });

    // Get all students to initialize their attendance
    const studentsResponse =
      await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!A3:A`,
      });

    const studentRows = studentsResponse.result.values || [];

    if (studentRows.length > 0) {
      // Create array of default "لا" values for all students
      const defaultValues = studentRows.map(() => ["لا"]);

      // Update all attendance values at once
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${
          SHEETS.MahdaraMemorizedStudent
        }!${targetColumn}4:${targetColumn}${3 + studentRows.length}`,
        valueInputOption: "RAW",
        resource: {
          values: defaultValues,
        },
      });
    }

    console.log(
      `✅ Successfully initialized attendance column for ${studentRows.length} students`
    );
    return true;
  } catch (error) {
    console.error("❌ Error initializing attendance column:", error);
    throw error;
  }
};
