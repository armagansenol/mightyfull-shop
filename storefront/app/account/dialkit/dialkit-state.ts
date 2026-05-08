/**
 * Dialkit token schema. One flat state tree keyed by section. Each leaf
 * is a primitive (number, string, boolean) so we can drive a single
 * `<input>` per knob and serialize to JSON / CSS without ceremony.
 *
 * Defaults below match the production Overview redesign at the time of
 * writing — tweaking the kit and copying the export back into the real
 * components is the intended workflow.
 */

export interface DialState {
  // Outer card frame
  card: {
    borderWidth: number; // px
    borderOpacity: number; // 0-100, applied to blue-ruin
    radius: number; // px
    bgWhite: boolean; // false = sugar-milk, true = white
    headerInset: number; // px margin around the header island
  };
  // Inset header "island"
  header: {
    bgOpacity: number; // 0-100, applied to blue-ruin
    blur: number; // px (backdrop-filter)
    borderWidth: number; // px
    borderOpacity: number; // 0-100
    radius: number; // px
    padX: number; // px
    padY: number; // px
    invert: boolean; // true = solid blue-ruin bg + sugar-milk text
  };
  // Icon dot inside header
  icon: {
    size: number; // px diameter
    borderWidth: number; // px (0 = no ring, filled circle instead)
    strokeWidth: number; // 1.0 - 2.5
    filled: boolean; // true = bg-blue-ruin/15, false = transparent
  };
  // Typography
  type: {
    titleSize: number; // px
    titleWeight: number; // 300-900
    eyebrowSize: number; // px
    eyebrowTracking: number; // em (0 - 0.2)
    eyebrowOpacity: number; // 40-100
    bodySize: number; // px
    bodyLineHeight: number; // 1.2-1.8
  };
  // Page header (h1 above cards)
  page: {
    titleSize: number; // px
    titleWeight: number;
    descriptionSize: number; // px
  };
  // Status pills
  pill: {
    borderWidth: number; // px
    radius: number; // px (999 = full)
    padX: number; // px
    padY: number; // px
    fontSize: number; // px
    fontWeight: number;
  };
  // Quick action tiles
  tile: {
    borderWidth: number; // px
    radius: number; // px
    padding: number; // px
    iconRingWidth: number; // px
  };
  // Layout
  layout: {
    sectionGap: number; // px
    gridGap: number; // px
  };
}

export const DEFAULT_STATE: DialState = {
  card: {
    borderWidth: 2,
    borderOpacity: 100,
    radius: 12,
    bgWhite: false,
    headerInset: 16
  },
  header: {
    bgOpacity: 20,
    blur: 12,
    borderWidth: 1.5,
    borderOpacity: 25,
    radius: 12,
    padX: 20,
    padY: 16,
    invert: false
  },
  icon: {
    size: 36,
    borderWidth: 2,
    strokeWidth: 1.75,
    filled: false
  },
  type: {
    titleSize: 22,
    titleWeight: 700,
    eyebrowSize: 11,
    eyebrowTracking: 0.14,
    eyebrowOpacity: 70,
    bodySize: 14,
    bodyLineHeight: 1.5
  },
  page: {
    titleSize: 36,
    titleWeight: 700,
    descriptionSize: 15
  },
  pill: {
    borderWidth: 1.5,
    radius: 999,
    padX: 10,
    padY: 2,
    fontSize: 12,
    fontWeight: 600
  },
  tile: {
    borderWidth: 2,
    radius: 12,
    padding: 16,
    iconRingWidth: 2
  },
  layout: {
    sectionGap: 32,
    gridGap: 20
  }
};

const STORAGE_KEY = 'mf-dialkit-state-v1';

export function loadDialState(): DialState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<DialState>;
    // Merge each section so newly added knobs pick up defaults.
    return {
      card: { ...DEFAULT_STATE.card, ...parsed.card },
      header: { ...DEFAULT_STATE.header, ...parsed.header },
      icon: { ...DEFAULT_STATE.icon, ...parsed.icon },
      type: { ...DEFAULT_STATE.type, ...parsed.type },
      page: { ...DEFAULT_STATE.page, ...parsed.page },
      pill: { ...DEFAULT_STATE.pill, ...parsed.pill },
      tile: { ...DEFAULT_STATE.tile, ...parsed.tile },
      layout: { ...DEFAULT_STATE.layout, ...parsed.layout }
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveDialState(state: DialState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode etc. */
  }
}

/** Convert state into CSS custom properties for the preview wrapper. */
export function stateToCssVars(s: DialState): Record<string, string> {
  return {
    // Card frame
    '--dk-card-border-width': `${s.card.borderWidth}px`,
    '--dk-card-border-color': `rgb(0 119 224 / ${s.card.borderOpacity}%)`,
    '--dk-card-radius': `${s.card.radius}px`,
    '--dk-card-bg': s.card.bgWhite ? 'rgb(255 255 255)' : 'rgb(255 250 243)',
    '--dk-card-header-inset': `${s.card.headerInset}px`,

    // Header island
    '--dk-header-bg': s.header.invert
      ? 'rgb(0 119 224)'
      : `rgb(0 119 224 / ${s.header.bgOpacity}%)`,
    '--dk-header-blur': s.header.invert ? '0px' : `${s.header.blur}px`,
    '--dk-header-border-width': `${s.header.borderWidth}px`,
    '--dk-header-border-color': s.header.invert
      ? 'rgb(0 119 224)'
      : `rgb(0 119 224 / ${s.header.borderOpacity}%)`,
    '--dk-header-radius': `${s.header.radius}px`,
    '--dk-header-pad-x': `${s.header.padX}px`,
    '--dk-header-pad-y': `${s.header.padY}px`,
    '--dk-header-fg': s.header.invert ? 'rgb(255 250 243)' : 'rgb(0 119 224)',
    '--dk-header-fg-muted': s.header.invert
      ? `rgb(255 250 243 / ${s.type.eyebrowOpacity}%)`
      : `rgb(0 119 224 / ${s.type.eyebrowOpacity}%)`,

    // Icon dot
    '--dk-icon-size': `${s.icon.size}px`,
    '--dk-icon-border-width': `${s.icon.borderWidth}px`,
    '--dk-icon-bg': s.icon.filled
      ? s.header.invert
        ? 'rgb(255 250 243 / 0.15)'
        : 'rgb(0 119 224 / 0.10)'
      : 'transparent',

    // Type
    '--dk-title-size': `${s.type.titleSize}px`,
    '--dk-title-weight': `${s.type.titleWeight}`,
    '--dk-eyebrow-size': `${s.type.eyebrowSize}px`,
    '--dk-eyebrow-tracking': `${s.type.eyebrowTracking}em`,
    '--dk-body-size': `${s.type.bodySize}px`,
    '--dk-body-line-height': `${s.type.bodyLineHeight}`,

    // Page header
    '--dk-page-title-size': `${s.page.titleSize}px`,
    '--dk-page-title-weight': `${s.page.titleWeight}`,
    '--dk-page-description-size': `${s.page.descriptionSize}px`,

    // Pills
    '--dk-pill-border-width': `${s.pill.borderWidth}px`,
    '--dk-pill-radius': `${s.pill.radius}px`,
    '--dk-pill-pad-x': `${s.pill.padX}px`,
    '--dk-pill-pad-y': `${s.pill.padY}px`,
    '--dk-pill-font-size': `${s.pill.fontSize}px`,
    '--dk-pill-font-weight': `${s.pill.fontWeight}`,

    // Tiles
    '--dk-tile-border-width': `${s.tile.borderWidth}px`,
    '--dk-tile-radius': `${s.tile.radius}px`,
    '--dk-tile-padding': `${s.tile.padding}px`,
    '--dk-tile-icon-ring-width': `${s.tile.iconRingWidth}px`,

    // Layout
    '--dk-section-gap': `${s.layout.sectionGap}px`,
    '--dk-grid-gap': `${s.layout.gridGap}px`
  };
}

/** Format the current state as a copy-pasteable CSS snippet. */
export function stateToCssSnippet(s: DialState): string {
  const vars = stateToCssVars(s);
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `:root {\n${body}\n}`;
}
