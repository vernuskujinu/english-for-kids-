import React from 'react';
import { TCategory } from '../../services/english-for-kids-service';

import './category-card.sass';

interface IProps {
  category: TCategory;
}

const CategoryCard = ({ category }: IProps) => {
  const { title, imgSrc, cardCount } = category;

  return (
    <div className="category-card">
      <div className="category-card__image" style={{ backgroundImage: `url(${imgSrc})` }}></div>
      <div className="category-card__descriptions-wrapper">
        <h3 className="category-card__description">{title}</h3>
        <div className="category-card__amount-wrapper">
          <span className="category-card__amount">{`${cardCount} ${
            cardCount > 1 ? 'cards' : 'card'
          }`}</span>
          <div className="category-card__game-mode"></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
