interface NotesGridProps {
  showGrid: boolean;
  gridSize: number;
  maxDistance: number;
}

export function NotesGrid({ showGrid, gridSize, maxDistance }: NotesGridProps) {
  if (!showGrid) return null;

  const gridLines = [];
  const numLines = Math.ceil(maxDistance / gridSize) * 2;
  
  // Vertical lines
  for (let i = 0; i < numLines; i++) {
    const position = (i - numLines/2) * gridSize;
    gridLines.push(
      <line
        key={`v${i}`}
        x1={position}
        y1={-maxDistance}
        x2={position}
        y2={maxDistance}
        stroke="#ddd"
        strokeWidth="1"
      />
    );
  }
  
  // Horizontal lines
  for (let i = 0; i < numLines; i++) {
    const position = (i - numLines/2) * gridSize;
    gridLines.push(
      <line
        key={`h${i}`}
        x1={-maxDistance}
        y1={position}
        x2={maxDistance}
        y2={position}
        stroke="#ddd"
        strokeWidth="1"
      />
    );
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ 
        width: maxDistance * 2, 
        height: maxDistance * 2, 
        left: -maxDistance, 
        top: -maxDistance 
      }}
    >
      {gridLines}
    </svg>
  );
}