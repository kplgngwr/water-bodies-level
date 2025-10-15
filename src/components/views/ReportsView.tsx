'use client';

import { BasinSummary } from '@/types';
import { ArrowDownToLine, Calendar, FileText, Send } from 'lucide-react';

interface ReportsViewProps {
  basins: BasinSummary[];
}

const REPORT_TEMPLATES = [
  {
    title: 'Daily Situational Report',
    description: '24-hour water level changes, alert summaries, and network health.',
    frequency: 'Daily - 06:00 IST',
  },
  {
    title: 'Basin Performance Digest',
    description: 'Comparative basin performance with risers/droppers and SLA status.',
    frequency: 'Weekly - Monday',
  },
  {
    title: 'Alert Escalation Log',
    description: 'Chronological log of warning and danger alerts with acknowledgements.',
    frequency: 'On Demand',
  },
];

const SCHEDULED_REPORTS = [
  {
    name: 'Regulatory Compliance Pack',
    audience: 'MoWR Analytics Team',
    cadence: 'Monthly - First business day',
    lastRun: '01 Oct 2025',
    status: 'Scheduled',
  },
  {
    name: 'Emergency Escalation Digest',
    audience: 'Control Room Supervisors',
    cadence: 'Hourly when danger alerts present',
    lastRun: '15 Oct 2025 08:00',
    status: 'Auto-triggered',
  },
];

export default function ReportsView({ basins }: ReportsViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {REPORT_TEMPLATES.map((report) => (
          <div
            key={report.title}
            className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-lg p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-sky-300" />
                <h3 className="text-sm font-semibold text-zinc-100">{report.title}</h3>
              </div>
              <p className="text-xs text-zinc-500 mt-2">{report.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <Calendar size={12} />
                {report.frequency}
              </span>
              <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 transition-colors flex items-center gap-1">
                <ArrowDownToLine size={14} />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Scheduled Deliveries</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Automated distribution lists for {basins.length} basin summaries
            </p>
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
            <Send size={14} />
            New Schedule
          </button>
        </div>
        <div className="p-4 space-y-3">
          {SCHEDULED_REPORTS.map((report) => (
            <div
              key={report.name}
              className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{report.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{report.audience}</p>
                </div>
                <span className="text-xs text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                  {report.status}
                </span>
              </div>
              <div className="mt-3 text-[11px] text-zinc-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>Cadence: {report.cadence}</span>
                <span>Last run: {report.lastRun}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
