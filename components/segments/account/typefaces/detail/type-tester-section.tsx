"use client";

import { useId } from "react";
import CollapsibleSection from "@/components/global/collapsible-section";
import StudioPageFontFace from "@/components/global/studio-page-font-face";
import type { Font } from "@/types/studio";
import type { TypeTesterConfig } from "@/types/studio";

type Props = {
  typeTesterConfig: TypeTesterConfig;
  onTypeTesterConfigChange: (
    config: TypeTesterConfig
  ) => void;
  fonts: Font[];
};

const DEFAULT_CONFIG: TypeTesterConfig = {
  col1: { fontSize: 48, fontId: "", content: "" },
  col2: {
    fontSize: 48,
    slots: [
      { fontId: "", content: "" },
      { fontId: "", content: "" },
    ],
  },
  col3: {
    fontSize: 48,
    slots: [
      { fontId: "", content: "" },
      { fontId: "", content: "" },
      { fontId: "", content: "" },
    ],
  },
};

function FontSelect({
  id,
  fonts,
  value,
  onChange,
  label,
}: {
  id: string;
  fonts: Font[];
  value: string;
  onChange: (fontId: string) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="font-whisper text-black text-xs uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
      >
        <option value="">Select font…</option>
        {fonts.map((f) => (
          <option
            key={f.id}
            value={f.id}
          >
            {f.styleName}
          </option>
        ))}
      </select>
    </div>
  );
}

function FontSizeInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (size: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-whisper text-black text-xs uppercase tracking-wider"
      >
        Font size (px)
      </label>
      <input
        id={id}
        type="number"
        min={8}
        max={400}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value) || 48)
        }
        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
      />
    </div>
  );
}

function ContentInput({
  id,
  value,
  onChange,
  fontFamily,
  fontSize,
  label,
}: {
  id: string;
  value: string;
  onChange: (content: string) => void;
  fontFamily: string;
  fontSize: number;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="font-whisper text-black text-xs uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your text here…"
        rows={3}
        className="w-full resize-y rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
        style={{
          fontFamily,
          fontSize,
        }}
      />
    </div>
  );
}

function SlotBlock({
  fonts,
  fontId,
  content,
  fontSize,
  onFontChange,
  onContentChange,
  fontSelectId,
  contentId,
  label,
}: {
  fonts: Font[];
  fontId: string;
  content: string;
  fontSize: number;
  onFontChange: (id: string) => void;
  onContentChange: (v: string) => void;
  fontSelectId: string;
  contentId: string;
  label?: string;
}) {
  const selectedFont = fonts.find((f) => f.id === fontId);
  const familyName = fontId
    ? `type-tester-${fontId}`
    : "sans-serif";

  return (
    <div className="flex flex-col gap-3">
      <FontSelect
        id={fontSelectId}
        fonts={fonts}
        value={fontId}
        onChange={onFontChange}
        label={label}
      />
      {selectedFont?.file ? (
        <StudioPageFontFace
          key={fontId}
          family={familyName}
          url={selectedFont.file}
          fallbackFamily="sans-serif"
        >
          {({ fontFamily }) => (
            <ContentInput
              id={contentId}
              value={content}
              onChange={onContentChange}
              fontFamily={fontFamily}
              fontSize={fontSize}
            />
          )}
        </StudioPageFontFace>
      ) : (
        <ContentInput
          id={contentId}
          value={content}
          onChange={onContentChange}
          fontFamily="sans-serif"
          fontSize={fontSize}
        />
      )}
    </div>
  );
}

export default function TypeTesterSection({
  typeTesterConfig,
  onTypeTesterConfigChange,
  fonts,
}: Props) {
  const uid = useId();
  const cfg = typeTesterConfig ?? DEFAULT_CONFIG;

  const patchCol1 = (
    patch: Partial<(typeof cfg)["col1"]>
  ) => {
    onTypeTesterConfigChange({
      ...cfg,
      col1: { ...cfg.col1, ...patch },
    });
  };

  const patchCol2 = (
    patch: Partial<(typeof cfg)["col2"]>
  ) => {
    onTypeTesterConfigChange({
      ...cfg,
      col2: { ...cfg.col2, ...patch },
    });
  };

  const patchCol2Slot = (
    index: number,
    patch: Partial<{ fontId: string; content: string }>
  ) => {
    const slots = [...(cfg.col2.slots ?? [])];
    slots[index] = { ...slots[index], ...patch };
    patchCol2({ slots });
  };

  const patchCol3 = (
    patch: Partial<(typeof cfg)["col3"]>
  ) => {
    onTypeTesterConfigChange({
      ...cfg,
      col3: { ...cfg.col3, ...patch },
    });
  };

  const patchCol3Slot = (
    index: number,
    patch: Partial<{ fontId: string; content: string }>
  ) => {
    const slots = [...(cfg.col3.slots ?? [])];
    slots[index] = { ...slots[index], ...patch };
    patchCol3({ slots });
  };

  const col2Slots = cfg.col2.slots ?? [
    { fontId: "", content: "" },
    { fontId: "", content: "" },
  ];
  const col3Slots = cfg.col3.slots ?? [
    { fontId: "", content: "" },
    { fontId: "", content: "" },
    { fontId: "", content: "" },
  ];

  return (
    <div className="flex flex-col">
      {/* 1 Column */}
      <CollapsibleSection
        title="1 column"
        defaultOpen={false}
      >
        <div className="flex flex-col gap-4 pb-4">
          <FontSizeInput
            id={`${uid}-col1-size`}
            value={cfg.col1.fontSize}
            onChange={(fontSize) => patchCol1({ fontSize })}
          />
          <SlotBlock
            fonts={fonts}
            fontId={cfg.col1.fontId}
            content={cfg.col1.content}
            fontSize={cfg.col1.fontSize}
            onFontChange={(fontId) => patchCol1({ fontId })}
            onContentChange={(content) =>
              patchCol1({ content })
            }
            fontSelectId={`${uid}-col1-font`}
            contentId={`${uid}-col1-content`}
            label="Font"
          />
        </div>
      </CollapsibleSection>

      {/* 2 Columns */}
      <CollapsibleSection
        title="2 columns"
        defaultOpen={false}
      >
        <div className="flex flex-col gap-4 pb-4">
          <FontSizeInput
            id={`${uid}-col2-size`}
            value={cfg.col2.fontSize}
            onChange={(fontSize) => patchCol2({ fontSize })}
          />
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <SlotBlock
                key={i}
                fonts={fonts}
                fontId={col2Slots[i]?.fontId ?? ""}
                content={col2Slots[i]?.content ?? ""}
                fontSize={cfg.col2.fontSize}
                onFontChange={(fontId) =>
                  patchCol2Slot(i, { fontId })
                }
                onContentChange={(content) =>
                  patchCol2Slot(i, { content })
                }
                fontSelectId={`${uid}-col2-${i}-font`}
                contentId={`${uid}-col2-${i}-content`}
                label={`Font ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* 3 Columns */}
      <CollapsibleSection
        title="3 columns"
        defaultOpen={false}
      >
        <div className="flex flex-col gap-4 pb-4">
          <FontSizeInput
            id={`${uid}-col3-size`}
            value={cfg.col3.fontSize}
            onChange={(fontSize) => patchCol3({ fontSize })}
          />
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <SlotBlock
                key={i}
                fonts={fonts}
                fontId={col3Slots[i]?.fontId ?? ""}
                content={col3Slots[i]?.content ?? ""}
                fontSize={cfg.col3.fontSize}
                onFontChange={(fontId) =>
                  patchCol3Slot(i, { fontId })
                }
                onContentChange={(content) =>
                  patchCol3Slot(i, { content })
                }
                fontSelectId={`${uid}-col3-${i}-font`}
                contentId={`${uid}-col3-${i}-content`}
                label={`Font ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
