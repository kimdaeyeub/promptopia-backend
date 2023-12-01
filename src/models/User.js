import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  avatarUrl: {
    type: String,
    required: [true, 'AvatarUrl is required'],
  },
});

const User = mongoose.model('User', userSchema);

export default User;
