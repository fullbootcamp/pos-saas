const superadminDao = require('../dao/superadminDao');

class SuperadminService {
  static async getUsers() {
    return await superadminDao.getUsers();
  }

  static async createUser(name, email, password, role) {
    const existingUsers = await superadminDao.findUserByEmail(email);
    if (existingUsers.length) throw new Error('Email already exists');

    const hashedPassword = await superadminDao.hashPassword(password);
    const userId = await superadminDao.createUser(name, email, hashedPassword, role);
    return { id: userId, name, email, role };
  }

  static async getTasks() {
    const tasks = await superadminDao.getTasks();
    return await Promise.all(tasks.map(async (task) => {
      const userIds = await superadminDao.getTaskUserIds(task.id);
      const users = await superadminDao.getUsersByIds(userIds.map(u => u.user_id));
      return {
        id: task.id,
        userIds: userIds.map(u => u.user_id),
        title: task.title,
        status: task.status,
        deadline: task.deadline,
        notes: task.notes || '',
        urgent: !!task.urgent,
        createdAt: task.createdAt.toISOString().split('T')[0],
      };
    }));
  }

  static async createTask(title, userIds, deadline, notes, urgent) {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new Error('At least one userId is required');
    }
    const taskId = await superadminDao.createTask(title, deadline, notes, urgent);
    await Promise.all(userIds.map(userId => superadminDao.assignTaskToUser(taskId, userId)));

    const [newTask] = await superadminDao.getTaskById(taskId);
    const userIdsResult = await superadminDao.getTaskUserIds(taskId);
    return {
      id: newTask.id,
      userIds: userIdsResult.map(u => u.user_id),
      title: newTask.title,
      status: newTask.status,
      deadline: newTask.deadline,
      notes: newTask.notes || '',
      urgent: !!newTask.urgent,
      createdAt: newTask.createdAt.toISOString().split('T')[0],
    };
  }
}

module.exports = SuperadminService;