import { Molecule } from 'openchemlib';
import { ResultMolecule } from '../types/ResultMolecule';
interface InputProps {
  resultMolecules: ResultMolecule[];
}

function buildSDFileContent({ resultMolecules }: InputProps) {
  let content = '';
  resultMolecules.forEach((res, i) => {
    const molfile = Molecule.fromSmiles(res.dataSet.meta.smiles).toMolfileV3();

    content += molfile;
    content += '\n> <Rank> \n';
    content += `${i + 1}\n\n`;
    content += '> <RMSD_PPM> \n';
    content += `${res.dataSet.meta.rmsd}\n\n`;
    content += '> <AVG_DEV_PPM> \n';
    content += `${res.dataSet.meta.averageDeviation}\n\n`;
    content += '> <SMILES> \n';
    content += `${res.dataSet.meta.smiles}\n\n`;
    content += '> <Molecular_Formula> \n';
    content += `${res.dataSet.meta.mf}\n\n`;
    content += '$$$$\n';
  });

  return content;
}

export default buildSDFileContent;
