const Child = require('./models/Child');
const Saving = require('./models/Saving');
const date = new Date();

const addProfit = async () => {
  try {
    const childs = await Child.find({ revenue: { $gt: 0 } });
    console.log(childs);
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
  } catch (error) {
    console.log(error);
  }
};

if (date.getDate() === 24) {
  addProfit();
} else {
  console.log('Not today');
}
