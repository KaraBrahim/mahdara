// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";

import { useAuth } from "./AuthContext";
import ProfileCard from "./Student/ProfileCard";
import ProfileForm from "./Student/ProfileForm";
import MadharaHelperProfile from "./Supporter/SupporterCard";
import MadharaHelperForm from "./Supporter/SupporterForm";
import MadharaHomePage from "./MahdaraHomePage";
import StudentManagement from "./Student/StudentManagement";
import SupporterManagement from "./Supporter/SupporterManagement";
import MahdaraNavbar from "./MahdaraNavbar";
import { fetchStudents } from "./googleSheetApi";

const pageMap = {
  home: MadharaHomePage,
  supporter: SupporterManagement,
  student: StudentManagement,
};

function App() {
  const [currentPageFace, setCurrentPage] = useState("home");
  const [navBarShown, setNavBarShown] = useState(true);
  const [networkMode ,setNetworkMode ] = useState('offline');
  
  const PageComponent = pageMap[currentPageFace];

  return (
    <>{}
      {navBarShown && (
        <MahdaraNavbar 
          networkMode={networkMode}
          setCurrentPage={setCurrentPage}
          currentPageFace={currentPageFace}
        />
      )}
      {PageComponent ? (
        <PageComponent
          networkMode={networkMode}
          setNavBarShown={setNavBarShown}
          navBarShown={navBarShown}
          setCurrentPage={setCurrentPage}
          currentPageFace={currentPageFace}
        />
      ) : (
        <div>Page not found</div>
      )}
    </>
  );
}

export default App;
