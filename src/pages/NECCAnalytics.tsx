
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Egg, MapPin, Calendar, ArrowLeft, Download, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllZonePrices, 
  getHistoricalPrices, 
  getAvailableZones, 
  getNationalAverage,
  getPriceAlerts,
  getSeasonalityMarkers,
  type NECCZonePrice 
} from '@/services/neccPriceService';

const NECCAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState('HYD');
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [compareZone, setCompareZone] = useState<string>('');
  
  const zones = getAvailableZones();
  const allPrices = getAllZonePrices();
  const national = getNationalAverage();
  const alerts = getPriceAlerts();
  const seasonality = getSeasonalityMarkers();
  
  const historicalData = useMemo(() => getHistoricalPrices(selectedZone, period), [selectedZone, period]);
  const compareData = useMemo(() => 
    compareZone ? getHistoricalPrices(compareZone, period) : null, 
    [compareZone, period]
  );
  
  const chartData = useMemo(() => {
    return historicalData.map((d, i) => ({
      date: d.date,
      eggPrice: d.eggPrice,
      broilerPrice: d.broilerPrice,
      feedCostIndex: d.feedCostIndex,
      ...(compareData && compareData[i] ? {
        compareEgg: compareData[i].eggPrice,
        compareBroiler: compareData[i].broilerPrice,
      } : {})
    }));
  }, [historicalData, compareData]);
  
  const selectedZoneData = allPrices.find(p => p.zoneCode === selectedZone);

  // Zone comparison data for bar chart
  const zoneComparisonData = allPrices
    .sort((a, b) => b.eggPrice - a.eggPrice)
    .map(z => ({
      zone: z.zoneCode,
      eggPrice: z.eggPrice,
      broilerPrice: z.broilerPrice,
      isSelected: z.zoneCode === selectedZone,
    }));

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NECC Price Analytics</h1>
              <p className="text-sm text-gray-500">Zonal price intelligence for informed decision making</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-1.5" />
              Set Alert
            </Button>
          </div>
        </div>

        {/* Zone Selector + Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-1">
            <CardContent className="p-4 space-y-3">
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {zones.map(z => (
                    <SelectItem key={z.zoneCode} value={z.zoneCode}>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {z.zone}, {z.state}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedZoneData && (
                <div className="space-y-2 pt-2">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <p className="text-[10px] uppercase text-blue-600 font-semibold">Egg Price</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-900">₹{selectedZoneData.eggPrice.toFixed(2)}</span>
                      <span className="text-xs text-blue-500">/piece</span>
                    </div>
                    <div className={`text-xs flex items-center gap-1 mt-0.5 ${selectedZoneData.eggDelta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {selectedZoneData.eggDelta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      ₹{Math.abs(selectedZoneData.eggDelta).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-rose-50 to-rose-100">
                    <p className="text-[10px] uppercase text-rose-600 font-semibold">Broiler Price</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-rose-900">₹{selectedZoneData.broilerPrice}</span>
                      <span className="text-xs text-rose-500">/kg</span>
                    </div>
                    <div className={`text-xs flex items-center gap-1 mt-0.5 ${selectedZoneData.broilerDelta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {selectedZoneData.broilerDelta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      ₹{Math.abs(selectedZoneData.broilerDelta)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* National Average Comparison */}
          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Price Trend — {selectedZoneData?.zone || selectedZone}</CardTitle>
                  <CardDescription className="text-xs">
                    {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : period === '90d' ? 'Last 90 days' : 'Last 1 year'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {(['7d', '30d', '90d', '1y'] as const).map(p => (
                    <Button 
                      key={p}
                      variant={period === p ? 'default' : 'outline'} 
                      size="sm"
                      className={`text-xs h-7 ${period === p ? 'bg-[#ea384c]' : ''}`}
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Select value={compareZone} onValueChange={setCompareZone}>
                    <SelectTrigger className="w-[140px] h-7 text-xs">
                      <SelectValue placeholder="Compare zone..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No comparison</SelectItem>
                      {zones.filter(z => z.zoneCode !== selectedZone).map(z => (
                        <SelectItem key={z.zoneCode} value={z.zoneCode}>{z.zone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="neccEgg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="neccBroiler" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea384c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ea384c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return period === '7d' ? d.toLocaleDateString('en-IN', { weekday: 'short' }) 
                          : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                      }}
                    />
                    <YAxis yAxisId="egg" orientation="left" tick={{ fontSize: 10 }} stroke="#3b82f6" />
                    <YAxis yAxisId="broiler" orientation="right" tick={{ fontSize: 10 }} stroke="#ea384c" />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                      formatter={(value: number, name: string) => [
                        `₹${typeof value === 'number' ? (name.includes('Egg') ? value.toFixed(2) : value.toFixed(0)) : value}`,
                        name
                      ]}
                      labelFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    />
                    <Legend />
                    <Area yAxisId="egg" type="monotone" dataKey="eggPrice" name="Egg Price (₹/pc)" 
                      stroke="#3b82f6" strokeWidth={2} fill="url(#neccEgg)" />
                    <Area yAxisId="broiler" type="monotone" dataKey="broilerPrice" name="Broiler Price (₹/kg)" 
                      stroke="#ea384c" strokeWidth={2} fill="url(#neccBroiler)" />
                    
                    {compareData && (
                      <>
                        <Area yAxisId="egg" type="monotone" dataKey="compareEgg" name={`${compareZone} Egg`}
                          stroke="#3b82f6" strokeWidth={1} strokeDasharray="5 5" fillOpacity={0} />
                        <Area yAxisId="broiler" type="monotone" dataKey="compareBroiler" name={`${compareZone} Broiler`}
                          stroke="#ea384c" strokeWidth={1} strokeDasharray="5 5" fillOpacity={0} />
                      </>
                    )}
                    
                    {/* National average reference line */}
                    <ReferenceLine yAxisId="egg" y={national.eggPrice} stroke="#6b7280" strokeDasharray="3 3" 
                      label={{ value: `Natl Avg ₹${national.eggPrice}`, fill: '#6b7280', fontSize: 9, position: 'left' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Comparison Bar Chart + Price Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cross-Zone Comparison</CardTitle>
              <CardDescription>Compare egg prices across all NECC zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneComparisonData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="zone" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Egg Price']}
                    />
                    <ReferenceLine y={national.eggPrice} stroke="#6b7280" strokeDasharray="3 3"
                      label={{ value: 'National Avg', fill: '#6b7280', fontSize: 9, position: 'top' }} />
                    <Bar dataKey="eggPrice" name="Egg Price (₹/pc)" radius={[4, 4, 0, 0]}
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Price Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                Price Alerts
              </CardTitle>
              <CardDescription>Significant price movements today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.length > 0 ? alerts.map(alert => (
                <div key={alert.id} className={`p-2.5 rounded-lg text-xs border ${
                  alert.type === 'spike' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                  alert.type === 'drop' ? 'bg-red-50 border-red-200 text-red-800' :
                  'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <p className="font-medium">{alert.zone}</p>
                  <p className="mt-0.5 text-[10px] opacity-80">{alert.message}</p>
                </div>
              )) : (
                <p className="text-xs text-gray-400 text-center py-4">No significant price movements today</p>
              )}
              
              {/* Seasonality Upcoming */}
              <div className="pt-3 border-t mt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Upcoming Seasonality Events</p>
                {seasonality
                  .filter(s => new Date(s.date) >= new Date())
                  .slice(0, 3)
                  .map(s => (
                    <div key={s.date} className="flex items-center gap-2 text-xs text-gray-500 py-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        s.type === 'festival' ? 'bg-purple-100 text-purple-700' :
                        s.type === 'weather' ? 'bg-blue-100 text-blue-700' :
                        s.type === 'outbreak' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{s.label}</span>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NECCAnalytics;
