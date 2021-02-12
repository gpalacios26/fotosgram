import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public tempImages: string[] = [];
  public cargandoGeo = false;

  public post = {
    mensaje: '',
    coords: null,
    posicion: false
  };

  constructor(
    private postsService: PostsService,
    private uiService: UiServiceService,
    private route: Router,
    private geolocation: Geolocation,
    private camera: Camera
  ) { }

  async crearPost() {

    const creado = await this.postsService.crearPost(this.post);
    if (creado) {
      this.post = {
        mensaje: '',
        coords: null,
        posicion: false
      };

      this.tempImages = [];

      this.route.navigateByUrl('/main/tabs/tab1');
    } else {
      // toast con el error
      this.uiService.presentToast('No se pudo crear el post');
    }
  }

  getGeo() {

    if (!this.post.posicion) {
      this.post.coords = null;
      return;
    }

    this.cargandoGeo = true;

    this.geolocation.getCurrentPosition().then((resp) => {
      this.cargandoGeo = false;
      const coords = `${resp.coords.latitude},${resp.coords.longitude}`;
      this.post.coords = coords;
    }).catch((error) => {
      this.cargandoGeo = false;
      console.log('Error al obtener la geolocalización', error);
    });
  }

  camara() {

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.procesarImagen(options);
  }

  libreria() {

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.procesarImagen(options);
  }

  procesarImagen(options: CameraOptions) {

    this.camera.getPicture(options).then((imageData) => {
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      this.postsService.subirImagen(imageData);
      this.tempImages.push(img);
    }, (err) => {
      console.log('Error al procesar la imagen', err);
    });
  }

}
