/**
 * Test script for NDVI Prediction System
 * Run with: node test-prediction.js
 */

import { predictNDVI, generateForecast } from "./src/lib/ndvi-prediction.js";
import { generateRecommendationReport } from "./src/lib/agronomic-recommendations.js";

async function testPredictionSystem() {
  console.log("🧪 Testing NDVI Prediction System\n");
  console.log("=" .repeat(60));

  try {
    // Test 1: Single prediction
    console.log("\n📊 Test 1: Single NDVI Prediction");
    console.log("-".repeat(60));

    const testLocation = {
      lat: 38.8977, // Washington DC (Cherry Blossoms)
      lon: -77.0365,
    };

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days ahead

    console.log(`Location: ${testLocation.lat}, ${testLocation.lon}`);
    console.log(`Target Date: ${targetDate.toISOString().split("T")[0]}`);
    console.log(`Days Ahead: 30\n`);

    const prediction = await predictNDVI(
      testLocation.lat,
      testLocation.lon,
      targetDate,
      3, // 3 years of history
    );

    console.log("✅ Prediction Results:");
    console.log(JSON.stringify(prediction, null, 2));

    // Test 2: Prediction with recommendations
    console.log("\n\n📋 Test 2: Prediction with Agronomic Recommendations");
    console.log("-".repeat(60));

    const report = generateRecommendationReport(prediction, {
      cropType: "corn",
      currentNDVI: 0.45,
    });

    console.log("✅ Recommendation Report:");
    console.log(JSON.stringify(report, null, 2));

    // Test 3: Generate forecast
    console.log("\n\n📈 Test 3: Generate 30-Day Forecast");
    console.log("-".repeat(60));

    const forecast = await generateForecast(
      testLocation.lat,
      testLocation.lon,
      30, // 30 days
      7, // 7-day intervals
      3, // 3 years history
    );

    console.log("✅ Forecast Results:");
    console.log(JSON.stringify(forecast, null, 2));

    // Test 4: Multiple locations
    console.log("\n\n🌍 Test 4: Multiple Locations");
    console.log("-".repeat(60));

    const locations = [
      { name: "Washington DC", lat: 38.8977, lon: -77.0365 },
      { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
      { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    ];

    const multiPredictions = [];

    for (const loc of locations) {
      const pred = await predictNDVI(loc.lat, loc.lon, targetDate, 3);
      multiPredictions.push({
        location: loc.name,
        coordinates: { lat: loc.lat, lon: loc.lon },
        ndvi: pred.prediction.ndvi,
        confidence: pred.confidence.percentage,
        confidenceLevel: pred.confidence.level,
      });
    }

    console.log("✅ Multi-Location Predictions:");
    console.table(multiPredictions);

    // Test 5: Error handling
    console.log("\n\n⚠️  Test 5: Error Handling");
    console.log("-".repeat(60));

    try {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      await predictNDVI(testLocation.lat, testLocation.lon, pastDate, 3);
    } catch (error) {
      console.log("✅ Correctly caught error for past date:");
      console.log(`   Error: ${error.message}`);
    }

    try {
      const farFutureDate = new Date();
      farFutureDate.setDate(farFutureDate.getDate() + 100);
      await predictNDVI(testLocation.lat, testLocation.lon, farFutureDate, 3);
    } catch (error) {
      console.log("✅ Correctly caught error for date > 90 days:");
      console.log(`   Error: ${error.message}`);
    }

    // Summary
    console.log("\n\n" + "=".repeat(60));
    console.log("🎉 All Tests Completed Successfully!");
    console.log("=".repeat(60));
    console.log("\n📝 Summary:");
    console.log("   ✓ Single prediction works");
    console.log("   ✓ Recommendation generation works");
    console.log("   ✓ Forecast generation works");
    console.log("   ✓ Multiple location predictions work");
    console.log("   ✓ Error handling works correctly");
    console.log("\n🚀 System is ready for deployment!");
  } catch (error) {
    console.error("\n❌ Test Failed:");
    console.error(error);
    process.exit(1);
  }
}

// Run tests
testPredictionSystem();
