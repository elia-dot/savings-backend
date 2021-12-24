const date = new Date();

const addProfit = async () => {
  const Child = require('./models/Child');
  const Saving = require('./models/Saving');
  try {
    console.log('addindg profit');
    const childs = await Child.find();
    console.log('childs');
    childs.forEach((child) => {
      const total = child.saving + child.profit;
      const profit = total * (child.revenue / 100);
      child.profit += profit;
      child.save();

      const createSaving = async () => {
        await Saving.create({
          user: child._id,
          amount: profit,
          description: 'monthly profit',
        });
      };
      createSaving();
    });
    console.log('profit added');
  } catch (error) {
    console.log(error);
  }
};

if (date.getDate() === 24) {
  addProfit();
} else {
  console.log('Not today');
}
