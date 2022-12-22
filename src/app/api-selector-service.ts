import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ApiSelectorService {
  private apiSelector = new BehaviorSubject('?api=function');
  selectedApi = this.apiSelector.asObservable();
  
  constructor() {}

  setApi(apiSelector: string) {
    this.apiSelector.next(apiSelector);
  }
}