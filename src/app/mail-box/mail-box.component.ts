import { Component, OnInit } from '@angular/core';
import { MailServiceService } from '../mail-service.service';
import { Router,ActivatedRoute,ParamMap } from '@angular/router';

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrls: ['./mail-box.component.css']
})
export class MailBoxComponent implements OnInit {

  public inboxMail = null;
  type: string;
  unRead : number = 0;
  constructor(private mailService: MailServiceService,private router: Router,private route:ActivatedRoute) {
  }

  ngOnInit() {
    this.type = 'inbox';
    
    if(window.location.pathname.indexOf('spam') > -1 ){
      this.type= 'spam';
    }else if(window.location.pathname.indexOf('delete') > -1 ){
      this.type= 'delete';
    }else if(window.location.pathname.indexOf('flagged') > -1 ){
      this.type= 'flagged';
    }
    this.getMails(this.type);
  }

  getMails(type){    
    if(type == 'delete'){
      this.mailService.getDataFromAllFile().subscribe((data)=>{
        let inbox = data.inbox;
        let spam = data.spam;
        this.inboxMail = inbox.concat(spam);
        this.checkForAllDeletedMail();
        this.inboxMail = this.inboxMail.filter(item =>{
          return item.deleted;
        });
      });
    }else if(type == 'flagged'){
      this.mailService.getDataFromAllFile().subscribe((data)=>{
        let inbox = data.inbox;
        let spam = data.spam;
        this.inboxMail = inbox.concat(spam);
        this.checkForAllDeletedMail();
        this.checkForAllFlaggedMail();
        this.inboxMail = this.inboxMail.filter(item =>{
          return !item.deleted && item.flagged;
        });
      });
    }else{
      this.unRead = 0;
      this.mailService.getDataFromFile(type).subscribe((data)=>{
        this.inboxMail = data;
        this.checkForDeletedMail(type);
        this.checkForFlaggedMail(type);
        this.checkForReadMail(type);
        this.inboxMail = this.inboxMail.filter(item =>{
          if(!item.read && !item.deleted){
            this.unRead++;
          }
          return !item.deleted;
        });
      }); 
    }
  }
  onSelect(mailDetails, mailType){
    this.onRead(mailDetails);
    this.router.navigate( ['/mail',{ id: mailDetails.mId, type: mailType }], { relativeTo: this.route });
  }

  checkForDeletedMail(type){
    let deletedMail = this.mailService.getDeletedMail(type);
    this.inboxMail = this.inboxMail.map( item=>{    
      if(deletedMail.indexOf(item.mId) == -1){
        item.deleted = false;
      }else{
        item.deleted = true;
      }
      return item;
    })
  }

  checkForFlaggedMail(type){
    let flaggedMail = this.mailService.getFlaggedMail(type);
    this.inboxMail = this.inboxMail.map( item=>{
     if(flaggedMail.indexOf(item.mId) == -1){
        item.flagged = false;
      }else{
        item.flagged = true;
      }

      return item;
    })
  }

  onDelete(mail){
    this.mailService.setDeletedMailItem(mail.mId,this.type);
    this.getMails(this.type);
  }
  
  onFlagged(mail){
    let flag = (typeof mail.flagged == 'undefined' || mail.flagged == null) ? true : !mail.flagged;
    if(flag){
      this.mailService.setFlaggedMailItem(mail.mId,this.type);
    }else{
      this.mailService.unSetFlaggedMailItem(mail.mId,'inbox');
      this.mailService.unSetFlaggedMailItem(mail.mId,'spam');
    }
    this.inboxMail = this.inboxMail.map(item =>{
      if(item.mId === mail.mId){
        item.flagged = flag;
      }
      return item;
    });
  }

  checkForAllDeletedMail(){
    let inbox = this.mailService.getDeletedMail('inbox');
    let spam = this.mailService.getDeletedMail('spam');
    let allMail = inbox.concat(spam);
    this.inboxMail = this.inboxMail.map( item=>{
      if(allMail.indexOf(item.mId) == -1){
        item.deleted = false;
      }else{
        item.deleted = true;
      }
      return item;
    })
  }

  checkForAllFlaggedMail(){
    let inbox = this.mailService.getFlaggedMail('inbox');
    let spam = this.mailService.getFlaggedMail('spam');
    let allMail = inbox.concat(spam);
    this.inboxMail = this.inboxMail.map( item=>{
      if(allMail.indexOf(item.mId) == -1){
         item.flagged = false;
       }else{
         item.flagged = true;
       }
       return item;
     });
  }

  onRead(mail){
    this.mailService.setUnReadMailItem(mail.mId,this.type);
    this.inboxMail = this.inboxMail.map(item =>{
      if(item.mId === mail.mId){
        item.read = true;
      }
      return item;
    });
  }

  checkForReadMail(type){
    let readMail = this.mailService.getUnReadMail(type);
    this.inboxMail = this.inboxMail.map( item=>{
     if(readMail.indexOf(item.mId) == -1){
        item.read = false;
      }else{
        item.read = true;
      }
      return item;
    })
  }
}