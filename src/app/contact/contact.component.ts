import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiSelectorService } from '../api-selector-service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: Contact;
  success: Boolean;
  baseUrl = environment.baseUrl;
  selectedApi: string = '';

  constructor(private http: HttpClient, private apiSelector: ApiSelectorService) {
    this.apiSelector.selectedApi.subscribe(selectedApi => { this.selectedApi = selectedApi });
  }

  ngOnInit() {
    this.success = false;
    this.contactForm = new Contact();
  }

  sendMessage() {
    var headers = new HttpHeaders({'Content-Type': 'application/json'});
    var options = { headers: headers };
    var body = JSON.stringify(this.contactForm);
    this.http.post<Contact>(this.baseUrl + '/contact' + this.selectedApi, body, options).subscribe(() => {
    }, error => console.error(error));
    this.success = true;
  }

}

export class Contact {
  name:string;
  email:string;
  message:string;
}
