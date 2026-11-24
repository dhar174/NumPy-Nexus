# NumPy Nexus

**NumPy Nexus** (`NEXUS ML_OPS`) is an interactive, browser-based educational game that teaches NumPy and array programming through hands-on data-ops missions. Python and NumPy execute entirely client-side in WebAssembly via [Pyodide](https://github.com/pyodide/pyodide/blob/master/README.md) — no local Python installation, backend server, or API key is required.

## Features

* **12 Progressive Missions**: Covers 1D/2D/3D array creation, boolean masking, vectorized broadcasting, reshaping, axis aggregations, strided slicing, descriptive statistics, matrix multiplication, and array concatenation.
* **In-Browser NumPy Console**: Code editor with 4-space `Tab` indentation, code reset, live execution, and captured `stdout`/`stderr` output.
* **Real-Time Data Wall**: Visualizes scalar outputs (numbers, strings, booleans, complex numbers) and 1D, 2D, and 3D NumPy arrays (up to 50 top-level elements) alongside live `SHAPE` and `DTYPE` readouts.
* **Progressive Hints & Automated Validation**: Each mission provides incremental hints ("Request Intel") and validates the user's `result` variable automatically.
* **Certificate of Completion**: Unlocks a downloadable PNG certificate (`nexus-ml-ops-certificate.png`) rendered via HTML5 Canvas once all 12 missions are completed.

## Mission Curriculum

| \# | ID | Title | Division | Tier | Concepts |
| --- | --- | --- | --- | --- | --- |
| 1 | `T1_M01` | System Initialization | Core Ops | 1 | `np.array()`, `shape` |
| 2 | `T1_M02` | Label Encoding | Model Training | 1 | `np.array()`, `string_dtype` |
| 3 | `T2_M01` | Anomaly Flagging | Fraud Detection | 2 | `boolean_mask`, `comparisons` |
| 4 | `T2_M03` | Fraud Burst Filter | Fraud Detection | 2 | `boolean_mask`, `indexing` |
| 5 | `T3_M01` | Sensor Grid Normalization | Smart Sensor Grid | 3 | `vectorized arithmetic`, `broadcasting` |
| 6 | `T3_M03` | Model Port Alignment | Vision Pipeline | 4 | `reshape` |
| 7 | `T3_M02` | KPI Stabilizer | Retail Analytics | 3 | `aggregation`, `axis` |
| 8 | `T4_M01` | Advanced Grid Extraction | Spatial Analysis | 3 | `slicing`, `2d_arrays`, `strides` |
| 9 | `T4_M02` | Volumetric Data Slicing | Spatial Analysis | 4 | `3d_arrays`, `reshape`, `multi_dimensional_slicing` |
| 10 | `T5_M01` | Statistical Summary | Data Science | 2 | `statistics`, `mean`, `median`, `min`, `max`, `std` |
| 11 | `T5_M02` | Neural Weights Calculation | Machine Learning | 3 | `matrix_multiplication`, `dot_product`, `@_operator` |
| 12 | `T5_M03` | Data Pipeline Merger | Data Engineering | 2 | `concatenation`, `axis`, `combining_arrays` |

## Tech Stack

* **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React
* **Python Runtime**: Pyodide `v0.25.0` (loaded in-browser via `index.html` and `src/pyodide.ts`)

> **Note on Environment Variables**: `.env.example` and `vite.config.ts` include `GEMINI_API_KEY` and `APP_URL` placeholders from the project template, but the application does not make any external API calls. You do not need to create a `.env` file or configure any API keys to run NumPy Nexus.

## Quick Start (Online)

### Prerequisites

* Node.js (v18 or later recommended) and npm

### Setup & Run

```bash
git clone https://github.com/dhar174/NumPy-Nexus.git
cd NumPy-Nexus
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. On first load, the app downloads the Pyodide runtime and NumPy package from jsDelivr before entering Mission 1.

## Running Offline

Out of the box, NumPy Nexus bundles all UI assets locally via Vite (React, Tailwind CSS, Lucide icons, inline SVG background, and Canvas certificate). Its **only** external runtime dependency is Pyodide `v0.25.0` and the NumPy WebAssembly wheel loaded from `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/` in `index.html` and `src/pyodide.ts`.

To run the app completely offline (for classrooms, workshops, or air-gapped environments), complete Steps 1 and 2 once while online, then run Step 3 offline.

### Step 1: Download Dependencies and Pyodide Locally (While Online)

First, install Node dependencies so `node_modules/` is cached locally:

```bash
npm install
```

Next, place the Pyodide `v0.25.0` runtime and NumPy wheel in `public/pyodide/`. Vite automatically serves `public/` during `npm run dev` and copies it into `dist/` during `npm run build`.

#### Option A: Minimal Download (Core Runtime + NumPy Only)

This fetches only the Pyodide `v0.25.0` core files, `pyodide-lock.json`, and `numpy` (plus any transitive dependencies declared in the lockfile):

```bash
mkdir -p public/pyodide
node -e '
const fs = require("fs");
const path = require("path");

const BASE = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/";
const OUT = path.join("public", "pyodide");
const CORE_FILES = [
  "pyodide.js",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json"
];

async function download(file) {
  const res = await fetch(BASE + file);
  if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.status}`);
  fs.writeFileSync(path.join(OUT, file), Buffer.from(await res.arrayBuffer()));
  console.log("Downloaded", file);
}

(async () => {
  for (const file of CORE_FILES) await download(file);
  const lock = JSON.parse(fs.readFileSync(path.join(OUT, "pyodide-lock.json"), "utf8"));
  const visited = new Set();
  const queue = ["numpy"];
  while (queue.length) {
    const pkg = queue.shift();
    if (visited.has(pkg) || !lock.packages[pkg]) continue;
    visited.add(pkg);
    await download(lock.packages[pkg].file_name);
    for (const dep of lock.packages[pkg].depends || []) queue.push(dep);
  }
})();
'
```

#### Option B: Full Pyodide Release Archive

Download the `0.25.0` release archive from the [Pyodide GitHub Releases](https://github.com/pyodide/pyodide/blob/master/README.md) page and extract its contents into `public/pyodide/` so that `public/pyodide/pyodide.js`, `pyodide.asm.wasm`, `python_stdlib.zip`, `pyodide-lock.json`, and the NumPy wheel live directly inside `public/pyodide/`.

> **Why not reuse `node_modules/pyodide`?** The `pyodide` devDependency in `package.json` (`^0.29.3`) is only used by the Node smoke-test scripts (`test_pyodide.cjs` and `test_pyodide2.cjs`) and ships the core interpreter without pre-bundled scientific wheels like NumPy.

### Step 2: Point the App to Local `/pyodide/`

Update the script tag in `index.html`:

```html
<!-- Replace the CDN script tag with: -->
<script src="/pyodide/pyodide.js"></script>
```

Update `indexURL` in `src/pyodide.ts`:

```ts
pyodideInstance = await window.loadPyodide({
  indexURL: "/pyodide/"
});
```

### Step 3: Build and Run Offline

You can now disconnect from the internet and run NumPy Nexus in either mode:

* **Development server**:

  ```bash
  npm run dev
  ```

  Then open `http://localhost:3000`.

* **Portable static production build** (can be copied to another offline machine without `node_modules/`):

  ```bash
  npm run build
  npm run preview
  ```

  Or serve the generated `dist/` folder with any static HTTP server, for example:

  ```bash
  python3 -m http.server 8000 --directory dist
  ```

> **Important**: Always serve `dist/` over `http://localhost` rather than opening `dist/index.html` directly via `file://`. Browsers block ES module imports and WebAssembly `fetch()` requests over the `file://` protocol.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on `0.0.0.0:3000` |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type-checking (`tsc --noEmit`) |
| `npm run clean` | Remove the `dist/` build directory |

Two standalone Node.js scripts (`test_pyodide.cjs` and `test_pyodide2.cjs`) are also included for testing Pyodide + NumPy type conversion outside the browser (`node test_pyodide2.cjs`).

## Project Structure

```text
NumPy-Nexus/
├── index.html                  # HTML entry point & Pyodide script loader
├── metadata.json               # App metadata
├── package.json                # Dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite + React + Tailwind v4 configuration
├── test_pyodide.cjs            # Node Pyodide/NumPy smoke test
├── test_pyodide2.cjs           # Node Pyodide conversion helper test
└── src/
    ├── main.tsx                # React root mount
    ├── index.css               # Tailwind CSS v4 entry
    ├── App.tsx                 # Main layout, CodeEditor, and ArrayVisualizer (Data Wall)
    ├── pyodide.ts              # Pyodide initialization, code execution, and NumPy conversion
    ├── missions.ts             # Mission definitions, starter code, hints, and validators
    └── components/
        └── Certificate.tsx     # HTML5 Canvas completion certificate & PNG export
```

## Adding Custom Missions

Missions are defined as an array of `Mission` objects in `src/missions.ts`. To add a mission, append an object matching the `Mission` interface:

```ts
export interface Mission {
  id: string;
  title: string;
  division: string;
  difficulty: number;
  concepts: string[];
  description: string;
  task: string;
  starter_code: string;
  hints: string[];
  validate: (res: any) => { passed: boolean; message: string };
}
```

When a user clicks **EXECUTE**, `src/pyodide.ts` runs the code and inspects the Python variable named `result`, passing `{ success, stdout, resultData, resultShape, resultType }` to your mission's `validate(res)` function.
