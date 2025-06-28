"use client";
import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { FiArrowLeft } from "react-icons/fi";

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://example.com");
  const [logo, setLogo] = useState(null);
  const qrRef = useRef(null);

  // Estados para personalización
  const [qrSize, setQrSize] = useState(256);
  const [logoSize, setLogoSize] = useState(48);

  // Calcular porcentaje del logo respecto al QR
  const [logoPadding, setLogoPadding] = useState(8);
  const logoPercentage = ((logoSize + logoPadding * 2) / qrSize) * 100;
  const isLogoTooLarge = logoPercentage > 30; // Más del 30% puede afectar la lectura
  const isLogoWarning = logoPercentage > 20; // Advertencia a partir del 20%
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [logoBgColor, setLogoBgColor] = useState("#ffffff");
  const [logoBorderRadius, setLogoBorderRadius] = useState(50);
  const [shadowBlur, setShadowBlur] = useState(8);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowOpacity, setShadowOpacity] = useState(0.3);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#000000");
  const [cornerRadius, setCornerRadius] = useState(0);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const downloadPNG = async () => {
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svg64 = btoa(unescape(encodeURIComponent(svgString)));
    const image64 = `data:image/svg+xml;base64,${svg64}`;

    const canvas = document.createElement("canvas");
    const totalSize = qrSize + borderWidth * 2;
    canvas.width = totalSize;
    canvas.height = totalSize;
    const ctx = canvas.getContext("2d");

    // Fondo con border
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, totalSize, totalSize);

    // Fondo principal del QR
    ctx.fillStyle = qrBgColor;
    if (cornerRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(borderWidth, borderWidth, qrSize, qrSize, cornerRadius);
      ctx.fill();
    } else {
      ctx.fillRect(borderWidth, borderWidth, qrSize, qrSize);
    }

    // Dibuja el QR
    await new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        ctx.drawImage(img, borderWidth, borderWidth, qrSize, qrSize);
        resolve();
      };
      img.src = image64;
    });

    // Dibuja el logo si existe
    if (logo) {
      await new Promise((resolve) => {
        const logoImg = new window.Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.onload = () => {
          const centerX = totalSize / 2;
          const centerY = totalSize / 2;
          const logoRadius = logoSize / 2 + logoPadding;

          ctx.save();

          // Sombra del logo
          if (shadowBlur > 0) {
            ctx.shadowColor =
              shadowColor +
              Math.round(shadowOpacity * 255)
                .toString(16)
                .padStart(2, "0");
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
          }

          // Fondo del logo
          ctx.fillStyle = logoBgColor;
          ctx.beginPath();
          if (logoBorderRadius === 50) {
            ctx.arc(centerX, centerY, logoRadius, 0, 2 * Math.PI);
          } else {
            const radius = (logoRadius * logoBorderRadius) / 50;
            ctx.roundRect(
              centerX - logoRadius,
              centerY - logoRadius,
              logoRadius * 2,
              logoRadius * 2,
              radius
            );
          }
          ctx.fill();

          ctx.restore();

          // Logo
          ctx.save();
          ctx.beginPath();
          if (logoBorderRadius === 50) {
            ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
          } else {
            const radius = ((logoSize / 2) * logoBorderRadius) / 50;
            ctx.roundRect(
              centerX - logoSize / 2,
              centerY - logoSize / 2,
              logoSize,
              logoSize,
              radius
            );
          }
          ctx.clip();

          ctx.drawImage(
            logoImg,
            centerX - logoSize / 2,
            centerY - logoSize / 2,
            logoSize,
            logoSize
          );
          ctx.restore();
          resolve();
        };
        logoImg.src = logo;
      });
    }

    // Descarga el PNG
    const link = document.createElement("a");
    link.download = `qr_${qrSize}x${qrSize}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const resetDefaults = () => {
    setQrSize(256);
    setLogoSize(48);
    setQrBgColor("#ffffff");
    setQrFgColor("#000000");
    setLogoBgColor("#ffffff");
    setLogoBorderRadius(50);
    setLogoPadding(8);
    setShadowBlur(8);
    setShadowColor("#000000");
    setShadowOpacity(0.3);
    setBorderWidth(0);
    setBorderColor("#000000");
    setCornerRadius(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#BD155C] to-[#1E171E] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Generador QR Ultra Personalizable
            </h1>
            <p className="text-white text-lg">
              Crea códigos QR únicos con control total sobre el diseño
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Dashboard
          </a>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel de Controles */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-6 h-fit">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Configuración
              </h2>
              <button
                onClick={resetDefaults}
                className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Restablecer
              </button>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                🔗 Enlace
              </label>
              <input
                type="text"
                placeholder="https://tupagina.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Tamaño del QR */}
            <div className="space-y-3">
              <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                📏 Tamaño del QR: {qrSize}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>128px</span>
                <span>320px</span>
                <span>512px</span>
              </div>
            </div>

            {/* Colores del QR */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                  🎨 Color de fondo
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                  🖤 Color del código
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Bordes del QR */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                  📐 Grosor borde: {borderWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                  🔲 Color borde
                </label>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-full h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Esquinas redondeadas */}
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                ⭕ Esquinas redondeadas: {cornerRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={cornerRadius}
                onChange={(e) => setCornerRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Logo */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Logo
              </h3>

              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                  📁 Subir logo (PNG, JPG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer text-slate-700 dark:text-slate-300 file:transition-colors"
                />
              </div>

              {logo && (
                <>
                  <div className="space-y-2">
                    <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                      📏 Tamaño logo: {logoSize}px ({logoPercentage.toFixed(1)}%
                      del QR)
                    </label>
                    <input
                      type="range"
                      min="24"
                      max="96"
                      step="4"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors ${
                        isLogoTooLarge
                          ? "bg-red-200"
                          : isLogoWarning
                          ? "bg-yellow-200"
                          : "bg-slate-200"
                      }`}
                    />

                    {/* Advertencias de tamaño */}
                    {isLogoTooLarge && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <span className="text-red-500">⚠️</span>
                        <div className="text-sm text-red-700 dark:text-red-300">
                          <strong>Logo muy grande:</strong> Puede afectar la
                          lectura del QR. Recomendado: máximo 30% del tamaño
                          total.
                        </div>
                      </div>
                    )}

                    {isLogoWarning && !isLogoTooLarge && (
                      <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <span className="text-yellow-600">⚡</span>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                          <strong>Cuidado:</strong> Logo grande detectado.
                          Prueba escanear el QR para verificar que funciona
                          correctamente.
                        </div>
                      </div>
                    )}

                    {!isLogoWarning && (
                      <div className="flex items-center space-x-2 p-2 text-sm text-green-600 dark:text-green-400">
                        <span>✅</span>
                        <span>Tamaño óptimo para buena legibilidad</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                      🎨 Color fondo logo
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={logoBgColor}
                        onChange={(e) => setLogoBgColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={logoBgColor}
                        onChange={(e) => setLogoBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                        🔄 Redondez: {logoBorderRadius}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={logoBorderRadius}
                        onChange={(e) =>
                          setLogoBorderRadius(Number(e.target.value))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                        📏 Padding: {logoPadding}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={logoPadding}
                        onChange={(e) => setLogoPadding(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                        💫 Sombra: {shadowBlur}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={shadowBlur}
                        onChange={(e) => setShadowBlur(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                        🌫️ Opacidad: {Math.round(shadowOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={shadowOpacity}
                        onChange={(e) =>
                          setShadowOpacity(Number(e.target.value))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-slate-700 dark:text-slate-200 font-semibold">
                        🎨 Color sombra
                      </label>
                      <input
                        type="color"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="w-full h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Vista Previa */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Vista Previa
              </h2>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {qrSize}×{qrSize}px
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div
                ref={qrRef}
                className="relative bg-slate-50 dark:bg-slate-100 rounded-xl p-8 shadow-inner"
                style={{
                  background: `repeating-conic-gradient(#f1f5f9 0% 25%, #e2e8f0 25% 50%) 50% / 20px 20px`,
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: qrSize + borderWidth * 2,
                    height: qrSize + borderWidth * 2,
                    backgroundColor: borderColor,
                    borderRadius: cornerRadius > 0 ? `${cornerRadius}px` : "0",
                    padding: `${borderWidth}px`,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: qrBgColor,
                      borderRadius:
                        cornerRadius > 0
                          ? `${Math.max(0, cornerRadius - borderWidth)}px`
                          : "0",
                      overflow: "hidden",
                    }}
                  >
                    <QRCode
                      value={url}
                      size={qrSize}
                      bgColor={qrBgColor}
                      fgColor={qrFgColor}
                    />
                  </div>

                  {logo && (
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: logoSize + logoPadding * 2,
                        height: logoSize + logoPadding * 2,
                        backgroundColor: logoBgColor,
                        borderRadius:
                          logoBorderRadius === 50
                            ? "50%"
                            : `${
                                (logoBorderRadius *
                                  (logoSize + logoPadding * 2)) /
                                100
                              }px`,
                        boxShadow:
                          shadowBlur > 0
                            ? `2px 2px ${shadowBlur}px ${shadowColor}${Math.round(
                                shadowOpacity * 255
                              )
                                .toString(16)
                                .padStart(2, "0")}`
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={logo}
                        alt="Logo"
                        style={{
                          width: logoSize,
                          height: logoSize,
                          borderRadius:
                            logoBorderRadius === 50
                              ? "50%"
                              : `${(logoBorderRadius * logoSize) / 100}px`,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={downloadPNG}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                📥 Descargar QR ({qrSize + borderWidth * 2}×
                {qrSize + borderWidth * 2}px)
              </button>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                  <div className="font-semibold text-slate-800 dark:text-white">
                    Tamaño Final
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    {qrSize + borderWidth * 2}px
                  </div>
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    logo
                      ? isLogoTooLarge
                        ? "bg-red-50 dark:bg-red-900/20"
                        : isLogoWarning
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : "bg-green-50 dark:bg-green-900/20"
                      : "bg-slate-50 dark:bg-slate-700"
                  }`}
                >
                  <div className="font-semibold text-slate-800 dark:text-white">
                    Logo
                  </div>
                  <div
                    className={`${
                      logo
                        ? isLogoTooLarge
                          ? "text-red-600 dark:text-red-400"
                          : isLogoWarning
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {logo
                      ? `${logoSize}px (${logoPercentage.toFixed(1)}%)`
                      : "Sin logo"}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                  <div className="font-semibold text-slate-800 dark:text-white">
                    Borde
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    {borderWidth}px
                  </div>
                </div>
              </div>

              {/* Recomendaciones automáticas */}
              {logo && isLogoTooLarge && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Sugerencias para mejor legibilidad:
                      </h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>
                          • Reducir tamaño del logo a máximo{" "}
                          {Math.round(qrSize * 0.3)}px
                        </li>
                        <li>• Usar colores con alto contraste</li>
                        <li>
                          • Probar escanear con diferentes apps antes de usar
                        </li>
                        <li>
                          • Considerar aumentar el tamaño del QR a {qrSize + 64}
                          px
                        </li>
                      </ul>
                      <button
                        onClick={() =>
                          setLogoSize(
                            Math.min(logoSize, Math.round(qrSize * 0.25))
                          )
                        }
                        className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ajustar automáticamente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
