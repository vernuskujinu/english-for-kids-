import React from 'react';
import InView from 'react-intersection-observer';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  selectCategory,
  addNewCategories,
  updateCategory,
  clearCategories,
  deleteCategory,
} from '../../redux/actions/actions';
import { TAppState } from '../../redux/reducers/reducer';
import EnglishForKidsService, { TCategory } from '../../services/english-for-kids-service';
import compose from '../../utils/compose';
import AdminPanelCategoryCard from '../admin-panel-category-card/admin-panel-category-card';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';

import './admin-panel-category-list.sass';

interface IProps {
  categories: TCategory[];
  selectCategory: (category: TCategory) => void;
  englishForKidsService: EnglishForKidsService;
  addNewCategories: typeof addNewCategories;
  updateCategory: typeof updateCategory;
  clearCategories: typeof clearCategories;
  deleteCategory: typeof deleteCategory;
}

interface IState {
  categories: TCategory[];
  redirect: string;
  page: number;
  isHasMoreData: boolean;
}

class AdminPanelCategoryList extends React.Component<IProps, IState> {
  state: IState = {
    categories: [],
    redirect: '',
    page: 0,
    isHasMoreData: true,
  };

  componentDidUpdate = (prevProps: IProps) => {
    if (this.props.categories !== prevProps.categories) {
      this.setState({ categories: this.props.categories });
    }
  };

  componentWillUnmount = () => {
    this.props.clearCategories();
  };

  render() {
    if (this.state.redirect)
      return <Redirect to={`/${this.state.redirect.toLowerCase().replaceAll(' ', '-')}/words`} />;

    const items = this.state.categories.map((category, index) => (
      <AdminPanelCategoryListItem
        key={index}
        category={category}
        onSubmit={this.onSubmit}
        onAddWords={this.onAddWords}
        onNewItemCancel={category._id < 0 ? this.onNewItemCancel : undefined}
        onDelete={this.onDelete}
      />
    ));

    return (
      <div className="admin-panel-categories-list__wrapper">
        <ul className="admin-panel-categories-list">
          {items}
          <InView threshold={1} onChange={(isInView) => (isInView ? this.loadNextPage() : null)}>
            <li className="categories-list__item categories-list__item-add">
              <div className="admin-panel-category-card categories-list__add-category">
                <span className="typography-h4">Add new category</span>
                <button
                  className="categories-list__add-category-button"
                  onClick={this.addNewItemToRender}
                >
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
    if (this.state.isHasMoreData)
      this.props.englishForKidsService.getCategories(this.state.page).then((cards) => {
        this.props.addNewCategories(cards);
        const isMoreData = cards.length > 0;

        this.setState((state) => ({
          page: state.page + 1,
          isHasMoreData: isMoreData,
        }));
      });
  };

  onDelete = (_id: number) => {
    if (_id < 0) {
      this.props.deleteCategory(_id);
      return;
    }

    this.props.englishForKidsService.deleteCategory(_id).then(() => {
      this.props.deleteCategory(_id);
    });
  };

  addNewItemToRender = () => {
    this.props.addNewCategories([
      { cardCount: 0, _id: -this.state.categories.length - 1, imgSrc: '', title: '' },
    ]);
  };

  onNewItemCancel = (_id: number) => {
    this.props.deleteCategory(_id);
  };

  onSubmit = async (category: {
    _id: number;
    title: string;
    imgSrc: string;
    img?: File;
  }): Promise<string> => {
    let message = '';
    if (category._id < 0) {
      await this.props.englishForKidsService
        .createCategory(category)
        .then((newCategory) => {
          console.log(newCategory);
          this.props.updateCategory(newCategory, category._id);
        })
        .catch((err) => {
          if (err.code === 11000) message = 'This name is already taken';
          else message = err.message;
        });
      // await this.props.englishForKidsService
      //   .createCategory({
      //     title: category.title,
      //     imgSrc: category.imgSrc,
      //     img: category.img,
      //   })
      //   .then((newCategory) => {
      //     this.setState((state) => {
      //       return { categories: state.categories.filter((c) => c._id >= 0) };
      //     });
      //     this.props.addNewCategories([newCategory]);
      //   })
      //   .catch((err) => {
      //     if (err.code === 11000) message = 'This name is already taken';
      //     else message = err.message;
      //   });
    } else {
      await this.props.englishForKidsService
        .updateCategory(category)
        .then((newCategory) => {
          console.log(newCategory);
          this.props.updateCategory(newCategory);
        })
        .catch((err) => {
          if (err.code === 11000) message = 'This name is already taken';
          else message = err.message;
        });
    }

    return message;
  };

  private setUpdatedCategoryToState = (oldId: number, newCategory: TCategory) => {
    this.setState(({ categories }) => {
      const newCategories = categories.map((item) => {
        if (item._id === oldId) {
          item._id = newCategory._id;
          item.title = newCategory.title;
          item.imgSrc = newCategory.imgSrc;
          item.cardCount = newCategory.cardCount;
        }
        return item;
      });
      return { categories: newCategories };
    });
  };

  onAddWords = (category: TCategory) => {
    this.props.selectCategory(category);
    this.setState({ redirect: category.title });
  };
}

interface ICategoryItemProps {
  category: TCategory;
  onNewItemCancel?: (_id: number) => void;
  onAddWords: (category: TCategory) => void;
  onSubmit: (data: { _id: number; title: string; imgSrc: string; img?: File }) => Promise<string>;
  onDelete: (_id: number) => void;
}

const AdminPanelCategoryListItem = (props: ICategoryItemProps) => (
  <li className="categories-list__item">
    <AdminPanelCategoryCard
      category={props.category}
      onNewItemCancel={props.onNewItemCancel}
      onAddWordsClick={props.onAddWords}
      onSubmitClick={props.onSubmit}
      onDeleteClick={props.onDelete}
    />
  </li>
);

const mapStateToProps = ({ categories }: TAppState) => {
  return { categories };
};

const mapDispatchToProps = {
  selectCategory,
  updateCategory,
  addNewCategories,
  clearCategories,
  deleteCategory,
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(AdminPanelCategoryList);
