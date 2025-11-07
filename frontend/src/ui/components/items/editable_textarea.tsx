import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";

export default function EditableTextArea({
  defaultValue,
  width = 50,
  onValueChange,
}: {
  defaultValue: string;
  width?: number;
  onValueChange?: (value: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [showPen, setShowPen] = useState(false);

  const handleBlur = () => setEditMode(false);
  const handleMouseEnter = () => {
    if (editMode === false) {
      setShowPen(true);
    }
  };

  useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowPen(false)}
      className="flex w-full justify-between gap-3 items-center min-w-50"
    >
      {editMode ? (
        <TextareaAutosize
          value={value}
          onChange={(e) => setValue(e.target.value !== "" ? e.target.value : " ")}
          onBlur={handleBlur}
          spellCheck={false}
          autoFocus
          className={`w-${width} bg-transparent border-none outline-none resize-none
                     text-inherit font-inherit leading-inherit
                     text-left text-current text-opacity-inherit
                    tracking-inherit
                     whitespace-pre-wrap align-baseline focus:outline-none`}
        />
      ) : (
        <span
          className={`w-${width}   text-inherit font-inherit leading-inherit
                     text-left text-current text-opacity-inherit
                    tracking-inherit
                     whitespace-pre-wrap align-baseline white-space: pre-wrap word-wrap: break-word`}
          onClick={() => {
            setEditMode(true);
            setShowPen(false);
          }}
        >
          {value}
        </span>
      )}
      {showPen && (
        <FaPen
          size={12}
          //   className="opacity-0 group-hover:opacity-60 cursor-pointer transition-opacity"
          onClick={() => setEditMode(true)}
        />
      )}
    </div>
  );
}
