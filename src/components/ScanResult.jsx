export default function ScanResult({ alumno }) {

  if (!alumno) return null;

  return (

      <div className="scan-result">

          <h2>{alumno.nombre}</h2>

          <p>Grupo {alumno.grupo}</p>

          <h1>{alumno.saldo} 🪙</h1>

          <h3>Nivel {alumno.nivel}</h3>

      </div>

  );

}