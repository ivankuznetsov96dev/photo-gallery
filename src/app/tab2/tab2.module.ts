import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { LongPressModule } from 'ionic-long-press';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    LongPressModule,
  ],
  declarations: [Tab2Page],
  providers: [PhotoViewer],
})
export class Tab2PageModule {}
