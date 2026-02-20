"use client";

import { useEffect, useRef, useState } from "react";
import { RiCloseLine, RiLoader4Line } from "react-icons/ri";
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
import FontFilesSection from "./font-files-section";
import type { FontFormat } from "./font-format-dropzone";
import FormFields from "./form-fields";
import TypeTesterDropzone from "./type-tester-dropzone";

const FONT_FORMATS: FontFormat[] = [
  "otf",
  "ttf",
  "woff",
  "woff2",
];

const emptyFilesByFormat = (): Record<
  FontFormat,
  SalesFile | null
> => ({
  otf: null,
  ttf: null,
  woff: null,
  woff2: null,
});

const emptyInputRefs = (): Record<
  FontFormat,
  HTMLInputElement | null
> => ({
  otf: null,
  ttf: null,
  woff: null,
  woff2: null,
});

export default function AddFontModal({
  isOpen,
  onClose,
  onSave,
  editingFont,
  studioId,
  defaultPrices = {
    printPrice: 0,
    webPrice: 0,
    appPrice: 0,
  },
}: AddFontModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const salesInputRefs = useRef<
    Record<FontFormat, HTMLInputElement | null>
  >(emptyInputRefs());
  const trialInputRefs = useRef<
    Record<FontFormat, HTMLInputElement | null>
  >(emptyInputRefs());
  const [fileName, setFileName] = useState<string | null>(
    null
  );
  const [pendingFile, setPendingFile] =
    useState<File | null>(null);
  const [salesFilesByFormat, setSalesFilesByFormat] =
    useState<Record<FontFormat, SalesFile | null>>(
      emptyFilesByFormat()
    );
  const [trialFilesByFormat, setTrialFilesByFormat] =
    useState<Record<FontFormat, SalesFile | null>>(
      emptyFilesByFormat()
    );
  const [formData, setFormData] = useState({
    styleName: "",
    weight: "400",
    width: "100",
    isItalic: false,
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
        file: editingFont.file,
      });
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

      const salesByFormat = emptyFilesByFormat();
      for (const url of editingFont.salesFiles || []) {
        const ext = url
          .split(".")
          .pop()
          ?.split("?")[0]
          ?.toLowerCase();
        if (
          ext &&
          (ext === "otf" ||
            ext === "ttf" ||
            ext === "woff" ||
            ext === "woff2")
        ) {
          salesByFormat[ext as FontFormat] = {
            id: generateUUID(),
            name: decodeURIComponent(
              url.split("/").pop()?.split("?")[0] || ""
            ),
            url,
          };
        }
      }
      setSalesFilesByFormat(salesByFormat);

      const trialByFormat = emptyFilesByFormat();
      const trialUrls =
        (editingFont as Font & { trialFiles?: string[] })
          .trialFiles || [];
      if (trialUrls.length === 0 && editingFont.file) {
        trialUrls.push(editingFont.file);
      }
      for (const url of trialUrls) {
        const ext = url
          .split(".")
          .pop()
          ?.split("?")[0]
          ?.toLowerCase();
        if (
          ext &&
          (ext === "otf" ||
            ext === "ttf" ||
            ext === "woff" ||
            ext === "woff2")
        ) {
          trialByFormat[ext as FontFormat] = {
            id: generateUUID(),
            name: decodeURIComponent(
              url.split("/").pop()?.split("?")[0] || ""
            ),
            url,
          };
        }
      }
      setTrialFilesByFormat(trialByFormat);
    } else {
      setFormData({
        styleName: "",
        weight: "400",
        width: "100",
        isItalic: false,
        file: "",
      });
      setFileName(null);
      setPendingFile(null);
      setSalesFilesByFormat(emptyFilesByFormat());
      setTrialFilesByFormat(emptyFilesByFormat());
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

  const isValidTypeTesterFile = (file: File) =>
    file.name.toLowerCase().endsWith(".woff2");

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
      file: "",
    });
    setFileName(null);
    setPendingFile(null);
    setSalesFilesByFormat(emptyFilesByFormat());
    setTrialFilesByFormat(emptyFilesByFormat());
    setError(null);
  };

  const getExt = (file: File): FontFormat | null => {
    const ext = file.name.toLowerCase().split(".").pop();
    if (
      ext === "otf" ||
      ext === "ttf" ||
      ext === "woff" ||
      ext === "woff2"
    )
      return ext;
    return null;
  };

  const createDropHandlers = (
    format: FontFormat,
    isSales: boolean
  ) => {
    const setter = isSales
      ? setSalesFilesByFormat
      : setTrialFilesByFormat;
    return {
      onChange: (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file = e.target.files?.[0];
        if (!file || getExt(file) !== format) return;
        setter((prev) => ({
          ...prev,
          [format]: {
            id: generateUUID(),
            name: file.name,
            file,
          },
        }));
        e.target.value = "";
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || getExt(file) !== format) return;
        setter((prev) => ({
          ...prev,
          [format]: {
            id: generateUUID(),
            name: file.name,
            file,
          },
        }));
      },
      onRemove: () => {
        setter((prev) => ({ ...prev, [format]: null }));
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let fileUrl = formData.file;
      if (pendingFile) {
        fileUrl = await uploadFile(
          pendingFile,
          "fonts",
          studioId
        );
      }

      const salesUrls: string[] = [];
      for (const format of FONT_FORMATS) {
        const sf = salesFilesByFormat[format];
        if (sf?.url) salesUrls.push(sf.url);
        else if (sf?.file) {
          const [uploaded] = await uploadMultipleFiles(
            [sf.file],
            "fonts",
            studioId
          );
          salesUrls.push(uploaded);
        }
      }

      const trialUrls: string[] = [];
      for (const format of FONT_FORMATS) {
        const tf = trialFilesByFormat[format];
        if (tf?.url) trialUrls.push(tf.url);
        else if (tf?.file) {
          const [uploaded] = await uploadMultipleFiles(
            [tf.file],
            "fonts",
            studioId
          );
          trialUrls.push(uploaded);
        }
      }

      const woff2Trial = trialUrls.find((u) =>
        u.toLowerCase().includes(".woff2")
      );
      const typeTesterFile = fileUrl || woff2Trial || "";

      const font: Font & { trialFiles?: string[] } = {
        id: editingFont?.id || generateUUID(),
        styleName: formData.styleName,
        weight: parseInt(formData.weight, 10) || 400,
        width: parseInt(formData.width, 10) || 100,
        isItalic: formData.isItalic,
        printPrice:
          editingFont?.printPrice ??
          defaultPrices.printPrice,
        webPrice:
          editingFont?.webPrice ?? defaultPrices.webPrice,
        appPrice:
          editingFont?.appPrice ?? defaultPrices.appPrice,
        file: typeTesterFile,
        salesFiles: salesUrls,
        trialFiles: trialUrls,
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

          <FormFields
            formData={formData}
            onChange={handleInputChange}
          />

          <TypeTesterDropzone
            fileName={fileName}
            onChange={handleFileChange}
            onDrop={handleDrop}
            inputRef={fileInputRef}
          />

          <FontFilesSection
            salesFilesByFormat={salesFilesByFormat}
            trialFilesByFormat={trialFilesByFormat}
            salesInputRefs={salesInputRefs}
            trialInputRefs={trialInputRefs}
            onSalesChange={(format) =>
              createDropHandlers(format, true).onChange
            }
            onSalesDrop={(format) =>
              createDropHandlers(format, true).onDrop
            }
            onSalesRemove={(format) =>
              createDropHandlers(format, true).onRemove
            }
            onTrialChange={(format) =>
              createDropHandlers(format, false).onChange
            }
            onTrialDrop={(format) =>
              createDropHandlers(format, false).onDrop
            }
            onTrialRemove={(format) =>
              createDropHandlers(format, false).onRemove
            }
          />

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
