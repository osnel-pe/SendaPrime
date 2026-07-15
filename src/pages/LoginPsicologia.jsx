import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabase';

import '../Styles/AppLayout.css';
import '../Styles/Auth.css';
import '../Styles/LoginPsicologia.css';

import {
  FaBrain,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
} from 'react-icons/fa';

export default function LoginPsicologia({
  cambiarPantalla,

  setTipoUsuario,
}) {
  const [correo, setCorreo] = useState('');

  const [password, setPassword] = useState('');

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [error, setError] = useState('');

  const [cargando, setCargando] = useState(false);

  async function iniciarSesion() {
    setError('');
    setCargando(true);

    // Iniciar sesión con Supabase Auth
    const resultado = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

    console.log(resultado);

    if (resultado.error) {
      console.log(resultado.error);

      setError(resultado.error.message);

      setCargando(false);

      return;
    }

    // Obtener el registro de la psicóloga
    const { data, error: dbError } = await supabase

      .from('profesores')
      .select('id, usuario')
      .eq('id', 2)
      .single();

    if (dbError) {
      await supabase.auth.signOut();

      setError('No fue posible validar la cuenta.');
      setCargando(false);
      return;
    }

    // Validar que el correo sea el registrado para Psicología
    if (data.usuario.trim().toLowerCase() !== correo.trim().toLowerCase()) {
      await supabase.auth.signOut();

      setError('Esta cuenta no pertenece al área de Psicología.');

      setCargando(false);

      return;
    }

    setTipoUsuario('psicologia');

    cambiarPantalla('psicologia');

    setCargando(false);
  }

  return (
    <>
      <div className="app-background">
        <div className="bg-wave1"></div>

        <div className="bg-wave2"></div>

        <div className="bg-light"></div>
      </div>

      <div className="app">
        <motion.div
          className="main-card auth-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="page-header">
            <div className="page-icon">
              <FaBrain />
            </div>

            <div>
              <h1>Psicología</h1>

              <p>Acceso al departamento psicopedagógico</p>
            </div>
          </div>

          <div className="input-group">
            <label>Correo electrónico</label>

            <div className="input-wrapper">
              <FaEnvelope className="left-icon" />

              <input
                type="email"
                value={correo}
                placeholder="correo@escuela.com"
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>

            <div className="input-wrapper">
              <FaLock className="left-icon" />

              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            className="btn-auth"
            onClick={iniciarSesion}
            disabled={cargando}
          >
            {cargando ? <div className="spinner"></div> : 'Iniciar sesión'}
          </button>

          <button className="btn-back" onClick={() => cambiarPantalla('home')}>
            <FaArrowLeft />
            Volver
          </button>

          <div className="footer-login">
            <FaShieldAlt />

            <span>Área exclusiva de Psicología Escolar</span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
