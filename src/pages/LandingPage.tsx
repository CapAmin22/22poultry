
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, ShoppingCart, ArrowRight, Egg, AlertTriangle, BarChart3, CheckCircle2, Star } from 'lucide-react';
import { getNationalAverage } from '@/services/neccPriceService';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const national = getNationalAverage();

  const features = [
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: "NECC Price Transparency",
      description: "Get real-time NECC zonal prices for eggs and broilers. Know the fair rate before you sell — never get underpaid again.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <ShoppingCart className="h-7 w-7" />,
      title: "Direct Marketplace",
      description: "Sell directly to buyers with NECC-anchored pricing. Fair price indicators show if your rate is competitive.",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: <AlertTriangle className="h-7 w-7" />,
      title: "Disease Alerts",
      description: "Instant HPAI and Newcastle outbreak alerts within your area. 5-step biosecurity checklist to protect your flock.",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Broiler Farmer, Anantapur",
      text: "Before 22POULTRY, I was selling broilers at ₹95/kg to the middleman. Now I check the NECC rate daily and sell at ₹115/kg directly. That's ₹40,000 extra per cycle.",
      stars: 5,
    },
    {
      name: "Lakshmi Devi",
      role: "Layer Farmer, Krishna",
      text: "The disease alert saved my entire flock. When HPAI was reported 30km from my farm, I got the notification and followed the biosecurity steps immediately.",
      stars: 5,
    },
    {
      name: "Mohammed Irfan",
      role: "Buyer, Hyderabad",
      text: "As a restaurant owner, I needed consistent quality poultry. 22POULTRY connects me directly with verified farmers — no middleman, fair prices for both sides.",
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" alt="22POULTRY" className="h-8 w-8" />
            <span className="text-xl font-bold">
              <span className="text-[#ea384c]">22</span><span className="text-[#0d3b66]">POULTRY</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="text-gray-600">
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate('/auth')} className="bg-[#ea384c] hover:bg-[#d63447] text-white">
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <Egg className="h-4 w-4" />
              Built for Indian Poultry Farmers
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Get NECC prices.{' '}
              <span className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
                Sell direct.
              </span>
              <br />No middleman.
            </h1>

            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
              Stop losing 45-55% of your revenue to middlemen. Check today's NECC rate, list your produce at fair prices, and sell directly to buyers.
            </p>

            {/* Live NECC Price Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1a1f35] to-[#0d3b66] text-white mb-8"
            >
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-white/50">Today's Egg Rate</p>
                <p className="text-xl font-bold">₹{national.eggPrice.toFixed(2)}<span className="text-xs text-white/50">/pc</span></p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-white/50">Today's Broiler Rate</p>
                <p className="text-xl font-bold">₹{national.broilerPrice}<span className="text-xs text-white/50">/kg</span></p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <p className="text-[10px] text-emerald-400">NECC National Average</p>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-[#ea384c] hover:bg-[#d63447] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-red-200"
              >
                Start Selling — Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-xs text-gray-400">No fees. No subscriptions. Just fair prices.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why farmers choose 22POULTRY</h2>
            <p className="text-gray-500">Built to solve the 4 biggest problems small-scale farmers face</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 bg-gradient-to-r from-[#1a1f35] to-[#0d3b66] text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '15+', label: 'NECC Zones Tracked' },
            { value: '₹2.6T', label: 'Indian Poultry Market' },
            { value: '6M+', label: 'Poultry Farmers in India' },
            { value: '45-55%', label: 'Revenue Lost to Middlemen' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-white/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Trusted by farmers across India</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.text}"</p>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#ea384c] to-[#d63447] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stop losing money to middlemen</h2>
          <p className="text-white/80 mb-8">Join thousands of farmers who check NECC prices and sell at fair rates every day.</p>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/auth')}
            className="bg-white text-[#ea384c] hover:bg-gray-100 border-0 px-8 py-6 text-lg rounded-xl"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" alt="22POULTRY" className="h-6 w-6" />
          <span className="text-white font-semibold">22POULTRY</span>
        </div>
        <p>© 2026 22POULTRY. Empowering poultry stakeholders across India.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
