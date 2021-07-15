import React from 'react';
import { connect } from 'react-redux';
import { TAppState } from '../../../redux/reducers/reducer';
import { TCategory } from '../../../services/english-for-kids-service';
import AdminPanelWordList from '../../admin-panel-word-list/admin-panel-word-list';
import { selectCategory } from '../../../redux/actions/actions';

import './words.sass';

interface IProps {
  selectedCategory: TCategory | null;
  selectCategory: typeof selectCategory;
}

class WordsPage extends React.Component<IProps> {
  componentWillUnmount = () => {
    this.props.selectCategory(null);
  };

  render() {
    const { selectedCategory } = this.props;

    return (
      <section className="section words-section">
        <h2 className="typography-h2">
          {selectedCategory?.title ? `Category: ${selectedCategory.title}` : 'Words'}
        </h2>
        <AdminPanelWordList />
      </section>
    );
  }
}

const mapStateToProps = ({ selectedCategory }: TAppState) => {
  return { selectedCategory };
};

const mapDispatchToProps = { selectCategory };

export default connect(mapStateToProps, mapDispatchToProps)(WordsPage);
