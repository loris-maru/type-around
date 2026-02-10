"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import {
  uploadFile,
  uploadMultipleFiles,
} from "@/lib/firebase/storage";
import type {
  AddFontModalProps,
  SalesFile,
} from "@/types/components";
import type { Font } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";

export default function AddFontModal({
  isOpen,
  onClose,
  onSave,
  editingFont,
  studioId,
}: AddFontModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const salesFilesInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(
    null
  );
  const [pendingFile, setPendingFile] =
    useState<File | null>(null);
  const [salesFiles, setSalesFiles] = useState<SalesFile[]>(
    []
  );

  const [formData, setFormData] = useState({
    styleName: "",
    weight: "400",
    width: "100",
    isItalic: false,
    printPrice: "",
    webPrice: "",
    file: "",
  });

  // Prefill form when editing
  useEffect(() => {
    if (editingFont) {
      setFormData({
        styleName: editingFont.styleName,
        weight: editingFont.weight.toString(),
        width: editingFont.width.toString(),
        isItalic: editingFont.isItalic,
        printPrice: editingFont.printPrice.toString(),
        webPrice: editingFont.webPrice.toString(),
        file: editingFont.file,
      });
      // Extract filename from URL for display
      const displayName = editingFont.file
        ? decodeURIComponent(
            editingFont.file
              .split("/")
              .pop()
              ?.split("?")[0] || ""
          )
        : null;
      setFileName(displayName);
      setPendingFile(null);

      // Load existing sales files
      const existingSalesFiles = (
        editingFont.salesFiles || []
      ).map((url) => ({
        id: generateUUID(),
        name: decodeURIComponent(
          url.split("/").pop()?.split("?")[0] || ""
        ),
        url,
      }));
      setSalesFiles(existingSalesFiles);
    } else {
      setFormData({
        styleName: "",
        weight: "400",
        width: "100",
        isItalic: false,
        printPrice: "",
        webPrice: "",
        file: "",
      });
      setFileName(null);
      setPendingFile(null);
      setSalesFiles([]);
      setError(null);
    }
  }, [editingFont]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isValidFontFile = (file: File) => {
    const ext = file.name.toLowerCase();
    return (
      ext.endsWith(".otf") ||
      ext.endsWith(".ttf") ||
      ext.endsWith(".woff") ||
      ext.endsWith(".woff2")
    );
  };

  const isValidTypeTesterFile = (file: File) => {
    return file.name.toLowerCase().endsWith(".woff2");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && isValidTypeTesterFile(file)) {
      setFileName(file.name);
      setPendingFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && isValidTypeTesterFile(file)) {
      setFileName(file.name);
      setPendingFile(file);
    }
  };

  const resetForm = () => {
    setFormData({
      styleName: "",
      weight: "400",
      width: "100",
      isItalic: false,
      printPrice: "",
      webPrice: "",
      file: "",
    });
    setFileName(null);
    setPendingFile(null);
    setSalesFiles([]);
    setError(null);
  };

  // Sales files handlers
  const handleSalesFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles =
      Array.from(files).filter(isValidFontFile);
    const newSalesFiles: SalesFile[] = validFiles.map(
      (file) => ({
        id: generateUUID(),
        name: file.name,
        file,
      })
    );

    setSalesFiles((prev) => [...prev, ...newSalesFiles]);

    if (salesFilesInputRef.current) {
      salesFilesInputRef.current.value = "";
    }
  };

  const handleSalesFilesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const validFiles =
      Array.from(files).filter(isValidFontFile);
    const newSalesFiles: SalesFile[] = validFiles.map(
      (file) => ({
        id: generateUUID(),
        name: file.name,
        file,
      })
    );

    setSalesFiles((prev) => [...prev, ...newSalesFiles]);
  };

  const handleRemoveSalesFile = (id: string) => {
    setSalesFiles((prev) =>
      prev.filter((f) => f.id !== id)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload new font file if selected
      let fileUrl = formData.file;
      if (pendingFile) {
        fileUrl = await uploadFile(
          pendingFile,
          "fonts",
          studioId
        );
      }

      // Upload new sales files and combine with existing ones
      const pendingSalesFiles = salesFiles.filter(
        (f) => f.file
      );
      const existingSalesFileUrls = salesFiles
        .filter((f) => f.url)
        .map((f) => f.url as string);

      let newSalesFileUrls: string[] = [];
      if (pendingSalesFiles.length > 0) {
        newSalesFileUrls = await uploadMultipleFiles(
          pendingSalesFiles.map((f) => f.file as File),
          "fonts",
          studioId
        );
      }

      const allSalesFileUrls = [
        ...existingSalesFileUrls,
        ...newSalesFileUrls,
      ];

      const font: Font = {
        id: editingFont?.id || generateUUID(),
        styleName: formData.styleName,
        weight: parseInt(formData.weight, 10) || 400,
        width: parseInt(formData.width, 10) || 100,
        isItalic: formData.isItalic,
        printPrice: parseFloat(formData.printPrice) || 0,
        webPrice: parseFloat(formData.webPrice) || 0,
        file: fileUrl,
        salesFiles: allSalesFileUrls,
      };

      onSave(font);
      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save font"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            {editingFont ? "Edit Font" : "Add New Font"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Style Name */}
          <div>
            <label
              htmlFor="styleName"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Style Name{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="styleName"
              name="styleName"
              value={formData.styleName}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Regular, Bold, Light Italic"
            />
          </div>

          {/* Weight & Width */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="weight"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Weight Value
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="100"
                max="900"
                step="100"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="400"
              />
            </div>
            <div>
              <label
                htmlFor="width"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Width Value
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                min="50"
                max="200"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="100"
              />
            </div>
          </div>

          {/* Is Italic */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isItalic"
              name="isItalic"
              checked={formData.isItalic}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
            />
            <label
              htmlFor="isItalic"
              className="font-normal font-whisper text-black text-sm"
            >
              Is Italic?
            </label>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="printPrice"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Print Price (₩)
              </label>
              <input
                type="number"
                id="printPrice"
                name="printPrice"
                value={formData.printPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="webPrice"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Web Price (₩)
              </label>
              <input
                type="number"
                id="webPrice"
                name="webPrice"
                value={formData.webPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Font File for Type Tester */}
          <div>
            <label
              htmlFor="fontFile"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Font file for type tester (woff2)
            </label>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone triggers file input */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: drop zone triggers file input */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-6 transition-colors hover:border-neutral-400"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".woff2"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload woff2 font file for type tester"
              />
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <RiFileTextLine className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-700 text-sm">
                    {fileName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <RiUploadCloud2Line className="h-8 w-8 text-neutral-400" />
                  <span className="text-neutral-500 text-sm">
                    Drop woff2 file or click to browse
                  </span>
                  <span className="text-neutral-400 text-xs">
                    .woff2
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fonts for Sales */}
          <div>
            <label
              htmlFor="salesFiles"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Fonts for sales
            </label>
            <p className="mb-2 font-normal font-whisper text-neutral-500 text-sm">
              Add here the font package that the user will
              get when buying this font. Put all the fonts
              for print and web (woff2, woff, ttf and otf).
            </p>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone triggers file input
            biome-ignore lint/a11y/useKeyWithClickEvents: drop zone triggers file input */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleSalesFilesDrop}
              onClick={() =>
                salesFilesInputRef.current?.click()
              }
              className="w-full cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-6 transition-colors hover:border-neutral-400"
            >
              <input
                ref={salesFilesInputRef}
                type="file"
                accept=".otf,.ttf,.woff,.woff2"
                multiple
                onChange={handleSalesFilesChange}
                className="hidden"
                aria-label="Upload font files for sales"
              />
              <div className="flex flex-col items-center gap-2">
                <RiUploadCloud2Line className="h-8 w-8 text-neutral-400" />
                <span className="text-neutral-500 text-sm">
                  Drop font files or click to browse
                </span>
                <span className="text-neutral-400 text-xs">
                  .woff2, .woff, .ttf, .otf (multiple files
                  allowed)
                </span>
              </div>
            </div>

            {/* Sales Files List */}
            {salesFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {salesFiles.map((sf) => (
                  <div
                    key={sf.id}
                    className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <RiFileTextLine className="h-4 w-4 text-neutral-500" />
                      <span className="max-w-[200px] truncate text-neutral-700 text-sm">
                        {sf.name}
                      </span>
                      {sf.url && (
                        <span className="text-green-600 text-xs">
                          (uploaded)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSalesFile(sf.id);
                      }}
                      className="rounded p-1 transition-colors hover:bg-neutral-200"
                    >
                      <RiDeleteBinLine className="h-4 w-4 text-neutral-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.styleName}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSubmitting && (
                <RiLoader4Line className="h-5 w-5 animate-spin" />
              )}
              {isSubmitting
                ? pendingFile
                  ? "Uploading..."
                  : "Saving..."
                : editingFont
                  ? "Save Changes"
                  : "Add Font"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
