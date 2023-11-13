import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

//bootstrap
import {CollapseModule} from 'ngx-bootstrap/collapse';
import { CarouselModule } from 'ngx-bootstrap/carousel';

//material
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

//my components
import { HeaderComponent } from './header/header.component';
import { ResumeComponent } from './resume/resume.component';
import { ContactComponent } from './contact/contact.component'
import { FooterComponent } from './footer/footer.component';
import { TechComponent } from './tech/tech.component';
import { ProjectComponent } from './projects/projects.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { ApiSelectorService } from './api-selector-service';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ResumeComponent,
    FooterComponent,
    ContactComponent,
    TechComponent,
    ProjectComponent,
    CertificationsComponent
  ],
  imports: [
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CollapseModule.forRoot(),
    CarouselModule.forRoot()
  ],
  providers: [ApiSelectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
