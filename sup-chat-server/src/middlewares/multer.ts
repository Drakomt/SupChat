import multer from "multer";
import path from "path";
import fs from "fs";

const ChatImgDirPath = path.join(process.cwd(), "public", "images","chats");  //current working directory
//console.log("images will be stored in:", ChatImgDirPath);
if(!fs.existsSync(ChatImgDirPath)){
    fs.mkdirSync(ChatImgDirPath, {recursive: true}); //allows creation of nested directories
}

const ChatImgStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ChatImgDirPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


const UserImgDirPath = path.join(process.cwd(), "public", "images","users");  //current working directory
//console.log("images will be stored in:", UserImgDirPath);
if(!fs.existsSync(UserImgDirPath)){
    fs.mkdirSync(UserImgDirPath, {recursive: true}); //allows creation of nested directories
}

const UserImgStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UserImgDirPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const MessageImgDirPath = path.join(process.cwd(), "public", "images", "messages");
if(!fs.existsSync(MessageImgDirPath)) {
    fs.mkdirSync(MessageImgDirPath,{ recursive :true });
}

const MessageImgStorageConfig = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, MessageImgDirPath);
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname);
    },
})

export const ChatImageStorage = multer({storage: ChatImgStorageConfig});
export const UserImageStorage = multer({storage: UserImgStorageConfig});
export const MessageImageStorage = multer({storage: MessageImgStorageConfig});

