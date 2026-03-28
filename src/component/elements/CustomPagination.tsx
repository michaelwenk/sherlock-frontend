import './CustomPagination.scss';

import { JSX, MouseEvent, useMemo } from 'react';

const maxPages = 5;

type InputProps = {
  nData: number;
  selected: number;
  onSelect: (page: number) => void;
};

function CustomPagination({ nData, selected, onSelect }: InputProps) {
  const paginationItems = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let i = 0; i < nData; i++) {
      const isActive = selected === i;
      items.push(
        <button
          aria-label={`Go to page ${i + 1}`}
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
  }, [nData, onSelect, selected]);

  const paginationItemLists = useMemo(() => {
    const _paginationItemLists: JSX.Element[][] = [];
    let paginationItemList: JSX.Element[] = [];
    for (let i = 0; i < paginationItems.length; i++) {
      if (i > 0 && i % maxPages === 0) {
        _paginationItemLists.push(paginationItemList);
        paginationItemList = [];
      }
      paginationItemList.push(paginationItems[i]);
    }
    _paginationItemLists.push(paginationItemList);

    return _paginationItemLists;
  }, [paginationItems]);

  const paginationItemListIndex = useMemo(
    () => Math.floor(selected / maxPages),
    [selected],
  );

  const goToFirstListElement = useMemo(() => {
    if (paginationItemListIndex > 0) {
      return (
        <button
          aria-label={`Go to page 1`}
          key={'go_to_first_page'}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onSelect(0);
          }}
        >
          {'<<'}
        </button>
      );
    }
    return null;
  }, [onSelect, paginationItemListIndex]);

  const goToLastListElement = useMemo(() => {
    if (paginationItemListIndex + 1 < paginationItemLists.length) {
      return (
        <button
          aria-label={`Go to last page`}
          key={'go_to_last_page'}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onSelect(paginationItemLists.length * maxPages - maxPages);
          }}
        >
          {'>>'}
        </button>
      );
    }
    return null;
  }, [paginationItemListIndex, paginationItemLists, onSelect]);

  const goToPrevListElement = useMemo(() => {
    if (paginationItemListIndex > 0) {
      return (
        <button
          aria-label={`Go to previous page`}
          key={'go_to_prev_page'}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onSelect((paginationItemListIndex - 1) * maxPages);
          }}
        >
          {'<'}
        </button>
      );
    }
    return null;
  }, [onSelect, paginationItemListIndex]);

  const goToNextListElement = useMemo(() => {
    if (paginationItemListIndex + 1 < paginationItemLists.length) {
      return (
        <button
          aria-label={`Go to next page`}
          key={'go_to_next_page'}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onSelect((paginationItemListIndex + 1) * maxPages);
          }}
        >
          {'>'}
        </button>
      );
    }
    return null;
  }, [onSelect, paginationItemListIndex, paginationItemLists]);

  return useMemo(() => {
    const listElements = [
      goToFirstListElement,
      goToPrevListElement,
      paginationItemLists[paginationItemListIndex].length > maxPages
        ? '...'
        : null,
      ...paginationItemLists[paginationItemListIndex].map(
        (paginationItem) => paginationItem,
      ),
      paginationItemLists[paginationItemListIndex].length > maxPages
        ? '...'
        : null,
      goToNextListElement,
      goToLastListElement,
    ];

    return (
      <div className="custom-pagination">
        <nav>
          <ul>
            {listElements.map((item, i) => (
              <li key={'list_item_' + i}>{item}</li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }, [
    goToFirstListElement,
    goToPrevListElement,
    paginationItemLists,
    paginationItemListIndex,
    goToNextListElement,
    goToLastListElement,
  ]);
}

export default CustomPagination;
