import  { diskStorage } from "multer";
import { uuid } from 'uuidv4';

import path = require("path");
import { from, map, Observable, observable, switchMap} from "rxjs";
import {fileTypeFromFile} from 'file-type';

type validFileTypes = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/gif';
type validFileExtensions = 'png' | 'jpeg' | 'jpg' | 'gif';

const validFileTypes: validFileTypes[] = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const validFileExtensions: validFileExtensions[] = ['png', 'jpeg', 'jpg', 'gif'];

export const imageUpload = {
  storage: diskStorage({
    destination: 'uploads/avatars',
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const fileName: string = uuid() + extension;
      cb(null, fileName);
    },
  }),
  filter: (req, file, cb) => {
    const allowdFileTypes: validFileTypes[] = validFileTypes;
    allowdFileTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  }
    
};
