# ML Models Integration Guide

This guide explains how to integrate your trained ML models with the Delhi Air Quality Intelligence application.

## Overview

The application now supports ML-based forecasting for NO₂ and O₃ predictions. Until models are uploaded and configured, the Forecast and Hotspots pages will display a message: **"We'll be back soon, our engineers are working on it."**

---

## Step 1: Upload Model Files

### Required Files

You need to upload the following files from your local machine:

#### NO₂ Models (Pickle format)
```
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\no2_model_site1.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\no2_model_site2.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\no2_model_site3.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\no2_model_site4.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\no2_model_site5.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\no2_model_site6.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\no2_model_site7.pkl
```

#### O₃ Models (Keras format)
```
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_model_site1.keras
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_model_site2.keras
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_model_site3.keras
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_model_site4.keras
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_model_site5.keras
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_model_site6.keras
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_model_site7.keras
```

#### O₃ Scalers (Pickle format)
```
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_scaler_site1.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_scaler_site2.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_scaler_site3.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_scaler_site4.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_scaler_site5.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_scaler_site6.pkl
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\models\o3_scaler_site7.pkl
```

#### CSV Results Files (Optional)
```
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\results\hotspot_clusters.csv
C:\Users\abhis\Downloads\test1\SIH_Data_PS-10\Data_SIH_2025\results\site_wise_evaluation_metrics.csv
```

### Upload Destination

Upload all model files to:
```
/app/backend/models/
```

Upload CSV files to:
```
/app/backend/results/
```

---

## Step 2: Enable ML Models

After uploading the files, edit the configuration file:

**File:** `/app/backend/model_config.json`

Change this line:
```json
"models_enabled": false
```

To:
```json
"models_enabled": true
```

### Configuration File Reference

The `model_config.json` file contains:
- `models_directory`: Base directory for models
- `no2_models`: Paths to NO₂ model files for each site
- `o3_models`: Paths to O₃ model files for each site
- `o3_scalers`: Paths to O₃ scaler files for each site
- `results`: Paths to CSV result files
- `default_site`: Which site's model to use by default (currently "site1")
- `models_enabled`: Boolean flag to enable/disable ML models

---

## Step 3: Restart Backend

After uploading files and enabling models, restart the backend service:

```bash
sudo supervisorctl restart backend
```

---

## Step 4: Verify ML Models Status

You can check if models are loaded correctly by calling this API endpoint:

```bash
curl http://localhost:8001/api/models/status
```

Expected response when models are loaded:
```json
{
  "models_enabled": true,
  "models_loaded": true,
  "no2_models_count": 7,
  "o3_models_count": 7,
  "available": true,
  "message": "ML models are operational"
}
```

---

## Application Behavior

### When Models Are NOT Available (models_enabled: false)

**Forecast Page (`/forecast`):**
- Displays: "We'll be back soon, our engineers are working on it"
- Shows a friendly message with an icon
- Provides a "Try Again" button

**Hotspots Page (`/hotspots`):**
- Displays: "We'll be back soon, our engineers are working on it"
- Shows a friendly message with an icon
- Provides a "Try Again" button

**No mock data is shown.**

### When Models ARE Available (models_enabled: true)

**Forecast Page:**
- Shows 24h/48h NO₂ and O₃ predictions from ML models
- Interactive charts with real forecasts
- Data export functionality

**Hotspots Page:**
- Shows pollution hotspots across Delhi
- Interactive map with location markers
- Real-time air quality data

---

## Troubleshooting

### Models Not Loading

1. **Check file names match exactly**
   ```bash
   ls -la /app/backend/models/
   ```
   Ensure file names match those in `model_config.json`

2. **Check file permissions**
   ```bash
   chmod 644 /app/backend/models/*.pkl
   chmod 644 /app/backend/models/*.keras
   ```

3. **Check backend logs**
   ```bash
   tail -f /var/log/supervisor/backend.err.log
   ```
   Look for error messages about model loading

4. **Verify models_enabled is true**
   ```bash
   cat /app/backend/model_config.json | grep models_enabled
   ```

### API Returns 503 Error

If you see "Failed to fetch forecast data" or 503 errors:
1. Models are not enabled in config
2. Model files are missing or corrupted
3. Backend service is not running

Check the status endpoint: `/api/models/status`

---

## Technical Details

### Backend Implementation

**Files Modified:**
- `/app/backend/server.py` - API endpoints updated to check model availability
- `/app/backend/ml_models.py` - New module for ML model loading and prediction
- `/app/backend/model_config.json` - Configuration file for model paths

**New Dependencies Added:**
- `tensorflow==2.17.0` - For loading Keras models
- `scikit-learn==1.5.2` - For loading pickle models and scalers

### Frontend Implementation

**Files Modified:**
- `/app/frontend/src/pages/ForecastAnalytics.js` - Added models unavailable state
- `/app/frontend/src/pages/HotspotMap.js` - Added models unavailable state

**User Experience:**
- Graceful degradation when models unavailable
- Clear messaging about system status
- Retry functionality for users

---

## Next Steps

1. Upload your ML model files to `/app/backend/models/`
2. Upload CSV files to `/app/backend/results/` (optional)
3. Set `models_enabled: true` in `/app/backend/model_config.json`
4. Restart backend: `sudo supervisorctl restart backend`
5. Visit the app and navigate to Forecast or Hotspots pages
6. Verify predictions are being displayed

---

## Support

If you encounter issues:
1. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
2. Verify model status: `curl http://localhost:8001/api/models/status`
3. Ensure all files are uploaded with correct names
4. Confirm `models_enabled: true` in config

---

**Last Updated:** January 2026
