// This file must be in the /api folder for Vercel to detect it as a serverless function
import type { Request, Response } from 'express';
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import logger from 'morgan';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRouter } from '../server/user/router';
import { lessonRouter } from '../server/lesson/router';

// import multer from 'multer'
// import { GridFsStorage } from 'multer-gridfs-storage';
// import { GridFSBucket, MongoClient, Db } from 'mongodb';

// import { Db } from '../node_modules/mongoose/node_modules/mongodb/mongodb';
// import { GridFSBucket } from '../node_modules/mongoose/node_modules/mongodb/mongodb';
// Load environmental variables
dotenv.config({});

// Connect to mongoDB
const mongoConnectionUrl = process.env.MONGO_SRV;
if (!mongoConnectionUrl) {
    throw new Error('Please add the MongoDB connection SRV as \'MONGO_SRV\'');
}
// let fileDatabase = null;
// let lessonVideoBucket: GridFSBucket = null;

mongoose
    .connect(mongoConnectionUrl)
    .then(m => {
        console.log('Connected to MongoDB');
        const conn = m.connection;
        // const fileDatabase = conn.getClient().db();
    })
    .catch(err => {
        console.error(`Error connecting to MongoDB: ${err.message as string}`);
    });

mongoose.connection.on('error', err => {
    console.error(err);
});

// Initalize an express app
const app = express();

// Declare the root directory
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.engine('html', engine({ extname: '.html', defaultLayout: false }));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../public'));

// Set the port
app.set('port', process.env.PORT || 3000);

// Log requests in the terminal
app.use(logger('dev'));

// Parse incoming requests with JSON payloads ('content-type: application/json' in header)
app.use(express.json());

// Parse incoming requests with urlencoded payloads ('content-type: application/x-www-form-urlencoded' in header)
app.use(express.urlencoded({ extended: false }));

// Initialize cookie session
app.use(session({
    secret: '61040',
    resave: true,
    saveUninitialized: false
}));

// This makes sure that if a user is logged in, they still exist in the database
// app.use(userValidator.isCurrentSessionUserExists);

// GET home page
app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

// Add routers from routes folder
app.use('/api/users', userRouter);

app.use('/api/lessons', lessonRouter);

// Catch all the other routes and display error message
app.all('*', (req: Request, res: Response) => {
    res.status(400).render('error');
});


// Create server to listen to request at specified port
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`Express server running at http://localhost:${app.get('port') as number}`);
});


// fun part yay! 
// for storing images and videos

// if (fileDatabase === null) {
//     console.error("database not connected; storing and loading images compromised");
// }

// creating an alias for GridFsStorage since the compiler treats GridFsStorage from above as an instance and not a class
// const storageClass: any = GridFsStorage;

// let fileDatabase = null;
// let lessonVideoBucket: GridFSBucket = null;

// mongoose
//     .connect(mongoConnectionUrl)
//     .then(m => {
//         console.log('Connected to MongoDB For File Storage');
//         const conn = m.connection;
//         // const fileDatabase = conn.getClient().db();
//         fileDatabase = conn.db;
//         // @ts-ignore
//         lessonVideoBucket = new GridFSBucket(fileDatabase, {
//             bucketName: "lessonVideos"
//         });
//         // console.log(lessonVideoBucket);
//         const lessonStorage = new GridFsStorage({
//             url: mongoConnectionUrl,
//             file: (req: Request, file: any) => {
//                 if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//                     return {
//                         bucketName: 'lessonPhotos'
//                     };
//                 } else if (file.mimetype === 'video/mp4') {
//                     return {
//                         bucketName: 'lessonVideos'
//                     };
//                 } else {
//                     return null;
//                 }
//             },
//             cache: 'storage'
//         });

//         const uploadLesson = multer({
//             storage: lessonStorage
//         });

//         // for dealing with files

//         app.get(
//             "/api/lessons/videos/:videoName",
//             function (req: Request, res: Response) {
//                 const file = lessonVideoBucket.find({
//                     filename: req.params.videoName
//                 });
//             }
//         );

//         app.post(// TODO: Make sure the name matches in the form
//             '/api/lessons/videos/',
//             uploadLesson.single("file"),
//             async (req, res) => {
//                 res.status(200).json({
//                     message: 'Video uploaded successfully'
//                 });
//             }
//         );
//     })
//     .catch(err => {
//         console.error(`Error connecting to MongoDB: ${err.message as string}`);
//     });
