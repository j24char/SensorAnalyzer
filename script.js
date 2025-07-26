function analyzeTimeSeries(data) {
  const values = data.map(d => d.value).filter(v => !isNaN(v));
  const timestamps = data.map((point) => Number(point.timestamp));

  const timeDiffs = [];
  for (let i = 1; i < timestamps.length; i++) {
    timeDiffs.push(timestamps[i] - timestamps[i - 1]); 
  }

  const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
  const stdDevTimeDiff = Math.sqrt(
    timeDiffs.reduce((sum, val) => sum + Math.pow(val - avgTimeDiff, 2), 0) / timeDiffs.length
  );

  // let mean = null;
  // let std = null;

  // if (timeDiffs.length > 0) {
  //   mean = timeDiffs.reduce((sum, t) => sum + t, 0) / timeDiffs.length;

  //   stdDev = Math.sqrt(
  //     timeDiffs.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / timeDiffs.length
  //   );
  // }
  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = arr => {
   const mu = mean(arr);
   return Math.sqrt(mean(arr.map(v => (v - mu) ** 2)));
  };
  
  const uniqueValues = new Set(values);
  //const duplicateTimestamps = timestamps.length !== new Set(timestamps.map(t => t.getTime())).size;

  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues.length % 2 === 0 ?
    (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2 :
    sortedValues[Math.floor(sortedValues.length / 2)];

  const maxFreq = dominantFrequency(values);
  const peaks = countPeaks(values);

  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    mean: mean(values),
    median,
    stdDev: std(values),
    valueRange: Math.max(...values) - Math.min(...values),
    uniqueValues: uniqueValues.size,
    timeSpanSeconds: (timestamps.at(-1) - timestamps[0]),
    avgIntervalSeconds: mean(timeDiffs),
    intervalStdDevSeconds: std(timeDiffs),
    //hasDuplicateTimestamps: duplicateTimestamps,
    numberOfGaps: countGaps(timeDiffs),
    dominantFrequency: maxFreq,
    numberOfPeaks: peaks,
    volatility: std(rollingStd(values, 5)),
  };
}

function countPeaks(arr) {
  let count = 0;
  for (let i = 1; i < arr.length - 1; i++) {
    if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) count++;
  }
  return count;
}

function countGaps(deltas, threshold = 5) {
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return deltas.filter(dt => dt > avg * threshold).length;
}

function rollingStd(arr, windowSize) {
  const out = [];
  for (let i = 0; i < arr.length - windowSize; i++) {
    const window = arr.slice(i, i + windowSize);
    const mean = window.reduce((a, b) => a + b) / window.length;
    const variance = window.reduce((sum, val) => sum + (val - mean) ** 2, 0) / window.length;
    out.push(Math.sqrt(variance));
  }
  return out;
}

function dominantFrequency(values) {
  const N = values.length;
  if (N < 2) return null;

  const re = [...values];
  const im = Array(N).fill(0);

  // Simple DFT
  const powerSpectrum = Array(N).fill(0);
  for (let k = 0; k < N / 2; k++) {
    let sumRe = 0;
    let sumIm = 0;
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      sumRe += values[n] * Math.cos(angle);
      sumIm -= values[n] * Math.sin(angle);
    }
    powerSpectrum[k] = Math.sqrt(sumRe ** 2 + sumIm ** 2);
  }
  const maxPower = Math.max(...powerSpectrum);
  const peakIndex = powerSpectrum.indexOf(maxPower);
  return peakIndex;
}
