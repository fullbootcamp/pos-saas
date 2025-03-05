
// File: backend/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Use pool from config/db.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path'); // Add this import at the top
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT, 10),
  secure: process.env.MAIL_ENCRYPTION === 'ssl',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const generateToken = (payload, expiresIn = '1h') => 
  jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });

const hashPassword = (password) => bcrypt.hash(password, 10);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const sendVerificationEmail = async (to, subject, content, isHtml = false) => {
  const mailOptions = {
    from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject,
    [isHtml ? 'html' : 'text']: content,
  };
  await transporter.sendMail(mailOptions);
};
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Verifying token:', token); // Debug token

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded token:', decoded); // Debug decoded result
    req.userId = decoded.id;

    const [userRows] = await pool.query(
      'SELECT id, name, email, role, email_verified_at, store_id, is_store_setup_complete, plan_id, trial_ends_at, is_dashboard_created FROM users WHERE id = ?',
      [decoded.id]
    );
    if (!userRows || userRows.length === 0) {
      console.log('User not found for id:', decoded.id);
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = userRows[0];
    console.log('Authenticated user:', req.user); // Debug user

    // Allow minimal auth for status check
    const allowedSetupRoutes = ['/api/status/status', '/stores', '/subscriptions', '/update-subscription-end', '/api/status'];
    if (allowedSetupRoutes.includes(req.originalUrl)) {
      console.log(`Allowing access to ${req.originalUrl} for user: ${req.user.id}`);
      return next(); // Bypass full checks for status
    }

    // Dashboard-specific checks
    if (req.user.email_verified_at && req.user.is_store_setup_complete && req.user.plan_id && req.user.is_dashboard_created) {
      const [subscription] = await pool.query(
        'SELECT ends_at FROM subscriptions WHERE user_id = ? ORDER BY ends_at DESC LIMIT 1',
        [req.user.id]
      );
      const subscriptionEnd = subscription[0]?.ends_at ? new Date(subscription[0].ends_at) : null;
      if (subscriptionEnd && subscriptionEnd < new Date()) {
        console.log('Subscription expired for user:', req.user.id);
        return res.status(403).json({ message: 'Subscription expired' });
      }
    } else {
      console.log('User setup incomplete:', req.user);
      return res.status(403).json({ message: 'User setup or subscription incomplete' });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error.message, error.stack);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired, please log in again' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

app.use(express.static(path.join(__dirname, 'build'))); // Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateToken({ email }, '1h');
    await pool.query(
      'INSERT INTO users (name, email, password, verification_token, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, verificationToken, 'user', new Date()]
    );

    const verificationLink = `http://localhost:5173/email-verified?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; text-align: center;">
            <img src="https://your-retailpoz-logo-url.com/logo.png" alt="RetailPoz Logo" style="max-width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #6b46c1;">Validate Your Email</h2>
            <p>Hi ${name},</p>
            <p>Thank you for creating a RetailPoz account. Please click the button below to validate your email address:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #6b46c1; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Confirm Your Email Here</a>
            <p>If this link doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all;">${verificationLink}</p>
            <p>If you didn't create a new account, please ignore this email and don't click the link above.</p>
            <p>Cheers,<br />The RetailPoz Crew<br />Your POS HQ, Somewhere Awesome<br />© 2025 RetailPoz Inc.<br />Questions? Hit us at <a href="mailto:support@retailpoz.com" style="color: #6b46c1;">support@retailpoz.com</a></p>
          </div>
        </body>
      </html>
    `;

    await sendVerificationEmail(email, 'Validate Your RetailPoz Email', emailContent, true);
    res.json({ message: 'Registration successful. Check your email to verify.', verificationToken });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await comparePassword(password, user[0].password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });
    if (!user[0].email_verified_at) return res.status(400).json({ message: 'Email not verified' });

    const [storeUsers] = await pool.query('SELECT store_location_id, role FROM store_users WHERE user_id = ?', [user[0].id]);
    const token = generateToken({ id: user[0].id, role: user[0].role || 'user', locationRoles: storeUsers });
    console.log('Login token payload:', { id: user[0].id, role: user[0].role, locationRoles: storeUsers }); // Debug

    const [store] = await pool.query('SELECT slug FROM stores WHERE user_id = ?', [user[0].id]);
    const redirectTo = user[0].role === 'superadmin' 
      ? '/superadmin-dashboard' 
      : (user[0].email_verified_at && user[0].is_store_setup_complete && user[0].plan_id && store.length > 0) 
        ? `/dashboard/${store[0].slug}` 
        : '/onboarding';

    res.json({
      token,
      user: { id: user[0].id, email: user[0].email, name: user[0].name },
      redirectTo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/verify-email', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { email } = decoded;
    const [user] = await pool.query('SELECT * FROM users WHERE email = ? AND verification_token = ?', [email, token]);
    if (user.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

    await pool.query('UPDATE users SET email_verified_at = ?, verification_token = NULL WHERE email = ?', [new Date(), email]);
    res.json({ message: 'Email verified successfully!', email, user: { name: user[0].name } });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

app.post('/api/auth/resend-verification-email', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { email } = decoded;
    const [user] = await pool.query('SELECT name FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ message: 'User not found' });
    if (user[0].email_verified_at) return res.status(400).json({ message: 'Email already verified' });

    const verificationToken = generateToken({ email }, '1h');
    await pool.query('UPDATE users SET verification_token = ? WHERE email = ?', [verificationToken, email]);

    const verificationLink = `http://localhost:5173/email-verified?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; text-align: center;">
            <img src="https://your-retailpoz-logo-url.com/logo.png" alt="RetailPoz Logo" style="max-width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #6b46c1;">Validate Your Email</h2>
            <p>Hi ${user[0].name},</p>
            <p>You requested a new verification link for your RetailPoz account. Click below to validate your email:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #6b46c1; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Confirm Your Email Here</a>
            <p>If this link doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all;">${verificationLink}</p>
            <p>If you didn’t request this, ignore this email and don’t click the link.</p>
            <p>Cheers,<br />The RetailPoz Crew<br />Your POS HQ, Somewhere Awesome<br />© 2025 RetailPoz Inc.<br />Questions? Hit us at <a href="mailto:support@retailpoz.com" style="color: #6b46c1;">support@retailpoz.com</a></p>
          </div>
        </body>
      </html>
    `;

    await sendVerificationEmail(email, 'Validate Your RetailPoz Email', emailContent, true);
    res.json({ message: 'Verification email resent successfully.' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

app.post('/api/auth/update-email', async (req, res) => {
  const { email: newEmail, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { email: oldEmail } = decoded;
    const [user] = await pool.query('SELECT name FROM users WHERE email = ?', [oldEmail]);
    if (user.length === 0) return res.status(400).json({ message: 'User not found' });

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [newEmail]);
    if (existing.length > 0) return res.status(400).json({ message: 'New email already in use' });

    const verificationToken = generateToken({ email: newEmail }, '1h');
    await pool.query('UPDATE users SET email = ?, verification_token = ? WHERE email = ?', [newEmail, verificationToken, oldEmail]);

    const verificationLink = `http://localhost:5173/email-verified?token=${verificationToken}&email=${encodeURIComponent(newEmail)}`;
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; text-align: center;">
            <img src="https://your-retailpoz-logo-url.com/logo.png" alt="RetailPoz Logo" style="max-width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #6b46c1;">Validate Your New Email</h2>
            <p>Hi ${user[0].name},</p>
            <p>You’ve updated your RetailPoz email. Click below to validate your new address:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #6b46c1; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Confirm Your Email Here</a>
            <p>If this link doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all;">${verificationLink}</p>
            <p>If you didn’t request this change, ignore this email and don’t click the link.</p>
            <p>Cheers,<br />The RetailPoz Crew<br />Your POS HQ, Somewhere Awesome<br />© 2025 RetailPoz Inc.<br />Questions? Hit us at <a href="mailto:support@retailpoz.com" style="color: #6b46c1;">support@retailpoz.com</a></p>
          </div>
        </body>
      </html>
    `;

    await sendVerificationEmail(newEmail, 'Validate Your New RetailPoz Email', emailContent, true);
    res.json({ message: 'Email updated. Check your new email to verify.', token: verificationToken });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

app.get('/api/status', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const [subscription] = await pool.query(
      'SELECT s.*, p.name AS planName, p.price, p.interval FROM subscriptions s LEFT JOIN plans p ON s.plan_id = p.id WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 1',
      [user.id]
    );
    const [store] = await pool.query('SELECT slug FROM stores WHERE user_id = ?', [user.id]);
    
    const status = {
      userName: user.name,
      registration: true,
      emailVerified: !!user.email_verified_at,
      storeSetup: !!user.is_store_setup_complete,
      planSelected: !!user.plan_id,
      dashboardCreated: !!user.is_dashboard_created,
      subscription: subscription.length > 0 ? {
        planName: subscription[0].planName,
        price: subscription[0].price || 0,
        interval: subscription[0].interval || '7 days',
        startsAt: subscription[0].starts_at,
        endsAt: subscription[0].ends_at,
        isAutoRenew: !!subscription[0].is_auto_renew,
      } : null,
      planId: user.plan_id,
      trial_ends_at: user.trial_ends_at,
      subscription_ends_at: subscription.length > 0 ? subscription[0].ends_at : null,
    };
    console.log('Status response:', status);
    res.json({ status });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/api/stores', authenticate, async (req, res) => {
  const { name, type, locationCount } = req.body;
  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    // Insert into stores table
    const storeResult = await pool.query(
      'INSERT INTO stores (name, slug, type, user_id, created_at, location_count) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, type, req.user.id, new Date(), locationCount]
    );

    const storeId = storeResult.insertId;

    // Insert into store_users table
    await pool.query(
      'INSERT INTO store_users (user_id, store_id, role, created_at) VALUES (?, ?, ?, ?)',
      [req.user.id, storeId, 'owner', new Date()]
    );

    // Insert into store_locations table
    for (let i = 0; i < locationCount; i++) {
      await pool.query(
        'INSERT INTO store_locations (store_id, address, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [storeId, `Location ${i + 1} Address`, `555-0${i+1}23`, new Date(), new Date()]
      );
    }
    await pool.query('UPDATE users SET store_id = ?, is_store_setup_complete = 1 WHERE id = ?', [storeId, req.user.id]);
    res.status(201).json({ message: 'Store created successfully', slug });
  } catch (error) {
    console.error('Store creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/api/subscriptions', authenticate, async (req, res) => {
  const { planId } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM subscriptions WHERE user_id = ? AND ends_at > ?', [req.user.id, new Date()]);
    
    const [plan] = await pool.query('SELECT duration FROM plans WHERE id = ?', [planId]);
    if (plan.length === 0) return res.status(400).json({ message: 'Invalid plan ID' });

    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + plan[0].duration * 24 * 60 * 60 * 1000);

    if (existing.length > 0) {
      // Update existing subscription
      await pool.query(
        'UPDATE subscriptions SET plan_id = ?, starts_at = ?, ends_at = ?, updated_at = ? WHERE user_id = ? AND ends_at > ?',
        [planId, startsAt, endsAt, new Date(), req.user.id, new Date()]
      );
    } else {
      // Insert new subscription
      await pool.query(
        'INSERT INTO subscriptions (user_id, plan_id, starts_at, ends_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, planId, startsAt, endsAt, new Date(), new Date()]
      );
    }
    await pool.query('UPDATE users SET plan_id = ? WHERE id = ?', [planId, req.user.id]);

    const [store] = await pool.query('SELECT slug FROM stores WHERE user_id = ?', [req.user.id]);
    if (store.length === 0) return res.status(400).json({ message: 'Store not found' });

    const redirectTo = planId === 1 ? `/dashboard/${store[0].slug}` : '/payment';
    res.status(201).json({ message: 'Subscription updated successfully', redirectTo, storeSlug: store[0].slug });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/update-dashboard-created', authenticate, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_dashboard_created = 1 WHERE id = ?', [req.user.id]);
    res.json({ message: 'Dashboard created flag updated' });
  } catch (error) {
    console.error('Update dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Superadmin Routes
app.get('/api/superadmin/users', authenticate, async (req, res) => {
  if (!['superadmin', 'tech lead'].includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
  const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE role != "user"'); // Removed 'status'
  res.json(users);
});

app.post('/api/superadmin/users', authenticate, async (req, res) => {
  try {
    if (!['superadmin', 'tech lead'].includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    const { name, email, password, role } = req.body;

    // Check if email exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user (assuming is_store_setup_complete and is_dashboard_created default to 0)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, is_store_setup_complete, is_dashboard_created) VALUES (?, ?, ?, ?, 0, 0)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ id: result.insertId, name, email, role });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error creating user' });
  }
});

// NEW: GET /api/superadmin/tasks (to fetch task list)
/**
 * @route GET /api/superadmin/tasks
 * @desc Fetch all tasks for superadmin/tech lead
 * @access Private
 * @requires JWT
 */
app.get('/api/superadmin/tasks', authenticate, async (req, res) => {
    try {
      if (!['superadmin', 'tech lead'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Fetch tasks from the database
      const [tasks] = await pool.query(
        'SELECT tasks.id, tasks.title, tasks.status, tasks.deadline, tasks.notes, tasks.urgent, tasks.created_at AS createdAt FROM tasks'
      );
  
      // Fetch user IDs for each task from the junction table
      const tasksWithUsers = await Promise.all(tasks.map(async (task) => {
        const [userIds] = await pool.query('SELECT user_id FROM task_users WHERE task_id = ?', [task.id]);
        const [users] = await pool.query('SELECT id, name, role FROM users WHERE id IN (?)', [userIds.map((u) => u.user_id)]);
        return {
          id: task.id,
          userIds: userIds.map((u) => u.user_id), // Return array of user IDs
          title: task.title,
          status: task.status, // JavaScript will return the string, e.g., 'To Do', 'In Progress', 'Done'
          deadline: task.deadline,
          notes: task.notes || '',
          urgent: !!task.urgent, // Convert 1/0 to boolean
          createdAt: task.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        };
      }));
  
      res.json(tasksWithUsers);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

/**
 * @typedef {Object} Task
 * @property {number} id - Task ID
 * @property {number[]} userIds - Array of user IDs assigned to the task
 * @property {string} title - Task title
 * @property {'To Do' | 'In Progress' | 'Done'} status - Task status
 * @property {string|null} deadline - Due date (YYYY-MM-DD or null)
 * @property {string} notes - Task notes
 * @property {boolean} urgent - Whether the task is urgent
 * @property {string} createdAt - Date of task creation (YYYY-MM-DD)
 */

/**
 * @route POST /api/superadmin/tasks
 * @desc Create a new task for superadmin/tech lead with multiple users
 * @access Private
 * @requires JWT
 */
app.post('/api/superadmin/tasks', authenticate, async (req, res) => {
    try {
      if (!['superadmin', 'tech lead'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { title, userIds, deadline, notes, urgent } = req.body;
  
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: 'At least one userId is required' });
      }
  
      // Insert the task into tasks table
      const [result] = await pool.query(
        'INSERT INTO tasks (title, status, deadline, notes, urgent) VALUES (?, "To Do", ?, ?, ?)',
        [title, deadline, notes, urgent ? 1 : 0]
      );
      const taskId = result.insertId;
  
      // Insert relationships into task_users for each userId
      const userInserts = userIds.map((userId) =>
        pool.query('INSERT INTO task_users (task_id, user_id) VALUES (?, ?)', [taskId, userId])
      );
      await Promise.all(userInserts);
  
      // Fetch the new task with users
      const [newTask] = await pool.query(
        'SELECT tasks.id, tasks.title, tasks.status, tasks.deadline, tasks.notes, tasks.urgent, tasks.created_at AS createdAt FROM tasks WHERE id = ?',
        [taskId]
      );
      const [userIdsResult] = await pool.query('SELECT user_id FROM task_users WHERE task_id = ?', [taskId]);
      const usersResponse = await pool.query(
        'SELECT id, name, role FROM users WHERE id IN (?)',
        [userIdsResult.map((u) => u.user_id)]
      );
  
      res.status(201).json({
        id: newTask[0].id,
        userIds: userIdsResult.map((u) => u.user_id),
        title: newTask[0].title,
        status: /** @type {'To Do' | 'In Progress' | 'Done'} */ (newTask[0].status),
        deadline: newTask[0].deadline,
        notes: newTask[0].notes || '',
        urgent: !!newTask[0].urgent,
        createdAt: newTask[0].createdAt.toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Superadmin task creation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await pool.getConnection();
    console.log('MySQL connected successfully!');
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
});