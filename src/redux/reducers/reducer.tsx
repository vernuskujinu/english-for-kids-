import { ACTIONS } from '../actions/actions';

import { AnyAction } from '@reduxjs/toolkit';
import { TCard, TCategory, TGameAssets } from '../../services/english-for-kids-service';

export enum APP_MODES {
  train = 'train',
  play = 'play',
}

export enum GAME_MODES {
  none = 'none',
  ready = 'ready',
  game = 'game',
  finish = 'finish',
}

export type TAppState = {
  loggedAsAdmin: boolean;

  mode: APP_MODES;
  isAppNavShown: boolean;
  isAppLoginModalShown: boolean;
  categories: TCategory[];
  selectedCategory: TCategory | null;

  loading: boolean;
  error: boolean | { object: string; message: string };

  cards: TCard[];
  gameMode: GAME_MODES;
  currentCard: TCard | null;
  attempts: boolean[];
  cardsToPlay: TCard[];
  gameAssets: TGameAssets;
};

const initalState: TAppState = {
  loggedAsAdmin: false,

  mode: APP_MODES.train,
  isAppLoginModalShown: false,
  categories: [],
  loading: false,
  error: false,
  isAppNavShown: false,
  selectedCategory: null,
  cards: [],
  gameMode: GAME_MODES.none,
  currentCard: null,
  attempts: [],
  cardsToPlay: [],
  gameAssets: {
    correctSoundSrc: '',
    incorrecSoundtSrc: '',
    winImageSrc: '',
    looseSoundSrc: '',
    looseImageSrc: '',
    winSoundSrc: '',
  },
};

const reducer = (state = initalState, action: AnyAction): TAppState => {
  switch (action.type) {
    case ACTIONS.APP_SET_MODE:
      const unGuessCards = [...state.cards].map((card) => {
        card.isGuessed = false;
        return card;
      });
      return {
        ...state,
        gameMode: GAME_MODES.ready,
        attempts: [],
        currentCard: null,
        mode: action.payload,
        cards: unGuessCards,
      };
    case ACTIONS.ADD_NEW_CATEGORIES:
      return {
        ...state,
        categories: [...state.categories, ...action.payload],
      };
    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((category) =>
          category._id === action.payload.id ? action.payload.category : category,
        ),
      };
    case ACTIONS.DELETE_CARD:
      return {
        ...state,
        cards: state.cards.filter((c) => c._id !== action.payload),
      };
    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter((c) => c._id !== action.payload),
      };
    case ACTIONS.ADD_NEW_CARDS:
      return { ...state, cards: [...state.cards, ...action.payload] };

    case ACTIONS.UPDATE_CARD:
      return {
        ...state,
        cards: state.cards.map((card) =>
          card._id === action.payload.id ? action.payload.card : card,
        ),
      };
    case ACTIONS.FETCH_LOGIN_REQUESTED:
      return { ...state, loading: true, error: false };
    case ACTIONS.FETCH_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: { object: 'login-modal', message: action.payload.message },
      };
    case ACTIONS.FETCH_LOGIN_SUCCESS:
      sessionStorage.setItem('auth', JSON.stringify(action.payload));
      return {
        ...state,
        loading: false,
        loggedAsAdmin: true,
        isAppLoginModalShown: false,
        categories: [],
        error: false,
      };
    case ACTIONS.FETCH_CATEGORIES_REQUESTED:
      return { ...state, categories: [], loading: true, error: false };
    case ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, loading: false, error: false };
    case ACTIONS.FETCH_CATEGORIES_FAILURE:
      return { ...state, categories: [], loading: false, error: true };
    case ACTIONS.APP_SET_NAV_SHOW:
      return { ...state, isAppNavShown: action.payload };
    case ACTIONS.GAME_SET_CATEGORY:
      if (action.payload === null)
        return {
          ...state,
          isAppNavShown: false,
          attempts: [],
          cards: [],
          selectedCategory: action.payload,
        };
      return { ...state, isAppNavShown: false, attempts: [], selectedCategory: action.payload };
    case ACTIONS.SET_CUSTOM_GAME_CARDS:
      return {
        ...state,
        selectedCategory: {
          _id: -1,
          cardCount: action.payload.length,
          imgSrc: '',
          title: 'Custom cards',
        },
        cards: action.payload,
      };

    case ACTIONS.APP_LOGOUT:
      return { ...state, categories: [], selectedCategory: null, cards: [], loggedAsAdmin: false };
    case ACTIONS.FETCH_GAME_CARDS_REQUESTED:
      return { ...state, gameMode: GAME_MODES.none, cards: [], loading: true, error: false };
    case ACTIONS.FETCH_GAME_CARDS_SUCCESS:
      const cards = action.payload.map((card: TCard) => ({ ...card, isGuessed: false }));
      return { ...state, gameMode: GAME_MODES.ready, cards, loading: false, error: false };
    case ACTIONS.FETCH_GAME_CARDS_FAILURE:
      return { ...state, gameMode: GAME_MODES.none, cards: [], loading: false, error: true };
    case ACTIONS.GAME_SET_MODE:
      // if (action.payload === GAME_MODES.none)
      //   return { ...state, attempts: [], gameMode: action.payload };
      return { ...state, gameMode: action.payload };
    case ACTIONS.GAME_SET_CURRENT_CARD:
      return { ...state, currentCard: action.payload };
    case ACTIONS.CLEAR_CATEGORIES:
      return { ...state, categories: [] };

    case ACTIONS.GAME_ADD_ATTEMPT: {
      if (action.payload === true) {
        const newCardsToPlay = [...state.cardsToPlay];
        newCardsToPlay.pop();

        const newCards = state.cards.map((card) =>
          card === state.currentCard ? ((card.isGuessed = true), card) : card,
        );

        const cardToPlay = newCardsToPlay[newCardsToPlay.length - 1];

        return {
          ...state,
          cards: newCards,
          currentCard: cardToPlay,
          cardsToPlay: newCardsToPlay,
          attempts: [...state.attempts, action.payload],
        };
      }
      return { ...state, attempts: [...state.attempts, action.payload] };
    }
    case ACTIONS.GAME_CLEAR_ATTEMPTS: {
      return { ...state, attempts: [] };
    }
    case ACTIONS.GAME_SET_CARDS_TO_PLAY: {
      return {
        ...state,
        currentCard: action.payload[action.payload.length - 1],
        cardsToPlay: action.payload,
      };
    }
    case ACTIONS.FETCH_GAME_ASSETS_SUCCESS:
      return {
        ...state,
        gameAssets: action.payload,
      };
    case ACTIONS.APP_SET_LOGIN_MODAL_SHOW:
      return {
        ...state,
        isAppLoginModalShown: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
