import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Wind, Eye } from 'lucide-react';
import { airQualityApi } from '@/lib/api';
import { getAQIColor, formatTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function Dashboard() {
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentData();
    const interval = setInterval(fetchCurrentData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentData = async () => {
    try {
      const data = await airQualityApi.getCurrentAirQuality();
      setCurrentData(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch air quality data');
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <ArrowUp className="w-5 h-5" />;
    if (trend === 'falling') return <ArrowDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass dark:glass rounded-2xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentData) return null;

  const aqiColor = getAQIColor(currentData.aqi_category);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold font-outfit mb-2">Live Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Real-time air quality data for Delhi • Updated {formatTime(currentData.timestamp)}
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main AQI Card - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 md:row-span-2 glass dark:glass rounded-2xl p-8 border hover:border-white/30 transition-all shadow-xl"
          data-testid="aqi-main-card"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Air Quality Index</p>
              <h2 className="text-6xl font-black font-mono">{currentData.aqi_value}</h2>
            </div>
            <div className={`px-4 py-2 rounded-full ${aqiColor.bg} bg-opacity-20 border-2 ${aqiColor.bg}`}>
              <p className={`text-sm font-bold ${aqiColor.text}`}>{currentData.aqi_category}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Location</span>
              </div>
              <span className="font-mono text-sm">{currentData.location}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Status</span>
              </div>
              <span className={`font-semibold ${aqiColor.text}`}>
                {currentData.aqi_category}
              </span>
            </div>
          </div>
        </motion.div>

        {/* NO2 Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass dark:glass rounded-2xl p-6 border hover:border-white/30 transition-all shadow-xl"
          data-testid="no2-card"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Nitrogen Dioxide</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-4xl font-black font-mono">{currentData.no2.toFixed(1)}</h3>
            <span className="text-sm text-muted-foreground">µg/m³</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${currentData.trend_no2 === 'rising' ? 'bg-red-500/20 text-red-500' : currentData.trend_no2 === 'falling' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
              {getTrendIcon(currentData.trend_no2)}
            </div>
            <span className="text-sm capitalize">{currentData.trend_no2}</span>
          </div>
        </motion.div>

        {/* O3 Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass dark:glass rounded-2xl p-6 border hover:border-white/30 transition-all shadow-xl"
          data-testid="o3-card"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Ozone</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-4xl font-black font-mono">{currentData.o3.toFixed(1)}</h3>
            <span className="text-sm text-muted-foreground">µg/m³</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${currentData.trend_o3 === 'rising' ? 'bg-red-500/20 text-red-500' : currentData.trend_o3 === 'falling' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
              {getTrendIcon(currentData.trend_o3)}
            </div>
            <span className="text-sm capitalize">{currentData.trend_o3}</span>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 glass dark:glass rounded-2xl p-6 border hover:border-white/30 transition-all shadow-xl"
          data-testid="info-card"
        >
          <h3 className="text-lg font-bold font-outfit mb-4">Health Impact</h3>
          <p className="text-muted-foreground leading-relaxed">
            {currentData.aqi_category === 'Good' && 'Air quality is satisfactory. Ideal for outdoor activities.'}
            {currentData.aqi_category === 'Satisfactory' && 'Air quality is acceptable. Enjoy outdoor activities.'}
            {currentData.aqi_category === 'Moderate' && 'Sensitive individuals should limit prolonged outdoor exposure.'}
            {currentData.aqi_category === 'Poor' && 'Everyone should reduce prolonged outdoor exertion. Wear masks.'}
            {currentData.aqi_category === 'Very Poor' && 'Avoid outdoor activities. Use N95 masks if necessary to go outside.'}
            {currentData.aqi_category === 'Severe' && 'Health alert: Stay indoors. Use air purifiers and keep windows closed.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}