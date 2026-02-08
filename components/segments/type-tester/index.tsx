"use client";

import { useMemo, useState } from "react";

export default function TypeTester() {
  const [fontSize] = useState<number>(16);

  const style = useMemo(
    () => ({
      fontSize: `${fontSize}px`,
    }),
    [fontSize]
  );

  return (
    <div
      className="relative w-full px-24"
      id="tester"
    >
      <div className="relative w-full min-h-[80vh] bg-white rounded-2xl p-5">
        <header className="absolute p-3 flex flex-row justify-between items-center gap-2">
          <div>Typefaces</div>
          <div>Settings here</div>
        </header>
        {/* biome-ignore lint/a11y/useSemanticElements: contentEditable div requires textbox role */}
        <div
          className="relative w-full h-full p-10 focus:outline-none"
          contentEditable="true"
          suppressContentEditableWarning
          role="textbox"
          tabIndex={0}
          id="editable-content"
          lang="ko"
          spellCheck="false"
          aria-label="Editable text content"
          style={style}
        >
          모진 바람 5월 꽃봉오리
        </div>
      </div>
    </div>
  );
}
