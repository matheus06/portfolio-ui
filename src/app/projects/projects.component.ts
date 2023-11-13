import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiSelectorService } from '../api-selector-service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
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
    this.http.get<Project[]>(this.baseUrl + '/projects' + this.selectedApi).subscribe({
      next: (data) =>  { 
        this.projects = data 
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

interface Project {
  name: string;
  imageUrl: string;
}
