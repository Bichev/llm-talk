'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession, useSessionConfig, useAnalytics } from '@/contexts';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PREDEFINED_TOPICS } from '@/constants/topics';
import { SCENARIO_CONFIGS } from '@/constants/scenarios';
import { EvolvedCommunicationRenderer } from '@/components/CommunicationMessageRenderer';
import { ParticipantSelector } from '@/components/ParticipantSelector';
import type { ConversationScenario } from '@/types/session';

/**
 * Modern, professional test interface for LLM communication evolution
 */
function TestPageContent() {
  const { 
    session, 
    status, 
    isProcessing, 
    error, 
    startSession, 
    sendMessage, 
    stopSession,
    canSendMessage,
    nextSpeaker,
    progressPercentage
  } = useSession();

  const { config, updateConfig, isValid, errors } = useSessionConfig();
  const { formatters, hasData } = useAnalytics();

  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setTestOutput(prev => [...prev, logMessage]);
    console.log(`🖥️ UI Log: ${logMessage}`);
  };

  // Effect to log real-time changes  
  React.useEffect(() => {
    if (session?.messages) {
      const messageCount = session.messages.length;
      if (messageCount > 0) {
        addLog(`📬 Messages updated - Total: ${messageCount}`);
        if (session.messages[messageCount - 1]) {
          const lastMessage = session.messages[messageCount - 1];
          addLog(`💭 Latest: "${lastMessage.evolvedMessage?.slice(0, 50)}..." by ${lastMessage.speaker}`);
        }
      }
    }
  }, [session?.messages?.length]);

  // Effect to log status changes
  React.useEffect(() => {
    if (status) {
      addLog(`📊 Status changed to: ${status}`);
    }
  }, [status]);

  // Effect to log processing changes
  React.useEffect(() => {
    if (isProcessing) {
      addLog(`⚙️ Processing started...`);
    } else {
      addLog(`✅ Processing completed`);
    }
  }, [isProcessing]);

  // Effect to sync session state and clear errors
  React.useEffect(() => {
    if (session && session.config) {
      addLog(`🔄 Session state updated: ${session.status}`);
      addLog(`📊 Current iteration: ${session.currentIteration || 0}/${session.config.maxIterations || 0}`);
    }
  }, [session?.status, session?.currentIteration]);

  const handleStartSession = async () => {
    try {
      addLog('🚀 Starting session...');
      addLog(`📋 Topic: ${config.topic || 'Test conversation about AI development'}`);
      addLog(`👥 Participants: ${config.participants.map(p => p.name).join(', ')}`);
      addLog(`🔄 Max iterations: ${config.maxIterations}`);
      
      await startSession({
        topic: config.topic || 'Test conversation about AI development',
        scenario: config.scenario,
        participants: config.participants,
        maxIterations: config.maxIterations,
        customPrompt: config.customPrompt
      });
      
      addLog('✅ Session started successfully!');
      addLog(`🆔 Session ID: ${session?.id || 'Unknown'}`);
      
      if (session?.status === 'running') {
        addLog('🔄 Ready to send messages...');
      }
    } catch (err) {
      addLog(`❌ Error starting session: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSendMessage = async () => {
    try {
      addLog(`💬 Sending message (speaker: ${nextSpeaker})...`);
      addLog(`📊 Current messages: ${session?.messages?.length || 0}`);
      addLog(`🎯 Iteration: ${session?.currentIteration || 0}/${session?.config?.maxIterations || 0}`);
      
      await sendMessage();
      
      addLog('✅ Message sent successfully!');
      addLog(`📈 Messages count: ${session?.messages?.length || 0}`);
    } catch (err) {
      addLog(`❌ Error sending message: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleStopSession = async () => {
    try {
      addLog('Stopping session...');
      await stopSession('manual');
      addLog('Session stopped successfully!');
    } catch (err) {
      addLog(`Error stopping session: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const clearLogs = () => {
    setTestOutput([]);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                🧬 LLM Communication Evolution Lab
              </h1>
              <p className="text-xs text-gray-600">
                Real-time AI communication protocol development
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs font-medium text-gray-700">
                  {status === 'running' ? 'Session Active' : 'Session Inactive'}
                </span>
              </div>
              {session && (
                <div className="text-xs text-gray-600">
                  Iteration {session.currentIteration} / {session.config.maxIterations}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Session Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-2 flex-1 flex flex-col">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">
          {/* Left Column - Configuration & Controls */}
          <div className="xl:col-span-1 space-y-3">
            {/* Session Controls */}
            <Card className="h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">🎮 Session Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleStartSession}
                  disabled={!isValid || status === 'running' || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                >
                  {status === 'running' ? 'Session Active' : 'Start Session'}
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!canSendMessage || isProcessing}
                  variant="secondary"
                  className="w-full text-xs h-8"
                >
                  {isProcessing ? 'Processing...' : `Send Message (${nextSpeaker})`}
                </Button>

                <Button
                  onClick={handleStopSession}
                  disabled={status !== 'running' || isProcessing}
                  variant="danger"
                  className="w-full text-xs h-8"
                >
                  Stop Session
                </Button>
              </CardContent>
            </Card>
            
            
            {/* Configuration Panel */}
            <Card className="h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">⚙️ Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Participant Selector */}
                <ParticipantSelector
                  participants={config.participants}
                  onParticipantsChange={(participants) => updateConfig({ participants })}
                  className="mb-4"
                />

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Topic</label>
                  <Input
                    value={config.topic}
                    onChange={(e) => updateConfig({ topic: e.target.value })}
                    placeholder="Enter conversation topic..."
                    error={errors.topic}
                    className="text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Scenario</label>
                  <Select
                    value={config.scenario}
                    onChange={(e) => updateConfig({ scenario: e.target.value as ConversationScenario })}
                    options={Object.values(SCENARIO_CONFIGS).map(s => ({
                      value: s.id,
                      label: s.name
                    }))}
                    className="text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max Iterations</label>
                  <Input
                    type="number"
                    value={config.maxIterations.toString()}
                    onChange={(e) => updateConfig({ maxIterations: parseInt(e.target.value) || 20 })}
                    error={errors.maxIterations}
                    className="text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Research Topics</label>
                  <div className="space-y-1">
                    {PREDEFINED_TOPICS.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => updateConfig({ topic: topic.title, scenario: topic.scenario })}
                        className="w-full text-left p-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                      >
                        <div className="font-medium text-gray-900 text-xs">{topic.title}</div>
                        <div className="text-gray-600 truncate text-xs leading-tight">{topic.description}</div>
                      </button>
                    ))}
                  </div>
                </div>


                <div className="pt-2">
                  <Badge variant={isValid ? "success" : "error"} className="text-xs">
                    {isValid ? '✅ Ready' : '❌ Invalid Config'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            

            {/* Analytics */}
            {hasData && (
              <Card className="h-fit">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">📊 Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <div className="text-blue-600 font-medium text-xs">Total Tokens</div>
                      <div className="text-sm font-bold text-blue-900">{formatters.totalTokens}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <div className="text-green-600 font-medium text-xs">Efficiency</div>
                      <div className="text-sm font-bold text-green-900">{formatters.efficiency}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <div className="text-purple-600 font-medium text-xs">Avg Tokens</div>
                      <div className="text-sm font-bold text-purple-900">{formatters.averageTokens}</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg">
                      <div className="text-orange-600 font-medium text-xs">Cost</div>
                      <div className="text-sm font-bold text-orange-900">{formatters.totalCost}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            )}

            {/* Test Output Log */}
            <Card className="h-32 flex-shrink-0">
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">📋 System Log</CardTitle>
                  <Button onClick={clearLogs} variant="outline" size="sm" className="text-xs h-6 px-2">
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <div className="bg-gray-900 text-green-400 p-2 rounded-lg font-mono text-xs h-20 overflow-y-auto">
                  {testOutput.length === 0 ? (
                    <p className="text-gray-500">No system activity yet...</p>
                  ) : (
                    testOutput.map((line, index) => (
                      <div key={index} className="mb-0.5">{line}</div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Messages & Logs */}
          <div className="xl:col-span-2 space-y-3 flex flex-col">
            {/* Messages Display */}
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">💬 Communication Evolution</CardTitle>
                  {session && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>Progress: {progressPercentage}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-3">
                {session && session.messages.length > 0 ? (
                  <div className="space-y-2">
                    {session.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedMessage?.id === message.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs px-1 py-0.5">
                              {message.speaker}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Iteration {message.iteration}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{message.tokenCount.total} tokens</span>
                            {message.processingTime && (
                              <span>{message.processingTime}ms</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="prose prose-sm max-w-none">
                          <EvolvedCommunicationRenderer 
                            content={message.evolvedMessage}
                            className="text-gray-900 leading-relaxed"
                          />
                          {message.translation && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-center mb-2">
                                <div className="text-sm font-medium text-blue-800 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  Translation
                                </div>
                              </div>
                              <div className="text-sm text-gray-700 leading-relaxed">
                                {message.translation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🧬</div>
                      <p>No messages yet. Start a session to begin communication evolution!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <SessionProvider>
      <TestPageContent />
    </SessionProvider>
  );
}