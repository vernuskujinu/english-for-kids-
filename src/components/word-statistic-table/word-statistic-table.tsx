import React from 'react';
import { TWordStatistic } from '../../services/statistic-service';

import _ from 'lodash';

import './word-statistic-table.sass';

enum SORT_SYMBOLS {
  sortable = '⇅',
  ASC = '▼',
  DESC = '▲',
}

enum SORTING_ORDERS {
  ASC,
  DESC,
}

interface IProps {
  statistic: TWordStatistic[];
}

interface IState {
  sortedBy: keyof TWordStatistic;
  sortingOrder: SORTING_ORDERS;
}

class WordStatisticTable extends React.Component<IProps, IState> {
  state: IState = {
    sortedBy: 'precent',
    sortingOrder: SORTING_ORDERS.ASC,
  };

  render() {
    const { statistic } = this.props;

    if (statistic.length <= 0)
      return <span className="typography-h2">Train words or play a game first!</span>;

    const { sortedBy, sortingOrder } = this.state;

    const theaderTitles = [
      {
        title: 'word',
        key: 'card.word',
      },
      {
        title: 'category',
        key: 'card.category',
      },
      {
        title: 'translation',
        key: 'card.translation',
      },
      {
        title: 'train',
        key: 'trainCount',
      },
      {
        title: 'correct',
        key: 'correctCount',
      },
      {
        title: 'incorrect',
        key: 'incorrectCount',
      },
      {
        title: 'precent',
        key: 'precent',
      },
    ];

    const theaders = theaderTitles.map((headerTitle) => (
      <th
        key={headerTitle.key}
        className="statistic-table__col"
        onClick={() => this.handleTheaderClick(headerTitle.key as keyof TWordStatistic)}
      >
        {headerTitle.title}
        {sortedBy === headerTitle.key
          ? sortingOrder === SORTING_ORDERS.ASC
            ? SORT_SYMBOLS.ASC
            : SORT_SYMBOLS.DESC
          : SORT_SYMBOLS.sortable}
      </th>
    ));

    const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });

    const sortedStatistic = statistic.sort((a, b) =>
      collator.compare(_.get(a, sortedBy).toString(), _.get(b, sortedBy).toString()),
    );

    if (sortingOrder === SORTING_ORDERS.DESC) sortedStatistic.reverse();

    const items = sortedStatistic.map((element) => (
      <WordStatisticTableItem
        key={element.card.category + element.card.translation}
        statistic={element}
      />
    ));

    return (
      <table className="table statistic-table">
        <thead>
          <tr>{theaders}</tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    );
  }

  handleTheaderClick = (headerTitle: keyof TWordStatistic) => {
    const { sortedBy, sortingOrder } = this.state;

    if (sortedBy === headerTitle) {
      const newOrder =
        sortingOrder === SORTING_ORDERS.ASC ? SORTING_ORDERS.DESC : SORTING_ORDERS.ASC;
      this.setState({ sortingOrder: newOrder });
      return;
    }

    this.setState({ sortedBy: headerTitle });
  };
}

const WordStatisticTableItem = ({ statistic }: { statistic: TWordStatistic }) => {
  return (
    <tr className="statistic-table__row">
      <th className="statistic-table__col">{statistic.card.word}</th>
      <th className="statistic-table__col">{statistic.card.category}</th>
      <th className="statistic-table__col">{statistic.card.translation}</th>
      <th className="statistic-table__col">{statistic.trainCount}</th>
      <th className="statistic-table__col">{statistic.correctCount}</th>
      <th className="statistic-table__col">{statistic.incorrectCount}</th>
      <th className="statistic-table__col">{statistic.precent}</th>
    </tr>
  );
};

export default WordStatisticTable;
