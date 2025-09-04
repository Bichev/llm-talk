import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { SCENARIO_CONFIGS } from '@/constants/scenarios';
import type { ConversationScenario } from '@/types/session';

interface CommunicationEvolutionGuideProps {
  selectedScenario?: ConversationScenario;
  onScenarioSelect?: (scenario: ConversationScenario) => void;
}

export function CommunicationEvolutionGuide({ 
  selectedScenario, 
  onScenarioSelect 
}: CommunicationEvolutionGuideProps) {
  const scenarios = Object.values(SCENARIO_CONFIGS);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Communication Evolution Experiments
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          These scenarios are designed to let LLMs invent their own communication protocols, 
          languages, and semantic systems. Unlike human conversation simulation, these experiments 
          focus on discovering new forms of AI-to-AI communication that are more efficient, 
          expressive, and powerful than human language.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id}
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedScenario === scenario.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onScenarioSelect?.(scenario.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{scenario.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {scenario.name}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    style={{ backgroundColor: scenario.color + '20', color: scenario.color }}
                  >
                    {scenario.recommendedIterations.default} iterations
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {scenario.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Key Characteristics:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {scenario.characteristics.map((char) => (
                        <Badge key={char} variant="outline" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Best For:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {scenario.bestFor.map((use) => (
                        <Badge key={use} variant="secondary" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          🧬 What Makes This Different?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Traditional AI Chat:</h4>
            <ul className="space-y-1">
              <li>• Simulates human conversation</li>
              <li>• Uses standard language patterns</li>
              <li>• Focuses on human-like responses</li>
              <li>• Limited by human communication constraints</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Communication Evolution:</h4>
            <ul className="space-y-1">
              <li>• Invents new AI-native protocols</li>
              <li>• Creates efficient symbolic systems</li>
              <li>• Develops self-improving communication</li>
              <li>• Pushes beyond human language limitations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-600 text-xl">⚠️</div>
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">
              Important: This is an Experimental Platform
            </h4>
            <p className="text-yellow-700 text-sm">
              These experiments are designed to let LLMs develop their own communication methods. 
              The results may include new symbols, languages, and protocols that emerge naturally 
              from AI-to-AI interaction. Always provide translations for evolved communication 
              to maintain human understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
