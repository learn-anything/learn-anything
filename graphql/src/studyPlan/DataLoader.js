// @flow

import faker from 'faker';

export type StudyPlanType = $ReadOnly<{|
  title: string,
  description: string,
  author: {
    id: string,
    userName: string,
  },
|}>;

const fakePlan = () => {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    author: {
      id: faker.random.uuid(),
      userName: faker.internet.userName(),
    },
  };
};

export default class DataLoader {
  async search(query: string): Promise<$ReadOnlyArray<StudyPlanType>> {
    console.warn(query);
    return Array(5)
      .fill(0)
      .map(() => fakePlan());
  }
}
