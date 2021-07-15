import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../../redux/actions/actions';
import { TAppState } from '../../redux/reducers/reducer';
import { TCategory } from '../../services/english-for-kids-service';

import './admin-panel-header.sass';

const AdminPanelHeader = (props: { selectedCategory: TCategory | null; logout: typeof logout }) => {
  return (
    <header className="header admin-panel-header">
      <nav className="admin-panel-nav">
        <NavLink
          activeClassName="admin-panel-nav__item--active"
          className="admin-panel-nav__item"
          to="/categories"
        >
          Categories
        </NavLink>
        <span
          className={`admin-panel-nav__item ${
            props.selectedCategory ? 'admin-panel-nav__item--active' : ''
          }`}
        >
          Words
        </span>
      </nav>
      <button onClick={props.logout}>Logout</button>
    </header>
  );
};

const mapStateToProps = ({ selectedCategory }: TAppState) => {
  return { selectedCategory };
};

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanelHeader);
