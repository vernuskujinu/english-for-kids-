import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { InView } from 'react-intersection-observer';

import { TAppState } from '../../redux/reducers/reducer';
import { addNewCards, updateCard, deleteCard } from '../../redux/actions/actions';
import EnglishForKidsService, {
  TCard,
  TCategory,
  TWordToAdd,
} from '../../services/english-for-kids-service';
import compose from '../../utils/compose';
import AdminPanelWordCard from '../admin-panel-word-card/admin-panel-word-card';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';

import './admin-panel-word-list.sass';

interface IProps {
  selectedCategory: TCategory;
  englishForKidsService: EnglishForKidsService;
  words: TCard[];
  updateCard: typeof updateCard;
  addNewCards: typeof addNewCards;
  deleteCard: typeof deleteCard;
}

interface IState {
  words: TCard[];
  page: number;
  isHasMoreData: boolean;
}

class AdminPanelWordList extends React.Component<IProps, IState> {
  state: IState = {
    words: [],
    page: 0,
    isHasMoreData: true,
  };

  componentDidUpdate(prevProps: IProps) {
    if (this.props.words !== prevProps.words) {
      this.setState({ words: this.props.words });
    }
  }

  render() {
    if (!this.props.selectedCategory) return <Redirect to="/categories" />;

    const items = this.state.words.map((word, index) => (
      <AdminPanelCategoryListItem
        key={index}
        word={word}
        onSubmit={this.onSubmit}
        onNewItemCancel={word._id < 0 ? this.onNewItemCancel : undefined}
        onDelete={this.onDelete}
      />
    ));

    return (
      <div className="admin-panel-words-list__wrapper">
        <ul className="admin-panel-words-list">
          {items}
          <InView threshold={1} onChange={(isInView) => (isInView ? this.loadNextPage() : null)}>
            <li className="words-list__item words-list__item-add">
              <div className="admin-panel-word-card words-list__add-word">
                <span className="typography-h4">Add new word</span>
                <button className="words-list__add-word-button" onClick={this.addNewItemToRender}>
                  +
                </button>
              </div>
            </li>
          </InView>
        </ul>
      </div>
    );
  }

  loadNextPage = () => {
    if (this.state.isHasMoreData) {
      this.props.englishForKidsService
        .getCategoryCards(this.props.selectedCategory.title, this.state.page)
        .then((cards) => {
          console.log(cards);
          this.props.addNewCards([...cards]);

          const isMoreData = cards.length > 0;

          this.setState((state) => ({
            page: state.page + 1,
            isHasMoreData: isMoreData,
          }));
        });
    }
  };

  onDelete = (category: string, _id: number) => {
    if (_id < 0) {
      this.props.deleteCard(_id);

      return;
    }

    this.props.englishForKidsService.deleteWord(category, _id).then(() => {
      this.props.deleteCard(_id);
    });
  };

  addNewItemToRender = () => {
    this.props.addNewCards([
      {
        _id: -this.props.words.length - 1,
        category: this.props.selectedCategory.title,
        audioSrc: '',
        imgSrc: '',
        translation: '',
        word: '',
        isGuessed: false,
      },
    ]);
  };

  onNewItemCancel = (_id: number) => {
    this.props.deleteCard(_id);
  };

  onSubmit = async (data: TWordToAdd) => {
    let message = '';

    if (data._id < 0) {
      this.props.englishForKidsService
        .createWord(data)
        .then((newWord) => this.props.updateCard(newWord, data._id))
        .catch((err) => (message = err.message));

      return message;
    }

    this.props.englishForKidsService
      .updateWord(data)
      .then((newWord) => this.props.updateCard(newWord))
      .catch((err) => (message = err.message));

    return message;
  };

  private setUpdatedWordToState = (oldId: number, newWord: TCard) => {
    this.setState(({ words }) => {
      const newWords = words.map((item) => {
        if (item._id === oldId) {
          item._id = newWord._id;
          item.word = newWord.word;
          item.imgSrc = newWord.imgSrc;
          item.audioSrc = newWord.audioSrc;
          item.category = newWord.category;
          item.translation = newWord.translation;
        }
        return item;
      });
      return { words: newWords };
    });
  };
}

interface ICategoryItemProps {
  word: TCard;
  onNewItemCancel?: (_id: number) => void;
  onSubmit: (data: TWordToAdd) => Promise<string>;
  onDelete: (category: string, _id: number) => void;
}

const AdminPanelCategoryListItem = (props: ICategoryItemProps) => {
  return (
    <li className="words-list__item">
      <AdminPanelWordCard
        word={props.word}
        onNewItemCancel={props.onNewItemCancel}
        onSubmitClick={props.onSubmit}
        onDeleteClick={props.onDelete}
      />
    </li>
  );
};

const mapStateToProps = ({ cards, selectedCategory }: TAppState) => {
  return { words: cards, selectedCategory };
};

const mapDispatchToProps = {
  addNewCards,
  updateCard,
  deleteCard,
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(AdminPanelWordList);
