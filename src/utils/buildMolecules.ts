import ResultRecord from '../types/sherlock/ResultRecord';
import { Molecule } from 'openchemlib';

export default function buildMolecules(resultRecord: ResultRecord | undefined) {
  return resultRecord && resultRecord.dataSetList
    ? resultRecord.dataSetList.map((dataSet) => {
        const molecule: Molecule = Molecule.fromSmiles(dataSet.meta.smiles);
        return {
          // molfile: molecule.toMolfileV3(),
          dataSet: {
            ...dataSet,
            meta: {
              ...dataSet.meta,
              querySpectrumSignalCount: Number(
                dataSet.meta.querySpectrumSignalCount,
              ),
              querySpectrumSignalCountWithEquivalences: Number(
                dataSet.meta.querySpectrumSignalCountWithEquivalences,
              ),
              isCompleteSpectralMatch:
                String(dataSet.meta.isCompleteSpectralMatch) === 'true',
              isCompleteSpectralMatchWithEquivalences:
                String(dataSet.meta.isCompleteSpectralMatchWithEquivalences) ===
                'true',
              rmsd: Number(dataSet.meta.rmsd),
              averageDeviation: Number(dataSet.meta.averageDeviation),
              tanimoto: Number(dataSet.meta.tanimoto),
              setAssignmentsCount: Number(dataSet.meta.setAssignmentsCount),
              setAssignmentsCountWithEquivalences: Number(
                dataSet.meta.setAssignmentsCountWithEquivalences,
              ),
            },
          },
        };
      })
    : [];
}
