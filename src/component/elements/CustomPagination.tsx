import { useCallback, useMemo } from 'react';
import Pagination from 'react-bootstrap/Pagination';

type InputProps = {
  data: any,
  selected: number,
  onSelect: Function,
  maxPages: number,
  className?: string,
}

function CustomPagination({
  data,
  selected,
  onSelect,
  maxPages,
  className = 'CustomPagination',
} : InputProps) {
  const paginationItems = useMemo(() => {
    const items: Array<JSX.Element> = [];
    for (let i = 0; i < data.length; i++) {
      const isActive = selected === i;
      items.push(
        <Pagination.Item
          key={i}
          active={isActive}
          disabled={isActive}
          onClick={(e: any) => {
            e.stopPropagation();
            onSelect(Number(e.target.text) - 1);
          }}
          className="PaginationItem"
        >
          {i + 1}
        </Pagination.Item>,
      );
    }

    return items;
  }, [data, onSelect, selected]);

  const paginationItemLists = useMemo(() => {
    let paginationItemLists: Array<Array<JSX.Element>> = [];
    let paginationItemList: Array<JSX.Element> = [];
    for (let i = 0; i < paginationItems.length; i++) {
      if (i > 0 && i % maxPages === 0) {
        paginationItemLists.push(paginationItemList);
        paginationItemList = [];
      }
      paginationItemList.push(paginationItems[i]);
    }
    paginationItemLists.push(paginationItemList);

    return paginationItemLists;
  }, [maxPages, paginationItems]);

  const paginationItemListIndex = useMemo(() => {
    return selected / maxPages;
  }, [maxPages, selected]);

  const handleOnClickFirst = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(0);
    },
    [onSelect],
  );

  const handleOnClickLast = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(paginationItems.length - 1);
    },
    [onSelect, paginationItems.length],
  );

  const handleOnClickPrev = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(Number(paginationItemLists[paginationItemListIndex - 1][0].key));
    },
    [onSelect, paginationItemListIndex, paginationItemLists],
  );

  const handleOnClickNext = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(Number(paginationItemLists[paginationItemListIndex + 1][0].key));
    },
    [onSelect, paginationItemListIndex, paginationItemLists],
  );

  return (
    <div className={className}>
      <Pagination className="Pagination">
        <Pagination.First
          onClick={handleOnClickFirst}
          disabled={selected === 0}
          className="PaginationFirst"
        />
        <Pagination.Prev
          onClick={handleOnClickPrev}
          disabled={paginationItemListIndex === 0}
          className="PaginationPrev"
        />
        {paginationItems.length > maxPages && paginationItemListIndex > 0 ? (
          <Pagination.Ellipsis disabled={true} />
        ) : null}
        {paginationItemLists[paginationItemListIndex]}
        {paginationItems.length > maxPages &&
        paginationItemListIndex + 1 < paginationItemLists.length ? (
          <Pagination.Ellipsis disabled={true} />
        ) : null}
        <Pagination.Next
          onClick={handleOnClickNext}
          disabled={paginationItemListIndex === paginationItemLists.length - 1}
          className="PaginationNext"
        />
        <Pagination.Last
          onClick={handleOnClickLast}
          disabled={selected === paginationItems.length - 1}
          className="PaginationLast"
        />
      </Pagination>
    </div>
  );
}

export default CustomPagination;
