import './ResultsView.scss';

import { useCallback, useMemo, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';
import ResultCard from '../resultCard/ResultCard';
import { ResultMolecule } from '../../../../../types/ResultMolecule';
import SelectBox from '../../../../elements/SelectBox';
import sortOptions from '../../../../../constants/sortOptions';
import ResultsInfo from '../../resultsInfo/ResultsInfo';

interface ImageSize {
  width: number;
  height: number;
}

const imageSizes: ImageSize[] = [
  { width: 150, height: 150 },
  { width: 200, height: 200 },
  { width: 250, height: 250 },
  { width: 300, height: 300 },
];

type InputProps = {
  molecules: Array<ResultMolecule>;
  maxPages: number;
  pageLimits: number[];
  onClickDownload: Function;
  onClickDelete: Function;
};

function ResultsView({
  molecules,
  maxPages,
  pageLimits,
  onClickDownload,
  onClickDelete,
}: InputProps) {
  const [selectedCardDeckIndex, setSelectedCardDeckIndex] = useState<number>(0);
  const [selectedPageLimit, setSelectedPageLimit] = useState<number>(
    pageLimits[1],
  );
  const [sortByLabel, setSortByLabel] = useState<string>(
    sortOptions.averageDeviation.label,
  );
  const [selectedImageSize, setSelectedImageSize] = useState<ImageSize>(
    imageSizes[0],
  );

  const handleOnSelectCardIndex = useCallback((index: number) => {
    setSelectedCardDeckIndex(index);
  }, []);

  const sortedMolecules = useMemo(() => {
    const sortByValue = Object.keys(sortOptions).filter(
      (sortOption) => sortOptions[sortOption].label === sortByLabel,
    )[0];
    function sort(mol1: ResultMolecule, mol2: ResultMolecule) {
      if (sortByValue === sortOptions.tanimoto.value) {
        return mol1.dataSet.meta[sortByValue] >= mol2.dataSet.meta[sortByValue]
          ? -1
          : 1;
      } else {
        return mol1.dataSet.meta[sortByValue] <= mol2.dataSet.meta[sortByValue]
          ? -1
          : 1;
      }
    }
    const _sortedMolecules = molecules.slice();
    _sortedMolecules.sort(sort);

    return _sortedMolecules;
  }, [molecules, sortByLabel]);

  const cardDeckData = useMemo(() => {
    const _cardDeckData: ResultMolecule[][] = [];
    let counter = 0;
    let resultMolecules: ResultMolecule[] = [];

    for (let i = 0; i < sortedMolecules.length; i++) {
      if (counter < selectedPageLimit) {
        counter++;
        resultMolecules.push(sortedMolecules[i]);
      } else {
        _cardDeckData.push(resultMolecules);
        resultMolecules = [sortedMolecules[i]];
        counter = 1;
      }
    }
    if (resultMolecules.length > 0) {
      _cardDeckData.push(resultMolecules);
    }

    return _cardDeckData;
  }, [selectedPageLimit, sortedMolecules]);

  const cardDecks = useMemo(() => {
    let cardDeckIndex = selectedCardDeckIndex;
    if (cardDeckIndex >= cardDeckData.length) {
      cardDeckIndex = 0;
      setSelectedCardDeckIndex(cardDeckIndex);
    }

    return cardDeckData.length > 0
      ? cardDeckData[cardDeckIndex].map((mol, i) => (
          <ResultCard
            key={`resultCard${i}`}
            id={cardDeckIndex * selectedPageLimit + i + 1}
            molecule={mol}
            imageWidth={selectedImageSize.width}
            imageHeight={selectedImageSize.height}
            styles={{
              minWidth: selectedImageSize.width + 25,
              maxWidth: selectedImageSize.height + 25,
              marginLeft: '4px',
              marginBottom: '4px',
              border: 'solid 1px lightgrey',
            }}
          />
        ))
      : [];
  }, [
    cardDeckData,
    selectedCardDeckIndex,
    selectedImageSize.height,
    selectedImageSize.width,
    selectedPageLimit,
  ]);

  return cardDeckData.length > 0 ? (
    <div className="results-view">
      <div className="results-view-header">
        <div className="results-info">
          <ResultsInfo
            onClickDownload={onClickDownload}
            onClickDelete={onClickDelete}
          />
        </div>
        <div className="view-settings">
          <table>
            <tbody>
              <tr>
                <td>img. size</td>
                <td>
                  <SelectBox
                    values={imageSizes.map(
                      (size) => `${size.width}x${size.height}`,
                    )}
                    defaultValue={`${selectedImageSize.width}x${selectedImageSize.height}`}
                    onChange={(value: string) => {
                      const split = value.split('x');
                      setSelectedImageSize({
                        width: Number(split[0]),
                        height: Number(split[1]),
                      });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>no. results</td>
                <td>
                  <SelectBox
                    values={pageLimits}
                    defaultValue={selectedPageLimit}
                    onChange={(value: number) => setSelectedPageLimit(value)}
                  />
                </td>
              </tr>
              <tr>
                <td>sort by</td>
                <td>
                  <SelectBox
                    values={Object.keys(sortOptions).map(
                      (sortOption) => sortOptions[sortOption].label,
                    )}
                    defaultValue={sortByLabel}
                    onChange={(label: string) => setSortByLabel(label)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
        <CustomPagination
          data={cardDeckData}
          selected={selectedCardDeckIndex}
          onSelect={handleOnSelectCardIndex}
          maxPages={maxPages}
        />
      </div>
      <div className="card-deck-container">
        <Container>
          <CardGroup>{cardDecks}</CardGroup>
        </Container>
      </div>
    </div>
  ) : null;
}

export default ResultsView;
