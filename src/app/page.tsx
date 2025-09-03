import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LLM-Talk - AI Communication Evolution Platform',
  description: 'Experimental platform where multiple LLMs develop efficient communication protocols in real-time',
};

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LLM-Talk
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Watch AI models develop efficient communication protocols in real-time
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🚧 Development in Progress
            </h2>
            <p className="text-blue-800">
              This platform is currently being built. Soon you'll be able to:
            </p>
            <ul className="text-blue-800 text-left mt-4 space-y-2 max-w-md mx-auto">
              <li>• Configure multi-LLM conversations</li>
              <li>• Watch communication evolve in real-time</li>
              <li>• Track token efficiency improvements</li>
              <li>• Analyze communication patterns</li>
            </ul>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Multi-LLM Support
            </h3>
            <p className="text-gray-600 text-sm">
              OpenAI, Claude, Gemini, and Perplexity working together
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Real-time Evolution
            </h3>
            <p className="text-gray-600 text-sm">
              Watch communication patterns develop live
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Efficiency Analytics
            </h3>
            <p className="text-gray-600 text-sm">
              Track token usage and communication improvements
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Research Focus
            </h3>
            <p className="text-gray-600 text-sm">
              Built for AI researchers and enthusiasts
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Multiple Scenarios
            </h3>
            <p className="text-gray-600 text-sm">
              Debate, cooperation, problem-solving modes
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Mobile Ready
            </h3>
            <p className="text-gray-600 text-sm">
              Responsive design for any device
            </p>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Built with Next.js, TypeScript, Supabase, and Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
