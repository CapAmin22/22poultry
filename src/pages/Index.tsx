
import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp, Plus, AlertTriangle, ChevronRight, Egg, BarChart3 } from 'lucide-react';
import NECCPriceCard from '@/components/dashboard/NECCPriceCard';
import DiseaseAlertBanner from '@/components/alerts/DiseaseAlertBanner';
import { useNavigate } from 'react-router-dom';
import { getNationalAverage } from '@/services/neccPriceService';
import { useI18n } from '@/i18n/i18n';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const national = getNationalAverage();
  const { t } = useI18n();

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="space-y-6">
          {/* Disease Alert Banner — shown when outbreaks in user's state */}
          <DiseaseAlertBanner userState="Andhra Pradesh" />

          {/* Welcome + NECC Price Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1f35] via-[#1e2a4a] to-[#0d3b66] p-6 text-white"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png"
                    alt="22POULTRY"
                    className="h-10 w-10"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">{t('common.welcome')}</h1>
                    <p className="text-sm text-white/60">{t('dashboard.subtitle')}</p>
                  </div>
                </div>

                {/* National Price Summary */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Egg className="h-4 w-4 text-amber-300" />
                      <span className="text-xs text-white/60 uppercase tracking-wider">{t('dashboard.eggPrice')}</span>
                    </div>
                    <p className="text-2xl font-bold tabular-nums">₹{national.eggPrice.toFixed(2)}<span className="text-xs text-white/50 ml-1">/piece</span></p>
                    <p className={`text-xs mt-1 ${national.eggDelta > 0 ? 'text-emerald-400' : 'text-red-300'}`}>
                      {national.eggDelta > 0 ? '↑' : '↓'} ₹{Math.abs(national.eggDelta).toFixed(2)} {t('dashboard.vsYesterday')}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-blue-300" />
                      <span className="text-xs text-white/60 uppercase tracking-wider">{t('dashboard.broilerPrice')}</span>
                    </div>
                    <p className="text-2xl font-bold tabular-nums">₹{national.broilerPrice}<span className="text-xs text-white/50 ml-1">/kg</span></p>
                    <p className={`text-xs mt-1 ${national.broilerDelta > 0 ? 'text-emerald-400' : 'text-red-300'}`}>
                      {national.broilerDelta > 0 ? '↑' : '↓'} ₹{Math.abs(national.broilerDelta)} {t('dashboard.vsYesterday')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Background decorative */}
              <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-[#ea384c]/10" />
              <div className="absolute top-4 right-8 w-4 h-4 rounded-full bg-white/10" />
            </motion.div>

            {/* NECC Price Card with zone selector */}
            <div className="lg:col-span-2">
              <NECCPriceCard onViewAnalytics={() => navigate('/necc-analytics')} />
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Sell Now */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 group"
                onClick={() => navigate('/marketplace')}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500 text-white group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">{t('marketplace.sellProduct')}</h3>
                    <p className="text-xs text-emerald-700/70">Create a new listing with NECC price anchor</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-emerald-400 ml-auto" />
                </CardContent>
              </Card>

              {/* Check Prices */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 group"
                onClick={() => navigate('/necc-analytics')}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500 text-white group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">{t('nav.neccAnalytics')}</h3>
                    <p className="text-xs text-blue-700/70">Zone trends, comparisons & alerts</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-blue-400 ml-auto" />
                </CardContent>
              </Card>

              {/* Browse Marketplace */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 group"
                onClick={() => navigate('/marketplace')}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500 text-white group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">{t('nav.marketplace')}</h3>
                    <p className="text-xs text-purple-700/70">Buy & sell with fair price transparency</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-400 ml-auto" />
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Market Intelligence Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-4"
          >
            <p className="text-xs text-gray-400">
              NECC prices {t('dashboard.updated')} {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • Data from National Egg Coordination Committee
            </p>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;