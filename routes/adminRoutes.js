const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isUserAuthenticated } = require("../config/customFunctions");

// Act as plugin
router.all('/*', isUserAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

/* DEFAULT ADMIN INDEX ROUTE*/
router.route('/')
    .get(adminController.index);

/* VARIOUS ADMIN POST ENDPOINTS */
router.route('/posts')
    .get(adminController.getPosts)
    .post(adminController.submitPosts);

router.route('/posts/create')
    .get(adminController.createPostsGet)
    .post(adminController.submitPosts);

router.route('/posts/edit/:id')
    .get(adminController.editPost)
    .put(adminController.editPostSubmit);

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

/* ADMIN CATEGORY ROUTES */
router.route('/category')
    .get(adminController.getCategories);

router.route('/category/create')
    .post(adminController.createCategories);

router.route('/category/edit/:id')
    .get(adminController.editCategoriesGetRoute)
    .post(adminController.editCategoriesPostRoute);

/* ADMIN COMMENT ROUTES */
router.route('/comment')
    .get(adminController.getComments);
    
module.exports = router;
