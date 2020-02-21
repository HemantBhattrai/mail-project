import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mails } from './mails';
import { Observable,forkJoin,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailServiceService {

  public data: Mails[];
  private inboxUrl: string = "./inbox.json"; 
  constructor(private http: HttpClient) { }

  getDataFromFile(type) : Observable<any>{
    return this.http.get('./assets/data/'+type+'.json');
  }

  getDataFromAllFile() : Observable<any>{

    return forkJoin(
      {
        inbox : this.getDataFromFile('inbox'),
        spam : this.getDataFromFile('spam')
      }
    )
    
  }
  
  getDeletedMail(type){
    let deletedMail:[];
    deletedMail = JSON.parse(localStorage.getItem('deletedMail'+type));
    if(deletedMail == null || typeof deletedMail == 'undefined'){
      return [];
    }else{
      return deletedMail;
    }
  }

  setDeletedMailItem(item,type){
    let deletedMail: any[] ;
    deletedMail = this.getDeletedMail(type);
    deletedMail[deletedMail.length] = item;
    localStorage.setItem('deletedMail'+type,JSON.stringify(deletedMail));
  }

  getFlaggedMail(type){
    let flaggedMail:[];
    flaggedMail = JSON.parse(localStorage.getItem('flaggedMail'+type));
    if(flaggedMail == null || typeof flaggedMail == 'undefined'){
      return [];
    }else{
      return flaggedMail;
    }
  }

  setFlaggedMailItem(item,type){
    let flaggedMail: any[] ;
    flaggedMail = this.getFlaggedMail(type);
    flaggedMail[flaggedMail.length] = item;
    localStorage.setItem('flaggedMail'+type,JSON.stringify(flaggedMail));
  }

  getUnReadMail(type){
    let unRead:[];
    unRead = JSON.parse(localStorage.getItem('unread'+type));
    if(unRead == null || typeof unRead == 'undefined'){
      return [];
    }else{
      return unRead;
    }
  }

  setUnReadMailItem(item,type){
    let unRead: any[] ;
    unRead = this.getUnReadMail(type);
    unRead[unRead.length] = item;
    localStorage.setItem('unread'+type,JSON.stringify(unRead));
  }

  unSetFlaggedMailItem(item,type){

    let flaggedMail: any[] ;
    flaggedMail = this.getFlaggedMail(type);
    flaggedMail = flaggedMail.filter(ele =>{
      return ele != item;
    });
    localStorage.setItem('flaggedMail'+type,JSON.stringify(flaggedMail));
  }
  

  
}
