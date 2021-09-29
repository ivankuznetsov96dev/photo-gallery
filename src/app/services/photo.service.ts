import { Injectable } from '@angular/core';
import {
  Camera,
  CameraPhoto,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';

export interface Photo {
  filepath: string;
  webviewPath: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: Photo[] = [];

  private PHOTO_STORAGE = 'photos';
  private platfotm: Platform;

  constructor(platfotm: Platform) {
    this.platfotm = platfotm;
  }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  public async loadSaved() {
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
    if (!this.platfotm.is('hybrid')) {
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async savePicture(cameraPhoto: CameraPhoto): Promise<Photo> {
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    const saveFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
    if (this.platfotm.is('hybrid')) {
      return {
        filepath: saveFile.uri,
        webviewPath: Capacitor.convertFileSrc(saveFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }

  public async deletePicture(photo: Photo, position: number): Promise<void> {
    this.photos.splice(position, 1);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  private async readAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
    if (this.platfotm.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });
      return file.data;
    } else {
      const responce = await fetch(cameraPhoto.webPath);
      const blob = await responce.blob();
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
