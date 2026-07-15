import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function CameraScanner({ onScan }) {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        }
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR detectado:", decodedText);
        onScan(decodedText);
      },
      (error) => {
        console.log("Buscando QR...");
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, []);

  return <div id="reader"></div>;

}