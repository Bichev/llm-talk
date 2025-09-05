import type { SessionState } from '@/types/session';

export interface DownloadOptions {
  includeMetadata?: boolean;
  includeAnalytics?: boolean;
  includeTranslations?: boolean;
  format?: 'json' | 'csv' | 'pdf';
}

/**
 * Safely convert a date to ISO string, handling both Date objects and string timestamps
 */
function toISOString(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
}

export interface ConversationExport {
  session: {
    id: string;
    topic: string;
    scenario: string;
    status: string;
    startedAt: string;
    completedAt?: string;
    totalIterations: number;
    participants: Array<{
      id: string;
      name: string;
      provider: string;
      model: string;
    }>;
  };
  messages: Array<{
    id: string;
    iteration: number;
    speaker: string;
    timestamp: string;
    evolvedMessage: string;
    translation?: string;
    tokenCount: {
      input: number;
      output: number;
      total: number;
    };
    processingTime?: number;
    efficiencyScore?: number;
    evolutionMarkers?: string[];
  }>;
  analytics?: {
    totalTokens: number;
    averageTokensPerMessage: number;
    efficiencyImprovement: number;
    participantStats: Array<{
      name: string;
      messageCount: number;
      totalTokens: number;
      averageTokens: number;
      averageResponseTime: number;
      innovationScore: number;
    }>;
  };
}

/**
 * Convert session data to export format
 */
export function prepareSessionExport(
  session: SessionState, 
  options: DownloadOptions = {}
): ConversationExport {
  const {
    includeAnalytics = true,
    includeTranslations = true
  } = options;

  const exportData: ConversationExport = {
    session: {
      id: session.id,
      topic: session.config.topic,
      scenario: session.config.scenario,
      status: session.status,
      startedAt: toISOString(session.startedAt)!,
      completedAt: toISOString(session.completedAt),
      totalIterations: session.currentIteration,
      participants: session.participants.map(p => ({
        id: p.id || '',
        name: p.name,
        provider: p.provider,
        model: p.model
      }))
    },
    messages: session.messages.map(msg => ({
      id: msg.id,
      iteration: msg.iteration,
      speaker: msg.speaker,
      timestamp: toISOString(msg.timestamp)!,
      evolvedMessage: msg.evolvedMessage,
      translation: includeTranslations ? msg.translation : undefined,
      tokenCount: msg.tokenCount,
      processingTime: msg.processingTime,
      efficiencyScore: msg.efficiencyScore,
      evolutionMarkers: msg.evolutionMarkers?.map(marker => typeof marker === 'string' ? marker : marker.type) || []
    }))
  };

  if (includeAnalytics && session.analytics) {
    exportData.analytics = {
      totalTokens: session.analytics.totalTokens,
      averageTokensPerMessage: session.analytics.averageTokensPerMessage,
      efficiencyImprovement: session.analytics.efficiencyImprovement,
      participantStats: session.analytics.participantStats.map(stat => ({
        name: stat.name,
        messageCount: stat.messageCount,
        totalTokens: stat.totalTokens,
        averageTokens: stat.averageTokens,
        averageResponseTime: stat.averageResponseTime,
        innovationScore: stat.innovationScore
      }))
    };
  }

  return exportData;
}

/**
 * Generate JSON export
 */
export function generateJSONExport(session: SessionState, options: DownloadOptions = {}): string {
  const exportData = prepareSessionExport(session, options);
  return JSON.stringify(exportData, null, 2);
}

/**
 * Generate CSV export
 */
export function generateCSVExport(session: SessionState, options: DownloadOptions = {}): string {
  const exportData = prepareSessionExport(session, options);
  
  // Create CSV headers
  const headers = [
    'Iteration',
    'Speaker',
    'Timestamp',
    'Message',
    'Translation',
    'Input Tokens',
    'Output Tokens',
    'Total Tokens',
    'Processing Time (ms)',
    'Efficiency Score',
    'Evolution Markers'
  ];

  // Create CSV rows
  const rows = exportData.messages.map(msg => [
    msg.iteration.toString(),
    `"${msg.speaker}"`,
    msg.timestamp,
    `"${msg.evolvedMessage.replace(/"/g, '""')}"`, // Escape quotes
    msg.translation ? `"${msg.translation.replace(/"/g, '""')}"` : '',
    msg.tokenCount.input.toString(),
    msg.tokenCount.output.toString(),
    msg.tokenCount.total.toString(),
    msg.processingTime?.toString() || '',
    msg.efficiencyScore?.toString() || '',
    msg.evolutionMarkers ? `"${msg.evolutionMarkers.join('; ')}"` : ''
  ]);

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  
  return csvContent;
}

/**
 * Generate PDF export (simplified HTML that can be printed to PDF)
 */
export function generatePDFExport(session: SessionState, options: DownloadOptions = {}): string {
  const exportData = prepareSessionExport(session, options);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LLM Communication Evolution - ${exportData.session.topic}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .session-info {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .message {
      margin-bottom: 25px;
      padding: 15px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f3f4f6;
    }
    .speaker {
      font-weight: 600;
      color: #1f2937;
      background: #e5e7eb;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    .iteration {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .message-content {
      margin: 10px 0;
      white-space: pre-wrap;
      font-size: 0.9rem;
    }
    .translation {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 10px;
      margin-top: 10px;
      border-radius: 0 4px 4px 0;
    }
    .translation-label {
      font-weight: 600;
      color: #1e40af;
      font-size: 0.875rem;
      margin-bottom: 5px;
    }
    .metadata {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 8px;
    }
    .analytics {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
    }
    .analytics h3 {
      margin: 0 0 10px 0;
      color: #166534;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }
    .stat {
      background: white;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
    }
    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #166534;
    }
    .stat-label {
      font-size: 0.75rem;
      color: #6b7280;
    }
    @media print {
      body { margin: 0; padding: 15px; }
      .message { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧬 LLM Communication Evolution</h1>
    <h2>${exportData.session.topic}</h2>
  </div>

  <div class="session-info">
    <h3>Session Information</h3>
    <p><strong>Scenario:</strong> ${exportData.session.scenario}</p>
    <p><strong>Status:</strong> ${exportData.session.status}</p>
    <p><strong>Started:</strong> ${new Date(exportData.session.startedAt).toLocaleString()}</p>
    ${exportData.session.completedAt ? `<p><strong>Completed:</strong> ${new Date(exportData.session.completedAt).toLocaleString()}</p>` : ''}
    <p><strong>Total Iterations:</strong> ${exportData.session.totalIterations}</p>
    <p><strong>Participants:</strong> ${exportData.session.participants.map(p => `${p.name} (${p.provider})`).join(', ')}</p>
  </div>

  <div class="messages">
    <h3>Conversation Messages</h3>
    ${exportData.messages.map(msg => `
      <div class="message">
        <div class="message-header">
          <span class="speaker">${msg.speaker}</span>
          <span class="iteration">Iteration ${msg.iteration}</span>
        </div>
        <div class="message-content">${msg.evolvedMessage}</div>
        ${msg.translation ? `
          <div class="translation">
            <div class="translation-label">Translation:</div>
            <div>${msg.translation}</div>
          </div>
        ` : ''}
        <div class="metadata">
          ${msg.tokenCount.total} tokens | 
          ${msg.processingTime ? `${msg.processingTime}ms` : 'N/A'} | 
          ${msg.efficiencyScore ? `Efficiency: ${msg.efficiencyScore}%` : 'N/A'}
          ${msg.evolutionMarkers && msg.evolutionMarkers.length > 0 ? ` | Markers: ${msg.evolutionMarkers.join(', ')}` : ''}
        </div>
      </div>
    `).join('')}
  </div>

  ${exportData.analytics ? `
    <div class="analytics">
      <h3>Session Analytics</h3>
      <div class="stats-grid">
        <div class="stat">
          <div class="stat-value">${exportData.analytics.totalTokens.toLocaleString()}</div>
          <div class="stat-label">Total Tokens</div>
        </div>
        <div class="stat">
          <div class="stat-value">${Math.round(exportData.analytics.averageTokensPerMessage)}</div>
          <div class="stat-label">Avg Tokens/Message</div>
        </div>
        <div class="stat">
          <div class="stat-value">${exportData.analytics.efficiencyImprovement.toFixed(1)}%</div>
          <div class="stat-label">Efficiency Improvement</div>
        </div>
        <div class="stat">
          <div class="stat-value">${exportData.messages.length}</div>
          <div class="stat-label">Total Messages</div>
        </div>
      </div>
    </div>
  ` : ''}
</body>
</html>
  `;

  return html;
}

/**
 * Download file utility
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Download session in specified format
 */
export function downloadSession(
  session: SessionState, 
  format: 'json' | 'csv' | 'pdf', 
  options: DownloadOptions = {}
): void {
  if (!session || session.messages.length === 0) {
    throw new Error('No session data available for download');
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const sessionId = session.id.substring(0, 8);
  const topic = session.config.topic.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  
  let content: string;
  let filename: string;
  let mimeType: string;

  switch (format) {
    case 'json':
      content = generateJSONExport(session, options);
      filename = `llm-talk_${topic}_${sessionId}_${timestamp}.json`;
      mimeType = 'application/json';
      break;
      
    case 'csv':
      content = generateCSVExport(session, options);
      filename = `llm-talk_${topic}_${sessionId}_${timestamp}.csv`;
      mimeType = 'text/csv';
      break;
      
    case 'pdf':
      content = generatePDFExport(session, options);
      filename = `llm-talk_${topic}_${sessionId}_${timestamp}.html`;
      mimeType = 'text/html';
      break;
      
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  downloadFile(content, filename, mimeType);
}
