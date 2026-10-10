
function roundToCents(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

const testCases = [
  { val: 1.005, expected: 1.01 },
  { val: 1.004, expected: 1.00 },
  { val: -1.005, expected: -1.00 }, // Math.round(-1.005) -> -1
  { val: -1.006, expected: -1.01 },
  { val: 0.00, expected: 0.00 },
  { val: 100.555, expected: 100.56 },
  { val: 100.554, expected: 100.55 },
];

testCases.forEach(({ val, expected }) => {
  const result = roundToCents(val);
  console.log(`Input: ${val}, Expected: ${expected}, Got: ${result}, ${result === expected ? 'PASS' : 'FAIL'}`);
});
