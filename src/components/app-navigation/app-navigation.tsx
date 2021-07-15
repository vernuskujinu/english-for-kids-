import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { TAppState } from '../../redux/reducers/reducer';
import EnglishForKidsService, { TCategory } from '../../services/english-for-kids-service';
import {
  setAppNavShown,
  selectCategoryAndLoadCards,
  setLoginModalShown,
} from '../../redux/actions/actions';

import './app-navigation.sass';
import compose from '../../utils/compose';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';
import { AppDispatch } from '../../store';
import { bindActionCreators } from '@reduxjs/toolkit';

interface IProps {
  categories: TCategory[];
  isAppNavShown: boolean;
  setAppNavShown: typeof setAppNavShown;
  selectCategoryAndLoadCards: (category: TCategory, page: number) => void;
  setLoginModalShown: typeof setLoginModalShown;
  selectedCategory: TCategory | null;
}

class AppNavigation extends React.Component<IProps, unknown> {
  render() {
    const { categories, isAppNavShown, selectedCategory } = this.props;

    const items =
      categories.length > 0
        ? categories.map((category) =>
            AppNavigationItem({
              category,
              onClick: this.handleItemClick,
              selectedCategory: selectedCategory,
            }),
          )
        : null;

    return (
      <div
        className={`app-navigation__wrapper ${isAppNavShown ? 'shown' : ''}`}
        onClick={this.handleWrapperClick}
      >
        <nav className={`app-navigation ${isAppNavShown ? 'shown' : ''}`}>
          <ul className="app-navigation-list">
            <li className="app-navigation-list__item">
              <NavLink
                className="app-navigation-list__link"
                activeClassName="navigation-link--active"
                to="/"
                exact
                onClick={this.handleWrapperClick}
              >
                Home
              </NavLink>
            </li>
            {items}
            {/* <li className="app-navigation-list__item">
              <NavLink
                className="app-navigation-list__link"
                activeClassName="navigation-link--active"
                to="/statistic"
                onClick={this.handleWrapperClick}
              >
                Statistic
              </NavLink>
            </li> */}
          </ul>
          <button
            className="app-navigation__login-modal-show-button"
            onClick={() => {
              this.props.setLoginModalShown(true);
              this.props.setAppNavShown(false);
            }}
          >
            Login
          </button>
        </nav>
      </div>
    );
  }

  handleWrapperClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) this.props.setAppNavShown(false);
  };

  handleItemClick = (category: TCategory) => {
    this.props.selectCategoryAndLoadCards(category, -1);
  };
}

interface INavigationItemProps {
  category: TCategory;
  selectedCategory: TCategory | null;
  onClick: (category: TCategory) => void;
}

const AppNavigationItem = ({ category, onClick, selectedCategory }: INavigationItemProps) => {
  return (
    <li key={category._id} className="app-navigation-list__item" onClick={() => onClick(category)}>
      <NavLink
        className={`app-navigation-list__link ${
          selectedCategory === category ? 'navigation-link--active' : ''
        }`}
        to="/game"
      >
        {category.title}
      </NavLink>
    </li>
  );
};

const mapStateToProps = ({ categories, isAppNavShown, selectedCategory }: TAppState) => {
  return { categories, isAppNavShown, selectedCategory };
};

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      setAppNavShown,
      setLoginModalShown,
      selectCategoryAndLoadCards: selectCategoryAndLoadCards(englishForKidsService),
    },
    dispatch,
  );
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(AppNavigation);
