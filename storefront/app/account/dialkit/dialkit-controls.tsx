'use client';

import type { ReactNode } from 'react';

interface ControlBaseProps {
  label: string;
  description?: string;
  unit?: string;
  value: number | string | boolean;
}

function Row({
  label,
  description,
  value,
  unit,
  children
}: ControlBaseProps & { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-2">
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold text-blue-ruin">{label}</span>
        {description && (
          <span className="text-xs text-account-subtle">{description}</span>
        )}
      </span>
      <span className="text-xs font-mono text-blue-ruin/80 tabular-nums whitespace-nowrap">
        {typeof value === 'boolean'
          ? value
            ? 'on'
            : 'off'
          : `${value}${unit ?? ''}`}
      </span>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

interface SliderProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

export function Slider({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange
}: SliderProps) {
  return (
    <Row label={label} description={description} value={value} unit={unit}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-ruin cursor-pointer"
      />
    </Row>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, description, value, onChange }: ToggleProps) {
  return (
    <Row label={label} description={description} value={value}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-blue-ruin transition-colors cursor-pointer ${
          value ? 'bg-blue-ruin' : 'bg-sugar-milk'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${
            value
              ? 'translate-x-[22px] bg-sugar-milk'
              : 'translate-x-[3px] bg-blue-ruin'
          }`}
        />
      </button>
    </Row>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Section({
  title,
  description,
  defaultOpen = true,
  children
}: SectionProps) {
  return (
    <details
      open={defaultOpen}
      className="rounded-xl border-2 border-blue-ruin bg-sugar-milk overflow-hidden"
    >
      <summary className="px-4 py-3 cursor-pointer list-none flex items-center justify-between gap-3 select-none">
        <span className="flex flex-col gap-0.5 min-w-0">
          <span className="font-bomstad-display text-base text-blue-ruin">
            {title}
          </span>
          {description && (
            <span className="text-xs text-account-subtle">{description}</span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="text-blue-ruin/70 text-sm transition-transform group-open:rotate-90"
        >
          ▾
        </span>
      </summary>
      <div className="px-4 pb-3 pt-1 border-t border-blue-ruin/15 flex flex-col">
        {children}
      </div>
    </details>
  );
}
