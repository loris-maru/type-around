"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
} from "react-icons/ri";
import type { TypeTesterBlockData } from "@/types/layout-typeface";
import type { TypeTesterConfig } from "@/types/studio";
import type { TypetesterFont } from "@/types/typetester";

type TextAlign = "left" | "center" | "right";

type ColState = {
  fontId: string;
  content: string;
  fontSize: number;
  lineHeight: number;
  textAlign: TextAlign;
};

const DEFAULT_CONTENTS = {
  col1: "서체제작을 통해 늘 새로운 유형의 세상을 찾아 나가고 있습니다. 다양한 서체들과 진행 중인 여러 작업들을 통해서 저희의 열정을 끊임없이 보여주고자 합니다.",
  col2: [
    "스크린 상의 서체들을 구현하는 기술들은 이미 믿을 수 없을 정도로 진보되어 있고 많은 디자이너들에 의해 숙달된 상태이기 때문에, 저희는 강한 개성을 타입 프로젝트에 부여하기로 했습니다. 하지만 단순히 디자이너의 개성이 작업에 들어가는 방식이 아니라 서체가 중심이 되어 서사적이고 시각적인 어휘를 활용할 수 있는 환경을 만들었습니다.",
    "저희 웹사이트를 통해 아주 잠깐이라도 타입 디자인이 완전히 디지털을 포용한 미래를 볼 수 있었길 바랍니다. 당연히 이건 시작에 불과합니다. 저희는 탐험가라서 정말 열정적으로 감각적인 서체 가족을 만들어가며 늘 새로운 유형의 세상을 찾아 나가고 있습니다. 웹사이트에서 다양한 서체들과 진행 중인 여러가지 작업들, 그리고 각각의 프로토타입들을 통해서 작업에 대한 저희의 열정을 끊임없이 보여주고자 합니다.",
  ],
  col3: [
    "베르너 오버란트에 위치한 아이거(Eiger)의 마을 그린델발트(Grindelwald)는 아이거 북면과 베터호른(Wetterhorn)을 간직한 산악 경관으로 둘러싸여 있는 초록의 분지에 자리하고 있다. 산악 경관과 다양한 전망 지점 및 액티비티는 그린델발트를 스위스 및 전세계적으로 가장 인기 있는 휴가 및 여행지 중 한 곳이 될 수 있게 하였으며, 이 곳에는 또한 융프라우 지역에서 가장 대규모의 스키 리조트가 자리하고 있다. 웅장한 경치와 분지를 향하여 바로 연결되어 있는 빙하 덕에, 18세기 말 이 지역의 최초 여행자인 영국인 방문객을 매료시켰다. 알피니즘을 일으킨 실제적 돌파구가 된 시점은 19세기 중반이며, 이 지역 산악 가이드들과 영국인 여행객들이 산 정상까지 등반하였다.",
    "알프스 봉우리들과 유라(Jura) 지역의 완만한 언덕 사이에 자리잡은, 스위스의 불어권 도시 제네바(Geneva)는 제네바 호수로 흘러 들어가는 론 강 만에 자리한다. 따뜻한 인간미의 전통과 국제적인 도시의 향취가 있는 제네바는 UNO 유럽 본부가 위치한 곳이며, 국제 적십자의 본청이 있는 평화의 도시로도 널리 알려져 있다. 세계에서 가장 작은 국제도시로 불리는 제네바는 제네바 호수의 140m 높이의 물줄기를 쏘아 올리는 제또 분수(Jet d'eau)가 상징처럼 유명한 곳이다. 대규모 호텔과 많은 레스토랑들은 대부분 호수의 바로 우측 호반에 위치하고, 많은 쇼핑센터와 비즈니스 구역이 있는 구시가지는 제네바의 심장 지역으로 호반의 바로 왼쪽에 자리한다.",
    "오늘날에도 마테호른을 등반하는 것은 큰 도전과제이며, 뛰어난 장비와 훌륭한 가이드를 둔 전문 산악인들만이 등반의 꿈을 실현할 수 있다. 포토재닉한 마테호른을 감상할 수 있는 최적의 장소는 클라인-마테호른(마테호른 파라다이스)인데, 클라인 마테호른과 마테호른 사이에는 테오둘 패스(Theodul Pass)와 빙하만 살짝 가로막고 있을 뿐이다. 방문객들은 체르마트에서 공중 케이블카를 타고 접근할 수 있다. 산 꼭대기의 종착역은 해발 3,820m에 위치해 있으며, 알프스에서 가장 높은 케이블 카 정류장으로 유명하다.",
  ],
} as const;

function initCol(
  fontId: string,
  content: string,
  fontSize: number,
  defaultContent: string
): ColState {
  return {
    fontId,
    content: content || defaultContent,
    fontSize: fontSize || 48,
    lineHeight: 1.2,
    textAlign: "left",
  };
}

function FontFaceStyles({
  fontIds,
  fonts,
}: {
  fontIds: string[];
  fonts: TypetesterFont[];
}) {
  const css = useMemo(() => {
    return fontIds
      .map((id) => fonts.find((f) => f.id === id))
      .filter((f): f is TypetesterFont => !!f?.file)
      .map(
        (f) =>
          `@font-face{font-family:'tt-${f.id}';src:url('${f.file}');font-display:swap;}`
      )
      .join("");
  }, [fontIds, fonts]);

  if (!css) return null;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: font-face CSS injection
  return (
    <style dangerouslySetInnerHTML={{ __html: css }} />
  );
}

function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const pct = (((value - min) / (max - min)) * 100).toFixed(
    2
  );
  const display =
    step < 1 ? value.toFixed(1) : String(value);

  return (
    <div className="flex items-center gap-2">
      <span className="w-5 shrink-0 whitespace-nowrap font-mono text-neutral-400 text-[10px] uppercase tracking-wide">
        {label}
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(to right, #000 ${pct}%, #e5e7eb ${pct}%)`,
        }}
        className="h-px w-28 cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-black"
      />
      <span className="w-10 shrink-0 text-right font-mono text-neutral-600 text-xs tabular-nums">
        {display}
        <span className="text-neutral-400">{unit}</span>
      </span>
    </div>
  );
}

function ParamBar({
  state,
  onChange,
  fonts,
}: {
  state: ColState;
  onChange: (s: ColState) => void;
  fonts: TypetesterFont[];
}) {
  return (
    <div className="flex w-full items-center gap-x-3 border-b border-neutral-100 bg-white px-3 py-2 shadow-sm">
      {/* Font selector */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="shrink-0 whitespace-nowrap font-mono text-neutral-400 text-[10px] uppercase tracking-wide">
          Ft
        </span>
        <select
          value={state.fontId}
          onChange={(e) =>
            onChange({ ...state, fontId: e.target.value })
          }
          onClick={(e) => e.stopPropagation()}
          className="w-[120px] shrink-0 cursor-pointer appearance-none truncate rounded-md border border-neutral-200 bg-white px-2 py-0.5 font-mono text-neutral-700 text-xs focus:border-black focus:outline-none"
        >
          <option value="">— select —</option>
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

      <span className="h-3 w-px shrink-0 bg-neutral-200" />

      {/* Font size slider */}
      <ParamSlider
        label="Sz"
        value={state.fontSize}
        min={8}
        max={400}
        step={1}
        unit="px"
        onChange={(v) =>
          onChange({ ...state, fontSize: v })
        }
      />

      <span className="h-3 w-px shrink-0 bg-neutral-200" />

      {/* Line height slider */}
      <ParamSlider
        label="Lh"
        value={state.lineHeight}
        min={0.5}
        max={4}
        step={0.1}
        unit=""
        onChange={(v) =>
          onChange({ ...state, lineHeight: v })
        }
      />

      <span className="h-3 w-px shrink-0 bg-neutral-200" />

      {/* Text alignment */}
      <div className="flex shrink-0 items-center gap-0.5">
        {(
          [
            {
              align: "left" as TextAlign,
              Icon: RiAlignLeft,
            },
            {
              align: "center" as TextAlign,
              Icon: RiAlignCenter,
            },
            {
              align: "right" as TextAlign,
              Icon: RiAlignRight,
            },
          ] as const
        ).map(({ align, Icon }) => (
          <button
            key={align}
            type="button"
            onClick={() =>
              onChange({ ...state, textAlign: align })
            }
            className={`rounded p-0.5 transition-colors ${
              state.textAlign === align
                ? "bg-black text-white"
                : "text-neutral-400 hover:text-black"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

function TypeTesterColumn({
  state,
  onChange,
  foregroundColor,
  fonts,
}: {
  state: ColState;
  onChange: (s: ColState) => void;
  foregroundColor: string;
  fonts: TypetesterFont[];
}) {
  const fontFamily = state.fontId
    ? `'tt-${state.fontId}', sans-serif`
    : "sans-serif";

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const resize = () => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };
    resize();
    // Re-run after custom font may have finished loading
    const t = setTimeout(resize, 300);
    return () => clearTimeout(t);
  }, [
    state.content,
    state.fontSize,
    state.lineHeight,
    state.fontId,
  ]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Param bar — absolute overlay, hidden by default, shown on hover */}
      <div
        className="absolute top-0 right-0 left-0 z-10 transition-opacity duration-150"
        style={{
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <ParamBar
          state={state}
          onChange={onChange}
          fonts={fonts}
        />
      </div>
      <textarea
        ref={textareaRef}
        value={state.content}
        onChange={(e) => {
          onChange({ ...state, content: e.target.value });
        }}
        placeholder="Type here…"
        rows={1}
        className="w-full resize-none bg-transparent p-6 focus:outline-none"
        style={{
          fontFamily,
          fontSize: state.fontSize,
          lineHeight: state.lineHeight,
          textAlign: state.textAlign,
          color: foregroundColor,
          overflow: "hidden",
        }}
      />
    </div>
  );
}

type BlockState = {
  col1: ColState;
  col2: ColState[];
  col3: ColState[];
};

function buildInitialState(
  cfg: TypeTesterConfig | undefined
): BlockState {
  const c = cfg ?? {
    col1: { fontSize: 60, fontId: "", content: "" },
    col2: {
      fontSize: 30,
      slots: [
        { fontId: "", content: "" },
        { fontId: "", content: "" },
      ],
    },
    col3: {
      fontSize: 20,
      slots: [
        { fontId: "", content: "" },
        { fontId: "", content: "" },
        { fontId: "", content: "" },
      ],
    },
  };

  return {
    col1: initCol(
      c.col1.fontId,
      c.col1.content,
      c.col1.fontSize || 60,
      DEFAULT_CONTENTS.col1
    ),
    col2: (
      c.col2.slots ?? [
        { fontId: "", content: "" },
        { fontId: "", content: "" },
      ]
    ).map((s, i) =>
      initCol(
        s.fontId,
        s.content,
        c.col2.fontSize || 30,
        DEFAULT_CONTENTS.col2[i] ?? DEFAULT_CONTENTS.col2[0]
      )
    ),
    col3: (
      c.col3.slots ?? [
        { fontId: "", content: "" },
        { fontId: "", content: "" },
        { fontId: "", content: "" },
      ]
    ).map((s, i) =>
      initCol(
        s.fontId,
        s.content,
        c.col3.fontSize || 20,
        DEFAULT_CONTENTS.col3[i] ?? DEFAULT_CONTENTS.col3[0]
      )
    ),
  };
}

export default function TypeTesterBlock({
  typetesterFonts,
  data,
  typeTesterConfig,
}: {
  typetesterFonts: TypetesterFont[];
  data?: TypeTesterBlockData;
  typeTesterConfig?: TypeTesterConfig;
}) {
  const [state, setState] = useState<BlockState>(() =>
    buildInitialState(typeTesterConfig)
  );

  const backgroundColor =
    data?.backgroundColor ?? "#ffffff";
  const foregroundColor =
    data?.foregroundColor ?? "#000000";

  const allFontIds = useMemo(
    () =>
      [
        ...new Set([
          state.col1.fontId,
          ...state.col2.map((c) => c.fontId),
          ...state.col3.map((c) => c.fontId),
        ]),
      ].filter(Boolean),
    [state]
  );

  const patchCol1 = (s: ColState) =>
    setState((prev) => ({ ...prev, col1: s }));

  const patchCol2 = (i: number, s: ColState) =>
    setState((prev) => {
      const slots = [...prev.col2];
      slots[i] = s;
      return { ...prev, col2: slots };
    });

  const patchCol3 = (i: number, s: ColState) =>
    setState((prev) => {
      const slots = [...prev.col3];
      slots[i] = s;
      return { ...prev, col3: slots };
    });

  return (
    <div style={{ backgroundColor }}>
      <FontFaceStyles
        fontIds={allFontIds}
        fonts={typetesterFonts}
      />

      {/* 1 column */}
      <div className="border-neutral-200 border-b">
        <TypeTesterColumn
          state={state.col1}
          onChange={patchCol1}
          foregroundColor={foregroundColor}
          fonts={typetesterFonts}
        />
      </div>

      {/* 2 columns */}
      <div className="grid grid-cols-2 border-neutral-200 border-b divide-x divide-neutral-200">
        {state.col2.map((col, i) => (
          <TypeTesterColumn
            key={i}
            state={col}
            onChange={(s) => patchCol2(i, s)}
            foregroundColor={foregroundColor}
            fonts={typetesterFonts}
          />
        ))}
      </div>

      {/* 3 columns */}
      <div className="grid grid-cols-3 divide-x divide-neutral-200">
        {state.col3.map((col, i) => (
          <TypeTesterColumn
            key={i}
            state={col}
            onChange={(s) => patchCol3(i, s)}
            foregroundColor={foregroundColor}
            fonts={typetesterFonts}
          />
        ))}
      </div>
    </div>
  );
}
