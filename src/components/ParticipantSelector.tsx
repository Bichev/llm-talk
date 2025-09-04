import React, { useState, useEffect } from 'react';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { PROVIDER_CONFIGS, getModelsByProvider } from '@/constants/providers';
import type { LLMParticipant, LLMProvider } from '@/types/llm';

interface ParticipantSelectorProps {
  participants: LLMParticipant[];
  onParticipantsChange: (participants: LLMParticipant[]) => void;
  className?: string;
}

interface AvailableProvider {
  provider: LLMProvider;
  available: boolean;
  reason?: string;
}

export function ParticipantSelector({ participants, onParticipantsChange, className = '' }: ParticipantSelectorProps) {
  const [availableProviders, setAvailableProviders] = useState<AvailableProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check which providers are available (have API keys)
  useEffect(() => {
    const checkProviderAvailability = async () => {
      const providers: AvailableProvider[] = [
        { provider: 'openai', available: false },
        { provider: 'claude', available: false },
        { provider: 'gemini', available: false },
        { provider: 'perplexity', available: false }
      ];

      // Check all providers in parallel
      const checkPromises = [
        // Check OpenAI availability
        fetch('/api/providers/openai/test', { method: 'POST' })
          .then(response => {
            providers[0].available = response.ok;
            if (!response.ok) {
              return response.json().then(error => {
                providers[0].reason = error.error || 'API key not configured';
                return null;
              });
            }
            return null;
          })
          .catch(() => {
            providers[0].reason = 'API key not configured';
            return null;
          }),

        // Check Claude availability
        fetch('/api/providers/claude/test', { method: 'POST' })
          .then(response => {
            providers[1].available = response.ok;
            if (!response.ok) {
              return response.json().then(error => {
                providers[1].reason = error.error || 'API key not configured';
                return null;
              });
            }
            return null;
          })
          .catch(() => {
            providers[1].reason = 'API key not configured';
            return null;
          }),

        // Check Gemini availability
        fetch('/api/providers/gemini/test', { method: 'POST' })
          .then(response => {
            providers[2].available = response.ok;
            if (!response.ok) {
              return response.json().then(error => {
                providers[2].reason = error.error || 'API key not configured';
                return null;
              });
            }
            return null;
          })
          .catch(() => {
            providers[2].reason = 'API key not configured';
            return null;
          }),

        // Check Perplexity availability
        fetch('/api/providers/perplexity/test', { method: 'POST' })
          .then(response => {
            providers[3].available = response.ok;
            if (!response.ok) {
              return response.json().then(error => {
                providers[3].reason = error.error || 'API key not configured';
                return null;
              });
            }
            return null;
          })
          .catch(() => {
            providers[3].reason = 'API key not configured';
            return null;
          })
      ];

      try {
        await Promise.all(checkPromises);
      } catch (error) {
        console.error('Error checking provider availability:', error);
      }

      setAvailableProviders(providers);
      setIsLoading(false);
    };

    checkProviderAvailability();
  }, []);

  // Get available models for a provider
  const getAvailableModels = (provider: LLMProvider) => {
    const providerInfo = availableProviders.find(p => p.provider === provider);
    if (!providerInfo?.available) return [];
    
    return getModelsByProvider(provider);
  };

  // Update participant
  const updateParticipant = (index: number, field: keyof LLMParticipant, value: any) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    onParticipantsChange(newParticipants);
  };

  // Add new participant
  const addParticipant = () => {
    if (participants.length >= 4) return; // Max 4 participants
    
    const availableProvider = availableProviders.find(p => p.available);
    if (!availableProvider) return;

    const models = getAvailableModels(availableProvider.provider);
    if (models.length === 0) return;

    const newParticipant: LLMParticipant = {
      name: `${availableProvider.provider}-${participants.length + 1}`,
      provider: availableProvider.provider,
      model: models[0].model,
      temperature: 0.7
    };

    onParticipantsChange([...participants, newParticipant]);
  };

  // Remove participant
  const removeParticipant = (index: number) => {
    if (participants.length <= 2) return; // Min 2 participants
    const newParticipants = participants.filter((_, i) => i !== index);
    onParticipantsChange(newParticipants);
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-xs font-medium text-gray-700">Participants</div>
        <div className="text-xs text-gray-500">Loading available providers...</div>
      </div>
    );
  }

  const availableCount = availableProviders.filter(p => p.available).length;
  const canAddMore = participants.length < 4 && availableCount > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-gray-700">Participants</div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{participants.length}/4</span>
          {canAddMore && (
            <button
              onClick={addParticipant}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {participants.map((participant, index) => {
        const providerInfo = availableProviders.find(p => p.provider === participant.provider);
        const isAvailable = providerInfo?.available ?? false;
        const availableModels = getAvailableModels(participant.provider);

        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Select
                  value={participant.provider}
                  onChange={(e) => updateParticipant(index, 'provider', e.target.value as LLMProvider)}
                  options={availableProviders.map(p => ({
                    value: p.provider,
                    label: `${PROVIDER_CONFIGS[p.provider]?.icon || '🤖'} ${PROVIDER_CONFIGS[p.provider]?.displayName || p.provider}`,
                    disabled: !p.available
                  }))}
                  className="text-xs h-8"
                />
              </div>
              {participants.length > 2 && (
                <button
                  onClick={() => removeParticipant(index)}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Select
                  value={participant.model}
                  onChange={(e) => updateParticipant(index, 'model', e.target.value)}
                  options={availableModels.map(model => ({
                    value: model.model,
                    label: model.displayName
                  }))}
                  className="text-xs h-8"
                  disabled={!isAvailable}
                />
              </div>
              <div className="w-16">
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={participant.temperature}
                  onChange={(e) => updateParticipant(index, 'temperature', parseFloat(e.target.value))}
                  className="w-full text-xs h-8 px-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={!isAvailable}
                />
              </div>
            </div>

            {!isAvailable && providerInfo?.reason && (
              <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {providerInfo.reason}
              </div>
            )}

            {isAvailable && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs px-1 py-0.5"
                  style={{ 
                    backgroundColor: PROVIDER_CONFIGS[participant.provider]?.color + '20',
                    color: PROVIDER_CONFIGS[participant.provider]?.color
                  }}
                >
                  {PROVIDER_CONFIGS[participant.provider]?.icon} {participant.name}
                </Badge>
                <span className="text-xs text-gray-500">
                  T: {participant.temperature}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {availableCount === 0 && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          No providers available. Please configure API keys in your environment variables.
        </div>
      )}
    </div>
  );
}
