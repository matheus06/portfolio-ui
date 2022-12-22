import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiSelectorService } from '../api-selector-service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public currentYear: Number; 
  public environment: string; 
  baseUrl = environment.baseUrl;
  selectedApi: string = '';
  dataLoadingError = false;
  checked = false;
  
  constructor(private http: HttpClient, private apiSelector: ApiSelectorService) {
    this.currentYear = new Date().getFullYear();
    this.apiSelector.selectedApi.subscribe(selectedApi => this.selectedApi = selectedApi);
    this.callApi();
  }

  ngOnInit() {
  }

  callApi()
  {
    this.http.get(this.baseUrl + '/environment' + this.selectedApi, { responseType: 'text' }).subscribe({
      next: (data) =>  { 
        this.environment = data 
        this.dataLoadingError = false;
      } ,
      error: (error) =>  { this.handleError(error)} 
    });
  }

  
  handleError(error : any)
  {
    console.log(error);
    this.environment = "API not available"
    this.dataLoadingError = true;
  }

  public updateSelectedApi() {
    this.checked ?  this.apiSelector.setApi("") :  this.apiSelector.setApi("?api=function");
    this.callApi();
  }
}


