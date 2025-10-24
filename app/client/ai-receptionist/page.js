'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, PhoneOff, Mic, MicOff, PhoneCall, Settings } from 'lucide-react';
import Vapi from '@vapi-ai/web';

export default function AIReceptionist() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [vapiClient, setVapiClient] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [assistantId, setAssistantId] = useState('');
  const [recentCalls, setRecentCalls] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const userStr = localStorage.getItem('clientUser');
    
    if (!token || !userStr) {
      router.push('/client/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setLoading(false);
      
      // Fetch recent calls
      fetchRecentCalls(userData.id);
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Vapi public key not found');
      return;
    }

    const vapi = new Vapi(publicKey);
    
    vapi.on('call-start', () => {
      setIsCallActive(true);
      setIsConnecting(false);
      setMessages([]);
    });

    vapi.on('call-end', () => {
      setIsCallActive(false);
      setIsConnecting(false);
      // Refresh calls after call ends
      if (user) {
        setTimeout(() => fetchRecentCalls(user.id), 2000);
      }
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcript) {
        setMessages(prev => [...prev, {
          role: message.role || 'assistant',
          content: message.transcript
        }]);
      }
    });

    vapi.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsCallActive(false);
      setIsConnecting(false);
    });

    setVapiClient(vapi);

    return () => {
      if (vapi) {
        vapi.stop();
      }
    };
  }, [user]);

  const fetchRecentCalls = async (clientId) => {
    try {
      const response = await fetch(`/api/client/calls?clientId=${clientId}`);
      const data = await response.json();
      if (data.success) {
        setRecentCalls(data.calls.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const startCall = async () => {
    if (!vapiClient) return;
    
    // Check if assistant ID is configured
    const configuredAssistantId = assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!configuredAssistantId) {
      alert('Please configure your Assistant ID in settings first!');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      await vapiClient.start(configuredAssistantId, {
        metadata: {
          clientId: user?.id
        }
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsConnecting(false);
    }
  };

  const stopCall = () => {
    if (vapiClient) {
      vapiClient.stop();
    }
  };

  const toggleMute = () => {
    if (vapiClient) {
      vapiClient.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Virtual Receptionist</h1>
          <p className="text-muted-foreground">Test and manage your AI phone receptionist</p>
        </div>

        <Tabs defaultValue="test" className="w-full">
          <TabsList>
            <TabsTrigger value="test">Test Call</TabsTrigger>
            <TabsTrigger value="calls">Recent Calls</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Test Your AI Receptionist</span>
                  <div className="flex items-center gap-2">
                    {isCallActive ? (
                      <Badge className="bg-green-500">Call Active</Badge>
                    ) : isConnecting ? (
                      <Badge className="bg-yellow-500">Connecting...</Badge>
                    ) : (
                      <Badge variant="secondary">Ready</Badge>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  Click "Start Call" to test your AI receptionist. Make sure your microphone is enabled.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Conversation Display */}
                  <div className="h-80 overflow-y-auto border rounded-lg p-4 bg-muted/20">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground mt-10">
                        {isCallActive ? "Listening..." : "Start a call to begin testing"}
                      </p>
                    ) : (
                      messages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`mb-3 p-3 rounded-lg ${
                            msg.role === 'assistant' 
                              ? 'bg-blue-100 dark:bg-blue-900 ml-8' 
                              : 'bg-gray-100 dark:bg-gray-800 mr-8'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {msg.role === 'assistant' ? '🤖 AI Receptionist' : '👤 You'}
                          </p>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Call Controls */}
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={startCall}
                      disabled={isCallActive || isConnecting}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      {isConnecting ? 'Connecting...' : 'Start Call'}
                    </Button>
                    
                    <Button
                      onClick={stopCall}
                      disabled={!isCallActive}
                      size="lg"
                      variant="destructive"
                    >
                      <PhoneOff className="mr-2 h-5 w-5" />
                      End Call
                    </Button>
                    
                    <Button
                      onClick={toggleMute}
                      disabled={!isCallActive}
                      size="lg"
                      variant="outline"
                    >
                      {isMuted ? (
                        <>
                          <MicOff className="mr-2 h-5 w-5" />
                          Unmute
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-5 w-5" />
                          Mute
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>💡 Tip:</strong> This is a browser-based test. For real phone calls, your clients will call a dedicated phone number you configure in Vapi.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>Latest calls received by your AI receptionist</CardDescription>
              </CardHeader>
              <CardContent>
                {recentCalls.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No calls yet. Start by testing your receptionist!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentCalls.map((call) => (
                      <div key={call.callId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{call.phoneNumber || 'Test Call'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(call.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge>{call.status}</Badge>
                        </div>
                        {call.summary && (
                          <p className="text-sm mt-2">{call.summary}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Configure your AI receptionist settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Vapi Assistant ID</Label>
                  <Input
                    value={assistantId}
                    onChange={(e) => setAssistantId(e.target.value)}
                    placeholder="Enter your Vapi Assistant ID"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get this from your Vapi dashboard after creating an assistant
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    <strong>⚙️ Setup Required:</strong> Follow the VAPI_SETUP_GUIDE.md in your project to:
                  </p>
                  <ul className="text-sm text-yellow-900 dark:text-yellow-100 list-disc ml-5 mt-2">
                    <li>Create your AI assistant in Vapi dashboard</li>
                    <li>Configure voice, prompts, and functions</li>
                    <li>Get your Assistant ID</li>
                    <li>Purchase a phone number for real calls</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
