import { useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import ContentEditable from "react-contenteditable";

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
      className={`w-full flex justify-between gap-3 items-top min-w-50`}
    >
      <div className="w-[90%]">
        <ContentEditable
          html={value}
          onChange={(e) => setValue(e.target.value !== "" ? e.target.value : " ")}
          onBlur={handleBlur}
          spellCheck={false}
          className=" focus:outline-1 focus:outline-muted"
        />
      </div>
      <div className="w-[10%]">
        {showPen && <FaPen size={12} onClick={() => setEditMode(true)} />}
      </div>
    </div>
  );
}
