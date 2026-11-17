import type {
  ExperimentId,
  SampleScore,
  SolutionCategory,
} from '../types/chemistry';
import type { LabSample } from '../data/larutanData';

export const getExperimentRecordKey = (experimentId: ExperimentId, sampleId: string): string =>
  `${experimentId}:${sampleId}`;

export const scoreExperiment1 = (
  sample: LabSample,
  answer: {
    lamp: LabSample['expectedLamp'] | '';
    bubbles: LabSample['expectedBubbles'] | '';
    classification: SolutionCategory | '';
  },
): SampleScore => {
  const lamp = Number(answer.lamp === sample.expectedLamp);
  const bubbles = Number(answer.bubbles === sample.expectedBubbles);
  const classification = Number(answer.classification === sample.category);

  return {
    lamp,
    bubbles,
    classification,
    total: lamp + bubbles + classification,
    maximum: 3,
  };
};

export const scoreExperiment2 = (
  sample: LabSample,
  answer: {
    prediction: SolutionCategory | '';
    lamp: LabSample['expectedLamp'] | '';
    bubbles: LabSample['expectedBubbles'] | '';
  },
): SampleScore => {
  const prediction = Number(answer.prediction === sample.category);
  const lamp = Number(answer.lamp === sample.expectedLamp);
  const bubbles = Number(answer.bubbles === sample.expectedBubbles);

  return {
    prediction,
    lamp,
    bubbles,
    total: prediction + lamp + bubbles,
    maximum: 3,
  };
};
