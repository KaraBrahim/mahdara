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
    // Add timeout to the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Update operation timed out")), 30000); // 30 seconds timeout
    });

    const updatePromise = async () => {
      // Check if Google API is initialized
      if (!window.gapi || !window.gapi.client) {
        throw new Error("Google API not initialized");
      }

      // Check if user is signed in (uncomment if you have this function)
      /* if (!isSignedIn()) {
        throw new Error("User not signed in");
      } */

      console.log("🔄 Updating student in Google Sheets...");
      console.log("📊 Student ID:", studentData.id);

      // Handle image upload first if there's a new image file
      let profileImageUrl = null;
      if (
        studentData.profileImage &&
        typeof studentData.profileImage !== "string" &&
        studentData.profileImage !==
          "https://res.cloudinary.com/ds4qqawzr/image/upload/v1749917257/pfp_tncrll.jpg"
      ) {
        console.log("🖼️ Uploading new profile image to Cloudinary...");
        const uploadStart = performance.now();

        profileImageUrl = await uploadImageToCloudinary(
          studentData.profileImage
        );

        const uploadEnd = performance.now();
        console.log(
          `✅ Image uploaded to Cloudinary in ${(
            uploadEnd - uploadStart
          ).toFixed(2)}ms:`,
          profileImageUrl
        );
      }

      // More efficient approach: Use a smaller range or implement row tracking
      console.log("🔍 Searching for student row...");
      const searchStart = performance.now();

      // Try to get a reasonable range first (e.g., first 1000 rows)
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MahdaraMemorizedStudent}!A1:A1000`, // Limit the range
      });

      const rows = response.result.values || [];
      let rowNumber = -1;

      // Find the row with matching ID
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] && rows[i][0] === studentData.id) {
          rowNumber = i + 1; // +1 because Sheets API is 1-indexed
          break;
        }
      }

      const searchEnd = performance.now();
      console.log(
        `🔍 Search completed in ${(searchEnd - searchStart).toFixed(2)}ms`
      );

      if (rowNumber === -1) {
        // If not found in first 1000 rows, try a broader search
        console.log(
          "🔍 Student not found in first 1000 rows, searching entire sheet..."
        );
        const fullResponse =
          await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.MahdaraMemorizedStudent}!A:A`,
          });

        const allRows = fullResponse.result.values || [];
        for (let i = 0; i < allRows.length; i++) {
          if (allRows[i] && allRows[i][0] === studentData.id) {
            rowNumber = i + 1;
            break;
          }
        }
      }

      if (rowNumber === -1) {
        throw new Error(`Student with ID ${studentData.id} not found in sheet`);
      }

      console.log(`📊 Found student at row ${rowNumber}`);

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
        profileImageUrl || studentData.profileImageUrl || null, // AC: Profile Image
        null, // AD: Profile URL
        null, // AE: Attendance 2025
        studentData.jobType === "طالب" ? studentData.studentSpeciality : null, // AF: Student Speciality
      ];

      console.log(
        "📝 Preparing to update row with data:",
        updateData.slice(0, 5),
        "..."
      );

      // Update the student in the spreadsheet
      const updateStart = performance.now();
      const updateResponse =
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEETS.MahdaraMemorizedStudent}!A${rowNumber}:AG${rowNumber}`,
          valueInputOption: "RAW",
          resource: {
            values: [updateData],
          },
        });

      const updateEnd = performance.now();
      console.log(
        `✅ Sheet update completed in ${(updateEnd - updateStart).toFixed(2)}ms`
      );
      console.log("✅ Student updated successfully in Google Sheets");
      console.log("Response:", updateResponse);

      // Return the updated student object with the new image URL if it was updated
      return {
        ...studentData,
        profileImageUrl: profileImageUrl || studentData.profileImageUrl,
        profileImage: profileImageUrl || studentData.profileImageUrl,
      };
    };

    // Race between the update operation and timeout
    return await Promise.race([updatePromise(), timeoutPromise]);
  } catch (error) {
    console.error("❌ Error updating student in Google Sheets:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      studentId: studentData.id,
      timestamp: new Date().toISOString(),
    });
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

/* export const uploadImageToCloudinary = async (imageFile) => {
  try {
    console.log("🖼️ Starting image upload to Cloudinary...");
    console.log("📁 File size:", (imageFile.size / 1024).toFixed(2), "KB");
    console.log("📁 File type:", imageFile.type);

    // Add timeout for the upload
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Image upload timed out")), 20000); // 20 seconds timeout
    });

    const uploadPromise = async () => {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "brahim-profiles");
      formData.append("cloud_name", "ds4qqawzr");
      
      // Add additional parameters for optimization
      formData.append("quality", "auto:good"); // Optimize quality
      formData.append("fetch_format", "auto"); // Use best format for browser
      formData.append("flags", "progressive"); // Progressive JPEG for better loading

      const uploadStart = performance.now();
      console.log("📤 Sending request to Cloudinary...");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/ds4qqawzr/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadEnd = performance.now();
      console.log(`⏱️ Upload request completed in ${(uploadEnd - uploadStart).toFixed(2)}ms`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Upload failed with status:", response.status, response.statusText);
        console.error("❌ Error response:", errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Image uploaded successfully:", data.secure_url);
      console.log("📊 Upload stats:", {
        originalSize: `${(imageFile.size / 1024).toFixed(2)} KB`,
        uploadedSize: `${(data.bytes / 1024).toFixed(2)} KB`,
        format: data.format,
        width: data.width,
        height: data.height
      });

      return data.secure_url;
    };

    // Race between upload and timeout
    return await Promise.race([uploadPromise(), timeoutPromise]);

  } catch (error) {
    console.error("❌ Error uploading image:", error);
    console.error("Error details:", {
      message: error.message,
      fileName: imageFile?.name,
      fileSize: imageFile?.size,
      fileType: imageFile?.type,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}; */

// Add this function to check sheet access before making requests
export const checkSheetAccess = async () => {
  try {
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not initialized");
    }

    console.log("🔍 Checking sheet access...");

    // Try to get basic spreadsheet info (requires minimal permissions)
    const response = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    console.log("✅ Sheet access confirmed");
    return true;
  } catch (error) {
    console.error("❌ Sheet access denied:", error);

    if (error.status === 403) {
      const userEmail = userProfile?.email || "current account";
      throw new Error(
        `Access denied: The account "${userEmail}" doesn't have permission to access this spreadsheet. Please contact the administrator to grant access.`
      );
    }

    throw error;
  }
};

// Enhanced fetchStudents with better error handling
export const fetchStudents = async () => {
  try {
    // Check access first
    await checkSheetAccess();

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

    if (error.status === 403) {
      throw new Error(
        "Access denied: This account doesn't have permission to view the spreadsheet. Please contact the administrator to grant access."
      );
    }

    throw error;
  }
};

// Function to get current user info for better error messages
export const getCurrentUser = async () => {
  try {
    if (!isSignedIn()) {
      return null;
    }

    const storedProfile = TokenStorage.get("user_profile");
    if (storedProfile) {
      return storedProfile;
    }

    const token = window.gapi.client.getToken();
    if (token) {
      const userInfo = await fetchUserProfile(token.access_token);
      TokenStorage.set("user_profile", userInfo);
      return userInfo;
    }

    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Helper function to show user-friendly error messages
export const handleApiError = (error, operation = "operation") => {
  console.error(`Error during ${operation}:`, error);

  if (error.status === 403) {
    return {
      type: "permission",
      message: `❌ Access Denied: Your account doesn't have permission to perform this ${operation}. Please contact the administrator to grant access to your Google account.`,
      details: error.message,
    };
  }

  if (error.status === 401) {
    return {
      type: "authentication",
      message: "❌ Authentication Error: Please sign in again.",
      details: error.message,
    };
  }

  if (error.status === 404) {
    return {
      type: "not_found",
      message:
        "❌ Spreadsheet Not Found: The requested spreadsheet doesn't exist or has been deleted.",
      details: error.message,
    };
  }

  if (error.status === 429) {
    return {
      type: "rate_limit",
      message: "❌ Too Many Requests: Please wait a moment and try again.",
      details: error.message,
    };
  }

  return {
    type: "unknown",
    message: `❌ Error: Something went wrong during ${operation}. Please try again.`,
    details: error.message,
  };
};

// Test function to verify everything works
export const testSheetAccess = async () => {
  try {
    console.log("🧪 Testing sheet access...");

    // Test 1: Check if APIs are loaded
    if (!window.gapi || !window.gapi.client) {
      throw new Error("Google API not loaded");
    }
    console.log("✅ Google API loaded");

    // Test 2: Check if user is signed in
    if (!isSignedIn()) {
      throw new Error("User not signed in");
    }
    console.log("✅ User is signed in");

    // Test 3: Get current user info
    const user = await getCurrentUser();
    console.log("✅ Current user:", user?.email || "unknown");

    // Test 4: Check sheet access
    await checkSheetAccess();
    console.log("✅ Sheet access confirmed");

    // Test 5: Try to read some data
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.MahdaraMemorizedStudent}!A1:A5`,
    });
    console.log("✅ Successfully read data from sheet");

    return {
      success: true,
      message:
        "All tests passed! Your account has proper access to the spreadsheet.",
      user: user?.email,
    };
  } catch (error) {
    const errorInfo = handleApiError(error, "access test");
    return {
      success: false,
      ...errorInfo,
    };
  }
};

export const uploadImageToCloudinary = async (imageFile) => {
  try {
    console.log("🖼️ Starting optimized image upload to Cloudinary...");

    // Step 1: Smart compression based on file size
    const MAX_SIZE = 1024; // pixels
    const QUALITY = 0.7; // 70% quality
    const TARGET_FORMAT = "webp"; // Better compression than JPEG

    // Create canvas for compression
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Load image
    const imgLoadPromise = new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });

    await imgLoadPromise;

    // Calculate new dimensions while maintaining aspect ratio
    let { width, height } = img;
    if (width > height) {
      if (width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      }
    } else {
      if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }
    }

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw and compress image
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob with target format
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), `image/${TARGET_FORMAT}`, QUALITY);
    });

    // Create FormData with ONLY allowed parameters for unsigned upload
    const formData = new FormData();
    formData.append("file", blob, imageFile.name);
    formData.append("upload_preset", "brahim-profiles");
    // Remove these parameters - they're not allowed in unsigned uploads:
    // formData.append("format", TARGET_FORMAT);
    // formData.append("width", width);
    // formData.append("height", height);
    // formData.append("crop", "fill");
    // formData.append("gravity", "face");
    // formData.append("quality", "auto:good");

    // You can only use these parameters with unsigned uploads:
    // - upload_preset (required)
    // - callback
    // - public_id
    // - folder
    // - asset_folder
    // - tags
    // - context
    // - metadata
    // - face_coordinates
    // - custom_coordinates
    // - source
    // - filename_override
    // - manifest_transformation
    // - manifest_json
    // - template
    // - template_vars
    // - regions
    // - public_id_prefix

    // Upload with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/ds4qqawzr/image/upload",
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Image uploaded successfully:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Error uploading image:", error);

    // Special handling for abort errors
    if (error.name === "AbortError") {
      throw new Error("Upload timed out. Please try again.");
    }

    throw error;
  }
};
