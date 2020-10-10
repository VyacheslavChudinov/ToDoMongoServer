const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const Post = db.Post;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,    
    delete: _delete,

    addPost,
    updatePost,
    delete: deletePost,
};

function addUserJWT(user) {
    const token = jwt.sign({ sub: user.id }, config.secret);
    const tokenExpirationDate = new Date();
    tokenExpirationDate.setDate(tokenExpirationDate.getDate() + 1);

    return {
        ...user.toJSON(),
        token,
        tokenExpirationDate
    };
}

async function authenticate({ username, password }) {
    const user = await User.findOne({ username }).populate('posts').exec();

    if (user && bcrypt.compareSync(password, user.hash)) {
        return addUserJWT(user);
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    const user = await User.findById(id).populate('posts').exec();
    return addUserJWT(user);
}

async function create(userParam) {
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await user.save();
}

async function addPost(id, post) {
    const user = await User.findById(id);

    if (!user) throw 'User not found';

    const newPost = new Post({
        title: post.title,
        description: post.description,
        createdDate: post.createdDate,
        deadlineDate: post.deadlineDate,
        owner: id
    })

    user.posts.push(newPost);
    await user.save();
    await newPost.save();
    const updatedUser = await User.findById(id).populate('posts').exec();
    return addUserJWT(updatedUser);
}

async function updatePost(id, post) {
    const dbUser = await User.findById(id);

    if (!dbUser) throw 'User not found';

    const dbPost = await Post.findById(post.id);

    dbPost.title = post.title;
    dbPost.description = post.description;
    dbPost.createdDate = post.createdDate;
    dbPost.deadlineDate = post.deadlineDate;

    await dbPost.save();
    
    const updatedUser = await User.findById(id).populate('posts').exec();
    return addUserJWT(updatedUser);
}

async function deletePost(id, postId) {
    const dbUser = await User.findById(id);

    if (!dbUser) throw 'User not found';

    const dbPost = await Post.findById(postId);
    await dbPost.delete();
    
    const updatedUser = await User.findById(id).populate('posts').exec();
    return addUserJWT(updatedUser);
}


async function _delete(id) {
    await User.findByIdAndRemove(id);
}