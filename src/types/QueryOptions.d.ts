import DereplicationOptions from './sherlock/DereplicationOptions';
import DetectionOptions from './sherlock/DetectionOptions';
import ElucidationOptions from './sherlock/ElucidationOptions';
import RetrievalOptions from './sherlock/RetrievalOptions';

export default interface QueryOptions {
  queryType: string;
  dereplicationOptions: DereplicationOptions;
  elucidationOptions: ElucidationOptions;
  detectionOptions: DetectionOptions;
  retrievalOptions: RetrievalOptions;
  predictionOptions: PredictionOptions;
}
