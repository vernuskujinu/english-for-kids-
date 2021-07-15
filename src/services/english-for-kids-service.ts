import { logout } from '../redux/actions/actions';
import store from '../store';

export type TCategory = {
  _id: number;
  title: string;
  imgSrc: string;
  cardCount: number;
};

export type TNewCategory = {
  title: string;
  imgSrc: string;
};

export type TCard = {
  _id: number;
  word: string;
  translation: string;
  imgSrc: string;
  audioSrc: string;
  category: string;
  isGuessed: boolean;
};

export type TGameAssets = {
  correctSoundSrc: string;
  incorrecSoundtSrc: string;
  winSoundSrc: string;
  looseSoundSrc: string;
  winImageSrc: string;
  looseImageSrc: string;
};

export type TWordToAdd = {
  _id: number;
  word: string;
  translation: string;
  imgSrc: string;
  img: File | undefined;
  audioSrc: string;
  audio: File | undefined;
  category: string;
};

function checkAuthReponse(response: Response) {
  if (response.status === 401) store.dispatch(logout());
}

export default class EnglishForKidsService {
  defaultURL = 'https://rnssnc-english-for-kids-api.herokuapp.com';
  // defaultURL = 'http://localhost:80';
  categoreisURL = `${this.defaultURL}/categories`;
  loginURL = `${this.defaultURL}/login`;

  async login(login: string, password: string) {
    return new Promise<{ token: string; userLogin: string }>(async (resolve, reject) => {
      const response = await fetch(this.loginURL, {
        method: 'POST',
        body: JSON.stringify({ login, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) resolve(await response.json());
      if (!response.ok) reject(await response.json());
    });
  }

  async getCategories(page = 0) {
    return new Promise<TCategory[]>(async (resolve, reject) => {
      const categoriesResponse = await fetch(`${this.categoreisURL}?_page=${page}`);

      checkAuthReponse(categoriesResponse);

      const categories: TCategory[] = await categoriesResponse.json();

      const categoriesWithLength = [];

      for (let i = 0; i < categories.length; i++) {
        const length = await this.getCategoryLength(categories[i].title);

        categoriesWithLength.push({ ...categories[i], cardCount: length });
      }

      resolve(categoriesWithLength);
    });
  }

  async getCategoryCards(title: string, page = 0) {
    const link = title.split(' ').join('-');
    const response = await fetch(`${this.defaultURL}/${link}/words?_page=${page}`);

    checkAuthReponse(response);

    return response.json();
  }

  async getGameAssets() {
    return (await fetch(`./assets/assets.json`)).json();
  }

  private getCategoryLength = async (category: string) => {
    const response = await fetch(`${this.defaultURL}/${category}/words/length`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const length = await response.json();

    return length;
  };

  async createCategory(category: { title: string; imgSrc: string; img?: File }) {
    return new Promise<TCategory>(async (resolve, reject) => {
      const auth = sessionStorage.getItem('auth');

      const formData = new FormData();

      formData.set('title', category.title);
      formData.set('imgSrc', category.imgSrc);
      if (category.img) formData.set('image', category.img);

      const response = await fetch(this.categoreisURL, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: auth ? auth : '',
        },
      });

      checkAuthReponse(response);

      const data = await response.json();

      if (!response.ok) reject(data);

      if (response.ok) resolve({ ...data, cardCount: 0 });
    });
  }

  async createWord(word: TWordToAdd) {
    return new Promise<TCard>(async (resolve, reject) => {
      const auth = sessionStorage.getItem('auth');

      const formData = new FormData();

      formData.set('word', word.word);
      formData.set('translation', word.translation);
      formData.set('imgSrc', word.imgSrc);
      formData.set('audioSrc', word.audioSrc);
      formData.set('category', word.category);
      if (word.img) formData.set('image', word.img);
      if (word.audio) formData.set('audio', word.audio);

      const response = await fetch(`${this.defaultURL}/${word.category}/words`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: auth ? auth : '',
        },
      });

      checkAuthReponse(response);

      if (response.ok) resolve(await response.json());
      if (!response.ok) reject(await response.json());
    });
  }

  async deleteWord(title: string, _id: number) {
    const link = title.split(' ').join('-');

    const auth = sessionStorage.getItem('auth');

    return new Promise<TCategory>(async (resolve, reject) => {
      const response = await fetch(`${this.defaultURL}/${link}/words`, {
        method: 'DELETE',
        body: JSON.stringify({ _id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth ? auth : '',
        },
      });

      checkAuthReponse(response);

      if (response.ok) resolve(await response.json());
      if (!response.ok) reject(await response.json());
    });
  }

  async updateWord(word: TWordToAdd) {
    return new Promise<TCard>(async (resolve, reject) => {
      const auth = sessionStorage.getItem('auth');

      const formData = new FormData();

      formData.set('id', word._id.toString());
      formData.set('word', word.word);
      formData.set('translation', word.translation);
      formData.set('imgSrc', word.imgSrc);
      formData.set('audioSrc', word.audioSrc);
      formData.set('category', word.category);
      if (word.img) formData.set('image', word.img);
      if (word.audio) formData.set('audio', word.audio);

      const response = await fetch(`${this.defaultURL}/${word.category}/words`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: auth ? auth : '',
        },
      });

      checkAuthReponse(response);

      if (response.ok) resolve(await response.json());
      if (!response.ok) reject(await response.json());
    });
  }

  async updateCategory(category: { _id: number; imgSrc: string; title: string; img?: File }) {
    return new Promise<TCategory>(async (resolve, reject) => {
      const auth = sessionStorage.getItem('auth');

      const formData = new FormData();

      formData.set('id', category._id.toString());
      formData.set('title', category.title);
      formData.set('imgSrc', category.imgSrc);
      if (category.img) formData.set('image', category.img);

      const response = await fetch(this.categoreisURL, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: auth ? auth : '',
        },
      });

      checkAuthReponse(response);

      const data = await response.json();

      if (!response.ok) reject(data);

      const itemsCount = await this.getCategoryLength(data.title);

      if (response.ok) resolve({ ...data, cardCount: itemsCount });
    });
  }

  async deleteCategory(_id: number) {
    const auth = sessionStorage.getItem('auth');

    return new Promise<TCategory>(async (resolve, reject) => {
      const response = await fetch(this.categoreisURL, {
        method: 'DELETE',
        body: JSON.stringify({ _id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth ? auth : '',
        },
      });

      checkAuthReponse(response);

      const data = await response.json();

      if (response.ok) resolve(data);
      if (!response.ok) reject(data);
    });
  }

  async getCategoryCard(categoryId: number, cardWord: string) {
    const cards = await (await fetch(`./assets/categories/${categoryId}.json`)).json();

    return cards.find((card: TCard) => card.word === cardWord);
  }
}
