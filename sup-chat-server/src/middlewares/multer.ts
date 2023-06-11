import multer from "multer";
import path from "path";
import fs from "fs";

const ChatImgDirirPath = path.join(process.cwd(), "public", "images","chats");  //current working directory
console.log("images will be stored in:", ChatImgDirirPath);
if(!fs.existsSync(ChatImgDirirPath)){
    fs.mkdirSync(ChatImgDirirPath, {recursive: true}); //allows creation of nested directories
}

const ChatImgStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ChatImgDirirPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


const UserImgDirirPath = path.join(process.cwd(), "public", "images","users");  //current working directory
console.log("images will be stored in:", UserImgDirirPath);
if(!fs.existsSync(UserImgDirirPath)){
    fs.mkdirSync(UserImgDirirPath, {recursive: true}); //allows creation of nested directories
}

const UserImgStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UserImgDirirPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const ChatImageStorage = multer({storage: ChatImgStorageConfig});
export const UserImageStorage = multer({storage: UserImgStorageConfig});

