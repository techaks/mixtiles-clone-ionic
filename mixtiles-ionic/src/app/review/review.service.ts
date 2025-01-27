import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import {
  CreateFileBody,
  Endpoints,
  FileUploadResponse,
  SelectImageEvRes,
} from '../app.constant';
import { AuthenticationService } from '../services';

@Injectable()
export class ReviewService {
  constructor(
    private transfer: FileTransfer,
    private http: HTTP,
    private auth: AuthenticationService
  ) {}

  async createFile(createFileBody: CreateFileBody): Promise<boolean> {
    const headers = await this.auth.getHeaders();

    try {
      await this.http.post(
        Endpoints.CREATE_FILE,
        {
          body: createFileBody,
        },
        headers
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async upload(
    imagePath: string,
    fileName: string
  ): Promise<FileUploadResponse | null> {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const headers = await this.auth.getHeaders();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      headers: headers,
    };

    return new Promise((resolve) => {
      fileTransfer.upload(imagePath, Endpoints.UPLOAD_FILE, options).then(
        (data) => {
          const res: FileUploadResponse = JSON.parse(data.response);
          resolve(res);
          console.log('[upload] success => ', data);
        },
        (err) => {
          console.log('[upload] error => ', err);
          resolve(null);
        }
      );
    });
  }

  async uploadMulti(images: SelectImageEvRes[]) {
    const uploadedFileNames: string[] = [];

    for (let index = 0; index < images.length; index++) {
      const item = images[index];
      const e = await this.upload(item.filePath, item.imageName);
      uploadedFileNames.push(String(e.filename).toString());
    }

    return uploadedFileNames;
  }
}
