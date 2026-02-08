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
      <span className="font-whisper text-sm font-normal text-black mb-2">
        Designers
      </span>

      {/* Selected designers tags */}
      {selectedDesigners.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedDesigners.map((designer) => (
            <span
              key={designer.id}
              className="inline-flex items-center gap-4 px-6 py-3 bg-transparent border border-neutral-300 rounded-full text-base font-medium font-whisper"
            >
              {designer.firstName} {designer.lastName}
              <button
                type="button"
                onClick={() =>
                  handleRemoveSelected(designer.id)
                }
                className="hover:text-red-500 transition-colors"
              >
                <RiCloseLine className="w-5 h-5" />
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
          className="w-full px-6 py-5 border border-neutral-300 rounded-4xl transition-colors flex items-center justify-center gap-2 text-black font-whisper cursor-pointer"
        >
          <RiAddFill className="w-5 h-5" />
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
            className="w-full px-6 py-5 border border-neutral-300 bg-transparent flex items-center justify-between text-black font-whisper font-medium rounded-[80px]"
          >
            <span>
              {selectedDesigners.length > 0
                ? `${selectedDesigners.length} designer(s) selected`
                : "Select designers..."}
            </span>
            <RiArrowDownSLine
              className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-neutral-300 shadow-lg max-h-60 overflow-y-auto">
              {availableDesigners.map((designer) => (
                <button
                  key={designer.id}
                  type="button"
                  onClick={() =>
                    handleSelectDesigner(designer)
                  }
                  className="w-full px-6 py-3 text-left hover:bg-neutral-50 transition-colors font-whisper border-b border-neutral-100 last:border-b-0"
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
                className="w-full px-6 py-3 text-left hover:bg-neutral-50 transition-colors font-whisper flex items-center gap-2 text-neutral-600 border-t border-neutral-200"
              >
                <RiAddFill className="w-4 h-4" />
                Add new designer
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Add designer form */}
      {isFormOpen && (
        <div className="mt-2 p-4 border border-neutral-300 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="font-whisper font-medium text-sm">
              New designer
            </span>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setFirstName("");
                setLastName("");
              }}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="designer-first-name"
                className="block font-whisper text-sm font-normal text-black mb-2"
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
                className="w-full px-4 py-3 border border-neutral-300 placeholder:text-neutral-400 placeholder:text-sm font-whisper"
              />
            </div>
            <div>
              <label
                htmlFor="designer-last-name"
                className="block font-whisper text-sm font-normal text-black mb-2"
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
                className="w-full px-4 py-3 border border-neutral-300 placeholder:text-neutral-400 placeholder:text-sm font-whisper"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddDesigner}
            disabled={!firstName.trim() || !lastName.trim()}
            className="w-full py-3 bg-black text-white font-whisper font-medium hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            Add designer
          </button>
        </div>
      )}
    </div>
  );
}
