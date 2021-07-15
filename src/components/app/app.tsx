import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { HomePage, StatisticPage, GamePage, WordsPage, CategoriesPage } from '../pages';
import AppHeader from '../app-header/app-header';

import './app.sass';
import { connect } from 'react-redux';
import { AppDispatch } from '../../store';
import EnglishForKidsService from '../../services/english-for-kids-service';
import { bindActionCreators } from 'redux';
import { fetchCategories, fetchGameAssets } from '../../redux/actions/actions';
import compose from '../../utils/compose';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';
import AppNavigation from '../app-navigation/app-navigation';
import LavaLamp from '../lavalamp/lavalamp';
import { APP_MODES, TAppState } from '../../redux/reducers/reducer';
import AppFooter from '../app-footer/app-footer';
import LoginModal from '../login-modal/login-modal';
import AdminPanelHeader from '../admin-panel-header/admin-panel-header';

interface IProps {
  fetchCategories: (page: number) => void;
  fetchGameAssets: () => void;
  isAppLoginModalShown: boolean;
  isAppNavShown: boolean;
  loggedAsAdmin: boolean;
  mode: APP_MODES;
}

interface IState {
  redirect: boolean;
}

class App extends React.Component<IProps, IState> {
  state = {
    redirect: false,
  };

  componentDidMount() {
    this.props.fetchCategories(-1);
    this.props.fetchGameAssets();
    sessionStorage.clear();
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.loggedAsAdmin !== this.props.loggedAsAdmin) {
      this.setState({ redirect: true });
    }
  }

  render() {
    const { mode, isAppLoginModalShown, isAppNavShown, loggedAsAdmin } = this.props;

    isAppLoginModalShown || isAppNavShown
      ? document.body.classList.add('body--overflow-y-hidden')
      : document.body.classList.remove('body--overflow-y-hidden');

    this.setDocumentDatasetMode(mode);

    let redirect = null;

    if (this.state.redirect) {
      redirect = this.props.loggedAsAdmin ? <Redirect to="/categories" /> : <Redirect to="/" />;
    }

    return (
      <main role="main" className="main">
        <LavaLamp />
        {!loggedAsAdmin && <AppHeader />}
        {loggedAsAdmin && <AdminPanelHeader />}
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/statistic" component={StatisticPage} />
          <Route path="/game" component={GamePage} />
          <Route path="/:categories/words" component={WordsPage} />
          <Route path="/categories" component={CategoriesPage} />
        </Switch>
        <AppFooter />
        {!loggedAsAdmin && <AppNavigation />}
        <LoginModal />
        {redirect}
      </main>
    );
  }

  setDocumentDatasetMode(mode: APP_MODES) {
    document.documentElement.dataset.appMode = mode;
  }
}

const mapStateToProps = ({
  mode,
  isAppLoginModalShown,
  isAppNavShown,
  loggedAsAdmin,
}: TAppState) => {
  return { mode, isAppLoginModalShown, isAppNavShown, loggedAsAdmin };
};

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

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(App);
