declare global {
  interface Window {
    loadPyodide: any;
  }
}

let pyodideInstance: any = null;

export const initPyodide = async () => {
  if (pyodideInstance) return pyodideInstance;
  
  if (!window.loadPyodide) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!window.loadPyodide) throw new Error("Pyodide script not loaded. Check internet connection.");
  }

  pyodideInstance = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
  });
  
  await pyodideInstance.loadPackage("numpy");
  return pyodideInstance;
};

export const runCode = async (code: string) => {
  if (!pyodideInstance) throw new Error("Pyodide not initialized");
  
  pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
if 'result' in globals():
    del globals()['result']
if 'result' in locals():
    del locals()['result']
  `);
  
  try {
    await pyodideInstance.runPythonAsync(code);
    
    const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
    const stderr = pyodideInstance.runPython("sys.stderr.getvalue()");
    
    let resultData = null;
    let resultShape = null;
    let resultType = null;
    
    const hasResult = pyodideInstance.runPython(`'result' in globals() or 'result' in locals()`);
    if (hasResult) {
      const isNumpy = pyodideInstance.runPython(`'numpy' in sys.modules and type(result).__name__ == 'ndarray'`);
      if (isNumpy) {
         const listRes = pyodideInstance.runPython(`result.tolist()`);
         resultData = listRes?.toJs ? listRes.toJs() : listRes;
         
         const shapeRes = pyodideInstance.runPython(`list(result.shape)`);
         resultShape = shapeRes?.toJs ? shapeRes.toJs() : shapeRes;
         
         resultType = pyodideInstance.runPython(`str(result.dtype)`);
      } else {
         const res = pyodideInstance.runPython(`
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
_convert(result)
`);
         resultData = res?.toJs ? res.toJs() : res;
      }
    }
    
    return { 
      success: true, 
      stdout: stdout + stderr, 
      resultData, 
      resultShape, 
      resultType 
    };
  } catch (err: any) {
    const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
    return { success: false, error: stdout + '\n' + err.message };
  }
};
