import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/models/message';
import { Pagination } from 'src/app/models/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] | undefined; // ako hoces da izbegnes undefined mozes da stavis
  //message?: Message[];
  pagination?: Pagination;
  container = 'Unread'; // ovo je u htmlu povezano na ngModel
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService ) {

  }
  ngOnInit(): void {
    this.loadMesages();
  }

  loadMesages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMesages();
    }
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => this.messages?.splice(this.messages.findIndex(m => m.id === id), 1)  // ovo jedan znaci da obrise 1 record
    })
  }
}
