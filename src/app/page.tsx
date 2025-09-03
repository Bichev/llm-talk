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
          <h1 className="text-4xl font-bold mb-4">
            LLM-Talk
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
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
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="font-semibold text-foreground mb-2">
              Multi-LLM Support
            </h3>
            <p className="text-muted-foreground text-sm">
              OpenAI, Claude, Gemini, and Perplexity working together
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-foreground mb-2">
              Real-time Evolution
            </h3>
            <p className="text-muted-foreground text-sm">
              Watch communication patterns develop live
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-foreground mb-2">
              Efficiency Analytics
            </h3>
            <p className="text-muted-foreground text-sm">
              Track token usage and communication improvements
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-foreground mb-2">
              Research Focus
            </h3>
            <p className="text-muted-foreground text-sm">
              Built for AI researchers and enthusiasts
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🔄</div>
            <h3 className="font-semibold text-foreground mb-2">
              Multiple Scenarios
            </h3>
            <p className="text-muted-foreground text-sm">
              Debate, cooperation, problem-solving modes
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-semibold text-foreground mb-2">
              Mobile Ready
            </h3>
            <p className="text-muted-foreground text-sm">
              Responsive design for any device
            </p>
          </div>
        </div>

        {/* Testing Link */}
        <div className="mt-12 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🧪 Ready for Testing!
            </h3>
            <p className="text-green-800 mb-4">
              The session management system is complete. Test it before we build the main UI.
            </p>
            <a 
              href="/test"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Open Test Interface →
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, Supabase, and Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
