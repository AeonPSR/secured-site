function requireAdmin(req, res, next) {
	if (!req.session.user || req.session.user.role !== 'admin') {
	  return res.status(403).json({ message: 'Admin access only' });
	}
	next();
  }
  
  module.exports = requireAdmin;
  