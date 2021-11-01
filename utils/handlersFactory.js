const User = require('../models/User');

module.exports.createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create({ ...req.body, user: req.user._id });

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
};

module.exports.getOneById = (Model) => async (req, res) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        error: `doc not exist`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
};

module.exports.getAllByUser = (Model) => async (req, res) => {
  try {
    const docs = await Model.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    if (!docs) {
      return res.status(404).json({
        status: 'fail',
        error: `docs not exist`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: docs,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
};

module.exports.getAll = (Model) => async (req, res) => {
  try {
    const docs = await Model.find();
    res.status(200).json({
      status: 'success',
      data: {
        data: docs,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
};

module.exports.updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findOneAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        error: `doc not exist`,
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
};

module.exports.deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        error: `doc not exist`,
      });
    }
    if (req.baseUrl === '/savings') {
      const user = await User.findById(req.user._id);
      user.saving -= this.amount * 1;

      await user.save();
    }
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
};
