// src/utils/dataProvider.ts

const dataProvider = {
  getList: () => {
    return Promise.resolve([
      { id: 1, name: "�l�ve A" },
      { id: 2, name: "�l�ve B" },
    ]);
  },
};

export default dataProvider;
