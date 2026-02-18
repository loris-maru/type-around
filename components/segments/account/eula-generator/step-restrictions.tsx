"use client";

import { useEulaStore } from "@/stores/eula-store";

type ToggleFieldProps = {
  label: string;
  labelKo: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function ToggleField({
  label,
  labelKo,
  description,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-4 border p-5 text-left transition-all duration-200 ${
        checked
          ? "border-black bg-neutral-50"
          : "border-neutral-300 bg-white hover:border-neutral-400"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
          checked ? "bg-black" : "bg-neutral-300"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-3.5" : "translate-x-0"
          }`}
        />
      </span>
      <div className="flex flex-col gap-y-1">
        <span className="font-whisper text-sm font-medium">
          {label}
          <span className="ml-1 text-xs text-neutral-500">
            ({labelKo})
          </span>
        </span>
        <span className="font-whisper text-xs text-neutral-500">
          {description}
        </span>
      </div>
    </button>
  );
}

export default function StepRestrictions() {
  const { restrictions, updateRestrictions } =
    useEulaStore();

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div>
        <h3 className="font-bold font-ortank text-lg">
          Restrictions & Rights
        </h3>
        <p className="mt-1 font-whisper text-neutral-500 text-sm">
          Set what the licensee cannot do with your font.
        </p>
      </div>

      <div className="flex flex-col gap-y-4">
        <ToggleField
          label="Allow sublicensing?"
          labelKo="재라이선스 허용"
          description="The licensee can grant font usage rights to a third party."
          checked={restrictions.allowSublicensing}
          onChange={(v) =>
            updateRestrictions({ allowSublicensing: v })
          }
        />
        <ToggleField
          label="Allow modification or derivative fonts?"
          labelKo="수정 또는 파생 폰트 허용"
          description="The licensee can alter, transform, or create new fonts based on your work."
          checked={restrictions.allowModification}
          onChange={(v) =>
            updateRestrictions({ allowModification: v })
          }
        />
        <ToggleField
          label="Allow redistribution?"
          labelKo="재배포 허용"
          description="The licensee can share or distribute the font files to others."
          checked={restrictions.allowRedistribution}
          onChange={(v) =>
            updateRestrictions({ allowRedistribution: v })
          }
        />
        <ToggleField
          label="Allow use in AI/ML training datasets?"
          labelKo="AI/ML 학습 데이터셋 사용 허용"
          description="The font can be included in datasets used to train AI or machine learning models."
          checked={restrictions.allowAiMlTraining}
          onChange={(v) =>
            updateRestrictions({ allowAiMlTraining: v })
          }
        />
        <ToggleField
          label="Include watermark/font embedding protection clause?"
          labelKo="워터마크/폰트 임베딩 보호 조항 포함"
          description="Add a clause protecting against unauthorized extraction from embedded documents."
          checked={restrictions.includeEmbeddingProtection}
          onChange={(v) =>
            updateRestrictions({
              includeEmbeddingProtection: v,
            })
          }
        />
      </div>
    </div>
  );
}
