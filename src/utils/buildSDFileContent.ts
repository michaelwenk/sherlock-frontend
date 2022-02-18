import DataSet from '../types/sherlock/DataSet';
interface InputProps {
  dataSets: DataSet[];
}

function buildSDFileContent({ dataSets }: InputProps) {
  let content = '';
  dataSets.forEach((dataSet, i) => {
    content += dataSet.meta.molfile;
    content += '\n> <Rank> \n';
    content += `${i + 1}\n\n`;
    content += '> <RMSD_PPM> \n';
    content += `${dataSet.meta.rmsd}\n\n`;
    content += '> <AVG_DEV_PPM> \n';
    content += `${dataSet.meta.averageDeviation}\n\n`;
    content += '> <SMILES> \n';
    content += `${dataSet.meta.smiles}\n\n`;
    content += '> <Molecular_Formula> \n';
    content += `${dataSet.meta.mfOriginal}\n\n`;
    content += '$$$$\n';
  });

  return content;
}

export default buildSDFileContent;
