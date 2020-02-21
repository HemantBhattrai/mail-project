import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MailServiceService } from '../mail-service.service';
import {Mails} from '../mails';

@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.css']
})
export class MailDetailComponent implements OnInit {

  mailData: any;
  id: string;
  type: string;
  
  constructor(private route:ActivatedRoute, private mailService: MailServiceService) { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.type = params.get('type');
      this.getMailData();
   });
  }

  ngOnInit(){
    this.mailData = {
      subject : "",
      content: ""
    };
    
    this.getMailData();

  }

  getMailData(){

    if(this.type == 'delete' || this.type == 'flagged'){

      this.mailService.getDataFromAllFile().subscribe((data) => {
        
        let inbox = data.inbox;
        let spam = data.spam;
        this.mailData = inbox.concat(spam);

        this.mailData = this.mailData.filter((value)=>{
          return value.mId == this.id;
        });
        this.mailData = this.mailData[0];
      });

    }else{
      this.mailService.getDataFromFile(this.type).subscribe((data) => {
        this.mailData = data;
        this.mailData = this.mailData.filter((value)=>{
          return value.mId == this.id;
        });
        this.mailData = this.mailData[0];
      });
    }
    


  }
}