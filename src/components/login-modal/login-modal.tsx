import React, { FormEvent } from 'react';
import { connect } from 'react-redux';
import { TAppState } from '../../redux/reducers/reducer';
import { setLoginModalShown, login } from '../../redux/actions/actions';

import './login-modal.sass';
import compose from '../../utils/compose';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';
import { AppDispatch } from '../../store';
import EnglishForKidsService from '../../services/english-for-kids-service';
import { bindActionCreators } from 'redux';

interface IState {
  login: string;
  password: string;
}

interface IProps {
  isAppLoginModalShown: boolean;
  setShown: typeof setLoginModalShown;
  login: (login: string, password: string) => void;
  error: boolean | { object: string; message: string };
}

class LoginModal extends React.Component<IProps, IState> {
  state: IState = {
    login: '',
    password: '',
  };

  render() {
    const { login, password } = this.state;

    const { isAppLoginModalShown } = this.props;
    return (
      <div
        className={`login-modal__wrapper ${isAppLoginModalShown ? 'modal--shown' : ''}`}
        onClick={this.hideModal}
      >
        <div className="login-modal">
          <h3 className="typography-h3">Login</h3>
          <form
            method="POST"
            className="login-modal__form"
            onSubmit={this.login}
            onReset={this.reset}
          >
            <div className="login-modal__inputs-wrapper">
              <input
                className="input input-text"
                type="text"
                placeholder="Login"
                onChange={(e) => this.setState({ login: e.target.value })}
                value={login}
              />
              <input
                className="input input-text"
                type="password"
                placeholder="Password"
                onChange={(e) => this.setState({ password: e.target.value })}
                value={password}
              />
            </div>
            <span className="login-modal__error-message">
              {this.props.error &&
              (this.props.error as Record<string, string>).object === 'login-modal'
                ? (this.props.error as Record<string, string>).message
                : ''}
            </span>
            <div className="login-modal__buttons-wrapper">
              <button type="reset" className="button button-cancel">
                Cancel
              </button>
              <button type="submit" className="button button-submit" disabled={!login || !password}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  hideModal = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) this.props.setShown(false);
  };

  login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.props.login(this.state.login, this.state.password);
  };

  reset = () => {
    this.setState({ login: '', password: '' });
    this.props.setShown(false);
  };
}

const mapStateToProps = ({ isAppLoginModalShown, error }: TAppState) => {
  return { isAppLoginModalShown, error };
};

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      setShown: setLoginModalShown,
      login: login(englishForKidsService),
    },
    dispatch,
  );
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(LoginModal);
