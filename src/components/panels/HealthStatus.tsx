"use client";

import React, { useMemo } from "react";
import { Station } from "@/types";
import { Card, TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { Activity, Battery } from "lucide-react";

interface HealthStatusProps {
  stations: Station[];
}

export default function HealthStatus({ stations }: HealthStatusProps) {
  const total = Math.max(1, stations.length);

  const commsHealth = useMemo(() => {
    const ranges = { excellent: 0, good: 0, fair: 0, poor: 0, offline: 0 };
    stations.forEach((s) => {
      if (s.status === "Offline") {
        ranges.offline++;
        return;
      }
      const rssi = s.lastReading?.rssi ?? -999;
      if (rssi > -65) ranges.excellent++;
      else if (rssi > -75) ranges.good++;
      else if (rssi > -85) ranges.fair++;
      else ranges.poor++;
    });
    return ranges;
  }, [stations]);

  const powerHealth = useMemo(() => {
    const ranges = { high: 0, medium: 0, low: 0, critical: 0 };
    stations.forEach((s) => {
      if (s.status === "Offline") return;
      const battery = s.lastReading?.battery ?? 0;
      if (battery > 80) ranges.high++;
      else if (battery > 50) ranges.medium++;
      else if (battery > 20) ranges.low++;
      else ranges.critical++;
    });
    return ranges;
  }, [stations]);

  const percent = (n: number, denom = total) => `${Math.round((n / Math.max(1, denom)) * 100)}%`;
  const powerDenom = Math.max(1, stations.length - commsHealth.offline);

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-lg h-full">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="font-medium flex items-center gap-2">
          <Activity size={18} className="text-sky-400" />
          Station Health
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Communications and power overview</p>
      </div>

      <div className="p-4">
        <TabGroup>
          <TabList className="border-b border-zinc-800 bg-transparent">
            <Tab className="data-[headlessui-state=selected]:text-sky-400 data-[headlessui-state=selected]:border-sky-400">
              Communications
            </Tab>
            <Tab className="data-[headlessui-state=selected]:text-sky-400 data-[headlessui-state=selected]:border-sky-400">
              Power
            </Tab>
          </TabList>

          <TabPanels>
            {/* Communications Panel */}
            <TabPanel>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-zinc-300">RSSI Distribution</h4>
                  <span className="text-xs text-zinc-500">{stations.length} stations</span>
                </div>

                <div className="flex h-10 w-full rounded-xl overflow-hidden shadow-inner border border-zinc-800">
                  {commsHealth.excellent > 0 && (
                    <div
                      className="bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(commsHealth.excellent) }}
                      title={`Excellent: ${commsHealth.excellent} stations`}
                    >
                      {commsHealth.excellent}
                    </div>
                  )}
                  {commsHealth.good > 0 && (
                    <div
                      className="bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(commsHealth.good) }}
                      title={`Good: ${commsHealth.good} stations`}
                    >
                      {commsHealth.good}
                    </div>
                  )}
                  {commsHealth.fair > 0 && (
                    <div
                      className="bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(commsHealth.fair) }}
                      title={`Fair: ${commsHealth.fair} stations`}
                    >
                      {commsHealth.fair}
                    </div>
                  )}
                  {commsHealth.poor > 0 && (
                    <div
                      className="bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(commsHealth.poor) }}
                      title={`Poor: ${commsHealth.poor} stations`}
                    >
                      {commsHealth.poor}
                    </div>
                  )}
                  {commsHealth.offline > 0 && (
                    <div
                      className="bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(commsHealth.offline) }}
                      title={`Offline: ${commsHealth.offline} stations`}
                    >
                      {commsHealth.offline}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2 p-2 bg-emerald-950/30 rounded-lg border border-emerald-800/30">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">Excellent</p>
                      <p className="text-xs text-zinc-500">{commsHealth.excellent} stations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-emerald-950/20 rounded-lg border border-emerald-800/20">
                    <span className="w-3 h-3 bg-emerald-400 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">Good</p>
                      <p className="text-xs text-zinc-500">{commsHealth.good} stations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-amber-950/20 rounded-lg border border-amber-800/20">
                    <span className="w-3 h-3 bg-amber-400 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">Fair</p>
                      <p className="text-xs text-zinc-500">{commsHealth.fair} stations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-rose-950/20 rounded-lg border border-rose-800/20">
                    <span className="w-3 h-3 bg-rose-500 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">Poor</p>
                      <p className="text-xs text-zinc-500">{commsHealth.poor} stations</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Power Panel */}
            <TabPanel>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Battery size={16} className="text-sky-400" />
                    Battery Status
                  </h4>
                  <span className="text-xs text-zinc-500">{powerDenom} online</span>
                </div>

                <div className="flex h-10 w-full rounded-xl overflow-hidden shadow-inner border border-zinc-800">
                  {powerHealth.high > 0 && (
                    <div
                      className="bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(powerHealth.high, powerDenom) }}
                      title={`High: ${powerHealth.high} stations`}
                    >
                      {powerHealth.high}
                    </div>
                  )}
                  {powerHealth.medium > 0 && (
                    <div
                      className="bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(powerHealth.medium, powerDenom) }}
                      title={`Medium: ${powerHealth.medium} stations`}
                    >
                      {powerHealth.medium}
                    </div>
                  )}
                  {powerHealth.low > 0 && (
                    <div
                      className="bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(powerHealth.low, powerDenom) }}
                      title={`Low: ${powerHealth.low} stations`}
                    >
                      {powerHealth.low}
                    </div>
                  )}
                  {powerHealth.critical > 0 && (
                    <div
                      className="bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ width: percent(powerHealth.critical, powerDenom) }}
                      title={`Critical: ${powerHealth.critical} stations`}
                    >
                      {powerHealth.critical}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2 p-2 bg-emerald-950/30 rounded-lg border border-emerald-800/30">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">High (&gt;80%)</p>
                      <p className="text-xs text-zinc-500">{powerHealth.high} stations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-emerald-950/20 rounded-lg border border-emerald-800/20">
                    <span className="w-3 h-3 bg-emerald-400 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">Medium (50-80%)</p>
                      <p className="text-xs text-zinc-500">{powerHealth.medium} stations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-amber-950/20 rounded-lg border border-amber-800/20">
                    <span className="w-3 h-3 bg-amber-400 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">Low (20-50%)</p>
                      <p className="text-xs text-zinc-500">{powerHealth.low} stations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-rose-950/20 rounded-lg border border-rose-800/20">
                    <span className="w-3 h-3 bg-rose-600 rounded-sm shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">Critical (&lt;20%)</p>
                      <p className="text-xs text-zinc-500">{powerHealth.critical} stations</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
