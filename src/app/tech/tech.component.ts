import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiSelectorService } from '../api-selector-service';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.css']
})
export class TechComponent implements OnInit {
  technologies: Technologie[] = [];
  baseUrl = environment.baseUrl;
  selectedApi: string = '';
  isLoading = true;
  dataLoadingError = false;

  constructor(private http: HttpClient,private apiSelector: ApiSelectorService) {
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
    this.http.get<Technologie[]>(this.baseUrl + '/technologies' + this.selectedApi).subscribe({
      next: (data) =>  { 
        this.technologies = data 
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

interface Technologie {
  name: string;
  imageUrl: string;

}
