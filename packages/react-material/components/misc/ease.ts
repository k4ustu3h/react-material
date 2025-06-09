const createBezierLUT = (points: number[][], pointCount: number = 100): number[][] => {
  const lut: number[][] = [];
  for (let t = 0; t < 1; t += 1 / pointCount) {
    const a = (1 - t) * (1 - t) * (1 - t);
    const b = (1 - t) * (1 - t) * t;
    const c = (1 - t) * t * t;
    const d = t * t * t;
    const x = (points[0]?.[0] ?? 0) * a + 
              (points[1]?.[0] ?? 0) * 3 * b + 
              (points[2]?.[0] ?? 0) * 3 * c + 
              (points[3]?.[0] ?? 0) * d;
    const y = (points[0]?.[1] ?? 0) * a + 
              (points[1]?.[1] ?? 0) * 3 * b + 
              (points[2]?.[1] ?? 0) * 3 * c + 
              (points[3]?.[1] ?? 0) * d;
    lut.push([x, y]);
  }
  return lut;
};

const createCSSEaseOptimized = (
  lutOptions: number[][][],
  maxErrorThreshold: number = 0.01
): string => {
  // Create the full lookup table
  const lut = lutOptions.map((args) => createBezierLUT(args)).flat();

  // Find key points using Douglas-Peucker algorithm
  const keyPoints: number[][] = [
    lut[0] ?? [0, 0],
    lut[lut.length - 1] ?? [1, 1],
  ];
  const segments: number[][] = [[0, lut.length - 1]];

  while (segments.length > 0) {
    const [startIdx = 0, endIdx = 0] = segments.pop() || [0, 0];
    let maxError = 0;
    let maxErrorIdx = -1;

    // Skip if segment is too small
    if (endIdx - startIdx <= 1) continue;

    const [startX = 0, startY = 0] = lut[startIdx] ?? [0, 0];
    const [endX = 0, endY = 0] = lut[endIdx] ?? [0, 0];

    // Find point with maximum error
    for (let i = startIdx + 1; i < endIdx; i++) {
      const [x=0, y=0] = lut[i] ?? [0, 0];

      // Linear interpolation
      const t = (x - startX) / (endX - startX);
      const interpolatedY = startY + t * (endY - startY);

      const error = Math.abs(y - interpolatedY);

      if (error > maxError) {
        maxError = error;
        maxErrorIdx = i;
      }
    }

    // If error exceeds threshold, add point and split segment
    if (maxError > maxErrorThreshold) {
      keyPoints.push(lut[maxErrorIdx] ?? [0, 0]);
      segments.push([startIdx, maxErrorIdx]);
      segments.push([maxErrorIdx, endIdx]);
    }
  }

  // Sort by x value
  keyPoints
    .filter((point): point is [number, number] => point !== undefined)
    .sort((a, b) => a[0] - b[0]);

  // Format result using CSS linear() with explicit percentages
  let result = "linear(";

  // First point (no percentage for first point)
  result += (keyPoints[0]?.[1] ?? 0).toFixed(3);

  // Middle points with explicit percentages
  for (let i = 1; i < keyPoints.length - 1; i++) {
    const [x=0, y=0] = keyPoints[i] ?? [0, 0];
    const percentage = (x * 100).toFixed(0) + "%";
    result += `, ${y.toFixed(3)} ${percentage}`;
  }

  // Last point (no percentage for last point)
  result += `, ${(keyPoints[keyPoints.length - 1]?.[1] ?? 0).toFixed(3)}`;
  result += ")";

  return result;
};

// Example usage
const testInput = [
  [
    [0, 0],
    [0.05, 0],
    [0.133, 0.06],
    [0.166, 0.4],
  ],
  [
    [0.166, 0.4],
    [0.208, 0.82],
    [0.25, 1],
    [1, 1],
  ],
];

// Run optimized function with a more relaxed threshold for smaller size
const optimizedSmallResult = createCSSEaseOptimized(testInput, 0.01);
console.log("Optimized result (relaxed threshold 0.01):");
console.log(optimizedSmallResult);