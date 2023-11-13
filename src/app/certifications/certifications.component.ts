import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiSelectorService } from '../api-selector-service';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.css']
})
export class CertificationsComponent implements OnInit {
  certifications: Certification[] = [];
  baseUrl = environment.baseUrl;
  selectedApi: string = '';
  isLoading = true;
  dataLoadingError = false;

  constructor(private http: HttpClient, private apiSelector: ApiSelectorService) {
    this.apiSelector.selectedApi.subscribe(selectedApi => 
      {
        this.selectedApi = selectedApi;
        this.callApi();
      });
  }

  ngOnInit() {
  }

  callApi()
  {
    this.isLoading = true;
    this.http.get<Certification[]>(this.baseUrl + '/certifications' + this.selectedApi ).subscribe({
        next: (data) =>  { 
          this.certifications = data 
          this.isLoading = false;
          this.dataLoadingError = false;
        } ,
        error: (error) =>  { this.handleError(error)} 
      });
  }

  handleError(error : any)
  {
    console.log(error);
    this.dataLoadingError = true;
    this.isLoading = false;
  }

}

interface Certification {
  name: string;
  imageUrl: string;
  badgeUrl: string;
}
