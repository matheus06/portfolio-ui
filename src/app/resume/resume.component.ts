import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiSelectorService } from '../api-selector-service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  resume: Resume[] = [];
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
    this.http.get<Resume[]>(this.baseUrl + '/resume' + this.selectedApi).subscribe({
      next: (data) =>  { 
        this.resume = data 
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

interface Resume {
  description: string;
  blobUrl: string;
}

