import { TCard } from './english-for-kids-service';

export type TWordStatistic = {
  card: TCard;
  trainCount: number;
  correctCount: number;
  incorrectCount: number;
  precent: string;
};

export default class StatisticService {
  static keyName = 'wordStatistic';

  static getStatistic(): TWordStatistic[] {
    const data = localStorage.getItem(this.keyName);
    if (data) return JSON.parse(data);

    return [];
  }

  static clearStatistic() {
    localStorage.setItem(this.keyName, '[]');
  }

  static increaseWordCorrect(card: TCard) {
    this.increaseField(card, 'correctCount');
  }

  static increaseWordIncorrect(card: TCard) {
    this.increaseField(card, 'incorrectCount');
  }

  static increaseWordTrain(card: TCard) {
    this.increaseField(card, 'trainCount', false);
  }

  private static increaseField(
    card: TCard,
    field: keyof TWordStatistic,
    recalculatePrecents = true,
  ) {
    const statistic = this.getStatistic();

    const index = statistic.findIndex(
      (item) => item.card.word === card.word && item.card.category === card.category,
    );

    if (index > -1) {
      statistic[index][field]++;

      if (recalculatePrecents)
        statistic[index].precent = `${Math.round(
          (statistic[index].correctCount /
            (statistic[index].incorrectCount + statistic[index].correctCount)) *
            100,
        )}%`;

      localStorage.setItem(this.keyName, JSON.stringify(statistic));
      return;
    }

    this.pushNewItem(card, field);
  }

  private static pushNewItem(card: TCard, field: keyof TWordStatistic) {
    const statistic = this.getStatistic();

    const newItem = {
      card: card,
      trainCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      precent: '-',
    };

    newItem[field]++;

    statistic.push(newItem);

    localStorage.setItem(this.keyName, JSON.stringify(statistic));
  }
}
