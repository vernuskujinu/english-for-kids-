import { bindActionCreators } from '@reduxjs/toolkit';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCategoryAndLoadCards } from '../../redux/actions/actions';
import { TAppState } from '../../redux/reducers/reducer';
import EnglishForKidsService, { TCategory } from '../../services/english-for-kids-service';
import { AppDispatch } from '../../store';
import compose from '../../utils/compose';
import CategoryCard from '../category-card/category-card';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';

import './categories-list.sass';

interface IProps {
  categories: TCategory[];
  selectCategoryAndLoadCards: (category: TCategory, page: number) => void;
}

const CategoryList = (props: IProps) => {
  const { categories, selectCategoryAndLoadCards } = props;

  const items = categories.map((category) => (
    <CategoryListItem
      key={category._id}
      category={category}
      onClick={(category) => selectCategoryAndLoadCards(category, -1)}
    />
  ));

  return (
    <div className="categories-list__wrapper">
      <ul className="categories-list">{items}</ul>
    </div>
  );
};

interface ICategoryItemProps {
  category: TCategory;
  onClick: (category: TCategory) => void;
}

const CategoryListItem = (props: ICategoryItemProps) => {
  return (
    <li className="categories-list__item" onClick={() => props.onClick(props.category)}>
      <Link to="/game" className="link-styles-remove">
        <CategoryCard category={props.category} />
      </Link>
    </li>
  );
};

const mapStateToProps = ({ categories }: TAppState) => {
  return { categories };
};

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      selectCategoryAndLoadCards: selectCategoryAndLoadCards(englishForKidsService),
    },
    dispatch,
  );
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(CategoryList);
