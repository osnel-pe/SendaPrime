export default function ProgressBar({ progreso }) {

  return (

    <div className="progress-container">

      <div
        className="progress-fill"
        style={{ width: `${progreso}%` }}
      ></div>

    </div>

  );

}