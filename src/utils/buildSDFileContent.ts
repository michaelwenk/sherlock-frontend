import { ResultMolecule } from "../types/ResultMolecule";

const buildSDFileContent = (resultData: Array<ResultMolecule>) => {
  let content = '';
  resultData.forEach((res, i) => {
    content += res.molfile;
    content += '\n> <Rank> \n';
    content += `${i + 1}\n\n`;
    content += '> <RMSD_PPM> \n';
    content += `${res.meta.rmsd}\n\n`;
    content += '> <SMILES> \n';
    content += `${res.meta.smiles}\n\n`;
    content += '> <Molecular_Formula> \n';
    content += `${res.meta.mf}\n\n`;
    content += '$$$$\n';
  });

  return content;
};

export default buildSDFileContent;
