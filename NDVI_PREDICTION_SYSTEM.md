# 🌱 Sistema de Predicción de NDVI - Documentación Completa

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [API Endpoints](#api-endpoints)
5. [Metodología de Predicción](#metodología-de-predicción)
6. [Uso y Ejemplos](#uso-y-ejemplos)
7. [Despliegue](#despliegue)

---

## 📖 Descripción General

Sistema de predicción de NDVI (Índice de Vegetación de Diferencia Normalizada) que utiliza análisis estadístico de series temporales para predecir valores futuros de vegetación hasta 90 días adelante, con cálculo de confianza y recomendaciones agronómicas.

### Características Principales

- ✅ **Predicción estadística** sin necesidad de Machine Learning
- ✅ **Análisis histórico** de 3-5 años de datos MODIS
- ✅ **Cálculo de confianza** basado en múltiples factores
- ✅ **Recomendaciones agronómicas** automáticas
- ✅ **Pronósticos de múltiples fechas** con intervalos personalizables
- ✅ **Soporte para diferentes cultivos** (maíz, trigo, soja, arroz)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│              Frontend (Next.js)                 │
│  - Mapas interactivos (MapLibre GL)             │
│  - Visualización de predicciones                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         API Routes (Next.js API)                │
│  POST /api/nasa/predict                         │
│  GET  /api/nasa/predict (forecast)              │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│           Módulos de Predicción                 │
│  ┌──────────────────────────────────────────┐   │
│  │  1. ndvi-analysis.js                     │   │
│  │     - fetchHistoricalNDVI()              │   │
│  │     - calculateSeasonalPattern()         │   │
│  │     - calculateTrend()                   │   │
│  │     - calculateVariability()             │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  2. ndvi-prediction.js                   │   │
│  │     - predictNDVI()                      │   │
│  │     - calculateConfidence()              │   │
│  │     - generateForecast()                 │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  3. agronomic-recommendations.js         │   │
│  │     - generateRecommendations()          │   │
│  │     - getIrrigationRecommendation()      │   │
│  │     - getFertilizationRecommendation()   │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Fuentes de Datos (Futuro)               │
│  - NASA AppEEARS API                            │
│  - Google Earth Engine                          │
│  - MODIS MOD13Q1 (NDVI/EVI)                     │
└─────────────────────────────────────────────────┘
```

---

## 🧩 Componentes Principales

### 1. **Módulo de Análisis Histórico** (`src/lib/ndvi-analysis.js`)

Funciones principales:

#### `fetchHistoricalNDVI(lat, lon, yearsBack)`
```javascript
// Obtiene datos históricos de NDVI para una ubicación
const historicalData = await fetchHistoricalNDVI(38.8977, -77.0365, 3);
```

#### `calculateSeasonalPattern(historicalData)`
```javascript
// Calcula promedios mensuales y desviación estándar
const seasonalPattern = calculateSeasonalPattern(historicalData);
// Retorna: { 1: {average: 0.45, stdDev: 0.08, ...}, 2: {...}, ... }
```

#### `calculateTrend(historicalData)`
```javascript
// Regresión lineal para tendencia a largo plazo
const trend = calculateTrend(historicalData);
// Retorna: { slope: 0.0001, intercept: 0.45, r2: 0.82 }
```

#### `calculateVariability(historicalData)`
```javascript
// Métricas de variabilidad
const variability = calculateVariability(historicalData);
// Retorna: { mean: 0.55, stdDev: 0.12, cv: 0.22, ... }
```

---

### 2. **Módulo de Predicción** (`src/lib/ndvi-prediction.js`)

#### Fórmula de Predicción

```javascript
NDVI_predicho = Promedio_estacional + Ajuste_tendencia + Factor_variabilidad

Donde:
- Promedio_estacional = Promedio histórico del mes objetivo
- Ajuste_tendencia = slope * días_desde_inicio
- Factor_variabilidad = stdDev * factor_incertidumbre * 0.5
```

#### Cálculo de Confianza

```javascript
Confianza = (
  estabilidad_estacional * 0.3 +
  confiabilidad_tendencia * 0.2 +
  calidad_datos * 0.2 +
  confiabilidad_temporal * 0.2 +
  score_variabilidad * 0.1
) * 100

Factores:
1. Estabilidad estacional: 1 - (stdDev / promedio)
2. Confiabilidad tendencia: R² de regresión lineal
3. Calidad datos: min(puntos_datos / 36, 1)
4. Confiabilidad temporal: 1 - (días_adelante / 90)
5. Score variabilidad: 1 - coeficiente_variación
```

#### Funciones principales:

```javascript
// Predicción única
const prediction = await predictNDVI(lat, lon, targetDate, yearsHistory);

// Pronóstico múltiple
const forecast = await generateForecast(lat, lon, days, interval, yearsHistory);
```

---

### 3. **Módulo de Recomendaciones Agronómicas** (`src/lib/agronomic-recommendations.js`)

#### Umbrales NDVI

```javascript
BARE_SOIL: 0.1           // Suelo desnudo
SPARSE_VEGETATION: 0.3   // Vegetación escasa
MODERATE_VEGETATION: 0.5 // Vegetación moderada
HEALTHY_VEGETATION: 0.7  // Vegetación saludable
VERY_HEALTHY: 0.8        // Muy saludable
```

#### Tipos de Recomendaciones

1. **Riego**: Basado en nivel NDVI y tendencia
2. **Fertilización**: NPK según déficit detectado
3. **Monitoreo**: Frecuencia según confianza de predicción
4. **Timing**: Siembra, cosecha, aspersión
5. **Alertas**: Condiciones críticas o preocupantes

#### Ejemplo de uso:

```javascript
const report = generateRecommendationReport(prediction, {
  cropType: 'corn',
  currentNDVI: 0.45,
  region: 'midwest'
});
```

---

## 🔌 API Endpoints

### POST `/api/nasa/predict`

Predicción de NDVI para una fecha específica.

**Request Body:**
```json
{
  "lat": 38.8977,
  "lon": -77.0365,
  "targetDate": "2025-11-05",
  "yearsHistory": 3,
  "cropType": "corn",
  "currentNDVI": 0.45,
  "includeRecommendations": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prediction": {
      "ndvi": 0.652,
      "lowerBound": 0.598,
      "upperBound": 0.706,
      "targetDate": "2025-11-05",
      "daysAhead": 30
    },
    "confidence": {
      "percentage": 78,
      "level": "high",
      "factors": {
        "seasonalStability": 0.856,
        "trendReliability": 0.734,
        "dataQuality": 1.0,
        "temporalDistance": 0.667
      }
    },
    "recommendations": {
      "summary": "Healthy vegetation with good canopy development",
      "vegetation": {
        "status": "healthy",
        "health": "Good"
      },
      "irrigation": {
        "priority": "low",
        "action": "Continue current irrigation practices"
      },
      "fertilization": {
        "priority": "low",
        "action": "Maintain current fertilization schedule"
      }
    }
  }
}
```

---

### GET `/api/nasa/predict?lat=x&lon=y&days=30&interval=7`

Generar pronóstico para múltiples fechas.

**Query Parameters:**
- `lat`: Latitud (required)
- `lon`: Longitud (required)
- `days`: Días a pronosticar (default: 30, max: 90)
- `interval`: Intervalo en días (default: 7)
- `yearsHistory`: Años de historia (default: 3)

**Response:**
```json
{
  "success": true,
  "data": {
    "location": { "lat": 38.8977, "lon": -77.0365 },
    "forecastPeriod": {
      "days": 30,
      "interval": 7,
      "startDate": "2025-10-05",
      "endDate": "2025-11-04"
    },
    "predictions": [
      {
        "prediction": { "ndvi": 0.623, "targetDate": "2025-10-12" },
        "confidence": { "percentage": 82, "level": "high" }
      }
    ],
    "summary": {
      "averageNDVI": 0.641,
      "averageConfidence": 79,
      "totalPredictions": 4
    }
  }
}
```

---

## 🧪 Uso y Ejemplos

### Ejemplo 1: Predicción Simple

```javascript
// Frontend o cliente
const response = await fetch('/api/nasa/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lat: 38.8977,
    lon: -77.0365,
    targetDate: '2025-11-05',
    includeRecommendations: true
  })
});

const { data } = await response.json();
console.log(`NDVI predicho: ${data.prediction.ndvi}`);
console.log(`Confianza: ${data.confidence.percentage}%`);
```

### Ejemplo 2: Pronóstico de 60 días

```javascript
const response = await fetch(
  '/api/nasa/predict?lat=34.0522&lon=-118.2437&days=60&interval=10'
);

const { data } = await response.json();
data.predictions.forEach(p => {
  console.log(`${p.prediction.targetDate}: NDVI ${p.prediction.ndvi} (${p.confidence.percentage}% confianza)`);
});
```

### Ejemplo 3: Test Script

```bash
# Ejecutar pruebas
node test-prediction.js
```

---

## 📊 Metodología de Predicción

### 1. Análisis Histórico (3-5 años)

```
Datos MODIS MOD13Q1:
- Resolución: 250m
- Temporal: 16 días
- Fuente: AppEEARS API / Google Earth Engine
```

### 2. Patrón Estacional

```
Para cada mes (1-12):
  - Calcular promedio NDVI de todos los años
  - Calcular desviación estándar
  - Identificar min/max históricos
```

### 3. Tendencia de Largo Plazo

```
Regresión lineal:
  y = mx + b

Donde:
  x = días desde primera observación
  y = NDVI
  m = slope (tendencia)
  b = intercept
  R² = coeficiente de determinación
```

### 4. Predicción Final

```
1. Obtener promedio estacional del mes objetivo
2. Aplicar ajuste de tendencia según días desde inicio
3. Añadir margen de variabilidad según incertidumbre
4. Limitar NDVI al rango válido [0, 1]
```

### 5. Confianza

```
Factores considerados:
✓ Consistencia estacional del mes
✓ Calidad de la regresión lineal (R²)
✓ Cantidad de datos históricos disponibles
✓ Distancia temporal de la predicción
✓ Variabilidad general de los datos

Resultado: 0-100%
- 80-100%: Alta confianza
- 60-79%: Media confianza
- 40-59%: Baja confianza
- 0-39%: Muy baja confianza
```

---

## 🚀 Despliegue

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Probar sistema de predicción
node test-prediction.js
```

### Producción (Google Cloud Run)

```bash
# Build
npm run build

# Deploy (ejemplo con gcloud)
gcloud run deploy bloom-minds-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Variables de Entorno

```env
# Opcional: Credenciales NASA Earthdata
NASA_USERNAME=your_username
NASA_PASSWORD=your_password

# Opcional: Google Earth Engine
GEE_SERVICE_ACCOUNT=your_service_account
GEE_PRIVATE_KEY=your_private_key
```

---

## 📈 Mejoras Futuras

1. **Integración real con Google Earth Engine**
   - Reemplazar datos mock con datos reales MODIS
   - Implementar autenticación GEE

2. **Machine Learning (opcional)**
   - LSTM para series temporales
   - Random Forest para clasificación

3. **Más fuentes de datos**
   - Sentinel-2 (10m resolución)
   - Landsat 8/9 (30m resolución)
   - VIIRS para tiempo casi real

4. **Análisis climático**
   - Integrar datos de precipitación
   - Temperatura de superficie
   - Humedad del suelo

5. **Alertas automáticas**
   - Notificaciones por email/SMS
   - Webhooks para sistemas externos

---

## 📝 Licencia y Créditos

- **Datos**: NASA Earth Science Data Systems
- **API**: AppEEARS, GIBS, CMR
- **Framework**: Next.js, React, MapLibre GL
- **Proyecto**: NASA Space Apps Challenge 2025

---

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agregar mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

---

## 📞 Soporte

Para preguntas o problemas:
- Issues: [GitHub Issues](https://github.com/GynoRomeroPrado/Proyectonasa/issues)
- Documentación: Este archivo
- Tests: `test-prediction.js`

---

**¡Gracias por usar el Sistema de Predicción de NDVI! 🌱🛰️**
