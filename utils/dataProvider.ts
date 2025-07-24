// src/utils/dataProvider.ts

const dataProvider = {
  getList: () => {
    return Promise.resolve([
      { id: 1, name: "Élève A" },
      { id: 2, name: "Élève B" },
    ]);
  },
};

export default dataProvider;
