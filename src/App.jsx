import { useState, useEffect } from 'react';
import Toast from './components/Toast';
import LoginProfesor from './pages/LoginProfesor';
import PanelAlumno from "./pages/PanelAlumno";
import RankingAlumno from "./pages/RankingAlumno";
import Splash from "./pages/Splash";

import './App.css';
import "./Styles/theme.css";
import "./Styles/global.css";
import "./Styles/Toast.css";
import "./Styles/ios.css";


import Home from './pages/Home';
import Teacher from './pages/Teacher';
import Students from './pages/Students';
import Profile from './pages/Profile';
import Scanner from './pages/Scanner';
import { supabase } from './services/supabase';
import LoginAlumno from "./pages/LoginAlumno";
import RankingProfesor from "./pages/RankingProfesor";
import LoginPsicologia from "./pages/LoginPsicologia";
import Psicologia from "./pages/Psicologia";
import ScanPsicologia from "./pages/ScanPsicologia";
import { motion } from "framer-motion";
import PerfilesPsicologia from "./pages/PerfilesPsicologia";
import GrupoPsicologia from "./pages/GrupoPsicologia";
import PerfilAlumnoPsico from "./pages/PerfilAlumnoPsico";
import { iniciarShareManager } from "./share/ShareManager";
import {

    escucharArchivoCompartido,

    dejarDeEscucharArchivoCompartido

} from "./share/ShareEvents";
import { guardarArchivo } from "./share/ShareStorage";
import CitasProgramadas from "./pages/CitasProgramadas";
import NEE from "./pages/NEE";

function App() {
  const [loading, setLoading] = useState(true);
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [pantalla, setPantalla] = useState(() => {
    return localStorage.getItem('pantalla') || 'home';
  });
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(() => {
  const guardado = localStorage.getItem('alumnoSeleccionado');

    return guardado ? JSON.parse(guardado) : null;
  });
  const [grupoSeleccionado,setGrupoSeleccionado]=useState(() => {

    return localStorage.getItem("grupoSeleccionado") || "";

});
      useEffect(()=>{

        if(grupoSeleccionado){

            localStorage.setItem(
                "grupoSeleccionado",
                grupoSeleccionado
            );

        }

      },[grupoSeleccionado]);
  const [tipoUsuario, setTipoUsuario] = useState(() => {
    return localStorage.getItem("tipoUsuario");
  });
  const [students, setStudents] = useState([]);
  const [toastMensaje, setToastMensaje] = useState('');
  const [toastTipo, setToastTipo] = useState('success');

  const cargarAlumnos = async()=>{

    try{

        const {data,error}=await supabase
        .from("alumnos")
        .select("*")
        .order("grupo")
        .order("apellido_paterno");

        if(error) throw error;

        setStudents(data);

    }catch(error){

        console.error(error);

    }finally{

        setLoading(false);

    }

};

useEffect(()=>{

    cargarAlumnos();

},[]);

  useEffect(() => {
    localStorage.setItem('pantalla', pantalla);
  }, [pantalla]);

  useEffect(() => {

    if (tipoUsuario) {
  
      localStorage.setItem("tipoUsuario", tipoUsuario);
  
    } else {
  
      localStorage.removeItem("tipoUsuario");
  
    }
  
  }, [tipoUsuario]);

  useEffect(() => {
    if (alumnoSeleccionado) {
      localStorage.setItem(
        'alumnoSeleccionado',
        JSON.stringify(alumnoSeleccionado)
      );
    } else {
      localStorage.removeItem('alumnoSeleccionado');
    }
  }, [alumnoSeleccionado]);

  useEffect(() => {

    const timer = setTimeout(() => {
  
      setMostrarSplash(false);
  
    }, 2200);
  
    return () => clearTimeout(timer);
  
  }, []);
  useEffect(() => {

    if (tipoUsuario === "profesor") {
  
      setPantalla("teacher");
  
    }
  
    if (tipoUsuario === "alumno" && alumnoSeleccionado) {
  
      setPantalla("panelAlumno");
  
    }
    if(tipoUsuario==="psicologia"){

      setPantalla("psicologia");
      
      }
  
  }, []);

  useEffect(() => {

    iniciarShareManager();

    const expedienteRecibido = () => {

        console.log("Expediente recibido.");

        setPantalla("recibirExpediente");

    };

    escucharArchivoCompartido(expedienteRecibido);

    return () => {

        dejarDeEscucharArchivoCompartido(

            expedienteRecibido

        );

    };

}, []);

useEffect(() => {

    navigator.serviceWorker.onmessage = (event) => {

        console.log(event.data);
        alert("React recibió mensaje");

        if (event.data.type === "SHARED_PDF") {

            guardarArchivo(event.data.file);

            setPantalla("recibirExpediente");

        }

    };

}, []);

  const agregarMathCoins = async (id, cantidad) => {
    const alumno = students.find((a) => a.id === id);

    if (!alumno) return;

    const nuevoSaldo = Math.max(0, alumno.saldo + Number(cantidad));

    const nuevoNivel = Math.floor(nuevoSaldo / 200) + 1;

    const { error } = await supabase
      .from('alumnos')
      .update({
        saldo: nuevoSaldo,
        nivel: nuevoNivel,
      })
      .eq('id', id);

    if (error) {
      console.log(error);

      return;
    }

    const nuevos = students.map((a) =>
      a.id === id
        ? {
            ...a,
            saldo: nuevoSaldo,
            nivel: nuevoNivel,
          }
        : a
    );

    setStudents(nuevos);

    setAlumnoSeleccionado(nuevos.find((a) => a.id === id));
    if (cantidad > 0) {
      setToastTipo('success');
      setToastMensaje(`+${cantidad} MathCoins`);
    } else {
      setToastTipo('error');
      setToastMensaje(`${cantidad} MathCoins`);
    }

    setTimeout(() => {

      setToastMensaje("");
      
      },1500);
  };
  
  const cerrarSesion = async () => {

    // Si es profesor, cerrar sesión en Supabase
    await supabase.auth.signOut();
  
    // Limpiar estados
    setAlumnoSeleccionado(null);
  
    setTipoUsuario(null);
  
    // Limpiar almacenamiento local
    localStorage.removeItem("alumnoSeleccionado");
  
    localStorage.removeItem("tipoUsuario");
  
    localStorage.removeItem("pantalla");
  
    localStorage.removeItem("grupoSeleccionado");
  
    // Volver al inicio
    setPantalla("home");
  
  };
  if (mostrarSplash) {

    return <Splash />;
  
  }
  if (loading) {
    return (
      <div className="screen">
        <h2>Cargando alumnos...</h2>
      </div>
    );
  }
  console.log(students);

  let contenido;

  switch (pantalla) {
    case "loginAlumno":

      contenido = (

      <LoginAlumno

      students={students}

      seleccionarAlumno={setAlumnoSeleccionado}

      cambiarPantalla={setPantalla}

      setTipoUsuario={setTipoUsuario}

      />

      );

      break;

    case 'loginProfesor':
      contenido = <LoginProfesor cambiarPantalla={setPantalla}

      setTipoUsuario={setTipoUsuario} />;

      break;

      case 'teacher':
      contenido = <Teacher

      students={students}
      
      cambiarPantalla={setPantalla}
      
      cerrarSesion={cerrarSesion}
      
      />;

      break;

      case "loginPsicologia":

        contenido=(

        <LoginPsicologia

        cambiarPantalla={setPantalla}

        setTipoUsuario={setTipoUsuario}

        />

        );

        break;
        case "recibirExpediente":

    contenido = (

        <RecibirExpediente

            students={students}

            cambiarPantalla={setPantalla}

            setAlumnoSeleccionado={setAlumnoSeleccionado}

            setStudents={setStudents}

        />

    );

    break;
    case 'student':
      contenido = <Student cambiarPantalla={setPantalla} />;

      break;

    case 'students':
      contenido = (
        <Students
          students={students}
          cambiarPantalla={setPantalla}
          seleccionarAlumno={setAlumnoSeleccionado}
        />
      );

      break;

    case 'profile':
      contenido = (
        <Profile
          alumno={alumnoSeleccionado}
          students={students}
          agregarMathCoins={agregarMathCoins}
          cambiarPantalla={setPantalla}
        />
      );

      break;

    case 'scanner':
      contenido = (
        <Scanner
          students={students}
          agregarMathCoins={agregarMathCoins}
          cambiarPantalla={setPantalla}
        />
      );
      break;
      case "rankingProfesor":

        contenido = (
        
        <RankingProfesor
        
        students={students}
        
        cambiarPantalla={setPantalla}
        
        />
        
        );
        
        break;
        case "psicologia":

          contenido=(

          <Psicologia

              cerrarSesion={cerrarSesion}

              cambiarPantalla={setPantalla}

              students={students}

              setAlumnoSeleccionado={setAlumnoSeleccionado}

          />

          );

        break;
          case "perfilPsicopedagogico":

            contenido=(

              <PerfilesPsicologia

              students={students}
              
              cambiarPantalla={setPantalla}
              
              setGrupoSeleccionado={setGrupoSeleccionado}
              
              seleccionarAlumno={setAlumnoSeleccionado}
              
              />

            );

            break;
            
            case "grupoPsicologia":

            contenido=(

            <GrupoPsicologia

                students={students}

                setStudents={setStudents}

                grupoSeleccionado={grupoSeleccionado}

                cambiarPantalla={setPantalla}

                seleccionarAlumno={setAlumnoSeleccionado}

            />

            );

            break;

          case "perfilAlumnoPsico":

          contenido=(

            <PerfilAlumnoPsico
            alumno={alumnoSeleccionado}
            cambiarPantalla={setPantalla}
            setAlumnoSeleccionado={setAlumnoSeleccionado}
            students={students}
            setStudents={setStudents}
        />

          );

          break;

          case "nee":

          contenido=(

          <NEE

          students={students}
          setStudents={setStudents}
          cargarAlumnos={cargarAlumnos}

          seleccionarAlumno={setAlumnoSeleccionado}

          cambiarPantalla={setPantalla}

          />

          );

          break;

          case "scanPsicologia":

          contenido=(

            <ScanPsicologia

            cambiarPantalla={setPantalla}
            
            />

          );

          break;

          case "panelAlumno":

            contenido = (

            <PanelAlumno

            alumno={alumnoSeleccionado}

            students={students}

            cambiarPantalla={setPantalla}

            cerrarSesion={cerrarSesion}

            />

            );
            break;
            case "rankingAlumno":

            contenido=(

            <RankingAlumno

            alumno={alumnoSeleccionado}

            students={students}

            cambiarPantalla={setPantalla}

            />

            );

            break;

            case "agenda":

              contenido=(

              <CitasProgramadas

                  cambiarPantalla={setPantalla}

                  students={students || []}

                  setStudents={setStudents}

              />

              );

              break;

    default:
      contenido = <Home cambiarPantalla={setPantalla} />;
  }
  return (
    <>
      <Toast
        mensaje={toastMensaje}
        tipo={toastTipo}
      />
  
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: .35,
          ease: "easeOut"
        }}
      >
        {contenido}
      </motion.div>
  
    </>
  );
}

export default App;
