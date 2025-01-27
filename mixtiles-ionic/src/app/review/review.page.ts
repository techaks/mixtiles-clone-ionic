import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
} from '@ionic/angular';

import { FrameType, SelectImageEvRes } from '../app.constant';
import { ReviewService } from './review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  frameType: FrameType = 'bold';
  selectedImage: SelectImageEvRes = {
    base64: null,
    filePath: null,
    imageName: null,
  };
  selectedFiles: SelectImageEvRes[] = [];

  constructor(
    private menu: MenuController,
    private alert: AlertController,
    private reviewService: ReviewService,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}

  onCheckout() {}

  toggle() {
    this.menu.toggle();
  }

  async save(savedFileName: string[]) {
    if (!this.selectedImage) {
      this.failedAlert();
      return;
    }

    const success = await this.reviewService.createFile({
      fileNames: savedFileName,
      frameType: this.frameType,
    });

    if (success) {
      this.reset();
      await this.successAlert();
    } else {
      await this.failedAlert();
    }
  }

  reset() {
    this.frameType = 'bold';
    this.selectedImage = {
      base64: null,
      filePath: null,
      imageName: null,
    };
    this.selectedFiles = [];
  }

  async upload() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });

    await loading.present();

    const response = await this.reviewService.uploadMulti(this.selectedFiles);

    if (response.length > 0) {
      await this.save(response);
    } else {
      this.failedAlert();
    }

    await loading.dismiss();
  }

  async successAlert() {
    const success = await this.alert.create({
      message: 'File added successfully',
    });

    success.present();
  }

  async failedAlert() {
    const failed = await this.alert.create({
      message: 'File added failed',
    });
    await failed.present();
  }
}
