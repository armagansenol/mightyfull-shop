'use client';

import { useEffect, useMemo, useState } from 'react';
import { Section, Slider, Toggle } from './dialkit-controls';
import { DialkitPreview } from './dialkit-preview';
import {
  DEFAULT_STATE,
  type DialState,
  loadDialState,
  saveDialState,
  stateToCssSnippet,
  stateToCssVars
} from './dialkit-state';

type SectionKey = keyof DialState;

export function DialkitClient() {
  const [state, setState] = useState<DialState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState<'css' | 'json' | null>(null);

  useEffect(() => {
    setState(loadDialState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDialState(state);
  }, [state, hydrated]);

  const cssVars = useMemo(() => stateToCssVars(state), [state]);

  const update = <K extends SectionKey, F extends keyof DialState[K]>(
    section: K,
    field: F,
    value: DialState[K][F]
  ) => {
    setState((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const reset = () => setState(DEFAULT_STATE);

  const copy = async (kind: 'css' | 'json') => {
    const text =
      kind === 'css'
        ? stateToCssSnippet(state)
        : JSON.stringify(state, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard denied — silent */
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-6">
      <aside className="flex flex-col gap-3 max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
        <div className="flex flex-wrap gap-2 sticky top-0 bg-sugar-milk pb-3 z-10">
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer h-9 px-3 rounded-lg border-2 border-blue-ruin text-blue-ruin text-sm font-bold hover:bg-blue-ruin hover:text-sugar-milk transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => copy('css')}
            className="cursor-pointer h-9 px-3 rounded-lg border-2 border-blue-ruin bg-blue-ruin text-sugar-milk text-sm font-bold hover:bg-sugar-milk hover:text-blue-ruin transition-colors"
          >
            {copied === 'css' ? 'Copied!' : 'Copy CSS'}
          </button>
          <button
            type="button"
            onClick={() => copy('json')}
            className="cursor-pointer h-9 px-3 rounded-lg border-2 border-blue-ruin text-blue-ruin text-sm font-bold hover:bg-blue-ruin hover:text-sugar-milk transition-colors"
          >
            {copied === 'json' ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>

        <Section title="Card frame" description="Outer surface">
          <Slider
            label="Border width"
            unit="px"
            min={0}
            max={6}
            step={0.5}
            value={state.card.borderWidth}
            onChange={(v) => update('card', 'borderWidth', v)}
          />
          <Slider
            label="Border opacity"
            unit="%"
            min={0}
            max={100}
            value={state.card.borderOpacity}
            onChange={(v) => update('card', 'borderOpacity', v)}
          />
          <Slider
            label="Radius"
            unit="px"
            min={0}
            max={32}
            value={state.card.radius}
            onChange={(v) => update('card', 'radius', v)}
          />
          <Slider
            label="Header inset"
            description="Margin around the header island"
            unit="px"
            min={0}
            max={32}
            value={state.card.headerInset}
            onChange={(v) => update('card', 'headerInset', v)}
          />
          <Toggle
            label="Pure white body"
            description="Off = sugar-milk cream"
            value={state.card.bgWhite}
            onChange={(v) => update('card', 'bgWhite', v)}
          />
        </Section>

        <Section title="Header island" description="Inset top block">
          <Toggle
            label="Solid (inverted)"
            description="On = filled blue-ruin block + cream text"
            value={state.header.invert}
            onChange={(v) => update('header', 'invert', v)}
          />
          <Slider
            label="Background opacity"
            unit="%"
            min={0}
            max={100}
            value={state.header.bgOpacity}
            onChange={(v) => update('header', 'bgOpacity', v)}
          />
          <Slider
            label="Backdrop blur"
            unit="px"
            min={0}
            max={32}
            value={state.header.blur}
            onChange={(v) => update('header', 'blur', v)}
          />
          <Slider
            label="Border width"
            unit="px"
            min={0}
            max={4}
            step={0.5}
            value={state.header.borderWidth}
            onChange={(v) => update('header', 'borderWidth', v)}
          />
          <Slider
            label="Border opacity"
            unit="%"
            min={0}
            max={100}
            value={state.header.borderOpacity}
            onChange={(v) => update('header', 'borderOpacity', v)}
          />
          <Slider
            label="Radius"
            unit="px"
            min={0}
            max={32}
            value={state.header.radius}
            onChange={(v) => update('header', 'radius', v)}
          />
          <Slider
            label="Padding X"
            unit="px"
            min={8}
            max={40}
            value={state.header.padX}
            onChange={(v) => update('header', 'padX', v)}
          />
          <Slider
            label="Padding Y"
            unit="px"
            min={8}
            max={32}
            value={state.header.padY}
            onChange={(v) => update('header', 'padY', v)}
          />
        </Section>

        <Section title="Icon" description="Circle inside header">
          <Slider
            label="Size"
            unit="px"
            min={24}
            max={56}
            value={state.icon.size}
            onChange={(v) => update('icon', 'size', v)}
          />
          <Slider
            label="Ring width"
            unit="px"
            min={0}
            max={3}
            step={0.5}
            value={state.icon.borderWidth}
            onChange={(v) => update('icon', 'borderWidth', v)}
          />
          <Slider
            label="Stroke width"
            min={1}
            max={2.5}
            step={0.25}
            value={state.icon.strokeWidth}
            onChange={(v) => update('icon', 'strokeWidth', v)}
          />
          <Toggle
            label="Filled background"
            value={state.icon.filled}
            onChange={(v) => update('icon', 'filled', v)}
          />
        </Section>

        <Section title="Typography">
          <Slider
            label="Card title size"
            unit="px"
            min={14}
            max={32}
            value={state.type.titleSize}
            onChange={(v) => update('type', 'titleSize', v)}
          />
          <Slider
            label="Card title weight"
            min={300}
            max={900}
            step={100}
            value={state.type.titleWeight}
            onChange={(v) => update('type', 'titleWeight', v)}
          />
          <Slider
            label="Eyebrow size"
            unit="px"
            min={9}
            max={16}
            value={state.type.eyebrowSize}
            onChange={(v) => update('type', 'eyebrowSize', v)}
          />
          <Slider
            label="Eyebrow tracking"
            unit="em"
            min={0}
            max={0.24}
            step={0.01}
            value={state.type.eyebrowTracking}
            onChange={(v) => update('type', 'eyebrowTracking', v)}
          />
          <Slider
            label="Eyebrow opacity"
            unit="%"
            min={40}
            max={100}
            value={state.type.eyebrowOpacity}
            onChange={(v) => update('type', 'eyebrowOpacity', v)}
          />
          <Slider
            label="Body size"
            unit="px"
            min={12}
            max={18}
            value={state.type.bodySize}
            onChange={(v) => update('type', 'bodySize', v)}
          />
          <Slider
            label="Body line height"
            min={1.2}
            max={1.8}
            step={0.05}
            value={state.type.bodyLineHeight}
            onChange={(v) => update('type', 'bodyLineHeight', v)}
          />
        </Section>

        <Section title="Page header" defaultOpen={false}>
          <Slider
            label="Title size"
            unit="px"
            min={20}
            max={56}
            value={state.page.titleSize}
            onChange={(v) => update('page', 'titleSize', v)}
          />
          <Slider
            label="Title weight"
            min={300}
            max={900}
            step={100}
            value={state.page.titleWeight}
            onChange={(v) => update('page', 'titleWeight', v)}
          />
          <Slider
            label="Description size"
            unit="px"
            min={12}
            max={18}
            value={state.page.descriptionSize}
            onChange={(v) => update('page', 'descriptionSize', v)}
          />
        </Section>

        <Section title="Pills" description="Status badges" defaultOpen={false}>
          <Slider
            label="Border width"
            unit="px"
            min={1}
            max={3}
            step={0.5}
            value={state.pill.borderWidth}
            onChange={(v) => update('pill', 'borderWidth', v)}
          />
          <Slider
            label="Radius"
            unit="px"
            min={0}
            max={999}
            value={state.pill.radius}
            onChange={(v) => update('pill', 'radius', v)}
          />
          <Slider
            label="Padding X"
            unit="px"
            min={4}
            max={20}
            value={state.pill.padX}
            onChange={(v) => update('pill', 'padX', v)}
          />
          <Slider
            label="Padding Y"
            unit="px"
            min={0}
            max={8}
            step={0.5}
            value={state.pill.padY}
            onChange={(v) => update('pill', 'padY', v)}
          />
          <Slider
            label="Font size"
            unit="px"
            min={10}
            max={16}
            value={state.pill.fontSize}
            onChange={(v) => update('pill', 'fontSize', v)}
          />
          <Slider
            label="Font weight"
            min={400}
            max={900}
            step={100}
            value={state.pill.fontWeight}
            onChange={(v) => update('pill', 'fontWeight', v)}
          />
        </Section>

        <Section title="Quick action tiles" defaultOpen={false}>
          <Slider
            label="Border width"
            unit="px"
            min={1}
            max={4}
            step={0.5}
            value={state.tile.borderWidth}
            onChange={(v) => update('tile', 'borderWidth', v)}
          />
          <Slider
            label="Radius"
            unit="px"
            min={0}
            max={32}
            value={state.tile.radius}
            onChange={(v) => update('tile', 'radius', v)}
          />
          <Slider
            label="Padding"
            unit="px"
            min={8}
            max={32}
            value={state.tile.padding}
            onChange={(v) => update('tile', 'padding', v)}
          />
          <Slider
            label="Icon ring width"
            unit="px"
            min={0}
            max={3}
            step={0.5}
            value={state.tile.iconRingWidth}
            onChange={(v) => update('tile', 'iconRingWidth', v)}
          />
        </Section>

        <Section title="Layout" defaultOpen={false}>
          <Slider
            label="Section gap"
            unit="px"
            min={12}
            max={64}
            value={state.layout.sectionGap}
            onChange={(v) => update('layout', 'sectionGap', v)}
          />
          <Slider
            label="Grid gap"
            unit="px"
            min={8}
            max={40}
            value={state.layout.gridGap}
            onChange={(v) => update('layout', 'gridGap', v)}
          />
        </Section>
      </aside>

      <main className="lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <DialkitPreview vars={cssVars} />
      </main>
    </div>
  );
}
