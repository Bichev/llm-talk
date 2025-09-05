'use client';

import { useState, useCallback, useMemo } from 'react';
import { PREDEFINED_TOPICS, getTopicsByScenario, getRandomTopic, estimateSessionCost } from '@/constants/topics';
import { SCENARIO_CONFIGS } from '@/constants/scenarios';
import { PROVIDER_CONFIGS, DEFAULT_PARTICIPANTS, RECOMMENDED_COMBINATIONS } from '@/constants/providers';
import type { SessionConfig, ConversationScenario } from '@/types/session';
import type { LLMParticipant } from '@/types/llm';

/**
 * Hook for managing session configuration with validation and presets
 */
export function useSessionConfig() {
  // Configuration state
  const [config, setConfig] = useState<SessionConfig>({
    topic: '',
    scenario: 'protocol-evolution',
    participants: DEFAULT_PARTICIPANTS, // Start with defaults, can be changed by ParticipantSelector
    maxIterations: 20,
    customPrompt: '',
    autoMode: false,
    autoModeDelay: 2000 // 2 seconds default delay
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  // Update configuration
  const updateConfig = useCallback((updates: Partial<SessionConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Update specific fields
  const setTopic = useCallback((topic: string) => {
    updateConfig({ topic });
  }, [updateConfig]);

  const setScenario = useCallback((scenario: ConversationScenario) => {
    updateConfig({ scenario });
  }, [updateConfig]);

  const setParticipants = useCallback((participants: LLMParticipant[]) => {
    updateConfig({ participants });
  }, [updateConfig]);

  const setMaxIterations = useCallback((maxIterations: number) => {
    updateConfig({ maxIterations });
  }, [updateConfig]);

  const setCustomPrompt = useCallback((customPrompt: string) => {
    updateConfig({ customPrompt });
  }, [updateConfig]);

  // Add participant
  const addParticipant = useCallback((participant: LLMParticipant) => {
    setConfig(prev => ({
      ...prev,
      participants: [...prev.participants, participant]
    }));
  }, []);

  // Remove participant
  const removeParticipant = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  }, []);

  // Update participant
  const updateParticipant = useCallback((index: number, updates: Partial<LLMParticipant>) => {
    setConfig(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => 
        i === index ? { ...p, ...updates } : p
      )
    }));
  }, []);

  // Validation
  const validateConfig = useCallback((configToValidate: SessionConfig = config): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Topic validation
    if (!configToValidate.topic || configToValidate.topic.trim().length === 0) {
      newErrors.topic = 'Topic is required';
    } else if (configToValidate.topic.length < 10) {
      newErrors.topic = 'Topic must be at least 10 characters';
    } else if (configToValidate.topic.length > 500) {
      newErrors.topic = 'Topic must be less than 500 characters';
    }

    // Participants validation
    if (configToValidate.participants.length < 2) {
      newErrors.participants = 'At least 2 participants are required';
    } else if (configToValidate.participants.length > 5) {
      newErrors.participants = 'Maximum 5 participants allowed';
    }

    // Check for duplicate participant names
    const participantNames = configToValidate.participants.map(p => p.name.toLowerCase().trim());
    const duplicateNames = participantNames.filter((name, index) => participantNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      newErrors.participants = `Duplicate participant names: ${duplicateNames.join(', ')}. Each participant must have a unique name, even if using the same model.`;
    }

    // Validate each participant
    configToValidate.participants.forEach((participant, index) => {
      if (!participant.name || participant.name.trim().length === 0) {
        newErrors[`participant_${index}_name`] = 'Participant name is required';
      }

      if (!participant.provider) {
        newErrors[`participant_${index}_provider`] = 'Provider is required';
      }

      if (!participant.model) {
        newErrors[`participant_${index}_model`] = 'Model is required';
      }

      if (participant.temperature < 0 || participant.temperature > 2) {
        newErrors[`participant_${index}_temperature`] = 'Temperature must be between 0 and 2';
      }
    });

    // Max iterations validation
    if (configToValidate.maxIterations < 5) {
      newErrors.maxIterations = 'Minimum 5 iterations required';
    } else if (configToValidate.maxIterations > 200) {
      newErrors.maxIterations = 'Maximum 200 iterations allowed';
    }

    // Custom prompt validation (optional)
    if (configToValidate.customPrompt && configToValidate.customPrompt.length > 2000) {
      newErrors.customPrompt = 'Custom prompt must be less than 2000 characters';
    }

    return newErrors;
  }, [config]);

  // Update validation state
  const updateValidation = useCallback(() => {
    const newErrors = validateConfig();
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [validateConfig]);

  // Auto-validate when config changes
  useMemo(() => {
    updateValidation();
  }, [config, updateValidation]);

  // Preset configurations
  const applyPreset = useCallback((preset: 'cost-effective' | 'high-performance' | 'balanced' | 'research-focused') => {
    const presetParticipants = RECOMMENDED_COMBINATIONS[preset].map((combo, index) => ({
      id: undefined,
      name: `${PROVIDER_CONFIGS[combo.provider].displayName} ${index + 1}`,
      provider: combo.provider,
      model: combo.model,
      temperature: 0.7,
      config: {}
    }));

    updateConfig({ participants: presetParticipants });
  }, [updateConfig]);

  // Load random topic
  const loadRandomTopic = useCallback((scenario?: ConversationScenario) => {
    const randomTopic = getRandomTopic(scenario || config.scenario);
    updateConfig({ 
      topic: randomTopic.title,
      scenario: randomTopic.scenario 
    });
  }, [config.scenario, updateConfig]);

  // Reset configuration
  const resetConfig = useCallback(() => {
    setConfig({
      topic: '',
      scenario: 'protocol-evolution',
      participants: DEFAULT_PARTICIPANTS, // Reset to defaults
      maxIterations: 20,
      customPrompt: '',
      autoMode: false,
      autoModeDelay: 2000
    });
    setErrors({});
  }, []);

  // Save configuration to localStorage
  const saveConfig = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(localStorage.getItem('llm-talk-configs') || '{}');
      savedConfigs[name] = config;
      localStorage.setItem('llm-talk-configs', JSON.stringify(savedConfigs));
    }
  }, [config]);

  // Load configuration from localStorage
  const loadConfig = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(localStorage.getItem('llm-talk-configs') || '{}');
      if (savedConfigs[name]) {
        setConfig(savedConfigs[name]);
      }
    }
  }, []);

  // Get saved configurations
  const getSavedConfigs = useCallback((): string[] => {
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(localStorage.getItem('llm-talk-configs') || '{}');
      return Object.keys(savedConfigs);
    }
    return [];
  }, []);

  // Delete saved configuration
  const deleteSavedConfig = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(localStorage.getItem('llm-talk-configs') || '{}');
      delete savedConfigs[name];
      localStorage.setItem('llm-talk-configs', JSON.stringify(savedConfigs));
    }
  }, []);

  // Computed values
  const availableTopics = useMemo(() => {
    return getTopicsByScenario(config.scenario);
  }, [config.scenario]);

  const scenarioConfig = useMemo(() => {
    return SCENARIO_CONFIGS[config.scenario];
  }, [config.scenario]);

  const estimatedCost = useMemo(() => {
    const topicData = PREDEFINED_TOPICS.find(t => t.title === config.topic);
    if (topicData) {
      return estimateSessionCost(topicData, config.participants.length);
    }
    return estimateSessionCost({ estimatedTokens: 10000 } as any, config.participants.length);
  }, [config.topic, config.participants.length]);

  const estimatedDuration = useMemo(() => {
    // Rough estimation: 30 seconds per message on average
    const totalMessages = config.maxIterations * config.participants.length;
    return Math.round(totalMessages * 30 / 60); // in minutes
  }, [config.maxIterations, config.participants.length]);

  const configSummary = useMemo(() => {
    return {
      topic: config.topic || 'No topic selected',
      scenario: scenarioConfig.name,
      participantCount: config.participants.length,
      participantNames: config.participants.map(p => p.name).join(', '),
      maxIterations: config.maxIterations,
      estimatedCost,
      estimatedDuration,
      hasCustomPrompt: !!config.customPrompt
    };
  }, [config, scenarioConfig, estimatedCost, estimatedDuration]);

  // Validation helpers
  const getFieldError = useCallback((field: string) => {
    return errors[field] || null;
  }, [errors]);

  const hasFieldError = useCallback((field: string) => {
    return !!errors[field];
  }, [errors]);

  const getParticipantError = useCallback((index: number, field: string) => {
    return errors[`participant_${index}_${field}`] || null;
  }, [errors]);

  return {
    // Configuration state
    config,
    errors,
    isValid,
    
    // Update methods
    updateConfig,
    setTopic,
    setScenario,
    setParticipants,
    setMaxIterations,
    setCustomPrompt,
    
    // Participant management
    addParticipant,
    removeParticipant,
    updateParticipant,
    
    // Validation
    validateConfig,
    updateValidation,
    getFieldError,
    hasFieldError,
    getParticipantError,
    
    // Presets and utilities
    applyPreset,
    loadRandomTopic,
    resetConfig,
    
    // Persistence
    saveConfig,
    loadConfig,
    getSavedConfigs,
    deleteSavedConfig,
    
    // Computed values
    availableTopics,
    scenarioConfig,
    estimatedCost,
    estimatedDuration,
    configSummary,
    
    // Constants for UI
    predefinedTopics: PREDEFINED_TOPICS,
    scenarios: Object.values(SCENARIO_CONFIGS),
    providerConfigs: PROVIDER_CONFIGS,
    recommendedCombinations: RECOMMENDED_COMBINATIONS
  };
}
