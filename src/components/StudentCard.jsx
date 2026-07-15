import {
  FaUserGraduate,
  FaCoins,
  FaStar
  } from "react-icons/fa";
  
  export default function StudentCard({
  
  alumno,
  
  onClick
  
  }){
  
  return(
  
  <div
  className="student-card"
  onClick={onClick}
  >
  
  <div className="student-left">
  
  <div className="student-avatar">
  
  <FaUserGraduate/>
  
  </div>
  
  <div className="student-data">
  
  <h3>
  
  {alumno.nombre} {alumno.apellido_paterno}
  
  </h3>
  
  <div className="student-info">
  
  <span>
  
  {alumno.grupo}
  
  </span>
  
  <span className="dot">
  
  •
  
  </span>
  
  <span>
  
  <FaStar/>
  
  &nbsp;
  
  Nivel {alumno.nivel}
  
  </span>
  
  </div>
  
  </div>
  
  </div>
  
  <div className="student-wallet">
  
  <FaCoins/>
  
  <span>
  
  {alumno.saldo}
  
  </span>
  
  </div>
  
  </div>
  
  );
  
  }