import React from 'react';
import { connect } from 'react-redux';
import { fetchCategories } from '../../../redux/actions/actions';
import compose from '../../../utils/compose';
import withEnglishForKidsService from '../../hoc/with-english-for-kids-service';
import { AppDispatch } from '../../../store';
import EnglishForKidsService from '../../../services/english-for-kids-service';
import { bindActionCreators } from 'redux';
import AdminPanelCategoryList from '../../admin-panel-category-list/admin-panel-category-list';

import './categories.sass';
import { TAppState } from '../../../redux/reducers/reducer';
import { Redirect } from 'react-router-dom';

interface IProps {
  fetchCategories: () => void;
  loggedAsAdmin: boolean;
}

class CategoriesPage extends React.Component<IProps, unknown> {
  // componentDidMount() {
  //   this.props.fetchCategories();
  // }

  render() {
    if (!this.props.loggedAsAdmin) return <Redirect to="/" />;

    return (
      <section className="section admin-panel-categories-section">
        <h2 className="typography-h2">Categories</h2>
        <AdminPanelCategoryList />
      </section>
    );
  }
}

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      fetchCategories: fetchCategories(englishForKidsService),
    },
    dispatch,
  );
};

const mapStateToProps = ({ loggedAsAdmin, loading }: TAppState) => {
  return { loggedAsAdmin, loading };
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(CategoriesPage);
