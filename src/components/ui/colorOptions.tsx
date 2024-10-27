import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";



export default function ColorOptions({onColorChange}: {onColorChange: (color: string) => void}) {
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    onColorChange(selectedColor);
  }, [selectedColor, onColorChange]);
  
  const renderColorOptions = () => {
    const colors = ["#FE7B7B", "#75D073", "#74A3FF", "#FFE977", "#FBB143", "#C17ED9"];
    return colors.map((color, index) => (
      <Button className={`${selectedColor === color ? "border-2 border-bg-gray-300": ""}`} type="button" variant="ghost" size="icon" onClick={() => setSelectedColor(color)} key={index}>
        <div style={{ backgroundColor: color }} className="rounded-full h-6 w-6"/>
      </Button>
    ));
  };
  return (
    <div className="flex">
      {renderColorOptions()}
    </div>
  )
}