import APIerror from '../utils/API-Error.js';

export const adminOnly = (req, res, next) => {
  if(req.user?.role !== 'admin'){
    throw new APIerror(403, "Admin access is required")
  }
  next();
}