'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Calendar, Users, BarChart3, Phone, Mail, Zap, Shield, LogIn } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Bot,
      title: 'AI Virtual Receptionist',
      description: 'Never miss a call. Our AI receptionist handles calls 24/7, books appointments, and qualifies leads automatically.',
      image: 'https://images.pexels.com/photos/8728559/pexels-photo-8728559.jpeg'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Streamline your scheduling with intelligent booking pages, automated reminders, and calendar synchronization.',
      image: 'https://images.pexels.com/photos/16053029/pexels-photo-16053029.jpeg'
    },
    {
      icon: Users,
      title: 'Lead Management',
      description: 'Track, qualify, and convert leads with our integrated CRM. All your prospects in one centralized platform.',
      image: null
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Make data-driven decisions with comprehensive analytics on calls, appointments, and conversion rates.',
      image: null
    }
  ];

  const integrations = [
    { name: 'Salesforce', icon: Zap },
    { name: 'HubSpot', icon: Zap },
    { name: 'Calendly', icon: Calendar },
    { name: 'Google Calendar', icon: Calendar },
    { name: 'Twilio', icon: Phone },
    { name: 'SendGrid', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with Admin Login */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ARI Solutions</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/admin/login')}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Your Complete
                <span className="text-blue-400"> AI-Powered</span>
                <br />Business Hub
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Manage your AI Virtual Receptionist and Appointment Booking services in one centralized CRM platform. Connect your AI automation and keep track of everything in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/client/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8"
                >
                  Client Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBidXNpbmVzcyUyMGF1dG9tYXRpb258ZW58MHx8fGJsdWV8MTc2MTMyMTE5NXww&ixlib=rb-4.1.0&q=85"
                  alt="AI Technology"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-white/70">One platform to manage all your AI-powered business tools</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-slate-800/50 border-white/10 hover:border-blue-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-blue-600/20">
                        <Icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/70 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  {feature.image && (
                    <CardContent>
                      <div className="rounded-lg overflow-hidden border border-white/10">
                        <img 
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CRM Integration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Seamless Integrations</h2>
            <p className="text-xl text-white/70">Connect with your favorite tools and platforms</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <Card key={index} className="bg-slate-800/50 border-white/10 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
                    <Icon className="h-8 w-8 text-blue-400" />
                    <p className="text-sm text-white/80 text-center">{integration.name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-white/10">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-blue-600/20 mb-4">
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Lightning Fast</h3>
                <p className="text-white/70">Set up your AI automation in minutes, not days</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-white/10">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-green-600/20 mb-4">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Secure & Reliable</h3>
                <p className="text-white/70">Enterprise-grade security for your business data</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-white/10">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-purple-600/20 mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Data-Driven</h3>
                <p className="text-white/70">Make informed decisions with real-time analytics</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-white/90 mb-8">Access your client portal and manage all your AI services in one place</p>
              <Button 
                size="lg" 
                onClick={() => router.push('/client/login')}
                className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8"
              >
                Go to Client Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60">© 2025 ARI Solutions Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
