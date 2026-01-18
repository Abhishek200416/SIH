# Data Sources Explanation

## Seasonal Insights Page

### Historical Data (Past 5 Years)

**API Endpoint:** `/api/historical`

**Data Generation:**
The historical data is currently **generated algorithmically** using realistic patterns based on Delhi's known air quality trends:

```python
# Winter months (Nov, Dec, Jan, Feb): Higher NO₂
- Average NO₂: 100-180 µg/m³
- Max NO₂: 180-250 µg/m³
- Reason: Low wind speeds, temperature inversion, biomass burning

# Summer months (Apr, May, Jun): Higher O₃
- Average O₃: 80-140 µg/m³
- Max O₃: 140-200 µg/m³
- Reason: High temperatures and intense sunlight increase O₃ formation

# Other months: Moderate levels
- Average NO₂: 50-100 µg/m³
- Average O₃: 40-80 µg/m³
```

**Data Structure:**
- Returns 60 data points (5 years × 12 months)
- Each point includes: year, month, avg_no2, avg_o3, max_no2, max_o3
- Data reflects realistic seasonal variations in Delhi's air quality

### Seasonal Patterns

**API Endpoint:** `/api/seasonal-patterns`

**Data:**
Returns 4 seasonal patterns with scientifically accurate descriptions:

1. **Winter (Dec-Feb)**
   - Highest NO₂ levels: 145.5 µg/m³
   - Lower O₃ levels: 55.2 µg/m³
   - Factors: Low wind speeds, temperature inversion, increased biomass burning

2. **Spring (Mar-May)**
   - Moderate NO₂: 85.3 µg/m³
   - Rising O₃: 105.8 µg/m³
   - Factors: Increasing solar radiation, improving weather

3. **Summer (Jun-Aug)**
   - Lowest NO₂: 65.7 µg/m³
   - Peak O₃: 125.4 µg/m³
   - Factors: High temperatures, intense sunlight, monsoon relief

4. **Autumn (Sep-Nov)**
   - Increasing NO₂: 115.2 µg/m³
   - Moderate O₃: 75.6 µg/m³
   - Factors: Stubble burning begins, cooler temperatures

---

## Other Data Sources

### Current Air Quality
**Endpoint:** `/api/current-air-quality`
**Source:** 
- **Primary:** Real WAQI API (when valid token provided)
- **Fallback:** Realistic mock data (when WAQI unavailable)

### Weather Data
**Endpoint:** `/api/weather`
**Source:** 
- **Real API:** Open-Meteo API (free, no token needed)
- Provides: temperature, humidity, wind, pressure, solar radiation, cloud cover

### Forecast Data (NO₂ and O₃)
**Endpoint:** `/api/forecast/no2` and `/api/forecast/o3`
**Source:**
- **With ML Models:** Your trained models (when enabled)
- **Without ML Models:** Returns 503 error with "We'll be back soon" message

### Hotspots
**Endpoint:** `/api/hotspots`
**Source:**
- **Primary:** Real WAQI API for Delhi stations
- **With ML Models:** Can be enhanced with your trained models
- **Without ML Models:** Returns 503 error with "We'll be back soon" message

### Alerts
**Endpoint:** `/api/alerts`
**Source:**
- Generated based on current pollution levels
- Dynamic recommendations based on air quality severity
- Real-time thresholds: Good (<100), Moderate (100-200), Poor (200+)

---

## Future Enhancement Options

If you want to replace the algorithmic historical data with real data:

1. **Option 1: Load from CSV**
   - Store historical data in CSV files
   - Load on server startup
   - Return actual historical measurements

2. **Option 2: Database Storage**
   - Store historical data in MongoDB
   - Update periodically from real sources
   - Query on demand

3. **Option 3: External API**
   - Integrate with historical air quality APIs
   - Example: OpenAQ, AirNow, CPCB archives

Would you like me to implement any of these options for real historical data?

---

## Summary

- ✅ **Seasonal Insights:** Generated with realistic Delhi patterns
- ✅ **Weather:** Real API (Open-Meteo)
- ✅ **Current Air Quality:** Real API (WAQI) with fallback
- ⏳ **Forecast:** Waiting for your ML models
- ⏳ **Hotspots:** Waiting for your ML models
- ✅ **Alerts:** Generated based on current conditions
