import {
  getAtomCounts,
  Correlation,
  getCorrelationDelta,
  getCorrelationIndex,
} from 'nmr-correlation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EditNeighbors from './EditNeighbors';
import lodashCloneDeep from 'lodash/cloneDeep';
import { useData } from '../../../../../context/DataContext';
import { useDispatch } from '../../../../../context/DispatchContext';
import {
  EDIT_FIXED_NEIGHBORS,
  EDIT_FORBIDDEN_NEIGHBORS,
  EDIT_SET_NEIGHBORS,
} from '../../../../../context/ActionTypes';
import CustomModal from '../../../../elements/modal/CustomModal';
import Highlight from '../../../../../types/Highlight';
import capitalize from '../../../../../utils/capitalize';
import { Tab, Tabs } from 'react-bootstrap';
import EditFixedNeighbors from './EditFixedNeighbors';
import NeighborsEntry from '../../../../../types/sherlock/detection/NeighborsEntry';

interface InputProps {
  correlation: Correlation;
  neighbors: NeighborsEntry;
  mode: 'forbidden' | 'set';
  highlight: Highlight;
}

function NeighborsTableCell({
  correlation,
  neighbors,
  mode,
  highlight,
}: InputProps) {
  const { nmriumData, resultData } = useData();
  const dispatch = useDispatch();

  const [show, setShow] = useState<boolean>(false);

  const correlationIndex = useMemo(
    () =>
      getCorrelationIndex(nmriumData?.correlations?.values || [], correlation),
    [correlation, nmriumData?.correlations?.values],
  );

  const handleOnDelete = useCallback(
    (atomType: string, protonCount: number, hybridization: number) => {
      const _editedNeighbors = lodashCloneDeep(neighbors);
      if (
        Object.keys(_editedNeighbors[atomType]).includes(`${hybridization}`)
      ) {
        if (_editedNeighbors[atomType][hybridization].includes(protonCount)) {
          _editedNeighbors[atomType][hybridization].splice(
            _editedNeighbors[atomType][hybridization].indexOf(protonCount),
            1,
          );
          if (_editedNeighbors[atomType][hybridization].length === 0) {
            delete _editedNeighbors[atomType][hybridization];
          }
        } else if (protonCount === -1) {
          delete _editedNeighbors[atomType][hybridization];
        }
        if (Object.keys(_editedNeighbors[atomType]).length === 0) {
          delete _editedNeighbors[atomType];
        }
      } else if (hybridization === -1) {
        delete _editedNeighbors[atomType];
      }

      dispatch({
        type:
          mode === 'forbidden' ? EDIT_FORBIDDEN_NEIGHBORS : EDIT_SET_NEIGHBORS,
        payload: { editedNeighbors: _editedNeighbors, correlation },
      });
    },
    [correlation, dispatch, mode, neighbors],
  );

  const handleOnAdd = useCallback(
    (atomType: string, protonCount: number, hybridization: number) => {
      const _editedNeighbors = lodashCloneDeep(neighbors);
      if (!Object.keys(_editedNeighbors).includes(atomType)) {
        _editedNeighbors[atomType] = {};
      }
      if (protonCount >= 0 || hybridization !== -1) {
        if (
          !Object.keys(_editedNeighbors[atomType]).includes(`${hybridization}`)
        ) {
          _editedNeighbors[atomType][hybridization] = [];
        }
        if (
          protonCount >= 0 &&
          !_editedNeighbors[atomType][hybridization].includes(protonCount)
        ) {
          _editedNeighbors[atomType][hybridization].push(protonCount);
        }
      }
      if (
        protonCount >= 0 &&
        hybridization !== -1 &&
        _editedNeighbors[atomType][-1] &&
        _editedNeighbors[atomType][-1].includes(protonCount)
      ) {
        _editedNeighbors[atomType][-1].splice(
          _editedNeighbors[atomType][-1].indexOf(protonCount),
          1,
        );
        if (_editedNeighbors[atomType][-1].length === 0) {
          delete _editedNeighbors[atomType][-1];
        }
      }

      dispatch({
        type:
          mode === 'forbidden' ? EDIT_FORBIDDEN_NEIGHBORS : EDIT_SET_NEIGHBORS,
        payload: { editedNeighbors: _editedNeighbors, correlation },
      });
    },
    [correlation, dispatch, mode, neighbors],
  );

  const handleOnDeleteFixed = useCallback(
    (neighborCorrelationIndex: number) => {
      const _fixedNeighbors = lodashCloneDeep(
        resultData?.resultRecord.detections?.fixedNeighbors,
      );
      if (
        _fixedNeighbors?.[correlationIndex] &&
        _fixedNeighbors[correlationIndex].includes(neighborCorrelationIndex)
      ) {
        _fixedNeighbors[correlationIndex].splice(
          _fixedNeighbors[correlationIndex].indexOf(neighborCorrelationIndex),
          1,
        );
        if (_fixedNeighbors[correlationIndex].length === 0) {
          delete _fixedNeighbors[correlationIndex];
        }
      }

      dispatch({
        type: EDIT_FIXED_NEIGHBORS,
        payload: { fixedNeighbors: _fixedNeighbors },
      });
    },
    [
      correlationIndex,
      dispatch,
      resultData?.resultRecord.detections?.fixedNeighbors,
    ],
  );

  const handleOnAddFixed = useCallback(
    (neighborCorrelationIndex: number) => {
      const _fixedNeighbors =
        lodashCloneDeep(resultData?.resultRecord.detections?.fixedNeighbors) ||
        {};
      if (!_fixedNeighbors[correlationIndex]) {
        _fixedNeighbors[correlationIndex] = [];
      }
      if (
        !_fixedNeighbors[correlationIndex].includes(neighborCorrelationIndex)
      ) {
        _fixedNeighbors[correlationIndex].push(neighborCorrelationIndex);
      }

      dispatch({
        type: EDIT_FIXED_NEIGHBORS,
        payload: { fixedNeighbors: _fixedNeighbors },
      });
    },
    [
      correlationIndex,
      dispatch,
      resultData?.resultRecord.detections?.fixedNeighbors,
    ],
  );

  const handleOnClose = useCallback(() => {
    setShow(false);
  }, []);

  const label = useMemo(() => {
    const values = Object.keys(neighbors)
      .map((atomType) => {
        const hybridizations = neighbors[atomType];
        if (Object.keys(hybridizations).length === 0) {
          return `${atomType}\u2217`;
        }

        return Object.keys(hybridizations)
          .map((hybridization) => Number(hybridization))
          .map((hybridization) => {
            if (
              hybridization === -1 &&
              hybridizations[hybridization].length === 0
            ) {
              return `${atomType}\u2217`;
            }
            return hybridizations[hybridization].map((protonCount) => {
              return protonCount === 0
                ? `${atomType}${
                    hybridization === -1 ? '' : ` (SP${hybridization})`
                  }`
                : `${atomType}H${protonCount > 1 ? protonCount : ''}${
                    hybridization === -1 ? '' : ` (SP${hybridization})`
                  }`;
            });
          })
          .flat();
      })
      .flat();

    if (
      mode === 'set' &&
      resultData?.resultRecord.detections?.fixedNeighbors &&
      resultData?.resultRecord.detections?.fixedNeighbors[correlationIndex]
    ) {
      resultData?.resultRecord.detections.fixedNeighbors[
        correlationIndex
      ].forEach((neighborCorrelationIndex) => {
        values.push(
          nmriumData?.correlations.values[neighborCorrelationIndex].label
            .origin,
        );
      });
    }

    return <label>{values.join(', ')}</label>;
  }, [
    correlationIndex,
    mode,
    neighbors,
    nmriumData?.correlations.values,
    resultData?.resultRecord.detections?.fixedNeighbors,
  ]);

  const possibleNeighbors = useMemo(
    () =>
      nmriumData?.correlations.options && nmriumData?.correlations.options.mf
        ? Object.keys(getAtomCounts(nmriumData.correlations.options.mf)).filter(
            (elem) => elem !== 'H',
          )
        : [],
    [nmriumData],
  );

  useEffect(() => {
    if (show) {
      highlight.hide();
    }
  }, [highlight, show]);

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setShow(true);
      }}
    >
      {label}
      {show && (
        <CustomModal
          show={show}
          title={`Edit ${capitalize(mode)} Neighbors: ${correlation.atomType}${
            correlationIndex + 1
          } ${
            getCorrelationDelta(correlation)
              ? `(${(getCorrelationDelta(correlation) as number).toFixed(
                  2,
                )} ppm)`
              : ''
          }`}
          body={
            mode === 'forbidden' ? (
              <EditNeighbors
                neighbors={neighbors}
                possibleNeighbors={possibleNeighbors}
                onDelete={handleOnDelete}
                onAdd={handleOnAdd}
              />
            ) : (
              <Tabs onSelect={() => {}} defaultActiveKey="general">
                <Tab eventKey={'general'} title="General">
                  <EditNeighbors
                    neighbors={neighbors}
                    possibleNeighbors={possibleNeighbors}
                    onDelete={handleOnDelete}
                    onAdd={handleOnAdd}
                  />
                </Tab>
                <Tab eventKey={'fixed'} title="Fixed">
                  {correlation.equivalence === undefined ||
                  correlation.equivalence !== 1 ||
                  !correlation.protonsCount ||
                  correlation.protonsCount.length !== 1 ||
                  !correlation.hybridization ||
                  correlation.hybridization.length !== 1 ? (
                    <p style={{ color: 'blue' }}>
                      Setting of direct bond to another atom is not allowed for
                      this atom with an equivalence higher than one or a
                      non-unique proton count/hybridization!
                    </p>
                  ) : (
                    <EditFixedNeighbors
                      fixedNeighborEntry={
                        resultData?.resultRecord.detections?.fixedNeighbors?.[
                          correlationIndex
                        ] || []
                      }
                      correlations={nmriumData?.correlations.values}
                      onDelete={handleOnDeleteFixed}
                      onAdd={handleOnAddFixed}
                    />
                  )}
                </Tab>
              </Tabs>
            )
          }
          onClose={handleOnClose}
        />
      )}
    </div>
  );
}

export default NeighborsTableCell;
