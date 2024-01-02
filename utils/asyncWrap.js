// asyncWrap.js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err, res)); // Pass the 'res' object to 'next'
  };
};
