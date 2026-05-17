
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, Bell, BellOff, ChevronRight, Egg, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllZonePrices, getNationalAverage, getAvailableZones, type NECCZonePrice } from '@/services/neccPriceService';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const NECCPriceCard: React.FC<{ onViewAnalytics?: () => void }> = ({ onViewAnalytics }) => {
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const zones = getAvailableZones();
  const allPrices = getAllZonePrices();
  const national = getNationalAverage();
  
  const selectedPrice: NECCZonePrice | null = selectedZone 
    ? allPrices.find(p => p.zoneCode === selectedZone) || null
    : null;
  
  const displayEgg = selectedPrice ? selectedPrice.eggPrice : national.eggPrice;
  const displayBroiler = selectedPrice ? selectedPrice.broilerPrice : national.broilerPrice;
  const displayEggDelta = selectedPrice ? selectedPrice.eggDelta : national.eggDelta;
  const displayBroilerDelta = selectedPrice ? selectedPrice.broilerDelta : national.broilerDelta;

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="h-3.5 w-3.5" />;
    if (delta < 0) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return 'text-emerald-400';
    if (delta < 0) return 'text-red-300';
    return 'text-white/60';
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f35] via-[#1e2a4a] to-[#0d3b66]" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#ea384c]/20 to-transparent rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#0FA0CE]/15 to-transparent rounded-full translate-y-8 -translate-x-8" />
      
      <CardContent className="relative z-10 p-5">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
              <Egg className="h-4 w-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">NECC Price Today</h3>
              <p className="text-[10px] text-white/50">
                {selectedPrice ? `${selectedPrice.zone}, ${selectedPrice.state}` : 'National Average'} • Updated {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                >
                  {alertsEnabled ? <Bell className="h-3.5 w-3.5 text-amber-300" /> : <BellOff className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {alertsEnabled ? 'Price alerts enabled' : 'Enable price alerts'}
              </TooltipContent>
            </Tooltip>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="h-7 w-[120px] text-xs bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All India" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All India Average</SelectItem>
                {zones.map(z => (
                  <SelectItem key={z.zoneCode} value={z.zoneCode}>
                    {z.zone} ({z.state})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Price Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Egg Price */}
          <motion.div
            key={`egg-${displayEgg}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium">Egg Price</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tabular-nums">₹{displayEgg.toFixed(2)}</span>
              <span className="text-xs text-white/50">/piece</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${getDeltaColor(displayEggDelta)}`}>
              {getDeltaIcon(displayEggDelta)}
              <span>₹{Math.abs(displayEggDelta).toFixed(2)} vs yesterday</span>
            </div>
          </motion.div>
          
          {/* Broiler Price */}
          <motion.div
            key={`broiler-${displayBroiler}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium">Broiler Price</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tabular-nums">₹{displayBroiler}</span>
              <span className="text-xs text-white/50">/kg</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${getDeltaColor(displayBroilerDelta)}`}>
              {getDeltaIcon(displayBroilerDelta)}
              <span>₹{Math.abs(displayBroilerDelta)} vs yesterday</span>
            </div>
          </motion.div>
        </div>

        {/* Mini zone comparison bar */}
        <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {allPrices.slice(0, 6).map((z) => (
            <button
              key={z.zoneCode}
              onClick={() => setSelectedZone(z.zoneCode)}
              className={`flex-shrink-0 px-2 py-1 rounded text-[9px] font-medium transition-all ${
                selectedZone === z.zoneCode
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
              }`}
            >
              {z.zoneCode} ₹{z.eggPrice.toFixed(2)}
            </button>
          ))}
        </div>
        
        {/* View Analytics Button */}
        {onViewAnalytics && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
            onClick={onViewAnalytics}
          >
            View Full NECC Analytics
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NECCPriceCard;
