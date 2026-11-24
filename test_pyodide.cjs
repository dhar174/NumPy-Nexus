const { loadPyodide } = require("pyodide");
async function main() {
  const pyodide = await loadPyodide();
  await pyodide.loadPackage("numpy");
  const res = pyodide.runPython(`
import numpy as np
scores = np.array([85, 92, 78, 90, 88, 76, 95, 89, 82, 91])
[np.mean(scores), np.median(scores), np.median(scores), np.max(scores), np.std(scores)]
  `);
  console.log(res.toJs());
}
main();
