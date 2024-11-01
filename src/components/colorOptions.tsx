import { Button } from "@/components/ui/button";
import { colors } from "@/constants";
import { useEffect, useState } from "react";

export default function ColorOptions(
  { onColorChange, initialSelectedColor }:
    { onColorChange: (color: string) => void;
      initialSelectedColor: string }
) {
  const [selectedColor, setSelectedColor] = useState<string>(initialSelectedColor);

  useEffect(() => {
    onColorChange(selectedColor);
  }, [selectedColor, onColorChange]);

  const renderColorOptions = () => {
    return colors.map((color, index) => (
      <Button data-testid={`${color}-btn`} className={`${selectedColor === color ? "border-2 border-gray-300" : ""}`} type="button" variant="ghost" size="icon" onClick={() => setSelectedColor(color)} key={index}>
        <div style={{ backgroundColor: color }} className="rounded-full h-6 w-6" />
      </Button>
    ));
  };

  return (
    <div className="flex">
      {renderColorOptions()}
    </div>
  )
}