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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-ortank text-xl font-bold">
            {editingFont ? "Edit Font" : "Add New Font"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Style Name */}
          <div>
            <label
              htmlFor="styleName"
              className="block text-sm font-medium text-neutral-700 mb-1"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., Regular, Bold, Light Italic"
            />
          </div>

          {/* Weight & Width */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-neutral-700 mb-1"
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
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="400"
              />
            </div>
            <div>
              <label
                htmlFor="width"
                className="block text-sm font-medium text-neutral-700 mb-1"
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
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
              className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
            />
            <label
              htmlFor="isItalic"
              className="text-sm font-medium text-neutral-700"
            >
              Is Italic?
            </label>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="printPrice"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Print Price ($)
              </label>
              <input
                type="number"
                id="printPrice"
                name="printPrice"
                value={formData.printPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="webPrice"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Web Price ($)
              </label>
              <input
                type="number"
                id="webPrice"
                name="webPrice"
                value={formData.webPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Font File for Type Tester */}
          <div>
            <label
              htmlFor="fontFile"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Font file for type tester (woff2)
            </label>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone triggers file input */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: drop zone triggers file input */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".woff2"
                onChange={handleFileChange}
                className="hidden"
              />
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <RiFileTextLine className="w-5 h-5 text-neutral-600" />
                  <span className="text-sm text-neutral-700">
                    {fileName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <RiUploadCloud2Line className="w-8 h-8 text-neutral-400" />
                  <span className="text-sm text-neutral-500">
                    Drop woff2 file or click to browse
                  </span>
                  <span className="text-xs text-neutral-400">
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
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Fonts for sales
            </label>
            <p className="text-sm font-whisper font-normal text-neutral-500 mb-2">
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
              className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors"
            >
              <input
                ref={salesFilesInputRef}
                type="file"
                accept=".otf,.ttf,.woff,.woff2"
                multiple
                onChange={handleSalesFilesChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <RiUploadCloud2Line className="w-8 h-8 text-neutral-400" />
                <span className="text-sm text-neutral-500">
                  Drop font files or click to browse
                </span>
                <span className="text-xs text-neutral-400">
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
                    className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <RiFileTextLine className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700 truncate max-w-[200px]">
                        {sf.name}
                      </span>
                      {sf.url && (
                        <span className="text-xs text-green-600">
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
                      className="p-1 hover:bg-neutral-200 rounded transition-colors"
                    >
                      <RiDeleteBinLine className="w-4 h-4 text-neutral-500 hover:text-red-500" />
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
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <RiLoader4Line className="w-5 h-5 animate-spin" />
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
