const express = require('express');
const cors = require('cors');
const app = express();
const userRouter = require('./routes/user/user.router');
const homeRouter = require('./routes/home/home.router');

app.use(cors({
    origin:'http://127.0.0.1:5173'
}));

app.set('view engine','ejs')
app.set('views',__dirname+'/views')


app.use(express.json());

app.use('/user',userRouter);
app.use('/home',homeRouter);

module.exports = app;