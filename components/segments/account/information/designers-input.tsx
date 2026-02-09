"use client";

import { useState } from "react";
import {
  RiAddFill,
  RiArrowDownSLine,
  RiCloseLine,
} from "react-icons/ri";
import type { Designer } from "@/types/studio";

// Mock data - replace with actual data from your backend
const EXISTING_DESIGNERS: Designer[] = [];

export default function DesignersInput() {
  const [designers, setDesigners] = useState<Designer[]>(
    EXISTING_DESIGNERS
  );
  const [selectedDesigners, setSelectedDesigners] =
    useState<Designer[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const hasDesigners = designers.length > 0;

  const handleAddDesigner = () => {
    if (!firstName.trim() || !lastName.trim()) return;

    const newDesigner: Designer = {
      id: `designer-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: "",
      biography: "",
      avatar: "",
      website: "",
      socialMedia: [],
    };

    setDesigners([...designers, newDesigner]);
    setSelectedDesigners([
      ...selectedDesigners,
      newDesigner,
    ]);
    setFirstName("");
    setLastName("");
    setIsFormOpen(false);
  };

  const handleSelectDesigner = (designer: Designer) => {
    if (
      selectedDesigners.find((d) => d.id === designer.id)
    ) {
      setSelectedDesigners(
        selectedDesigners.filter(
          (d) => d.id !== designer.id
        )
      );
    } else {
      setSelectedDesigners([
        ...selectedDesigners,
        designer,
      ]);
    }
  };

  const handleRemoveSelected = (designerId: string) => {
    setSelectedDesigners(
      selectedDesigners.filter((d) => d.id !== designerId)
    );
  };

  const availableDesigners = designers.filter(
    (d) => !selectedDesigners.find((s) => s.id === d.id)
  );

  return (
    <div className="relative w-full">
      <span className="mb-2 font-normal font-whisper text-black text-sm">
        Designers
      </span>

      {/* Selected designers tags */}
      {selectedDesigners.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedDesigners.map((designer) => (
            <span
              key={designer.id}
              className="inline-flex items-center gap-4 rounded-full border border-neutral-300 bg-transparent px-6 py-3 font-medium font-whisper text-base"
            >
              {designer.firstName} {designer.lastName}
              <button
                type="button"
                onClick={() =>
                  handleRemoveSelected(designer.id)
                }
                aria-label={`Remove ${designer.firstName} ${designer.lastName}`}
                className="transition-colors hover:text-red-500"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main input area */}
      {!hasDesigners && !isFormOpen ? (
        // No designers - show add button
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-4xl border border-neutral-300 px-6 py-5 font-whisper text-black transition-colors"
        >
          <RiAddFill className="h-5 w-5" />
          Add a designer
        </button>
      ) : hasDesigners && !isFormOpen ? (
        // Has designers - show dropdown
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsDropdownOpen(!isDropdownOpen)
            }
            className="flex w-full items-center justify-between rounded-[80px] border border-neutral-300 bg-transparent px-6 py-5 font-medium font-whisper text-black"
          >
            <span>
              {selectedDesigners.length > 0
                ? `${selectedDesigners.length} designer(s) selected`
                : "Select designers..."}
            </span>
            <RiArrowDownSLine
              className={`h-5 w-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-60 overflow-y-auto border border-neutral-300 bg-white shadow-lg">
              {availableDesigners.map((designer) => (
                <button
                  key={designer.id}
                  type="button"
                  onClick={() =>
                    handleSelectDesigner(designer)
                  }
                  className="w-full border-neutral-100 border-b px-6 py-3 text-left font-whisper transition-colors last:border-b-0 hover:bg-neutral-50"
                >
                  {designer.firstName} {designer.lastName}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 border-neutral-200 border-t px-6 py-3 text-left font-whisper text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                <RiAddFill className="h-4 w-4" />
                Add new designer
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Add designer form */}
      {isFormOpen && (
        <div className="mt-2 rounded-lg border border-neutral-300 bg-neutral-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium font-whisper text-sm">
              New designer
            </span>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setFirstName("");
                setLastName("");
              }}
              aria-label="Close add designer form"
              className="text-neutral-400 transition-colors hover:text-neutral-600"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="designer-first-name"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                First name
              </label>
              <input
                type="text"
                id="designer-first-name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                placeholder="First name..."
                className="w-full border border-neutral-300 px-4 py-3 font-whisper placeholder:text-neutral-400 placeholder:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="designer-last-name"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Last name
              </label>
              <input
                type="text"
                id="designer-last-name"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                placeholder="Last name..."
                className="w-full border border-neutral-300 px-4 py-3 font-whisper placeholder:text-neutral-400 placeholder:text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddDesigner}
            disabled={!firstName.trim() || !lastName.trim()}
            className="w-full bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Add designer
          </button>
        </div>
      )}
    </div>
  );
}
