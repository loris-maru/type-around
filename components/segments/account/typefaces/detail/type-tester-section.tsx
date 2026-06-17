"use client";

import { useEffect, useId } from "react";
import CollapsibleSection from "@/components/global/collapsible-section";
import CustomSelect from "@/components/global/inputs/custom-select";
import StudioPageFontFace from "@/components/global/studio-page-font-face";
import type { Font } from "@/types/studio";
import type { TypeTesterConfig } from "@/types/studio";

type SlotData = {
  fontId: string;
  content: string;
  fontSize: number;
  lineHeight: number;
};

type Props = {
  typeTesterConfig: TypeTesterConfig;
  onTypeTesterConfigChange: (
    config: TypeTesterConfig
  ) => void;
  fonts: Font[];
};

const DEFAULT_SLOT = (fontSize: number): SlotData => ({
  fontId: "",
  content: "",
  fontSize,
  lineHeight: 1.2,
});

const DEFAULT_CONFIG: TypeTesterConfig = {
  col1: {
    fontSize: 60,
    lineHeight: 1.2,
    fontId: "",
    content: "",
  },
  col2: {
    slots: [DEFAULT_SLOT(30), DEFAULT_SLOT(30)],
  },
  col3: {
    slots: [
      DEFAULT_SLOT(20),
      DEFAULT_SLOT(20),
      DEFAULT_SLOT(20),
    ],
  },
};

// ── Compact inline number field ───────────────────────────────────────────────
function NumberField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-whisper text-black text-xs uppercase tracking-wider"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
      />
    </div>
  );
}

// ── Per-slot module: [Size | Leading | Font] + [Text] ────────────────────────
function SlotModule({
  uid,
  slot,
  fonts,
  onChange,
}: {
  uid: string;
  slot: SlotData;
  fonts: Font[];
  onChange: (patch: Partial<SlotData>) => void;
}) {
  const fontOptions = fonts.map((f) => ({
    value: f.id,
    label: f.styleName,
  }));

  const selectedFont = fonts.find(
    (f) => f.id === slot.fontId
  );
  const familyName = slot.fontId
    ? `type-tester-${slot.fontId}`
    : "sans-serif";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
      {/* Size / Leading / Font — one row */}
      <div className="grid grid-cols-3 gap-2">
        <NumberField
          id={`${uid}-size`}
          label="Size (px)"
          value={slot.fontSize}
          min={8}
          max={400}
          onChange={(fontSize) => onChange({ fontSize })}
        />
        <NumberField
          id={`${uid}-lh`}
          label="Leading"
          value={slot.lineHeight}
          min={0.5}
          max={4}
          step={0.1}
          onChange={(lineHeight) =>
            onChange({ lineHeight })
          }
        />
        <CustomSelect
          id={`${uid}-font`}
          label="Font"
          value={slot.fontId}
          options={fontOptions}
          onChange={(fontId) => onChange({ fontId })}
          placeholder="Select…"
        />
      </div>

      {/* Text content */}
      {selectedFont?.file ? (
        <StudioPageFontFace
          key={slot.fontId}
          family={familyName}
          url={selectedFont.file}
          fallbackFamily="sans-serif"
        >
          {({ fontFamily }) => (
            <textarea
              value={slot.content}
              onChange={(e) =>
                onChange({ content: e.target.value })
              }
              placeholder="Type your text here…"
              rows={3}
              className="w-full resize-y rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
              style={{
                fontFamily,
                fontSize: slot.fontSize,
                lineHeight: slot.lineHeight,
              }}
            />
          )}
        </StudioPageFontFace>
      ) : (
        <textarea
          value={slot.content}
          onChange={(e) =>
            onChange({ content: e.target.value })
          }
          placeholder="Type your text here…"
          rows={3}
          className="w-full resize-y rounded-lg border border-neutral-300 px-3 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
          style={{
            fontSize: slot.fontSize,
            lineHeight: slot.lineHeight,
          }}
        />
      )}
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function TypeTesterSection({
  typeTesterConfig,
  onTypeTesterConfigChange,
  fonts,
}: Props) {
  const uid = useId();
  const cfg = typeTesterConfig ?? DEFAULT_CONFIG;

  const firstFontId = fonts[0]?.id ?? "";

  // Auto-set first available font when slots have no font selected
  useEffect(() => {
    if (!firstFontId) return;

    let changed = false;
    const next = { ...cfg };

    if (!next.col1.fontId) {
      next.col1 = { ...next.col1, fontId: firstFontId };
      changed = true;
    }

    const col2Slots = (next.col2.slots ?? []).map((s) => {
      if (!s.fontId) {
        changed = true;
        return { ...s, fontId: firstFontId };
      }
      return s;
    });
    if (col2Slots !== next.col2.slots) {
      next.col2 = { ...next.col2, slots: col2Slots };
    }

    const col3Slots = (next.col3.slots ?? []).map((s) => {
      if (!s.fontId) {
        changed = true;
        return { ...s, fontId: firstFontId };
      }
      return s;
    });
    if (col3Slots !== next.col3.slots) {
      next.col3 = { ...next.col3, slots: col3Slots };
    }

    if (changed) onTypeTesterConfigChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstFontId]);

  // ── Patch helpers ─────────────────────────────────────────────────────────
  const patchCol1 = (patch: Partial<typeof cfg.col1>) =>
    onTypeTesterConfigChange({
      ...cfg,
      col1: { ...cfg.col1, ...patch },
    });

  const patchCol2Slot = (
    i: number,
    patch: Partial<SlotData>
  ) => {
    const slots = [...(cfg.col2.slots ?? [])];
    slots[i] = { ...slots[i], ...patch };
    onTypeTesterConfigChange({
      ...cfg,
      col2: { ...cfg.col2, slots },
    });
  };

  const patchCol3Slot = (
    i: number,
    patch: Partial<SlotData>
  ) => {
    const slots = [...(cfg.col3.slots ?? [])];
    slots[i] = { ...slots[i], ...patch };
    onTypeTesterConfigChange({
      ...cfg,
      col3: { ...cfg.col3, slots },
    });
  };

  const col2Slots: SlotData[] = (cfg.col2.slots ?? []).map(
    (s) => ({
      fontId: s.fontId ?? "",
      content: s.content ?? "",
      fontSize: s.fontSize ?? 30,
      lineHeight: s.lineHeight ?? 1.2,
    })
  );

  const col3Slots: SlotData[] = (cfg.col3.slots ?? []).map(
    (s) => ({
      fontId: s.fontId ?? "",
      content: s.content ?? "",
      fontSize: s.fontSize ?? 20,
      lineHeight: s.lineHeight ?? 1.2,
    })
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      {/* 1 Column */}
      <CollapsibleSection
        title="1 column"
        defaultOpen={false}
      >
        <div className="pb-4">
          <SlotModule
            uid={`${uid}-col1`}
            slot={{
              fontId: cfg.col1.fontId,
              content: cfg.col1.content,
              fontSize: cfg.col1.fontSize,
              lineHeight: cfg.col1.lineHeight,
            }}
            fonts={fonts}
            onChange={(patch) => patchCol1(patch)}
          />
        </div>
      </CollapsibleSection>

      {/* 2 Columns */}
      <CollapsibleSection
        title="2 columns"
        defaultOpen={false}
      >
        <div className="grid grid-cols-2 gap-4 pb-4">
          {[0, 1].map((i) => (
            <SlotModule
              key={i}
              uid={`${uid}-col2-${i}`}
              slot={col2Slots[i] ?? DEFAULT_SLOT(30)}
              fonts={fonts}
              onChange={(patch) => patchCol2Slot(i, patch)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* 3 Columns */}
      <CollapsibleSection
        title="3 columns"
        defaultOpen={false}
      >
        <div className="grid grid-cols-3 gap-4 pb-4">
          {[0, 1, 2].map((i) => (
            <SlotModule
              key={i}
              uid={`${uid}-col3-${i}`}
              slot={col3Slots[i] ?? DEFAULT_SLOT(20)}
              fonts={fonts}
              onChange={(patch) => patchCol3Slot(i, patch)}
            />
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
