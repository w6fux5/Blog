/* eslint-disable func-names */
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    id: false,

    firstName: {
      required: [true, 'FirstName is required'],
      type: String,
      maxlength: [20, 'FirstName 最多ㄋ20個字'],
      trim: true,
    },

    lastName: {
      required: [true, 'LastName is required'],
      type: String,
      maxlength: [20, 'LastName 最多20個字'],
      trim: true,
    },

    profilePhoto: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },

    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      validate: {
        validator: isEmail,
        message: '無效的 Email 格式',
      },
    },

    bio: {
      type: String,
    },

    password: {
      required: [true, 'Password is required'],
      type: String,
      minlength: [6, '密碼至少六位數'],
      trim: true,
    },

    postCount: {
      type: Number,
      default: 0,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ['Admin', 'Guest', 'Blogger'],
    },

    isFollowing: {
      type: Boolean,
      default: false,
    },

    isUnFollowing: {
      type: Boolean,
      default: false,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    accountVerifyToken: {
      type: String,
    },

    accountVerifyTokenExpires: {
      type: Date,
    },

    viewedBy: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    followers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    passwordChangeAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    },

    active: {
      type: Boolean,
      default: false,
    },
  },

  {
    versionKey: false,

    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
);

UserSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'author',
  localField: '_id',
});

UserSchema.method('toJSON', function () {
  const { __v, password, createdAt, updatedAt, ...object } = this.toObject();
  return object;
});

UserSchema.pre('save', async function (next) {
  // 密碼沒有改變就不要重新 bcrypt 密碼
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIVE_TIME,
  });
};

UserSchema.methods.matchPassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

UserSchema.methods.createAccountVerifyToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.accountVerifyToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.accountVerifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return verificationToken;
};

UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model('User', UserSchema);

export default User;
