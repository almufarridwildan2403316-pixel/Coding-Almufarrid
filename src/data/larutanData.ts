import larutanDocument from './larutan.md?raw';
import type { BubbleStatus, ExperimentId, LampStatus, Solution, SolutionCategory } from '../types/chemistry';

interface DatasetSample {
  id: string;
  nama: string;
  rumus: string;
  kategori_acuan: 'elektrolit_kuat' | 'elektrolit_lemah' | 'nonelektrolit';
  kondisi_acuan: string;
  nyala_lampu_benar: 'terang' | 'redup' | 'mati';
  gelembung_benar: 'banyak' | 'sedikit' | 'tidak_ada';
  persamaan_reaksi: string;
  alasan: string;
  catatan_keselamatan_batasan: string;
}

export interface LabSample extends Solution {
  experimentId: ExperimentId;
  condition: string;
  safetyNote: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isDatasetSample = (value: unknown): value is DatasetSample => {
  if (!isObject(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.nama === 'string' &&
    typeof value.rumus === 'string' &&
    (value.kategori_acuan === 'elektrolit_kuat' ||
      value.kategori_acuan === 'elektrolit_lemah' ||
      value.kategori_acuan === 'nonelektrolit') &&
    typeof value.kondisi_acuan === 'string' &&
    (value.nyala_lampu_benar === 'terang' ||
      value.nyala_lampu_benar === 'redup' ||
      value.nyala_lampu_benar === 'mati') &&
    (value.gelembung_benar === 'banyak' ||
      value.gelembung_benar === 'sedikit' ||
      value.gelembung_benar === 'tidak_ada') &&
    typeof value.persamaan_reaksi === 'string' &&
    typeof value.alasan === 'string' &&
    typeof value.catatan_keselamatan_batasan === 'string'
  );
};

const parseDatasetBlock = (value: string): unknown => {
  const parsed: unknown = JSON.parse(value);
  return parsed;
};

// The supplied document contains Markdown plus fenced JSON datasets, but also accepts a normalized JSON file.
const datasetBlocks = larutanDocument.trimStart().startsWith('{')
  ? [parseDatasetBlock(larutanDocument)]
  : Array.from(
    larutanDocument.matchAll(/```json\s*([\s\S]*?)```/g),
    (match) => parseDatasetBlock(match[1]),
  );

const getExperimentSamples = (key: 'percobaan_1' | 'percobaan_2'): DatasetSample[] => {
  const block = datasetBlocks.find((entry) => isObject(entry) && Array.isArray(entry[key]));
  if (!isObject(block) || !Array.isArray(block[key]) || !block[key].every(isDatasetSample)) {
    throw new Error(`Dataset ${key} tidak tersedia atau format sampelnya tidak valid.`);
  }
  return block[key];
};

const categoryMap: Record<DatasetSample['kategori_acuan'], SolutionCategory> = {
  elektrolit_kuat: 'strong_electrolyte',
  elektrolit_lemah: 'weak_electrolyte',
  nonelektrolit: 'nonelectrolyte',
};

const lampMap: Record<DatasetSample['nyala_lampu_benar'], LampStatus> = {
  terang: 'bright',
  redup: 'dim',
  mati: 'off',
};

const bubbleMap: Record<DatasetSample['gelembung_benar'], BubbleStatus> = {
  banyak: 'visible',
  sedikit: 'possible',
  tidak_ada: 'not_expected',
};

const categoryLabels: Record<SolutionCategory, string> = {
  strong_electrolyte: 'Elektrolit Kuat',
  weak_electrolyte: 'Elektrolit Lemah',
  nonelectrolyte: 'Nonelektrolit',
};

const colors: Record<SolutionCategory, { liquid: string; accent: string }> = {
  strong_electrolyte: { liquid: 'rgba(56, 189, 248, 0.22)', accent: '#0284c7' },
  weak_electrolyte: { liquid: 'rgba(245, 158, 11, 0.2)', accent: '#d97706' },
  nonelectrolyte: { liquid: 'rgba(148, 163, 184, 0.18)', accent: '#64748b' },
};

const toLabSample = (sample: DatasetSample, experimentId: ExperimentId): LabSample => {
  const category = categoryMap[sample.kategori_acuan];
  const color = colors[category];

  return {
    id: sample.id,
    name: sample.nama,
    formula: sample.rumus,
    category,
    categoryLabel: categoryLabels[category],
    expectedLamp: lampMap[sample.nyala_lampu_benar],
    expectedBubbles: bubbleMap[sample.gelembung_benar],
    degreeOfIonization: sample.alasan,
    particleModel: sample.alasan,
    equation: sample.persamaan_reaksi,
    ions: { positive: 'ion (+)', negative: 'ion (−)', neutral: 'molekul netral' },
    liquidColor: color.liquid,
    accentColor: color.accent,
    description: sample.alasan,
    explanation: sample.alasan,
    experimentId,
    condition: sample.kondisi_acuan,
    safetyNote: sample.catatan_keselamatan_batasan,
  };
};

const experiment1Data = getExperimentSamples('percobaan_1');
const experiment2Data = getExperimentSamples('percobaan_2');
const allIds = [...experiment1Data, ...experiment2Data].map((sample) => sample.id);

if (new Set(allIds).size !== allIds.length) {
  throw new Error('ID sampel pada dataset larutan harus unik di kedua percobaan.');
}
if (experiment1Data.length !== 30 || experiment2Data.length !== 9) {
  throw new Error('Dataset harus memuat 30 sampel Percobaan 1 dan 9 sampel Percobaan 2.');
}
const categoryCounts = experiment1Data.reduce<Record<DatasetSample['kategori_acuan'], number>>(
  (counts, sample) => {
    counts[sample.kategori_acuan] += 1;
    return counts;
  },
  { elektrolit_kuat: 0, elektrolit_lemah: 0, nonelektrolit: 0 },
);
if (Object.values(categoryCounts).some((count) => count !== 10)) {
  throw new Error('Percobaan 1 harus memiliki tepat 10 sampel untuk setiap kategori elektrolit.');
}

export const EXPERIMENT_SAMPLES: Record<ExperimentId, LabSample[]> = {
  percobaan_1: experiment1Data.map((sample) => toLabSample(sample, 'percobaan_1')),
  percobaan_2: experiment2Data.map((sample) => toLabSample(sample, 'percobaan_2')),
};

export const getExperimentSample = (experimentId: ExperimentId, sampleId: string): LabSample | undefined =>
  EXPERIMENT_SAMPLES[experimentId].find((sample) => sample.id === sampleId);
