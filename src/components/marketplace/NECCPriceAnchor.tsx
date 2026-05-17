
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { getFairPriceIndicator, getZonePrice, getNationalAverage } from '@/services/neccPriceService';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NECCPriceAnchorProps {
  askingPrice?: number;
  commodity: 'egg' | 'broiler';
  zoneCode?: string;
  className?: string;
}

const NECCPriceAnchor: React.FC<NECCPriceAnchorProps> = ({ 
  askingPrice, 
  commodity, 
  zoneCode, 
  className = '' 
}) => {
  const zoneData = zoneCode ? getZonePrice(zoneCode) : null;
  const national = getNationalAverage();
  
  const neccRate = commodity === 'egg' 
    ? (zoneData?.eggPrice || national.eggPrice)
    : (zoneData?.broilerPrice || national.broilerPrice);
  
  const neccDelta = commodity === 'egg'
    ? (zoneData?.eggDelta || national.eggDelta)
    : (zoneData?.broilerDelta || national.broilerDelta);
  
  const unit = commodity === 'egg' ? '/piece' : '/kg';
  const zoneName = zoneData?.zone || 'National Avg';
  
  const indicator = askingPrice ? getFairPriceIndicator(askingPrice, neccRate) : null;
  
  const colorMap = {
    green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-3 ${
        indicator ? `${colorMap[indicator.color].bg} ${colorMap[indicator.color].border}` : 'bg-blue-50 border-blue-200'
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            NECC Rate — {zoneName}
          </span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                NECC (National Egg Coordination Committee) publishes daily wholesale rates. 
                This is the benchmark rate for {commodity === 'egg' ? 'eggs' : 'broiler birds'} in your zone.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className={`flex items-center gap-1 text-xs ${neccDelta > 0 ? 'text-emerald-600' : neccDelta < 0 ? 'text-red-500' : 'text-gray-400'}`}>
          {neccDelta > 0 ? <TrendingUp className="h-3 w-3" /> : neccDelta < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          <span>₹{Math.abs(neccDelta).toFixed(2)} vs yesterday</span>
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900">
          ₹{neccRate.toFixed(commodity === 'egg' ? 2 : 0)}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      
      {/* Fair Price Indicator */}
      {indicator && (
        <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${colorMap[indicator.color].text}`}>
          <span className={`w-2 h-2 rounded-full ${colorMap[indicator.color].dot} animate-pulse`} />
          <span>{indicator.label}</span>
          <span className="text-gray-400">
            ({indicator.percentDiff > 0 ? '+' : ''}{indicator.percentDiff}%)
          </span>
        </div>
      )}
      
      {!askingPrice && (
        <p className="mt-1.5 text-[10px] text-gray-400">
          Enter your price above to see how it compares to NECC
        </p>
      )}
    </motion.div>
  );
};

export default NECCPriceAnchor;
