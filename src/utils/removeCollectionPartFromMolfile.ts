import { Molecule } from 'openchemlib';

export default function removeCollectionPartFromMolfile(
  molfile: string,
): string {
  const str = molfile;
  const beginCollection = '\nM  V30 BEGIN COLLECTION';
  const endCollection = '\nM  V30 END COLLECTION';
  const splitBegin = str.split(beginCollection)[0];
  const splitEnd = str.split(endCollection)[1];
  const str2 = splitBegin + splitEnd;

  const mol = Molecule.fromMolfile(str2);

  return mol.toMolfileV3();
}
