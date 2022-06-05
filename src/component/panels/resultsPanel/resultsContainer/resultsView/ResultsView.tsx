import './ResultsView.scss';

import { memo, useCallback, useMemo, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';
import ResultCard from '../resultCard/ResultCard';
import SelectBox from '../../../../elements/SelectBox';
import sortOptions from '../../../../../constants/sortOptions';
import ResultsInfo from '../../resultsInfo/ResultsInfo';
import DataSet from '../../../../../types/sherlock/dataSet/DataSet';

interface ImageSize {
  width: number;
  height: number;
}

const bufferImageWidth = 75;

const imageSizes: ImageSize[] = [
  { width: 200, height: 200 },
  { width: 250, height: 250 },
  { width: 300, height: 300 },
];

type InputProps = {
  dataSets: DataSet[];
  maxPages: number;
  pageLimits: number[];
  onClickDownload: Function;
  onClickDelete: Function;
};

function ResultsView({
  dataSets,
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
    sortOptions.hits.label,
  );
  const [selectedImageSize, setSelectedImageSize] = useState<ImageSize>(
    imageSizes[0],
  );

  const handleOnSelectCardIndex = useCallback((index: number) => {
    setSelectedCardDeckIndex(index);
  }, []);

  const sortedDataSets = useMemo(() => {
    const sortByValue = Object.keys(sortOptions).filter(
      (sortOption) => sortOptions[sortOption].label === sortByLabel,
    )[0];
    function sort(dataSet1: DataSet, dataSet2: DataSet) {
      // if (sortByValue === sortOptions.tanimoto.value) {
      //   return dataSet1.attachment.tanimoto > dataSet2.attachment.tanimoto
      //     ? -1
      //     : 1;
      // } else
      if (
        sortByValue === sortOptions.hits.value &&
        dataSet1.attachment.setAssignmentsCount &&
        dataSet1.attachment.querySpectrumSignalCount &&
        dataSet2.attachment.setAssignmentsCount &&
        dataSet2.attachment.querySpectrumSignalCount
      ) {
        return dataSet1.attachment.setAssignmentsCount /
          dataSet1.attachment.querySpectrumSignalCount >
          dataSet2.attachment.setAssignmentsCount /
            dataSet2.attachment.querySpectrumSignalCount
          ? -1
          : 1;
      }
      return dataSet1.attachment[sortByValue] <=
        dataSet2.attachment[sortByValue]
        ? -1
        : 1;
    }
    const _sortedDataSets = dataSets.slice();
    _sortedDataSets.sort(sort);

    return _sortedDataSets;
  }, [dataSets, sortByLabel]);

  const cardDeckData = useMemo(() => {
    const _cardDeckData: DataSet[][] = [];
    let counter = 0;
    let resultDataSets: DataSet[] = [];

    for (let i = 0; i < sortedDataSets.length; i++) {
      if (counter < selectedPageLimit) {
        counter++;
        resultDataSets.push(sortedDataSets[i]);
      } else {
        _cardDeckData.push(resultDataSets);
        resultDataSets = [sortedDataSets[i]];
        counter = 1;
      }
    }
    if (resultDataSets.length > 0) {
      _cardDeckData.push(resultDataSets);
    }

    return _cardDeckData;
  }, [selectedPageLimit, sortedDataSets]);

  const cardDecks = useMemo(() => {
    let cardDeckIndex = selectedCardDeckIndex;
    if (cardDeckIndex >= cardDeckData.length) {
      cardDeckIndex = 0;
      setSelectedCardDeckIndex(cardDeckIndex);
    }

    return cardDeckData.length > 0
      ? cardDeckData[cardDeckIndex].map((dataSet, i) => (
          <ResultCard
            key={`resultCard_${i}`}
            id={cardDeckIndex * selectedPageLimit + i + 1}
            dataSet={dataSet}
            imageWidth={selectedImageSize.width}
            imageHeight={selectedImageSize.height}
            styles={{
              minWidth: selectedImageSize.width + bufferImageWidth,
              maxWidth: selectedImageSize.width + bufferImageWidth,
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

  return useMemo(
    () =>
      cardDeckData.length > 0 ? (
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
                        onChange={(value: number) =>
                          setSelectedPageLimit(value)
                        }
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
      ) : (
        <p className="no-results-text">No results</p>
      ),
    [
      cardDeckData,
      cardDecks,
      handleOnSelectCardIndex,
      maxPages,
      onClickDelete,
      onClickDownload,
      pageLimits,
      selectedCardDeckIndex,
      selectedImageSize.height,
      selectedImageSize.width,
      selectedPageLimit,
      sortByLabel,
    ],
  );
}

export default memo(ResultsView);
