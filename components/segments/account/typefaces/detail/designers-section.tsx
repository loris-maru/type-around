"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
import type { DesignersSectionProps } from "@/types/components";
import type { TypefaceContributor } from "@/types/studio";

function generateId() {
  return `contributor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function DesignersSection({
  contributors,
  onContributorsChange,
}: DesignersSectionProps) {
  const formId = useId();
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  // Focus the first field when the form opens (replaces autoFocus, which
  // jsx-a11y/no-autofocus discourages because it disorients sighted and
  // screen-reader users when the focus jump isn't user-initiated). Here the
  // user explicitly clicked "Add contributor", so a focus change is expected.
  useEffect(() => {
    if (isAdding) firstNameInputRef.current?.focus();
  }, [isAdding]);

  const resetForm = () => {
    setIsAdding(false);
    setFirstName("");
    setLastName("");
    setRole("");
  };

  const handleAdd = () => {
    if (!firstName.trim() && !lastName.trim()) return;
    const next: TypefaceContributor = {
      id: generateId(),
      type: "custom",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: role.trim(),
    };
    onContributorsChange([...contributors, next]);
    resetForm();
  };

  const handleRemove = (id: string) => {
    onContributorsChange(
      contributors.filter((c) => c.id !== id)
    );
  };

  const canAdd = !!(firstName.trim() || lastName.trim());

  return (
    <div className="flex flex-col gap-y-4">
      {contributors.length > 0 && (
        <div className="flex flex-col gap-2">
          {contributors.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium font-whisper text-black text-sm">
                  {c.firstName} {c.lastName}
                </span>
                {c.role && (
                  <span className="font-whisper text-neutral-500 text-xs">
                    {c.role}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(c.id)}
                aria-label={`Remove ${c.firstName} ${c.lastName}`}
                className="cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100"
              >
                <RiCloseLine className="h-4 w-4 text-neutral-400 hover:text-black" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`${formId}-fname`}
                className="font-whisper text-black text-xs uppercase tracking-wider"
              >
                First name
              </label>
              <input
                ref={firstNameInputRef}
                id={`${formId}-fname`}
                type="text"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                placeholder="First name"
                className="rounded-lg border border-neutral-300 px-3 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`${formId}-lname`}
                className="font-whisper text-black text-xs uppercase tracking-wider"
              >
                Last name
              </label>
              <input
                id={`${formId}-lname`}
                type="text"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                placeholder="Last name"
                className="rounded-lg border border-neutral-300 px-3 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor={`${formId}-role`}
              className="font-whisper text-black text-xs uppercase tracking-wider"
            >
              Role
            </label>
            <input
              id={`${formId}-role`}
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Type Designer, Art Director…"
              className="rounded-lg border border-neutral-300 px-3 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdd)
                  handleAdd();
              }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-neutral-300 px-4 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              className="rounded-lg bg-black px-4 py-2 font-whisper text-sm text-white transition-opacity disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 self-start rounded-lg border border-neutral-300 px-4 py-2.5 font-whisper text-neutral-600 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50"
        >
          <RiAddLine className="h-4 w-4" />
          Add contributor
        </button>
      )}
    </div>
  );
}
