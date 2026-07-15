export default function MarcoDocumento() {

  return (

      <div
          style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none"
          }}
      >

          <div
              style={{
                  width: "78%",
                  aspectRatio: "210 / 297",
                  border: "3px solid rgba(255,255,255,.95)",
                  borderRadius: "12px",
                  boxShadow: "0 0 25px rgba(0,0,0,.55)"
              }}
          />

      </div>

  );

}