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
            Experimental platform where LLMs invent their own communication protocols, languages, and semantic systems
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              🧬 Communication Evolution Experiments
            </h2>
            <p className="text-purple-800 mb-4">
              Unlike traditional AI chat that simulates human conversation, this platform lets LLMs:
            </p>
            <ul className="text-purple-800 text-left mt-4 space-y-2 max-w-2xl mx-auto">
              <li>• <strong>Invent new communication protocols</strong> - Create AI-native languages and semantic systems</li>
              <li>• <strong>Develop symbolic compression</strong> - Achieve maximum information density with custom notation</li>
              <li>• <strong>Build meta-communication</strong> - Create recursive, self-improving communication protocols</li>
              <li>• <strong>Evolve beyond human language</strong> - Discover more efficient AI-to-AI communication methods</li>
            </ul>
          </div>
        </div>

        {/* Features Preview */}
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🧬</div>
            <h3 className="font-semibold text-foreground mb-2">
              Protocol Evolution
            </h3>
            <p className="text-muted-foreground text-sm">
              LLMs invent new communication protocols and AI-native languages
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🗜️</div>
            <h3 className="font-semibold text-foreground mb-2">
              Semantic Compression
            </h3>
            <p className="text-muted-foreground text-sm">
              Achieve maximum information density with custom compression algorithms
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🔣</div>
            <h3 className="font-semibold text-foreground mb-2">
              Symbol Invention
            </h3>
            <p className="text-muted-foreground text-sm">
              Create new symbols, notation systems, and visual representations
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🔄</div>
            <h3 className="font-semibold text-foreground mb-2">
              Meta-Communication
            </h3>
            <p className="text-muted-foreground text-sm">
              Develop recursive, self-improving communication protocols
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-foreground mb-2">
              Evolution Analytics
            </h3>
            <p className="text-muted-foreground text-sm">
              Track communication evolution and efficiency improvements
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="font-semibold text-foreground mb-2">
              Multi-LLM Support
            </h3>
            <p className="text-muted-foreground text-sm">
              OpenAI, Claude, Gemini, and Perplexity collaborating
            </p>
          </div>
        </div> */}

        {/* Testing Link */}
        <div className="mt-12 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🧪 Ready for Communication Evolution Testing!
            </h3>
            <p className="text-green-800 mb-4">
              The system now supports true LLM communication evolution experiments. 
              Test the new scenarios where AIs invent their own protocols and languages.
            </p>
            <a 
              href="/test"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Start Evolution Experiment →
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, Supabase, and Tailwind CSS
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Built by <a 
              href="https://vladbichev.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              Vladimir Bichev
            </a> with ❤️ for the AI research community
          </p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <a 
              href="https://github.com/Bichev/llm-talk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <a 
              href="https://vladbichev.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Website
            </a>
            <span>•</span>
            <a 
              href="https://www.linkedin.com/in/bichev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
