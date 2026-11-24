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

export const MISSIONS: Mission[] = [
  {
    id: "T1_M01",
    title: "System Initialization",
    division: "Core Ops",
    difficulty: 1,
    concepts: ["np.array()", "shape"],
    description: "Welcome to NEXUS Command. Our primary data pipeline is offline. We need to initialize a basic calibration array to reboot the system.",
    task: "Create a 1D NumPy array containing the values 1, 2, 3, 4, 5 and assign it to the variable `result`.",
    starter_code: "import numpy as np\n\n# Create your array here\nresult = ",
    hints: [
      "Use the `np.array()` function.",
      "Pass a Python list `[1, 2, 3, 4, 5]` to the function."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (JSON.stringify(res.resultData) === JSON.stringify([1, 2, 3, 4, 5])) {
        return { passed: true, message: "Calibration array initialized successfully." };
      }
      return { passed: false, message: `Expected [1, 2, 3, 4, 5], got ${JSON.stringify(res.resultData)}` };
    }
  },
  {
    id: "T1_M02",
    title: "Label Encoding",
    division: "Model Training",
    difficulty: 1,
    concepts: ["np.array()", "string_dtype"],
    description: "Our classification model needs text labels to map its outputs to human-readable categories.",
    task: "Create a 1D NumPy array containing the strings 'cat', 'dog', and 'bird'. Assign it to `result`.",
    starter_code: "import numpy as np\n\n# Create string array\nresult = ",
    hints: [
      "Pass a list of strings to `np.array()`.",
      "Example: `np.array(['a', 'b', 'c'])`"
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      try {
        if (JSON.stringify(res.resultData) === JSON.stringify(['cat', 'dog', 'bird'])) {
          return { passed: true, message: "String labels initialized." };
        }
      } catch (e) {}
      return { passed: false, message: "Output does not match expected labels." };
    }
  },
  {
    id: "T2_M01",
    title: "Anomaly Flagging",
    division: "Fraud Detection",
    difficulty: 2,
    concepts: ["boolean_mask", "comparisons"],
    description: "Before extracting anomalous transactions, we need to generate a boolean mask that flags them. A mask is an array of True/False values.",
    task: "Create a boolean array where transactions strictly greater than 900 are True, and others are False. Assign it to `result`.",
    starter_code: "import numpy as np\n\ntransactions = np.array([450, 1020, 300, 980, 1200, 150, 950])\nthreshold = 900\n\n# Create boolean mask\nresult = ",
    hints: [
      "Use a comparison operator like `>` directly on the array.",
      "`transactions > threshold` will return a boolean array."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      try {
        if (JSON.stringify(res.resultData) === JSON.stringify([false, true, false, true, true, false, true])) {
          return { passed: true, message: "Boolean mask generated successfully." };
        }
      } catch (e) {}
      return { passed: false, message: "Output does not match expected boolean mask." };
    }
  },
  {
    id: "T2_M03",
    title: "Fraud Burst Filter",
    division: "Fraud Detection",
    difficulty: 2,
    concepts: ["boolean_mask", "indexing"],
    description: "We are receiving a burst of transaction data. Some of these are anomalously high and likely fraudulent. Flag and extract all transactions above the fraud threshold.",
    task: "Given the `transactions` array, create an array containing only transactions strictly greater than 900. Assign it to `result`.",
    starter_code: "import numpy as np\n\ntransactions = np.array([450, 1020, 300, 980, 1200, 150, 950])\nthreshold = 900\n\n# Extract anomalous transactions\nresult = ",
    hints: [
      "Use a comparison like `transactions > threshold` to create a boolean mask.",
      "Index the array using that mask: `transactions[mask]`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      try {
        const mapped = res.resultData.map((x: any) => typeof x === 'bigint' ? Number(x) : x);
        if (JSON.stringify(mapped) === JSON.stringify([1020, 980, 1200, 950])) {
          return { passed: true, message: "Anomalies isolated successfully." };
        }
      } catch (e) {}
      return { passed: false, message: "Output does not match expected anomalous transactions." };
    }
  },
  {
    id: "T3_M01",
    title: "Sensor Grid Normalization",
    division: "Smart Sensor Grid",
    difficulty: 3,
    concepts: ["vectorized arithmetic", "broadcasting"],
    description: "A 3x3 sensor grid is reporting raw voltage. We need to normalize these values by subtracting the baseline voltage from every sensor simultaneously.",
    task: "Subtract the `baseline` from the `sensor_grid` and assign the output to `result`.",
    starter_code: "import numpy as np\n\nsensor_grid = np.array([\n    [5.2, 5.1, 5.4],\n    [4.9, 5.0, 5.2],\n    [5.5, 5.3, 5.1]\n])\nbaseline = 5.0\n\n# Normalize the grid\nresult = ",
    hints: [
      "NumPy allows you to subtract a scalar directly from an array.",
      "Just use `sensor_grid - baseline`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      try {
        const flat = res.resultData.flat();
        const expected = [0.2, 0.1, 0.4, -0.1, 0.0, 0.2, 0.5, 0.3, 0.1];
        const isClose = flat.every((v: any, i: number) => Math.abs(Number(v) - expected[i]) < 0.01);
        if (isClose) return { passed: true, message: "Grid normalized." };
        return { passed: false, message: "Values are incorrect." };
      } catch (e) {
        return { passed: false, message: "Result must be a 2D array." };
      }
    }
  },
  {
    id: "T3_M03",
    title: "Model Port Alignment",
    division: "Vision Pipeline",
    difficulty: 4,
    concepts: ["reshape"],
    description: "Our image classification model expects a 2D matrix, but the incoming image data is flattened into a 1D array of 16 pixels. Reshape it into a 4x4 grid.",
    task: "Reshape the `flat_image` array into a 4x4 array and assign it to `result`.",
    starter_code: "import numpy as np\n\nflat_image = np.arange(16)\n\n# Reshape into 4x4\nresult = ",
    hints: [
      "Use the `.reshape()` method on the array.",
      "Pass the new shape as a tuple: `(4, 4)`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (res.resultShape && res.resultShape[0] === 4 && res.resultShape[1] === 4) {
        try {
          const flat = res.resultData.flat();
          if (flat.length === 16 && flat[0] === 0 && flat[15] === 15) {
            return { passed: true, message: "Image reshaped successfully." };
          }
        } catch (e) {}
      }
      return { passed: false, message: `Expected shape (4, 4) with original data, got shape ${res.resultShape}` };
    }
  },
  {
    id: "T3_M02",
    title: "KPI Stabilizer",
    division: "Retail Analytics",
    difficulty: 3,
    concepts: ["aggregation", "axis"],
    description: "We need to compute the average performance for each region across 4 quarters. The data is a 3x4 matrix (3 regions, 4 quarters).",
    task: "Compute the mean across the columns (quarters) for each row (region). Assign the resulting 1D array to `result`.",
    starter_code: "import numpy as np\n\nsales_data = np.array([\n    [100, 120, 110, 130], # Region 1\n    [80, 90, 85, 95],     # Region 2\n    [200, 210, 190, 220]  # Region 3\n])\n\n# Compute mean per region (row)\nresult = ",
    hints: [
      "Use `np.mean()` or the `.mean()` method.",
      "To average across columns for each row, use `axis=1`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (res.resultShape && res.resultShape.length === 1 && res.resultShape[0] === 3) {
        try {
          const expected = [115, 87.5, 205];
          const isClose = res.resultData.every((v: any, i: number) => Math.abs(Number(v) - expected[i]) < 0.01);
          if (isClose) return { passed: true, message: "KPIs computed correctly." };
        } catch (e) {}
      }
      return { passed: false, message: "Check your axis parameter. Expected 3 averages." };
    }
  },
  {
    id: "T4_M01",
    title: "Advanced Grid Extraction",
    division: "Spatial Analysis",
    difficulty: 3,
    concepts: ["slicing", "2d_arrays", "strides"],
    description: "We have a 5x5 sensor grid. We need to extract a specific sub-grid for analysis: every second sensor starting from the first row and second column.",
    task: "Given a 5x5 array `grid`, extract a sub-array containing every 2nd row (starting from index 0) and every 2nd column (starting from index 1). Assign it to `result`.",
    starter_code: "import numpy as np\n\ngrid = np.arange(25).reshape(5, 5)\n\n# Extract every 2nd row (start 0) and every 2nd col (start 1)\nresult = ",
    hints: [
      "Remember slicing syntax: `start:stop:step`.",
      "For rows, you want `0::2` (or just `::2`).",
      "For columns, you want `1::2`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (res.resultShape && res.resultShape.length === 2 && res.resultShape[0] === 3 && res.resultShape[1] === 2) {
        try {
          const expected = [[1, 3], [11, 13], [21, 23]];
          let isCorrect = true;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
              if (Number(res.resultData[i][j]) !== expected[i][j]) isCorrect = false;
            }
          }
          if (isCorrect) return { passed: true, message: "Sub-grid extracted correctly!" };
        } catch (e) {}
      }
      return { passed: false, message: "Check your slicing indices and steps. Expected shape (3, 2)." };
    }
  },
  {
    id: "T4_M02",
    title: "Volumetric Data Slicing",
    division: "Spatial Analysis",
    difficulty: 4,
    concepts: ["3d_arrays", "reshape", "multi_dimensional_slicing"],
    description: "Our new atmospheric sensors return 3D volumetric data (depth, rows, columns). We need to isolate the second depth layer for 2D analysis.",
    task: "Create a 3D array of shape (2, 3, 4) containing numbers from 0 to 23. Then, extract the entire second depth layer (index 1) and assign this 2D slice to `result`.",
    starter_code: "import numpy as np\n\n# 1. Create a 3D array of shape (2, 3, 4) with values 0 to 23\nvolume = \n\n# 2. Extract the second depth layer (index 1)\nresult = ",
    hints: [
      "Use `np.arange(24)` and `.reshape(2, 3, 4)` to create the volume.",
      "To get the second depth layer, index the first dimension with `1`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (res.resultShape && res.resultShape.length === 2 && res.resultShape[0] === 3 && res.resultShape[1] === 4) {
        try {
          const expected = [
            [12, 13, 14, 15],
            [16, 17, 18, 19],
            [20, 21, 22, 23]
          ];
          let isCorrect = true;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
              if (Number(res.resultData[i][j]) !== expected[i][j]) isCorrect = false;
            }
          }
          if (isCorrect) return { passed: true, message: "3D layer extracted correctly!" };
        } catch (e) {}
      }
      return { passed: false, message: "Check your volume creation and slicing. Expected a 2D array of shape (3, 4)." };
    }
  },
  {
    id: "T5_M01",
    title: "Statistical Summary",
    division: "Data Science",
    difficulty: 2,
    concepts: ["statistics", "mean", "median", "min", "max", "std"],
    description: "To understand the distribution of our daily user engagement scores, we need to compute some basic statistics.",
    task: "Given a 1D array of `scores`, compute the mean, median, minimum, maximum, and standard deviation. Store these 5 values in a list (or array) and assign it to `result` in that exact order.",
    starter_code: "import numpy as np\n\nscores = np.array([85, 92, 78, 90, 88, 76, 95, 89, 82, 91])\n\n# Calculate statistics\nmean_val = \nmedian_val = \nmin_val = \nmax_val = \nstd_val = \n\n# Store in a list\nresult = [mean_val, median_val, min_val, max_val, std_val]",
    hints: [
      "Use `np.mean()`, `np.median()`, `np.min()`, `np.max()`, and `np.std()`.",
      "You can pass the `scores` array to each of these functions."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (Array.isArray(res.resultData) && res.resultData.length === 5) {
        try {
          // scores = [85, 92, 78, 90, 88, 76, 95, 89, 82, 91]
          // mean = 86.6
          // median = 88.5
          // min = 76
          // max = 95
          // std = 5.919459434779536
          const expected = [86.6, 88.5, 76, 95, 5.9];
          let isCorrect = true;
          for (let i = 0; i < 5; i++) {
            if (Math.abs(Number(res.resultData[i]) - expected[i]) > 0.01) isCorrect = false;
          }
          if (isCorrect) return { passed: true, message: "Statistics computed correctly!" };
        } catch (e) {}
      }
      return { passed: false, message: "Check your calculations. Expected a list of 5 values: [mean, median, min, max, std]." };
    }
  },
  {
    id: "T5_M02",
    title: "Neural Weights Calculation",
    division: "Machine Learning",
    difficulty: 3,
    concepts: ["matrix_multiplication", "dot_product", "@_operator"],
    description: "In machine learning, transforming data often requires matrix multiplication. We have a set of input features and a weight matrix that need to be multiplied.",
    task: "Multiply the `inputs` matrix (shape 2x3) by the `weights` matrix (shape 3x2) using `np.dot()` or the `@` operator. Assign the resulting 2x2 matrix to `result`.",
    starter_code: "import numpy as np\n\ninputs = np.array([\n    [1, 2, 3],\n    [4, 5, 6]\n])\n\nweights = np.array([\n    [7, 8],\n    [9, 10],\n    [11, 12]\n])\n\n# Multiply inputs by weights\nresult = ",
    hints: [
      "You can use the `np.dot(inputs, weights)` function.",
      "Alternatively, use the matrix multiplication operator: `inputs @ weights`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (res.resultShape && res.resultShape.length === 2 && res.resultShape[0] === 2 && res.resultShape[1] === 2) {
        try {
          const expected = [
            [58, 64],
            [139, 154]
          ];
          let isCorrect = true;
          for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
              if (Number(res.resultData[i][j]) !== expected[i][j]) isCorrect = false;
            }
          }
          if (isCorrect) return { passed: true, message: "Matrix multiplication successful!" };
        } catch (e) {}
      }
      return { passed: false, message: "Check your matrix multiplication. Expected a 2x2 array." };
    }
  },
  {
    id: "T5_M03",
    title: "Data Pipeline Merger",
    division: "Data Engineering",
    difficulty: 2,
    concepts: ["concatenation", "axis", "combining_arrays"],
    description: "We have received two separate batches of sensor readings that need to be combined into a single dataset for processing.",
    task: "Given two 2D arrays, `batch1` and `batch2` (both shape 2x3), concatenate them vertically (along axis 0) to create a single 4x3 array. Assign it to `result`.",
    starter_code: "import numpy as np\n\nbatch1 = np.array([\n    [10, 15, 20],\n    [25, 30, 35]\n])\n\nbatch2 = np.array([\n    [40, 45, 50],\n    [55, 60, 65]\n])\n\n# Concatenate batch1 and batch2 vertically (axis=0)\nresult = ",
    hints: [
      "Use `np.concatenate((array1, array2), axis=0)`.",
      "Make sure to pass the arrays as a tuple or list: `(batch1, batch2)`."
    ],
    validate: (res: any) => {
      if (!res.resultData) return { passed: false, message: "Variable 'result' not found." };
      if (res.resultShape && res.resultShape.length === 2 && res.resultShape[0] === 4 && res.resultShape[1] === 3) {
        try {
          const expected = [
            [10, 15, 20],
            [25, 30, 35],
            [40, 45, 50],
            [55, 60, 65]
          ];
          let isCorrect = true;
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
              if (Number(res.resultData[i][j]) !== expected[i][j]) isCorrect = false;
            }
          }
          if (isCorrect) return { passed: true, message: "Arrays concatenated successfully!" };
        } catch (e) {}
      }
      return { passed: false, message: "Check your concatenation. Expected a 4x3 array." };
    }
  }
];
