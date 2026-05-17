
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, ChevronDown, ChevronUp, MapPin, Calendar, ExternalLink, CheckCircle2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  getActiveAlerts, 
  getBiosecurityChecklist, 
  getSeverityColor,
  type DiseaseAlert 
} from '@/services/diseaseAlertService';

interface DiseaseAlertBannerProps {
  userState?: string;
  className?: string;
}

const DiseaseAlertBanner: React.FC<DiseaseAlertBannerProps> = ({ userState, className = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const alerts = getActiveAlerts();
  const stateAlerts = userState 
    ? alerts.filter(a => a.location.state.toLowerCase() === userState.toLowerCase())
    : alerts;
  
  const checklist = getBiosecurityChecklist();
  
  // Only show the most critical alert(s)
  const criticalAlerts = stateAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const displayAlerts = criticalAlerts.length > 0 ? criticalAlerts : stateAlerts.slice(0, 1);
  
  if (displayAlerts.length === 0) return null;
  
  const primaryAlert = displayAlerts[0];
  const severityColors = getSeverityColor(primaryAlert.severity);
  
  const toggleStep = (id: string) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };
  
  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-600 via-red-500 to-red-700';
      case 'high': return 'from-orange-500 via-orange-400 to-orange-600';
      case 'medium': return 'from-amber-500 via-amber-400 to-amber-600';
      default: return 'from-yellow-500 via-yellow-400 to-yellow-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Alert Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full bg-gradient-to-r ${getSeverityBg(primaryAlert.severity)} p-4 text-white transition-all hover:brightness-110`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    {primaryAlert.severity} Alert
                  </span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                    {primaryAlert.diseaseType}
                  </span>
                </div>
                <h3 className="font-bold text-lg leading-tight">
                  {primaryAlert.diseaseType === 'HPAI' ? 'Avian Influenza' : primaryAlert.diseaseType} 
                  {' '}outbreak reported in {primaryAlert.location.district}, {primaryAlert.location.state}
                </h3>
                <div className="flex items-center gap-4 mt-1.5 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {primaryAlert.radiusKm}km radius affected
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(primaryAlert.reportedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs">
                    {primaryAlert.affectedBirds.toLocaleString('en-IN')} birds affected
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 p-1.5">
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </button>
        
        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-5 bg-white">
                {/* 5-Step Biosecurity Checklist */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Biosecurity Action Checklist</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {completedSteps.length}/{checklist.length} complete
                    </span>
                  </div>
                  <div className="space-y-2">
                    {checklist.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => toggleStep(item.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          completedSteps.includes(item.id)
                            ? 'bg-green-50 border-green-200'
                            : item.priority === 'immediate'
                            ? 'bg-red-50/50 border-red-200 hover:bg-red-50'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            completedSteps.includes(item.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {completedSteps.includes(item.id) ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${completedSteps.includes(item.id) ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {item.step}
                            </p>
                            <p className={`text-xs mt-0.5 ${completedSteps.includes(item.id) ? 'text-gray-300' : 'text-gray-500'}`}>
                              {item.description}
                            </p>
                            {item.priority === 'immediate' && !completedSteps.includes(item.id) && (
                              <span className="inline-block mt-1 text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                                ⚡ Do this immediately
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {primaryAlert.insuranceLink && (
                    <Button className="flex-1 bg-gradient-to-r from-[#ea384c] to-[#d63447]">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      File Insurance Claim
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call DAHD Helpline (1800-180-1551)
                  </Button>
                </div>

                {/* Multiple alerts indicator */}
                {displayAlerts.length > 1 && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 font-medium">
                      + {displayAlerts.length - 1} more alert(s) in your area
                    </p>
                    {displayAlerts.slice(1).map(alert => (
                      <div key={alert.id} className={`mt-2 p-2 rounded-lg text-xs ${getSeverityColor(alert.severity).bg} ${getSeverityColor(alert.severity).text} border ${getSeverityColor(alert.severity).border}`}>
                        <strong>{alert.diseaseType}</strong> — {alert.location.district}, {alert.location.state} 
                        ({alert.radiusKm}km radius) • {new Date(alert.reportedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default DiseaseAlertBanner;
