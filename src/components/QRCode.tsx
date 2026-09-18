// Simulated QR code visual — CSS art grid based on payload hash
interface QRCodeProps {
  payload: string;
  size?: number;
}

function hashPayload(str: string): number[] {
  const bits: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bits.push(str.charCodeAt(i));
  }
  // Expand to 21x21 = 441 bits
  const result: number[] = [];
  for (let i = 0; i < 441; i++) {
    const byte = bits[i % bits.length];
    const shift = i % 8;
    result.push((byte >> shift) & 1);
  }
  return result;
}

export default function QRCode({ payload, size = 160 }: QRCodeProps) {
  const bits = hashPayload(payload);
  const cells = 21;
  const cellSize = Math.floor(size / cells);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${cells}, ${cellSize}px)`,
        gap: 0,
        background: '#fff',
        padding: cellSize * 1.5,
        borderRadius: 8,
      }}>
      {bits.map((bit, i) => {
        // Force corner finder patterns
        const row = Math.floor(i / cells);
        const col = i % cells;
        const inTopLeft = row < 7 && col < 7;
        const inTopRight = row < 7 && col >= cells - 7;
        const inBottomLeft = row >= cells - 7 && col < 7;
        const isFinderBorder =
          (inTopLeft || inTopRight || inBottomLeft) &&
          (row === 0 || row === 6 || col === 0 || col === 6 ||
            (row >= cells - 7 && (row === cells - 7 || row === cells - 1 || col === 0 || col === 6)));
        const isFinderInner =
          (inTopLeft && row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
          (inTopRight && row >= 2 && row <= 4 && col >= cells - 5 && col <= cells - 3) ||
          (inBottomLeft && row >= cells - 5 && row <= cells - 3 && col >= 2 && col <= 4);

        let filled = bit === 1;
        if (isFinderBorder) filled = true;
        if (
          (inTopLeft && row >= 1 && row <= 5 && col >= 1 && col <= 5 && !isFinderInner) ||
          (inTopRight && row >= 1 && row <= 5 && col >= cells - 6 && col <= cells - 2 && !isFinderInner) ||
          (inBottomLeft && row >= cells - 6 && row <= cells - 2 && col >= 1 && col <= 5 && !isFinderInner)
        ) filled = false;
        if (isFinderInner) filled = true;

        return (
          <div
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              background: filled ? '#000' : '#fff',
            }}
          />
        );
      })}
    </div>
  );
}
