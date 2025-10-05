"use client";

import { useState } from "react";

export default function TestPredictionPage() {
  const [lat, setLat] = useState("38.8977");
  const [lon, setLon] = useState("-77.0365");
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set default date to 30 days from now
  useState(() => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    setTargetDate(future.toISOString().split("T")[0]);
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/nasa/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          targetDate,
          cropType: "corn",
          includeRecommendations: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Error desconocido");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForecast = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/nasa/predict?lat=${lat}&lon=${lon}&days=30&interval=7`,
      );

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Error desconocido");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          🌱 Test de Predicción NDVI
        </h1>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitud
              </label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitud
              </label>
              <input
                type="number"
                step="0.0001"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Objetivo
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Cargando..." : "📊 Predicción Única"}
            </button>

            <button
              onClick={handleForecast}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Cargando..." : "📈 Pronóstico 30 días"}
            </button>
          </div>

          {/* Quick Location Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Ubicaciones rápidas:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setLat("38.8977");
                  setLon("-77.0365");
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Washington DC
              </button>
              <button
                onClick={() => {
                  setLat("34.0522");
                  setLon("-118.2437");
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Los Angeles
              </button>
              <button
                onClick={() => {
                  setLat("35.6762");
                  setLon("139.6503");
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Tokyo
              </button>
              <button
                onClick={() => {
                  setLat("-23.5505");
                  setLon("-46.6333");
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                São Paulo
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ Error: {error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Resultados
            </h2>

            {/* Single Prediction */}
            {result.prediction && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  📊 Predicción
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">NDVI Predicho</p>
                    <p className="text-2xl font-bold text-green-700">
                      {result.prediction.ndvi}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Confianza</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {result.confidence.percentage}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Rango Inferior</p>
                    <p className="text-xl font-semibold text-gray-700">
                      {result.prediction.lowerBound}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Rango Superior</p>
                    <p className="text-xl font-semibold text-gray-700">
                      {result.prediction.upperBound}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  🌾 Recomendaciones
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="font-medium text-blue-900">
                      {result.recommendations.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border border-gray-200 p-3 rounded-md">
                      <p className="font-medium text-gray-700">💧 Riego</p>
                      <p className="text-sm text-gray-600">
                        {result.recommendations.irrigation?.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Prioridad:{" "}
                        {result.recommendations.irrigation?.priority}
                      </p>
                    </div>

                    <div className="border border-gray-200 p-3 rounded-md">
                      <p className="font-medium text-gray-700">🌱 Fertilización</p>
                      <p className="text-sm text-gray-600">
                        {result.recommendations.fertilization?.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tipo: {result.recommendations.fertilization?.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Forecast */}
            {result.predictions && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  📈 Pronóstico ({result.predictions.length} predicciones)
                </h3>
                <div className="space-y-2">
                  {result.predictions.map((pred, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {pred.prediction.targetDate}
                      </span>
                      <div className="flex gap-4">
                        <span className="text-sm">
                          NDVI:{" "}
                          <span className="font-semibold text-green-700">
                            {pred.prediction.ndvi}
                          </span>
                        </span>
                        <span className="text-sm">
                          Confianza:{" "}
                          <span className="font-semibold text-blue-700">
                            {pred.confidence.percentage}%
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                Ver JSON completo
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded-md text-xs overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
