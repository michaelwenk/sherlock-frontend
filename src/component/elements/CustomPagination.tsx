import './CustomPagination.scss';

import { JSX, MouseEvent, useCallback, useMemo } from 'react';

type InputProps = {
  data: any;
  selected: number;
  onSelect: (page: number) => void;
  maxPages: number;
  showFirst?: boolean;
  showLast?: boolean;
  showEllipsis?: boolean;
};

function CustomPagination({ data, selected, onSelect, maxPages }: InputProps) {
  const paginationItems = useMemo(() => {
    const items: Array<JSX.Element> = [];
    for (let i = 0; i < data.length; i++) {
      const isActive = selected === i;
      items.push(
        <button
          aria-label={`Go to page ${i + 1}`}
          key={i}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onSelect(i);
          }}
          style={
            isActive
              ? {
                  color: 'blue',
                  fontWeight: 'bold',
                  fontSize: '1.2em',
                  backgroundColor: '#e3e3e3',
                }
              : {}
          }
          disabled={isActive}
        >
          {i + 1}
        </button>,
      );
    }

    return items;
  }, [data.length, onSelect, selected]);

  const paginationItemLists = useMemo(() => {
    const paginationItemLists: JSX.Element[][] = [];
    let paginationItemList: JSX.Element[] = [];
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

  const paginationItemListIndex = useMemo(
    () => Math.floor(selected / maxPages),
    [maxPages, selected],
  );

  const handleOnClickFirst = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onSelect(0);
    },
    [onSelect],
  );

  const handleOnClickLast = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onSelect(paginationItems.length - 1);
    },
    [onSelect, paginationItems.length],
  );

  const handleOnClickPrev = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onSelect(Number(paginationItemLists[paginationItemListIndex - 1][0].key));
    },
    [onSelect, paginationItemListIndex, paginationItemLists],
  );

  const handleOnClickNext = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onSelect(Number(paginationItemLists[paginationItemListIndex + 1][0].key));
    },
    [onSelect, paginationItemListIndex, paginationItemLists],
  );

  const goToFirstListElement = useMemo(() => {
    if (paginationItemLists.length > 0) {
      return (
        <button
          aria-label={`Go to page 1`}
          key={'go_to_first_page'}
          onClick={handleOnClickFirst}
          disabled={paginationItemLists.length === 1}
        >
          {'<<'}
        </button>
      );
    }
    return null;
  }, [handleOnClickFirst, paginationItemLists.length]);

  const gotoLastListElement = useMemo(() => {
    if (paginationItemLists.length > 0) {
      return (
        <button
          aria-label={`Go to last page`}
          key={'go_to_last_page'}
          onClick={handleOnClickLast}
          disabled={paginationItemLists.length === 1}
        >
          {'>>'}
        </button>
      );
    }
    return null;
  }, [handleOnClickLast, paginationItemLists.length]);

  const goToPrevListElement = useMemo(() => {
    if (paginationItemListIndex > 0) {
      return (
        <button
          aria-label={`Go to previous page`}
          key={'go_to_prev_page'}
          onClick={handleOnClickPrev}
        >
          {'<'}
        </button>
      );
    }
    return null;
  }, [handleOnClickPrev, paginationItemListIndex]);

  const goToNextListElement = useMemo(() => {
    if (paginationItemListIndex + 1 < paginationItemLists.length) {
      return (
        <button
          aria-label={`Go to next page`}
          key={'go_to_next_page'}
          onClick={handleOnClickNext}
        >
          {'>'}
        </button>
      );
    }
    return null;
  }, [handleOnClickNext, paginationItemListIndex, paginationItemLists.length]);

  return useMemo(() => {
    const listElements = [
      goToFirstListElement,
      goToPrevListElement,
      ...paginationItemLists.map((list, index: number) => (
        <li key={'pagination_item_list_' + index}>
          {list.map((paginationItem) => paginationItem)}
        </li>
      )),
      goToNextListElement,
      gotoLastListElement,
    ];

    return (
      <div className={'pagination'}>
        <nav>
          <ul className="pagination">{listElements}</ul>
        </nav>
      </div>
    );
  }, [
    goToFirstListElement,
    goToNextListElement,
    goToPrevListElement,
    gotoLastListElement,
    paginationItemLists,
  ]);
}

export default CustomPagination;
