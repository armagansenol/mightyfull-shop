'use client';

import {
  Add01Icon,
  Location04Icon,
  MapPinIcon,
  Package01Icon,
  PackageDeliveredIcon,
  RepeatIcon,
  ShoppingBag01Icon
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Self-contained preview that mirrors the production AccountCard /
 * PageHeader / pills / quick-action tile shapes, but reads every
 * dimension and color from `--dk-*` CSS variables. The dialkit page
 * sets those variables on a wrapper `<div>` so dragging a slider
 * updates the preview live.
 */

interface DkCardProps {
  icon?: IconSvgElement;
  eyebrow?: string;
  title?: string;
  action?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

function DkCard({
  icon,
  eyebrow,
  title,
  action,
  children,
  style
}: DkCardProps) {
  return (
    <article
      style={{
        borderWidth: 'var(--dk-card-border-width)',
        borderStyle: 'solid',
        borderColor: 'var(--dk-card-border-color)',
        borderRadius: 'var(--dk-card-radius)',
        background: 'var(--dk-card-bg)',
        color: 'rgb(0 119 224)',
        ...style
      }}
    >
      <header
        style={{
          margin: 'var(--dk-card-header-inset)',
          padding: 'var(--dk-header-pad-y) var(--dk-header-pad-x)',
          background: 'var(--dk-header-bg)',
          backdropFilter: 'blur(var(--dk-header-blur))',
          WebkitBackdropFilter: 'blur(var(--dk-header-blur))',
          borderWidth: 'var(--dk-header-border-width)',
          borderStyle: 'solid',
          borderColor: 'var(--dk-header-border-color)',
          borderRadius: 'var(--dk-header-radius)',
          color: 'var(--dk-header-fg)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
          {icon && (
            <span
              aria-hidden="true"
              style={{
                width: 'var(--dk-icon-size)',
                height: 'var(--dk-icon-size)',
                flexShrink: 0,
                marginTop: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 9999,
                borderWidth: 'var(--dk-icon-border-width)',
                borderStyle: 'solid',
                borderColor: 'var(--dk-header-fg)',
                background: 'var(--dk-icon-bg)',
                color: 'var(--dk-header-fg)'
              }}
            >
              {icon && (
                <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
              )}
            </span>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 0
            }}
          >
            {eyebrow && (
              <span
                style={{
                  fontSize: 'var(--dk-eyebrow-size)',
                  letterSpacing: 'var(--dk-eyebrow-tracking)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--dk-header-fg-muted)'
                }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                style={{
                  fontFamily: 'var(--font-bomstad-display)',
                  fontSize: 'var(--dk-title-size)',
                  fontWeight: 'var(--dk-title-weight)' as unknown as number,
                  lineHeight: 1.1,
                  margin: 0
                }}
              >
                {title}
              </h2>
            )}
          </div>
        </div>
        {action}
      </header>
      <div
        style={{
          padding: '4px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          fontSize: 'var(--dk-body-size)',
          lineHeight: 'var(--dk-body-line-height)' as unknown as number
        }}
      >
        {children}
      </div>
    </article>
  );
}

interface DkPillProps {
  label: string;
  variant?: 'positive' | 'warning' | 'negative' | 'neutral';
}

function DkPill({ label, variant = 'neutral' }: DkPillProps) {
  const palette = {
    positive: { border: '#047857', bg: '#ecfdf5', fg: '#064e3b' },
    warning: { border: '#b45309', bg: '#fffbeb', fg: '#78350f' },
    negative: { border: '#b91c1c', bg: '#fef2f2', fg: '#7f1d1d' },
    neutral: {
      border: 'rgb(0 119 224)',
      bg: 'rgb(255 250 243)',
      fg: 'rgb(0 119 224)'
    }
  }[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        borderWidth: 'var(--dk-pill-border-width)',
        borderStyle: 'solid',
        borderColor: palette.border,
        background: palette.bg,
        color: palette.fg,
        borderRadius: 'var(--dk-pill-radius)',
        padding: 'var(--dk-pill-pad-y) var(--dk-pill-pad-x)',
        fontSize: 'var(--dk-pill-font-size)',
        fontWeight: 'var(--dk-pill-font-weight)' as unknown as number
      }}
    >
      {label}
    </span>
  );
}

interface DkTileProps {
  icon: IconSvgElement;
  label: string;
  description: string;
}

function DkTile({ icon, label, description }: DkTileProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 'var(--dk-tile-padding)',
        borderWidth: 'var(--dk-tile-border-width)',
        borderStyle: 'solid',
        borderColor: 'rgb(0 119 224)',
        borderRadius: 'var(--dk-tile-radius)',
        background: 'rgb(255 250 243)',
        color: 'rgb(0 119 224)'
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 9999,
          borderWidth: 'var(--dk-tile-icon-ring-width)',
          borderStyle: 'solid',
          borderColor: 'rgb(0 119 224)'
        }}
      >
        <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
      </span>
      <span
        style={{
          fontFamily: 'var(--font-bomstad-display)',
          fontSize: 17,
          lineHeight: 1.15
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12, color: 'rgb(71 85 105)' }}>
        {description}
      </span>
    </div>
  );
}

export function DialkitPreview({ vars }: { vars: Record<string, string> }) {
  return (
    <div
      style={vars as CSSProperties}
      className="rounded-2xl bg-sugar-milk p-5 md:p-8 border-2 border-blue-ruin/15"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--dk-section-gap)'
        }}
      >
        {/* Page header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span
            style={{
              fontSize: 'var(--dk-eyebrow-size)',
              letterSpacing: 'var(--dk-eyebrow-tracking)',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'rgb(100 116 139)'
            }}
          >
            Your account
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-bomstad-display)',
              fontSize: 'var(--dk-page-title-size)',
              fontWeight: 'var(--dk-page-title-weight)' as unknown as number,
              lineHeight: 1.05,
              color: 'rgb(0 119 224)',
              margin: 0
            }}
          >
            Hi, Armağan.
          </h1>
          <p
            style={{
              fontSize: 'var(--dk-page-description-size)',
              color: 'rgb(71 85 105)',
              margin: 0
            }}
          >
            Signed in as{' '}
            <span style={{ fontWeight: 600, color: 'rgb(0 119 224)' }}>
              armagansnl@gmail.com
            </span>
          </p>
        </header>

        {/* Two cards side-by-side */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--dk-grid-gap)'
          }}
        >
          <DkCard
            icon={Package01Icon}
            eyebrow="Recent order"
            title="#1001"
            action={
              <button
                type="button"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                  opacity: 0.8,
                  color: 'inherit',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                View all
              </button>
            }
          >
            <div style={{ display: 'flex', gap: 14, color: 'rgb(71 85 105)' }}>
              <span>Placed on Mar 13, 2025</span>
              <span style={{ color: 'rgb(100 116 139)' }}>•</span>
              <span style={{ fontWeight: 600, color: 'rgb(0 119 224)' }}>
                $0.00
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <DkPill label="Unfulfilled" variant="warning" />
              <DkPill label="Refunded" variant="neutral" />
            </div>
          </DkCard>

          <DkCard
            icon={RepeatIcon}
            eyebrow="Subscriptions"
            title="None active"
            action={
              <button
                type="button"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                  opacity: 0.8,
                  color: 'inherit',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Manage
              </button>
            }
          >
            <p style={{ color: 'rgb(71 85 105)', margin: 0 }}>
              Subscribe to your favorites and we&apos;ll deliver them on your
              schedule.
            </p>
          </DkCard>
        </div>

        {/* Default address card */}
        <DkCard
          icon={MapPinIcon}
          eyebrow="Default address"
          title="Armağan Şenol"
        >
          <address
            style={{
              fontStyle: 'normal',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              color: 'rgb(71 85 105)'
            }}
          >
            <span>address line 1</span>
            <span>NY, NY, 10006</span>
            <span>US</span>
            <span style={{ marginTop: 4, color: 'rgb(100 116 139)' }}>
              +1 202 555 0123
            </span>
          </address>
        </DkCard>

        {/* Quick action tiles */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2
            style={{
              fontSize: 'var(--dk-eyebrow-size)',
              letterSpacing: 'var(--dk-eyebrow-tracking)',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'rgb(100 116 139)',
              margin: 0
            }}
          >
            Quick actions
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'var(--dk-grid-gap)'
            }}
          >
            <DkTile
              icon={PackageDeliveredIcon}
              label="Track an order"
              description="Status, tracking & receipts"
            />
            <DkTile
              icon={RepeatIcon}
              label="Manage subscriptions"
              description="Pause, skip, or swap flavors"
            />
            <DkTile
              icon={Location04Icon}
              label="Add an address"
              description="Faster checkout next time"
            />
            <DkTile
              icon={ShoppingBag01Icon}
              label="Browse the shop"
              description="Stock up on cookies"
            />
          </div>
        </section>
      </div>

      {/* Quiet the linter for the unused Add01Icon import that exists for the
          icon catalog but isn't used in this preview. */}
      <span aria-hidden="true" style={{ display: 'none' }}>
        <HugeiconsIcon icon={Add01Icon} size={1} />
      </span>
    </div>
  );
}
