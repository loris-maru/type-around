"use client";

type InputCheckboxProps = {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export default function InputCheckbox({
  id,
  name,
  label,
  checked,
  onChange,
  className = "",
}: InputCheckboxProps) {
  const input = (
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-neutral-300"
    />
  );

  if (label) {
    return (
      <label
        className={`flex cursor-pointer items-center gap-2 ${className}`}
        htmlFor={id}
      >
        {input}
        <span className="font-whisper text-sm">
          {label}
        </span>
      </label>
    );
  }

  return input;
}
