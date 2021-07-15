import React from 'react';
import { connect } from 'react-redux';
import CategoriesList from '../../categories-list/categories-list';
import { fetchCategories, fetchGameAssets } from '../../../redux/actions/actions';
import compose from '../../../utils/compose';
import withEnglishForKidsService from '../../hoc/with-english-for-kids-service';
import { AppDispatch } from '../../../store';
import EnglishForKidsService from '../../../services/english-for-kids-service';
import { bindActionCreators } from 'redux';
import Spinner from '../../spinner/spinner';
import { TAppState } from '../../../redux/reducers/reducer';

interface IProps {
  fetchCategories: (page: number) => void;
  fetchGameAssets: () => void;
  loading: boolean;
}

class HomePage extends React.Component<IProps, unknown> {
  componentDidMount() {
    this.props.fetchCategories(-1);
    this.props.fetchGameAssets();
  }

  render() {
    const content = this.props.loading ? (
      <Spinner />
    ) : (
      <section className="section">
        <h2 className="typography-h2">Train & Play</h2>
        <CategoriesList />
      </section>
    );

    return content;
  }
}

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      fetchCategories: fetchCategories(englishForKidsService),
      fetchGameAssets: fetchGameAssets(englishForKidsService),
    },
    dispatch,
  );
};

const mapStateToProps = ({ loading }: TAppState) => {
  return { loading };
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(HomePage);
