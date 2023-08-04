const router = require('express').Router();
const express = require('express');
const { updateUserValidation } = require('../validation/user');

const {
  getUserById,
  editUserInfo,
} = require('../controllers/user');

router.use(express.json());

router.get('/users/me', getUserById);

router.patch(
  '/users/me',
  updateUserValidation,
  editUserInfo,
);

module.exports = router;
