import { Molecule } from 'openchemlib';
import DataSet from '../types/sherlock/dataSet/DataSet';

interface InputProps {
  dataSets: DataSet[];
}

function buildSDFileContent({ dataSets }: InputProps) {
  let content = '';
  dataSets.forEach((dataSet, i) => {
    const mol = Molecule.fromMolfile(dataSet.meta.molfile);
    mol.inventCoordinates();

    content += mol.toMolfile();
    content += '\n> <Rank> \n';
    content += `${i + 1}\n\n`;
    content += '> <RMSD_PPM> \n';
    content += `${dataSet.attachment.rmsd}\n\n`;
    content += '> <AVG_DEV_PPM> \n';
    content += `${dataSet.attachment.averageDeviation}\n\n`;
    content += '> <TANIMOTO> \n';
    content += `${dataSet.attachment.tanimoto}\n\n`;
    content += '> <HITS> \n';
    content += `${dataSet.attachment.setAssignmentsCount}/${dataSet.attachment.querySpectrumSignalCount}\n\n`;
    content += '> <SMILES> \n';
    content += `${dataSet.meta.smiles}\n\n`;
    content += '> <Molecular_Formula> \n';
    content += `${dataSet.meta.mfOriginal}\n\n`;
    content += '$$$$\n';
  });

  return content;
}

export default buildSDFileContent;
