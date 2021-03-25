import 'bootstrap/dist/css/bootstrap.min.css';

/** @jsxImportSource @emotion/react */
import { useCallback, useMemo } from 'react';
import Pagination from 'react-bootstrap/Pagination';

function CustomPagination({ data, selected, onSelect }) {
  const handleOnClickFirst = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(0);
    },
    [onSelect],
  );

  const handleOnClickPrev = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(selected - 1);
    },
    [onSelect, selected],
  );

  const handleOnClickNext = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(selected + 1);
    },
    [onSelect, selected],
  );

  const handleOnClickLast = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(data.length - 1);
    },
    [data.length, onSelect],
  );

  const getRange = (data, i) => {
    let begin = 1;
    for (let k = 0; k < i; k++) {
      begin += data[k].length;
    }
    const end = begin + data[i].length - 1;
    return { begin, end };
  };

  const paginationItemLabels = useMemo(() => {
    const labels = {};
    for (let i = 0; i < data.length; i++) {
      const { begin, end } = getRange(data, i);
      labels[`${begin}-${end}`] = i;
    }
    return labels;
  }, [data]);

  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < data.length; i++) {
      const { begin, end } = getRange(data, i);
      const isActive = selected === paginationItemLabels[`${begin}-${end}`];
      items.push(
        <Pagination.Item
          key={i}
          active={isActive}
          disabled={isActive}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(paginationItemLabels[e.target.text]);
          }}
        >
          {begin}-{end}
        </Pagination.Item>,
      );
    }

    return items;
  }, [data, onSelect, paginationItemLabels, selected]);

  return (
    <Pagination>
      <Pagination.First
        onClick={handleOnClickFirst}
        disabled={selected === 0}
      />
      <Pagination.Prev onClick={handleOnClickPrev} disabled={selected === 0} />
      {paginationItems}
      <Pagination.Next
        onClick={handleOnClickNext}
        disabled={selected === data.length - 1}
      />
      <Pagination.Last
        onClick={handleOnClickLast}
        disabled={selected === data.length - 1}
      />
    </Pagination>
  );
}

export default CustomPagination;
