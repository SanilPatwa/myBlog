const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({
      message: "No token found",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  if (userId !== undefined) {
    req.userId = userId;
    next();
  } else {
    res.status(403).json({
      message: "Invalid Token",
    });
  }
}

module.exports = {
  authMiddleware: authMiddleware,
};
// const jwt = require("jsonwebtoken");

// function authMiddleware(req, res, next) {
//   const token = req.headers.token;
//   const decoded = jwt.verify(token, "Sanilsecretkey");
//   const userId = decoded.userId;
//   if (userId) {
//     const user = req.userId;
//     next();
//   } else {
//     res.status(403).json({
//       message: "Invalid Token",
//     });
//   }
// }
// module.exports = {
//   authMiddleware: authMiddleware,
// };
