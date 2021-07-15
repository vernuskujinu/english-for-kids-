import React from 'react';
import { TCard } from '../../services/english-for-kids-service';
import WordCard from '../word-card/word-card';

import './word-list.sass';

interface IProps {
  cards: TCard[];
}

const WordList = ({ cards }: IProps) => {
  const items = cards.map(WordListItem);

  return (
    <div className="word-list__wrapper">
      <ul className="word-list">{items}</ul>
    </div>
  );
};

const WordListItem = (card: TCard) => {
  return (
    <li key={card._id} className="word-list__item">
      <WordCard card={card} />
    </li>
  );
};

export default WordList;
