import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, HelpCircle, CheckCircle2, XCircle, ChevronRight, Activity, Database, ShieldAlert, Award } from 'lucide-react';
import { initPyodide, runCode } from './pyodide';
import { MISSIONS } from './missions';
import { Certificate } from './components/Certificate';

const ArrayVisualizer: React.FC<{ data: any, depth?: number }> = ({ data, depth = 0 }) => {
  if (data === null || data === undefined) return <div className="text-slate-600 italic">No data</div>;
  
  let isComplex = false;
  let realPart = 0;
  let imagPart = 0;

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    if ('real' in data && 'imag' in data) {
      isComplex = true;
      realPart = data.real;
      imagPart = data.imag;
    } else if (data instanceof Map && data.has('real') && data.has('imag')) {
      isComplex = true;
      realPart = data.get('real');
      imagPart = data.get('imag');
    }
  }

  if (typeof data === 'number' || typeof data === 'bigint' || typeof data === 'string' || typeof data === 'boolean' || isComplex) {
    let displayValue = '';
    let colorClass = 'text-emerald-400';
    let bgClass = 'bg-slate-900';
    let borderClass = 'border-emerald-900/50';
    
    if (typeof data === 'number' || typeof data === 'bigint') {
      const num = Number(data);
      displayValue = num.toFixed(num % 1 === 0 ? 0 : 2);
      colorClass = 'text-emerald-400';
      borderClass = 'border-emerald-800/50';
    } else if (typeof data === 'string') {
      displayValue = `"${data}"`;
      colorClass = 'text-amber-400';
      borderClass = 'border-amber-800/50';
    } else if (typeof data === 'boolean') {
      displayValue = data ? 'True' : 'False';
      colorClass = 'text-purple-400';
      borderClass = 'border-purple-800/50';
    } else if (isComplex) {
      const r = Number(realPart).toFixed(realPart % 1 === 0 ? 0 : 2);
      const i = Math.abs(imagPart).toFixed(imagPart % 1 === 0 ? 0 : 2);
      const sign = imagPart >= 0 ? '+' : '-';
      displayValue = `${r}${sign}${i}j`;
      colorClass = 'text-cyan-400';
      borderClass = 'border-cyan-800/50';
    }

    return (
      <div className={`flex items-center justify-center min-w-[3.5rem] h-10 px-3 ${bgClass} border ${borderClass} rounded ${colorClass} font-mono text-sm shadow-sm`}>
        {displayValue}
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.length > 50) {
      return <div className="text-slate-500 italic font-mono text-xs p-2">Array too large to visualize ({data.length} elements)</div>;
    }

    const is2D = data.length > 0 && Array.isArray(data[0]);
    const is3D = is2D && data[0].length > 0 && Array.isArray(data[0][0]);
    const isRoot = depth === 0;

    if (is3D) {
      return (
        <div className={`flex flex-col gap-4 p-4 rounded-xl border-2 relative mt-4 ${isRoot ? 'bg-slate-800 border-slate-400 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-slate-800/50 border-slate-600'}`}>
          {isRoot && (
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-purple-500 text-white text-xs font-bold font-mono rounded shadow-lg tracking-wider">
              3D ARRAY
            </div>
          )}
          {data.map((layer: any, i: number) => (
            <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-600 relative pt-6">
              <div className="absolute top-1 left-2 text-[10px] text-slate-400 font-mono">LAYER {i}</div>
              {layer.map((row: any, j: number) => (
                <div key={j} className="flex gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-700 shadow-inner">
                  {row.map((cell: any, k: number) => (
                    <ArrayVisualizer key={k} data={cell} depth={depth + 2} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (is2D) {
      return (
        <div className={`flex flex-col gap-2 p-4 rounded-xl border-2 relative mt-4 ${isRoot ? 'bg-slate-800 border-slate-400 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-slate-800/50 border-slate-600'}`}>
          {isRoot && (
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-indigo-500 text-white text-xs font-bold font-mono rounded shadow-lg tracking-wider">
              2D ARRAY
            </div>
          )}
          {data.map((row, i) => (
            <div key={i} className="flex gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-700 shadow-inner">
              {row.map((cell: any, j: number) => (
                <ArrayVisualizer key={j} data={cell} depth={depth + 1} />
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`flex flex-wrap gap-2 p-4 rounded-xl border-2 relative mt-4 ${isRoot ? 'bg-slate-800 border-slate-400 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-slate-800/50 border-slate-600'}`}>
        {isRoot && (
          <div className="absolute -top-3 left-4 px-3 py-0.5 bg-emerald-600 text-white text-xs font-bold font-mono rounded shadow-lg tracking-wider">
            1D ARRAY
          </div>
        )}
        {data.map((cell, i) => (
          <ArrayVisualizer key={i} data={cell} depth={depth + 1} />
        ))}
      </div>
    );
  }
  
  return <div className="text-slate-500 text-xs font-mono">Unsupported type</div>;
};

const CodeEditor = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full h-full bg-slate-950 text-emerald-300 font-mono p-4 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
      spellCheck={false}
    />
  );
};

export default function App() {
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [pyodideError, setPyodideError] = useState('');
  
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [resultData, setResultData] = useState<any>(null);
  const [resultShape, setResultShape] = useState<number[] | null>(null);
  const [resultType, setResultType] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [validation, setValidation] = useState<{ passed: boolean, message: string } | null>(null);
  const [showHint, setShowHint] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set());

  const mission = MISSIONS[currentMissionIndex];

  useEffect(() => {
    const load = async () => {
      try {
        await initPyodide();
        setIsPyodideLoading(false);
      } catch (e: any) {
        setPyodideError(e.message);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (mission) {
      setCode(mission.starter_code);
      setOutput('');
      setResultData(null);
      setResultShape(null);
      setResultType(null);
      setValidation(null);
      setShowHint(0);
    }
  }, [currentMissionIndex, mission]);

  const handleRun = async () => {
    setIsRunning(true);
    setValidation(null);
    
    const res = await runCode(code);
    
    if (res.success) {
      setOutput(res.stdout);
      setResultData(res.resultData);
      setResultShape(res.resultShape);
      setResultType(res.resultType);
      
      const validationResult = mission.validate(res);
      setValidation(validationResult);
      if (validationResult.passed) {
        setCompletedMissions(prev => {
          const next = new Set(prev);
          next.add(currentMissionIndex);
          return next;
        });
      }
    } else {
      setOutput(res.error || 'Unknown error');
      setResultData(null);
      setResultShape(null);
      setResultType(null);
      setValidation({ passed: false, message: "Execution error. Check console." });
    }
    
    setIsRunning(false);
  };

  if (isPyodideLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-500 font-mono gap-4">
        <Activity className="w-12 h-12 animate-pulse" />
        <div className="text-xl tracking-widest">INITIALIZING NEXUS CORE...</div>
        <div className="text-slate-500 text-sm">Loading Pyodide & NumPy environment</div>
        {pyodideError && <div className="text-rose-500 mt-4">{pyodideError}</div>}
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-300 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Activity className="text-emerald-500 w-5 h-5" />
          <h1 className="font-bold text-lg tracking-wide text-slate-100">NEXUS <span className="text-emerald-500 font-mono text-sm">ML_OPS</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono">
          {completedMissions.size === MISSIONS.length && (
            <button
              onClick={() => setShowCertificate(true)}
              className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/30 transition-colors"
            >
              <Award className="w-4 h-4" /> CERTIFICATE
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">STATUS:</span>
            <span className="text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">MISSION:</span>
            <select
              value={currentMissionIndex}
              onChange={(e) => setCurrentMissionIndex(Number(e.target.value))}
              className="bg-slate-800 text-amber-400 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              {MISSIONS.map((m, i) => (
                <option key={m.id} value={i}>
                  {i + 1}. {m.title}
                </option>
              ))}
            </select>
            <span className="text-slate-500">/ {MISSIONS.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Panel: Mission Feed */}
        <div className="w-1/4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 flex flex-col overflow-hidden shadow-lg">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Mission Brief</span>
              <span className="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">TIER {mission.difficulty}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">{mission.title}</h2>
                <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Database className="w-3 h-3" /> {mission.division}
                </div>
              </div>
              
              <div className="text-sm text-slate-300 leading-relaxed">
                {mission.description}
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <h3 className="font-mono text-xs uppercase text-slate-500 mb-2">Objective</h3>
                <p className="text-sm text-emerald-100">{mission.task}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {mission.concepts.map(c => (
                  <span key={c} className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {c}
                  </span>
                ))}
              </div>

              {/* Hints */}
              <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-2">
                {showHint > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-200/80">
                    <ul className="list-disc pl-4 space-y-1">
                      {mission.hints.slice(0, showHint).map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button 
                  onClick={() => setShowHint(Math.min(showHint + 1, mission.hints.length))}
                  disabled={showHint >= mission.hints.length}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HelpCircle className="w-4 h-4" />
                  {showHint === 0 ? "Request Intel" : showHint < mission.hints.length ? "Request More Intel" : "No More Intel"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Data Wall */}
        <div className="w-2/4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 flex flex-col overflow-hidden shadow-lg relative">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Data Wall</span>
              {resultShape && (
                <div className="flex gap-3 font-mono text-xs">
                  <span className="text-slate-500">SHAPE: <span className="text-cyan-400">({resultShape.join(', ')})</span></span>
                  <span className="text-slate-500">DTYPE: <span className="text-cyan-400">{resultType}</span></span>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
              {/* Grid background effect */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
              
              <div className="relative z-10">
                {resultData ? (
                  <ArrayVisualizer data={resultData} />
                ) : (
                  <div className="text-slate-600 font-mono text-sm flex flex-col items-center gap-4">
                    <ShieldAlert className="w-12 h-12 opacity-20" />
                    <span>AWAITING ARRAY DEPLOYMENT</span>
                  </div>
                )}
              </div>
            </div>

            {/* Validation Overlay */}
            {validation && (
              <div className={`absolute bottom-0 left-0 right-0 p-4 border-t backdrop-blur-md ${validation.passed ? 'bg-emerald-950/80 border-emerald-500/30' : 'bg-rose-950/80 border-rose-500/30'}`}>
                <div className="flex items-start gap-3">
                  {validation.passed ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-rose-400 shrink-0" />}
                  <div className="flex-1">
                    <h4 className={`font-bold ${validation.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {validation.passed ? 'MISSION ACCOMPLISHED' : 'VALIDATION FAILED'}
                    </h4>
                    <p className={`text-sm mt-1 ${validation.passed ? 'text-emerald-200/70' : 'text-rose-200/70'}`}>
                      {validation.message}
                    </p>
                  </div>
                  {validation.passed && currentMissionIndex < MISSIONS.length - 1 && (
                    <button 
                      onClick={() => setCurrentMissionIndex(i => Math.min(i + 1, MISSIONS.length - 1))}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2 transition-all"
                    >
                      NEXT <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {validation.passed && currentMissionIndex === MISSIONS.length - 1 && (
                    <button 
                      onClick={() => setShowCertificate(true)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2 transition-all"
                    >
                      <Award className="w-4 h-4" /> VIEW CERTIFICATE
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Console */}
        <div className="w-1/4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 flex flex-col overflow-hidden shadow-lg">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400">NumPy Console</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCode(mission.starter_code)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
                  title="Reset Code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleRun}
                  disabled={isRunning || isPyodideLoading}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 rounded text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isRunning ? 'RUNNING...' : 'EXECUTE'}
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <CodeEditor value={code} onChange={setCode} />
            </div>

            {/* Output Console */}
            <div className="h-1/3 border-t border-slate-800 bg-slate-950 flex flex-col">
              <div className="px-4 py-1.5 border-b border-slate-800 bg-slate-900/50">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Standard Output</span>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-400 whitespace-pre-wrap">
                {output || <span className="opacity-30">No output...</span>}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCertificate && <Certificate onClose={() => setShowCertificate(false)} />}
    </div>
  );
}
