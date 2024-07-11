const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const bcrypt=require('bcryptjs');
const User=require('../models/UserModel').User;
const Comment=require('../models/CommentModel').Comment;


module.exports = {
  
    index:  async (req, res) => {
        
        const posts = await Post.find();
        const categories = await Category.find();
        
        res.render('default/index', {posts: posts, categories: categories});
    },
    
    loginGet: (req, res) => {
        res.render('default/login');
    },
    
    loginPost: (req, res) => {
      res.send("Congratulations, you've successfully submitted the data.");  
    },
    
    registerGet: (req, res) => {
        res.render('default/register');
    },
    
    registerPost: (req, res ) => {
        let errors=[];
        if(!req.body.firstName){
            errors.push({message:`first name mandatory`})
        }
        if(!req.body.lastName){
            errors.push({message:`last name mandatory`})
        }
        if(!req.body.email){
            errors.push({message:`email field is mandatory`})
        }
        if(req.body.password!==req.body.passwordConfirm){
            errors.push({message:`password not match`})
        }
        if(errors.length>0){
            res.render('default/register',{
                errors:errors,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email
            });
        }
        else{
            User.findOne({email:req.body.email}).then(user=>{
                if(user){
                    req.flash('error-message','email already exist');
                    res.redirect('/login');
                }
                else{
                    const newUser=new User(req.body);
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            newUser.password=hash;
                            newUser.save().then(user=>{
                                req.flash('success-message','you are now registered');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    },
    getSinglePost: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
            .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
            .then(post => {
            if (!post) {
                res.status(404).json({message: 'No Post Found'});
            }
            else {
                res.render('default/singlePost', {post: post,comments:post.comments});
            }
        })
    },
    submitComment: (req, res) => {
        if (req.user) {
            Post.findById(req.body.id).then(post => {
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                });
                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                      req.flash('success-message', 'Your comment was submitted for review.');
                      res.redirect(`/post/${post._id}`);
                    });
                });
            })
        }
        else {
            req.flash('error-message', 'Login first to comment');
            res.redirect('/login');
        }
    }
};
