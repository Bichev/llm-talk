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
import type { ConversationScenario } from '@/types/session';

/**
 * Test page to verify session management functionality
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
  const { analyticsData, formatters, hasData } = useAnalytics();

  const [testOutput, setTestOutput] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestOutput(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleStartSession = async () => {
    try {
      addLog('Starting session...');
      await startSession({
        topic: config.topic || 'Test conversation about AI development',
        scenario: config.scenario,
        participants: config.participants,
        maxIterations: config.maxIterations,
        customPrompt: config.customPrompt
      });
      addLog('Session started successfully!');
    } catch (err) {
      addLog(`Error starting session: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSendMessage = async () => {
    try {
      addLog(`Sending message (speaker: ${nextSpeaker})...`);
      await sendMessage();
      addLog('Message sent successfully!');
    } catch (err) {
      addLog(`Error sending message: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          LLM-Talk Test Interface
        </h1>
        <p className="text-muted-foreground">
          Test the session management system before building the main UI components.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <h3 className="font-semibold text-destructive mb-2">Error</h3>
          <p className="text-destructive/90">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Session Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Topic"
              value={config.topic}
              onChange={(e) => updateConfig({ topic: e.target.value })}
              placeholder="Enter conversation topic..."
              error={errors.topic}
            />

            <Select
              label="Scenario"
              value={config.scenario}
              onChange={(e) => updateConfig({ scenario: e.target.value as ConversationScenario })}
              options={Object.values(SCENARIO_CONFIGS).map(s => ({
                value: s.id,
                label: s.name
              }))}
            />

            <Input
              label="Max Iterations"
              type="number"
              value={config.maxIterations.toString()}
              onChange={(e) => updateConfig({ maxIterations: parseInt(e.target.value) || 20 })}
              error={errors.maxIterations}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Topic Selection</label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_TOPICS.slice(0, 3).map(topic => (
                  <Button
                    key={topic.id}
                    variant="outline"
                    size="sm"
                    onClick={() => updateConfig({ topic: topic.title, scenario: topic.scenario })}
                  >
                    {topic.title.substring(0, 30)}...
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Participants: {config.participants.length} configured
              </p>
              <div className="flex flex-wrap gap-2">
                {config.participants.map((participant, index) => (
                  <Badge key={index} variant="secondary">
                    {participant.name} ({participant.provider})
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Badge variant={isValid ? "success" : "error"}>
                Configuration {isValid ? 'Valid' : 'Invalid'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Session Status */}
        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={status === 'running' ? 'success' : 'secondary'}>
                  {status}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <Badge variant={isProcessing ? 'warning' : 'secondary'}>
                  {isProcessing ? 'Yes' : 'No'}
                </Badge>
              </div>

              {session && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="font-semibold">{progressPercentage}%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Messages</p>
                    <p className="font-semibold">{session.messages.length}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Next Speaker</p>
                    <p className="font-semibold">{nextSpeaker || 'None'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Iteration</p>
                    <p className="font-semibold">
                      {session.currentIteration} / {session.config.maxIterations}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleStartSession}
                disabled={!isValid || status === 'running' || isProcessing}
                className="w-full"
              >
                Start Session
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!canSendMessage || isProcessing}
                variant="secondary"
                className="w-full"
              >
                Send Next Message
              </Button>

              <Button
                onClick={handleStopSession}
                disabled={status !== 'running' || isProcessing}
                variant="danger"
                className="w-full"
              >
                Stop Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Display */}
        {hasData && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tokens</p>
                  <p className="font-semibold">{formatters.totalTokens}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Average Tokens</p>
                  <p className="font-semibold">{formatters.averageTokens}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  <p className="font-semibold">{formatters.totalCost}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="font-semibold">{formatters.efficiency}</p>
                </div>
              </div>

              {analyticsData?.communicationEvolution.symbolsIntroduced && 
               analyticsData.communicationEvolution.symbolsIntroduced.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Symbols Introduced</p>
                  <div className="flex flex-wrap gap-1">
                    {analyticsData.communicationEvolution.symbolsIntroduced.map((symbol, index) => (
                      <Badge key={index} variant="outline" size="sm">
                        {symbol.symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Messages Display */}
        {session && session.messages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {session.messages.slice(-5).map((message) => (
                  <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" size="sm">
                        {message.speaker}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Iteration {message.iteration}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{message.evolvedMessage}</p>
                    {message.translation && (
                      <p className="text-xs text-muted-foreground italic">
                        Translation: {message.translation}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>Tokens: {message.tokenCount.total}</span>
                      {message.processingTime && (
                        <span>Time: {message.processingTime}ms</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Output Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Test Output
              <Button onClick={clearLogs} variant="outline" size="sm">
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {testOutput.length === 0 ? (
                <p className="text-muted-foreground">No output yet...</p>
              ) : (
                testOutput.map((line, index) => (
                  <div key={index}>{line}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
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
