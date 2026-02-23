const PARSEABLE_EXTENSIONS = [
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
];

/**
 * Get the first font URL that can be parsed (ttf, otf, woff, woff2).
 */
export function getParseableFontUrl(
  file?: string,
  salesFiles?: string[]
): string | null {
  const allUrls = [
    ...(file ? [file] : []),
    ...(salesFiles || []),
  ];

  for (const url of allUrls) {
    const path = url.split("?")[0].toLowerCase();
    if (
      PARSEABLE_EXTENSIONS.some((ext) => path.endsWith(ext))
    ) {
      return url;
    }
  }
  return null;
}

/**
 * Default character set when font parsing fails (Korean Hangul syllables only)
 */
export const DEFAULT_CHARS =
  "가각갂갃간갅갆갇갈갉갊갋갌갍갎갏감갑값갓갔강갖갗갘같갚갛개객갞갟갠갡갢갣갤갥갦갧갨갩갪갫갬갭갮갯갰갱갲갳갴갵갶갷갸갹갺갻갼갽갾갿걀걁걂걃걄걅걆걇걈걉걊걋걌걍걎걏걐걑걒걓걔걕걖걗걘걙걚걛걜걝걞걟걠걡걢걣걤걥걦걧걨걩걪걫걬걭걮걯거걱걲걳건걵걶걷걸걹걺걻걼걽걾걿검겁겂것겄겅겆겇겈겉겊겋게겍겎겏겐겑겒겓겔겕겖겗겘겙겚겛겜겝겞겟겠겡겢겣겤겥겦겧겨격겪겫견겭겮겯결겱겲겳겴겵겶겷겸겹겺겻겼경겾겿곀곁곂곃계곅곆곇곈곉곊곋곌곍곎곏곐곑곒곓곔곕곖곗곘곙곚곛곜곝곞곟고곡곢곣곤곥곦곧골곩곪곫곬곭곮곯곰곱곲곳곴공곶곷곸곹곺곻과곽곾곿과곽괁괂괃괄괅괆괇괈괉괊괋괌괍괎괏괐광괒괓괔괕괖괗괘괙괚괛괜괝괞괟괠괡괢괣괤괥괦괧괨괩괪괫괬괭괮괯괰괱괲괳괴괵괶괷괸괹괺괻괼괽괾괿굀굁굂굃굄굅굆굇굈굉굊굋굌굍굎굏";

/** Unicode ranges for Korean Hangul */
const HANGUL_RANGES: [number, number][] = [
  [0xac00, 0xd7a3], // Hangul Syllables (가–힣)
  [0x1100, 0x11ff], // Hangul Jamo
  [0xa960, 0xa97f], // Hangul Jamo Extended-A
  [0xd7b0, 0xd7ff], // Hangul Jamo Extended-B
  [0x3130, 0x318f], // Hangul Compatibility Jamo
];

function isHangulCodePoint(code: number): boolean {
  return HANGUL_RANGES.some(
    ([lo, hi]) => code >= lo && code <= hi
  );
}

function filterToHangulOnly(chars: string[]): string[] {
  return chars.filter((c) => {
    const code = c.codePointAt(0);
    return code !== undefined && isHangulCodePoint(code);
  });
}

function processCharacterSet(chars: string[]): string[] {
  const hangulOnly = filterToHangulOnly(chars);
  return hangulOnly.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

/**
 * Extract glyph set from a font, including only glyphs with outlines.
 * For woff2: uses woff2-encoder to decompress to TTF, then opentype.js to parse.
 * For ttf/otf/woff: uses opentype.js directly.
 * Parses one font and uses it as the reference glyph set.
 */
export async function extractCharacterSetFromFont(
  fontUrl: string
): Promise<string[]> {
  const path = fontUrl.split("?")[0].toLowerCase();
  const isWoff2 = path.endsWith(".woff2");

  let font: {
    tables?: {
      cmap?: { glyphIndexMap?: Record<string, number> };
    };
    glyphs: {
      length: number;
      get: (i: number) => {
        path?: { commands?: unknown[] };
        unicodes?: number[];
        unicode?: number;
      };
    };
  } | null;

  if (isWoff2) {
    try {
      const { decompress } = await import("woff2-encoder");
      const response = await fetch(fontUrl);
      if (!response.ok)
        throw new Error(`Fetch failed: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const ttfBuffer = await decompress(arrayBuffer);
      const buf =
        ttfBuffer.byteOffset === 0 &&
        ttfBuffer.byteLength === ttfBuffer.buffer.byteLength
          ? ttfBuffer.buffer
          : ttfBuffer.buffer.slice(
              ttfBuffer.byteOffset,
              ttfBuffer.byteOffset + ttfBuffer.byteLength
            );
      const opentype = await import("opentype.js");
      font = opentype.default.parse(buf);
    } catch (err) {
      console.warn(
        "[extractCharacterSetFromFont] woff2 decompress/parse failed:",
        err
      );
      const fallback = getDefaultCharacterSet();
      console.log(
        "[extractCharacterSetFromFont] fallback to default,",
        fallback.length,
        "chars"
      );
      return fallback;
    }
  } else {
    try {
      const opentype = await import("opentype.js");
      font = await opentype.default.load(fontUrl);
    } catch (err) {
      console.warn(
        "[extractCharacterSetFromFont] opentype load failed:",
        err
      );
      const fallback = getDefaultCharacterSet();
      console.log(
        "[extractCharacterSetFromFont] fallback to default,",
        fallback.length,
        "chars"
      );
      return fallback;
    }
  }

  if (!font || !font.glyphs) {
    const fallback = getDefaultCharacterSet();
    return fallback;
  }

  const chars = new Set<string>();

  // Get unicode -> glyph index from cmap
  const glyphIndexMap = font.tables?.cmap?.glyphIndexMap;
  if (glyphIndexMap) {
    for (const codeStr of Object.keys(glyphIndexMap)) {
      const glyphIndex = glyphIndexMap[codeStr];
      if (glyphIndex === 0) continue;
      const code = Number.parseInt(codeStr, 10);
      if (
        Number.isNaN(code) ||
        code <= 0 ||
        code === 0xffff
      )
        continue;

      const glyph = font.glyphs.get(glyphIndex);
      if (!glyph) continue;
      const path = glyph.path;
      if (!path?.commands?.length) continue; // Skip glyphs without outlines

      if (!isHangulCodePoint(code)) continue;
      try {
        chars.add(String.fromCodePoint(code));
      } catch {
        /* skip invalid */
      }
    }
  }

  if (chars.size === 0) {
    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      const unicodes =
        glyph.unicodes ??
        (glyph.unicode !== undefined
          ? [glyph.unicode]
          : []);
      if (unicodes.length === 0) continue;
      const path = glyph.path;
      if (!path?.commands?.length) continue; // Skip glyphs without outlines
      for (const code of unicodes) {
        if (
          code > 0 &&
          code !== 0xffff &&
          isHangulCodePoint(code)
        ) {
          chars.add(String.fromCodePoint(code));
        }
      }
    }
  }

  const result = processCharacterSet(Array.from(chars));
  console.log(
    "[extractCharacterSetFromFont] reference glyph set (outlines only):",
    result.length,
    "chars",
    result
  );
  return result;
}

export function getDefaultCharacterSet(): string[] {
  return Array.from(new Set(DEFAULT_CHARS.split(""))).sort(
    (a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
  );
}
