import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StatHighlight from '@/components/home/StatHighlight';
import NewsHighlight from '@/components/home/NewsHighlight';
import WeatherCard from '@/components/dashboard/WeatherCard';
import { Egg, BarChart3, Database, TrendingUp, PieChart, AlertCircle, ChevronRight } from 'lucide-react';
import PriceChart from '@/components/dashboard/PriceChart';
import FeedRatioChart from '@/components/dashboard/FeedRatioChart';
import ProductionStats from '@/components/dashboard/ProductionStats';
import NECCPriceCard from '@/components/dashboard/NECCPriceCard';
import DiseaseAlertBanner from '@/components/alerts/DiseaseAlertBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNationalAverage } from '@/services/neccPriceService';

// Sample news data
const newsHighlights = [{
  id: 1,
  title: 'Government Announces New Subsidy for Poultry Farmers',
  summary: 'The Ministry of Agriculture has announced a new subsidy scheme to boost poultry production across India.',
  date: 'Today'
}, {
  id: 2,
  title: 'Avian Influenza Alert in Northern States',
  summary: 'Authorities have issued preventive guidelines following reports of avian influenza in neighboring countries.',
  date: 'Yesterday'
}, {
  id: 3,
  title: 'Export of Indian Poultry Products Sees 15% Growth',
  summary: 'Indian poultry exports reached a new high with 15% year-on-year growth in the last quarter.',
  source: 'Business Standard',
  date: '2 days ago'
}];

// Sample weather data
const weatherData = {
  location: 'Delhi NCR',
  temperature: 32,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  alert: 'Heat wave expected next week. Prepare your farms accordingly.',
  forecast: [{
    day: 'Today',
    temp: 32,
    condition: 'Partly Cloudy'
  }, {
    day: 'Tomorrow',
    temp: 33,
    condition: 'Sunny'
  }, {
    day: 'Day After',
    temp: 30,
    condition: 'Light Rain'
  }]
};

// Weather alerts data
const weatherAlerts = [{
  id: 1,
  title: 'Heat Wave Warning',
  description: 'Extreme temperatures expected for the next 3 days across Northern India. Take precautions for poultry.',
  severity: 'high'
}, {
  id: 2,
  title: 'Heavy Rain Alert',
  description: 'Heavy rainfall predicted in eastern regions starting tomorrow evening. Potential flooding risks.',
  severity: 'medium'
}];
const Index: React.FC = () => {
  const navigate = useNavigate();
  const national = getNationalAverage();
  
  return <Layout>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5
    }} className="w-full">
        <div className="space-y-6">
          {/* Disease Alert Banner — conditionally shown */}
          <DiseaseAlertBanner userState="Andhra Pradesh" />
          
          {/* Welcome Banner */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#f5565c] to-[#0066b2] p-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold">Welcome to 22POULTRY</h1>
                <p className="text-white/90 text-lg">
                  Your integrated digital platform for the Indian poultry industry
                </p>
                <div className="flex items-center space-x-2 text-sm font-medium text-white/80">
                  <TrendingUp className="h-4 w-4" />
                  <span>NECC prices updated today at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
              </div>
              
              <img src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" alt="22POULTRY" className="h-32 w-auto mt-6 lg:mt-0" />
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-white/10"></div>
            <div className="absolute top-10 right-32 w-6 h-6 rounded-full bg-white/20"></div>
          </motion.div>
          
          {/* NECC Price Card + Key Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* NECC Price Card — Main widget */}
            <div className="lg:col-span-1">
              <NECCPriceCard onViewAnalytics={() => navigate('/necc-analytics')} />
            </div>
            
            {/* Key Stats */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">National Market Overview</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/statistics')}>
                  View Detailed Statistics
                </Button>
              </div>
              <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.2,
              duration: 0.5
            }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatHighlight title="National Egg Price" value={`₹${national.eggPrice.toFixed(2)}`} unit="/piece" change={+(national.eggDelta / national.eggPrice * 100).toFixed(1)} icon={<Egg className="h-5 w-5 text-[#f5565c]" />} />
                <StatHighlight title="National Broiler Price" value={`₹${national.broilerPrice}`} unit="/kg" change={+(national.broilerDelta / national.broilerPrice * 100).toFixed(1)} icon={<BarChart3 className="h-5 w-5 text-[#f5565c]" />} />
                <StatHighlight title="Feed Price Index" value="124.5" unit="" change={5.2} icon={<Database className="h-5 w-5 text-[#f5565c]" />} />
                <StatHighlight title="National Production" value="98.3M" unit="eggs/day" change={2.1} icon={<PieChart className="h-5 w-5 text-[#f5565c]" />} />
              </motion.div>
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="market">
            <TabsList className="mb-4">
              <TabsTrigger value="market">Market Analysis</TabsTrigger>
              <TabsTrigger value="production">Production Data</TabsTrigger>
              <TabsTrigger value="forecasts">Forecasts & Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="market" className="space-y-6">
              {/* Charts Row */}
              <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PriceChart />
                <FeedRatioChart />
              </motion.div>
              
              {/* Module Highlights */}
              <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                      <Database className="h-5 w-5 text-[#ea384c]" />
                    </div>
                    <h2 className="text-lg font-medium">Financial Schemes</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    3 new loan schemes available nationwide for poultry farmers with subsidized interest rates.
                  </p>
                  <Button variant="link" className="flex items-center text-sm text-[#ea384c] font-medium mt-4 px-0" onClick={() => navigate('/financial')}>
                    Explore Options <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Card>
                
                <Card className="p-5">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                      <TrendingUp className="h-5 w-5 text-[#ea384c]" />
                    </div>
                    <h2 className="text-lg font-medium">Industry Network</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Connect with 1,200+ poultry professionals across India. 5 national events this month.
                  </p>
                  <Button variant="link" className="flex items-center text-sm text-[#ea384c] font-medium mt-4 px-0" onClick={() => navigate('/network')}>
                    Join Community <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Card>
                
                <Card className="p-5">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                      <AlertCircle className="h-5 w-5 text-[#ea384c]" />
                    </div>
                    <h2 className="text-lg font-medium">Weather Alert</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Heatwave expected in Northern India next week. Industry-wide advisory issued.
                  </p>
                  <Button variant="link" className="flex items-center text-sm text-[#ea384c] font-medium mt-4 px-0" onClick={() => navigate('/news')}>
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="production">
              <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              duration: 0.5
            }} className="space-y-6">
                <ProductionStats />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="forecasts">
              <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              duration: 0.5
            }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5">
                  <h3 className="font-medium text-lg mb-3">National Market Forecast (Next Quarter)</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Egg Price Trend</p>
                      <p className="font-medium">Projected to increase by 5-7% nationally</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{
                        width: '65%'
                      }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Broiler Price Trend</p>
                      <p className="font-medium">Expected to remain stable (±2%) across India</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                        <div className="bg-blue-500 h-2 rounded-full" style={{
                        width: '50%'
                      }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Feed Cost Projection</p>
                      <p className="font-medium">Likely to increase by 8-10% due to global grain prices</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                        <div className="bg-amber-500 h-2 rounded-full" style={{
                        width: '80%'
                      }}></div>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline" onClick={() => navigate('/statistics')}>
                    View Full Market Analysis
                  </Button>
                </Card>
                
                <Card className="p-5">
                  <h3 className="font-medium text-lg mb-3">Industry Analysts' Reports</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-[#ea384c] pl-3 py-1">
                      <p className="font-medium">CLFMA Annual Report 2023</p>
                      <p className="text-sm text-gray-600">Comprehensive analysis of national feed industry trends</p>
                      <Button variant="link" className="text-xs text-[#ea384c] p-0 h-auto">
                        Download PDF
                      </Button>
                    </div>
                    <div className="border-l-4 border-[#ea384c] pl-3 py-1">
                      <p className="font-medium">Poultry Federation Market Outlook</p>
                      <p className="text-sm text-gray-600">National projections for the next 2 years</p>
                      <Button variant="link" className="text-xs text-[#ea384c] p-0 h-auto">
                        Download PDF
                      </Button>
                    </div>
                    <div className="border-l-4 border-[#ea384c] pl-3 py-1">
                      <p className="font-medium">ICAR Poultry Technical Bulletin</p>
                      <p className="text-sm text-gray-600">Latest research findings and industry advisories</p>
                      <Button variant="link" className="text-xs text-[#ea384c] p-0 h-auto">
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline" onClick={() => navigate('/training')}>
                    Access All Reports
                  </Button>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          {/* News and Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3,
            duration: 0.5
          }} className="lg:col-span-4">
              <Card className="h-full border-none shadow-md">
                <CardHeader className="pb-2 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center">
                        Latest Industry News
                        <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Live</span>
                      </CardTitle>
                      <CardDescription>Stay updated with the latest happenings in the poultry industry</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/news')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {newsHighlights.map(news => <NewsHighlight key={news.id} {...news} />)}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4,
            duration: 0.5
          }} className="lg:col-span-3 space-y-6">
              <WeatherCard weather={weatherData} />
              
              {/* Weather Alerts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                    Weather Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weatherAlerts.map(alert => <div key={alert.id} className={`p-3 rounded-lg border ${alert.severity === 'high' ? 'border-red-200 bg-red-50' : alert.severity === 'medium' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'}`}>
                      <h4 className={`font-medium ${alert.severity === 'high' ? 'text-red-700' : alert.severity === 'medium' ? 'text-amber-700' : 'text-blue-700'}`}>
                        {alert.title}
                      </h4>
                      <p className="text-sm mt-1">{alert.description}</p>
                    </div>)}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/news')}>
                    View All Alerts
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>;
};
export default Index;