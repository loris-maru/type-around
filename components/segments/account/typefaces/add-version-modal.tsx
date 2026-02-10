"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RiCloseLine } from "react-icons/ri";
import type {
  AddVersionModalProps,
  TypefaceVersion,
} from "@/types/components";
import { generateUUID } from "@/utils/generate-uuid";

type FormData = Omit<TypefaceVersion, "id">;

type OptionalToggles = {
  newWeight: boolean;
  newStyle: boolean;
  corrections: boolean;
};

const EMPTY_FORM: FormData = {
  versionNumber: "",
  description: "",
  glyphSetCurrent: 0,
  glyphSetFinal: 0,
  features: "",
  newWeightCurrent: 0,
  newWeightFinal: 0,
  newStyleCurrent: 0,
  newStyleFinal: 0,
  corrections: "",
};

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-4 py-3 font-whisper text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black";
const labelClass =
  "mb-2 font-normal font-whisper text-black text-sm";
const subLabelClass =
  "font-normal font-whisper text-neutral-500 text-xs";

export default function AddVersionModal({
  isOpen,
  onClose,
  onSave,
  editingVersion,
}: AddVersionModalProps) {
  const initialForm = useMemo<FormData>(() => {
    if (!isOpen) return EMPTY_FORM;
    if (editingVersion) {
      return {
        versionNumber: editingVersion.versionNumber,
        description: editingVersion.description,
        glyphSetCurrent: editingVersion.glyphSetCurrent,
        glyphSetFinal: editingVersion.glyphSetFinal,
        features: editingVersion.features,
        newWeightCurrent: editingVersion.newWeightCurrent,
        newWeightFinal: editingVersion.newWeightFinal,
        newStyleCurrent: editingVersion.newStyleCurrent,
        newStyleFinal: editingVersion.newStyleFinal,
        corrections: editingVersion.corrections,
      };
    }
    return EMPTY_FORM;
  }, [isOpen, editingVersion]);

  const initialToggles = useMemo<OptionalToggles>(() => {
    if (!isOpen) {
      return {
        newWeight: false,
        newStyle: false,
        corrections: false,
      };
    }
    if (editingVersion) {
      return {
        newWeight:
          !!editingVersion.newWeightCurrent ||
          !!editingVersion.newWeightFinal,
        newStyle:
          !!editingVersion.newStyleCurrent ||
          !!editingVersion.newStyleFinal,
        corrections: !!editingVersion.corrections,
      };
    }
    return {
      newWeight: false,
      newStyle: false,
      corrections: false,
    };
  }, [isOpen, editingVersion]);

  // Track the reset key to detect when form should be reset
  const resetKey = `${isOpen}-${editingVersion?.id ?? "new"}`;

  const [prevResetKey, setPrevResetKey] =
    useState(resetKey);
  const [form, setForm] = useState(initialForm);
  const [toggles, setToggles] =
    useState<OptionalToggles>(initialToggles);

  // Reset form during render when dependencies change (avoids useEffect setState)
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setForm(initialForm);
    setToggles(initialToggles);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]:
          value === ""
            ? 0
            : Number.parseInt(value, 10) || 0,
      }));
    },
    []
  );

  const handleToggle = useCallback(
    (field: keyof OptionalToggles) => {
      setToggles((prev) => {
        const next = !prev[field];
        if (!next) {
          // Clear the paired fields when disabling
          if (field === "corrections") {
            setForm((f) => ({ ...f, corrections: "" }));
          } else {
            setForm((f) => ({
              ...f,
              [`${field}Current`]: 0,
              [`${field}Final`]: 0,
            }));
          }
        }
        return { ...prev, [field]: next };
      });
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const version: TypefaceVersion = {
        id: editingVersion?.id || generateUUID(),
        ...form,
        newWeightCurrent: toggles.newWeight
          ? form.newWeightCurrent
          : 0,
        newWeightFinal: toggles.newWeight
          ? form.newWeightFinal
          : 0,
        newStyleCurrent: toggles.newStyle
          ? form.newStyleCurrent
          : 0,
        newStyleFinal: toggles.newStyle
          ? form.newStyleFinal
          : 0,
        corrections: toggles.corrections
          ? form.corrections
          : "",
      };
      onSave(version);
      onClose();
    },
    [form, toggles, editingVersion, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to dismiss */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click to dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b px-6 py-4">
          <h2 className="font-bold font-ortank text-xl">
            {editingVersion
              ? "Edit Version"
              : "Add Version"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-5 overflow-y-auto px-6 py-5"
        >
          {/* Version Number */}
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="versionNumber"
              className={labelClass}
            >
              Version number
            </label>
            <input
              id="versionNumber"
              name="versionNumber"
              type="text"
              value={form.versionNumber}
              onChange={handleChange}
              placeholder="e.g. 1.0"
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="versionDescription"
              className={labelClass}
            >
              Description
            </label>
            <textarea
              id="versionDescription"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what's included in this version"
              className={`resize-y ${inputClass}`}
            />
          </div>

          {/* Glyph Set */}
          <CurrentFinalField
            label="Glyph set"
            currentId="glyphSetCurrent"
            finalId="glyphSetFinal"
            currentValue={form.glyphSetCurrent}
            finalValue={form.glyphSetFinal}
            onChange={handleNumberChange}
          />

          {/* Features */}
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="versionFeatures"
              className={labelClass}
            >
              Features
            </label>
            <textarea
              id="versionFeatures"
              name="features"
              value={form.features}
              onChange={handleChange}
              rows={3}
              placeholder="List the features of this version"
              className={`resize-y ${inputClass}`}
            />
          </div>

          {/* New Weight (optional) */}
          <OptionalField
            id="newWeight"
            label="New weight"
            enabled={toggles.newWeight}
            onToggle={() => handleToggle("newWeight")}
          >
            <CurrentFinalField
              label=""
              currentId="newWeightCurrent"
              finalId="newWeightFinal"
              currentValue={form.newWeightCurrent}
              finalValue={form.newWeightFinal}
              onChange={handleNumberChange}
            />
          </OptionalField>

          {/* New Style (optional) */}
          <OptionalField
            id="newStyle"
            label="New style"
            enabled={toggles.newStyle}
            onToggle={() => handleToggle("newStyle")}
          >
            <CurrentFinalField
              label=""
              currentId="newStyleCurrent"
              finalId="newStyleFinal"
              currentValue={form.newStyleCurrent}
              finalValue={form.newStyleFinal}
              onChange={handleNumberChange}
            />
          </OptionalField>

          {/* Corrections (optional) */}
          <OptionalField
            id="corrections"
            label="Corrections"
            enabled={toggles.corrections}
            onToggle={() => handleToggle("corrections")}
          >
            <textarea
              id="versionCorrections"
              name="corrections"
              value={form.corrections}
              onChange={handleChange}
              rows={3}
              placeholder="List the corrections made in this version"
              className={`resize-y ${inputClass}`}
            />
          </OptionalField>

          {/* Submit */}
          <div className="flex justify-end gap-3 border-neutral-200 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 font-medium font-whisper transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-black px-6 py-2 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
            >
              {editingVersion
                ? "Save Changes"
                : "Add Version"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Current / Final number pair ── */

function CurrentFinalField({
  label,
  currentId,
  finalId,
  currentValue,
  finalValue,
  onChange,
}: {
  label: string;
  currentId: string;
  finalId: string;
  currentValue: number;
  finalValue: number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      {label && <span className={labelClass}>{label}</span>}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <label
            htmlFor={currentId}
            className={subLabelClass}
          >
            Current
          </label>
          <input
            id={currentId}
            name={currentId}
            type="number"
            min={0}
            value={currentValue}
            onChange={onChange}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label
            htmlFor={finalId}
            className={subLabelClass}
          >
            Final
          </label>
          <input
            id={finalId}
            name={finalId}
            type="number"
            min={0}
            value={finalValue}
            onChange={onChange}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Checkbox-gated optional field ── */

function OptionalField({
  id,
  label,
  enabled,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  enabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-2">
        <input
          id={`toggle-${id}`}
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="h-4 w-4 rounded border-neutral-300 accent-black"
          aria-label={`Enable ${label}`}
        />
        <label
          htmlFor={`toggle-${id}`}
          className="font-normal font-whisper text-black text-sm"
        >
          {label}
        </label>
      </div>
      {enabled && children}
    </div>
  );
}
