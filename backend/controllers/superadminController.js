const superadminService = require('../services/superadminService');

class SuperadminController {
  static async getUsers(req, res) {
    try {
      if (!['superadmin', 'tech lead'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const result = await superadminService.getUsers();
      res.json(result);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createUser(req, res) {
    try {
      if (!['superadmin', 'tech lead'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { name, email, password, role } = req.body;
      const result = await superadminService.createUser(name, email, password, role);
      res.status(201).json(result);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Internal server error creating user' });
    }
  }

  static async getTasks(req, res) {
    try {
      if (!['superadmin', 'tech lead'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const result = await superadminService.getTasks();
      res.json(result);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createTask(req, res) {
    try {
      if (!['superadmin', 'tech lead'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { title, userIds, deadline, notes, urgent } = req.body;
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: 'At least one userId is required' });
      }
      const result = await superadminService.createTask(title, userIds, deadline, notes, urgent);
      res.status(201).json(result);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = SuperadminController;