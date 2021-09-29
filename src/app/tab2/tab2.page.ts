import { Photo, PhotoService } from './../services/photo.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: Photo, position: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }
}
