const Child = require('./models/Child');
const Saving = require('./models/Saving');

const { handlePushTokens } = require('./utils/sentNotification');

const date = new Date();

const addProfit = async () => {
  const childs = await Child.find({ revenue: { $gt: 0 } });
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
    const body = {
      to: child._id,
      title: `קיבלת ${profit} ש"ח!`,
      body: `הסכום הופקד לחשבונך בעבור: ריבית חודשית`,
    };
    handlePushTokens(body)
  });
};

if (date.getDate() === 19) {
  addProfit();
} else {
  console.log('Not today');
}

