const { loadPyodide } = require("pyodide");
async function main() {
  const pyodide = await loadPyodide();
  await pyodide.loadPackage("numpy");
  const res = pyodide.runPython(`
def _convert(obj):
    import sys
    if 'numpy' in sys.modules:
        import numpy as np
        if isinstance(obj, np.generic):
            return obj.item()
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
    if isinstance(obj, list):
        return [_convert(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _convert(v) for k, v in obj.items()}
    if isinstance(obj, tuple):
        return tuple(_convert(x) for x in obj)
    return obj

import numpy as np
scores = np.array([85, 92, 78, 90, 88, 76, 95, 89, 82, 91])
result = [np.mean(scores), np.median(scores), np.median(scores), np.max(scores), np.std(scores)]
_convert(result)
  `);
  console.log(res.toJs());
}
main();
