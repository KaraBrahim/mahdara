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

// Helper function to completely sign out
/* export const signOut = () => {
  try {
    sessionStorage.removeItem("access_token");
    window.gapi.client.setToken(null);
    
    // Revoke the token if it exists
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
    }
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};

// Helper function to check if user is currently signed in
export const isSignedIn = async () => {
  try {
    const result = await signIn(true);
    return !!result;
  } catch (error) {
    return false;
  }
};
 */

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

let userProfile = null;

// Mobile detection
const isMobile = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (window.innerWidth <= 768 && window.innerHeight <= 1024)
  );
};

// Low memory detection
const isLowMemoryDevice = () => {
  // Check if device has low memory indicators
  const memory = navigator.deviceMemory;
  const hardwareConcurrency = navigator.hardwareConcurrency;

  return (
    (memory && memory <= 2) || // Less than 2GB RAM
    (hardwareConcurrency && hardwareConcurrency <= 2) || // Less than 2 cores
    window.innerWidth <= 480
  ); // Very small screen (likely budget device)
};

// Enhanced token storage with compression for low memory devices
const TokenStorage = {
  set: (key, value) => {
    try {
      if (isLowMemoryDevice()) {
        // For low memory devices, use minimal storage
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn("Storage failed, using memory fallback:", error);
      window[`_${key}`] = value;
    }
  },

  get: (key) => {
    try {
      let stored = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (!stored && window[`_${key}`]) {
        stored = JSON.stringify(window[`_${key}`]);
      }
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Storage retrieval failed:", error);
      return window[`_${key}`] || null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      delete window[`_${key}`];
    } catch (error) {
      console.warn("Storage removal failed:", error);
    }
  },
};

// Simplified API initialization for mobile
const initializeGapiClient = () => {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error("Google API not loaded"));
      return;
    }

    const timeout = isLowMemoryDevice() ? 15000 : 10000; // Longer timeout for low memory devices

    window.gapi.load("client", {
      callback: () => {
        console.log("GAPI client loaded successfully");
        resolve();
      },
      onerror: (error) => {
        console.error("GAPI client load error:", error);
        reject(error);
      },
      timeout: timeout,
      ontimeout: () => {
        reject(new Error("GAPI client load timeout"));
      },
    });
  });
};

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

// Mobile-optimized token client initialization
const initializeTokenClient = () => {
  if (!window.google || !window.google.accounts) {
    throw new Error("Google Identity Services not loaded");
  }

  const mobile = isMobile();
  const lowMemory = isLowMemoryDevice();

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: () => {},
    auto_select: false,
    cancel_on_tap_outside: !mobile, // Don't cancel on tap outside for mobile
    use_fedcm_for_prompt: !lowMemory, // Disable FedCM for low memory devices
    ux_mode: mobile ? "redirect" : "popup", // Use redirect for mobile
    redirect_uri: mobile ? window.location.origin : undefined,
  });
};

// Enhanced mobile-friendly sign in
export const signIn = async (checkOnly = false) => {
  console.log("🔐 Starting sign in process...");

  if (!tokenClient) {
    throw new Error(
      "Token client not initialized. Please call loadGoogleApi() first."
    );
  }

  // Check for existing valid token first
  const storedToken = TokenStorage.get("access_token");
  const storedProfile = TokenStorage.get("user_profile");

  if (storedToken && storedProfile) {
    try {
      // Validate stored token
      const isValid = await validateToken(storedToken);
      if (isValid) {
        window.gapi.client.setToken({ access_token: storedToken });
        userProfile = storedProfile;
        console.log("✅ Using valid stored token");
        return createUserObject(storedProfile);
      }
    } catch (error) {
      console.log("Stored token invalid, will get new one");
    }
  }

  // If just checking and no valid token, return null
  if (checkOnly) {
    return null;
  }

  // For mobile devices, use a more robust approach
  if (isMobile()) {
    return await mobileSignIn();
  } else {
    return await desktopSignIn();
  }
};

// Mobile-optimized sign in
const mobileSignIn = async () => {
  console.log("📱 Starting mobile sign in...");

  return new Promise((resolve, reject) => {
    const originalCallback = tokenClient.callback;
    const timeout = isLowMemoryDevice() ? 120000 : 60000; // 2 minutes for low memory devices

    const timeoutId = setTimeout(() => {
      tokenClient.callback = originalCallback;
      reject(new Error("Authentication timeout - please try again"));
    }, timeout);

    tokenClient.callback = async (tokenResponse) => {
      clearTimeout(timeoutId);
      tokenClient.callback = originalCallback;

      if (tokenResponse.error) {
        console.error("Token error:", tokenResponse);
        reject(new Error(`Authentication failed: ${tokenResponse.error}`));
        return;
      }

      try {
        const result = await processTokenResponse(tokenResponse);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    try {
      // For mobile, always use redirect mode and force account selection
      if (
        window.location.href.includes("code=") ||
        window.location.href.includes("access_token=")
      ) {
        // Handle redirect callback
        handleRedirectCallback();
      } else {
        // Initiate OAuth flow
        tokenClient.requestAccessToken({
          prompt: "select_account",
          state: "mobile_auth",
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      tokenClient.callback = originalCallback;
      reject(error);
    }
  });
};

// Desktop sign in (original popup method)
const desktopSignIn = async () => {
  console.log("🖥️ Starting desktop sign in...");

  return new Promise((resolve, reject) => {
    const originalCallback = tokenClient.callback;
    const timeoutId = setTimeout(() => {
      tokenClient.callback = originalCallback;
      reject(new Error("Authentication timeout - please try again"));
    }, 60000);

    tokenClient.callback = async (tokenResponse) => {
      clearTimeout(timeoutId);
      tokenClient.callback = originalCallback;

      if (tokenResponse.error) {
        console.error("Token error:", tokenResponse);
        reject(new Error(`Authentication failed: ${tokenResponse.error}`));
        return;
      }

      try {
        const result = await processTokenResponse(tokenResponse);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    try {
      tokenClient.requestAccessToken({
        prompt: "select_account",
      });
    } catch (error) {
      clearTimeout(timeoutId);
      tokenClient.callback = originalCallback;
      reject(error);
    }
  });
};

// Process token response (shared between mobile and desktop)
const processTokenResponse = async (tokenResponse) => {
  console.log("🔄 Processing token response...");

  // Clear any existing tokens
  TokenStorage.remove("access_token");
  TokenStorage.remove("user_profile");
  window.gapi.client.setToken(null);

  // Set new token
  window.gapi.client.setToken({ access_token: tokenResponse.access_token });

  // Fetch user profile
  const userInfo = await fetchUserProfile(tokenResponse.access_token);

  // Store token and profile
  TokenStorage.set("access_token", tokenResponse.access_token);
  TokenStorage.set("user_profile", userInfo);

  userProfile = userInfo;
  console.log("✅ Authentication successful");

  return createUserObject(userInfo);
};

// Handle redirect callback for mobile
const handleRedirectCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.substring(1));

  const accessToken =
    urlParams.get("access_token") || fragment.get("access_token");
  const code = urlParams.get("code");

  if (accessToken) {
    // Direct access token (implicit flow)
    processTokenResponse({ access_token: accessToken });
  } else if (code) {
    // Authorization code (need to exchange for token)
    exchangeCodeForToken(code);
  }
};

// Exchange authorization code for access token
const exchangeCodeForToken = async (code) => {
  // Note: This would typically be done on your backend for security
  // For client-side only, you'd need to handle this differently
  console.log("Code received:", code);
  // Implementation depends on your backend setup
};

// Fetch user profile with retry logic
const fetchUserProfile = async (accessToken, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: isLowMemoryDevice() ? 15000 : 10000,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userInfo = await response.json();
      console.log("👤 User profile fetched:", userInfo.email);
      return userInfo;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;

      // Wait before retry (longer for low memory devices)
      await new Promise((resolve) =>
        setTimeout(resolve, isLowMemoryDevice() ? 2000 : 1000)
      );
    }
  }
};

// Validate token
const validateToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
      { timeout: 5000 }
    );

    if (response.ok) {
      const tokenInfo = await response.json();
      return tokenInfo.expires_in > 60; // Valid if expires in more than 1 minute
    }
    return false;
  } catch (error) {
    console.warn("Token validation failed:", error);
    return false;
  }
};

// Create user object
const createUserObject = (userInfo) => {
  return {
    getEmail: () => userInfo.email,
    getName: () => userInfo.name,
    getImageUrl: () => userInfo.picture,
  };
};

// Check if user is signed in
export const isSignedIn = () => {
  try {
    if (!window.gapi || !window.gapi.client) {
      return false;
    }

    const token = window.gapi.client.getToken();
    const storedToken = TokenStorage.get("access_token");

    return !!(token || storedToken);
  } catch (error) {
    console.error("Error checking sign-in status:", error);
    return false;
  }
};

// Enhanced sign out
export const signOut = async () => {
  try {
    const token = window.gapi?.client?.getToken();
    const storedToken = TokenStorage.get("access_token");
    const tokenToRevoke = token?.access_token || storedToken;

    if (tokenToRevoke) {
      try {
        // Revoke token
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${tokenToRevoke}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
      } catch (revokeError) {
        console.warn("Error revoking token:", revokeError);
      }
    }

    // Clear all stored data
    window.gapi?.client?.setToken(null);
    TokenStorage.remove("access_token");
    TokenStorage.remove("user_profile");
    userProfile = null;

    console.log("✅ Sign out completed successfully");
  } catch (error) {
    console.error("Error during sign out:", error);
    // Clean up anyway
    TokenStorage.remove("access_token");
    TokenStorage.remove("user_profile");
    userProfile = null;
  }
};

// Memory-efficient fetch students
export const fetchStudents = async () => {
  try {
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    console.log("🔄 Fetching students from Google Sheets...");

    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!A3:AG`,
    });

    const rows = response.result.values || [];

    // Process in chunks for low memory devices
    const chunkSize = isLowMemoryDevice() ? 50 : 100;
    const students = [];

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const processedChunk = chunk.map(processStudentRow);
      students.push(...processedChunk);

      // Give browser time to breathe on low memory devices
      if (isLowMemoryDevice() && i + chunkSize < rows.length) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    console.log(`✅ Fetched ${students.length} students from Google Sheets`);
    return students;
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    throw error;
  }
};

// Process individual student row
const processStudentRow = (row) => {
  return {
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
  };
};

// Helper function to extract name
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

// Rest of your functions remain the same...
export const addStudent = async (studentData) => {
  try {
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    if (!isSignedIn()) {
      throw new Error("User not signed in");
    }

    console.log("🔄 Adding student to Google Sheets...");

    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!A:A`,
    });

    const rows = response.result.values || [];
    let nextId = 1;

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

    const row = [
      nextId.toString(),
      studentData.fullName || null,
      studentData.branchCenter?.join(", ") || null,
      studentData.birthDate || null,
      studentData.memerYear || null,
      studentData.graduationDate || null,
      studentData.memTeacher || null,
      studentData.tartilMemYear || null,
      studentData.phone || null,
      studentData.phone2 || null,
      studentData.facebook || null,
      studentData.email || null,
      studentData.city || null,
      null,
      null,
      null,
      null,
      studentData.lastEducation || null,
      studentData.Speciality || null,
      studentData.workerNature || null,
      studentData.activity?.join(", ") || null,
      studentData.jobType === "طالب"
        ? studentData.studentUniversity
        : studentData.workerLocation || null,
      studentData.address || null,
      studentData.fieldActivity?.join(", ") || null,
      studentData.activity?.join(", ") || null,
      studentData.memCenter || null,
      null,
      null,
      studentData.profileImageUrl ||
        "https://res.cloudinary.com/ds4qqawzr/image/upload/v1749917257/pfp_tncrll.jpg",
      null,
      null,
      studentData.jobType === "طالب" ? studentData.studentUniversity : null,
    ];

    const addResponse =
      await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!A:AG`,
        valueInputOption: "RAW",
        resource: { values: [row] },
      });

    console.log("✅ Student added successfully to Google Sheets");
    return processStudentRow(row);
  } catch (error) {
    console.error("❌ Error adding student to Google Sheets:", error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "brahim-profiles");
    formData.append("cloud_name", "ds4qqawzr");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/ds4qqawzr/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
