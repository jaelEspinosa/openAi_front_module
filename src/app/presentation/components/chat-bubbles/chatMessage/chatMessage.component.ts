
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    MarkdownModule
  ],
  templateUrl: './chatMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent implements OnInit {
ngOnInit(): void {
  console.log(this.imageUrl)
} 
@Input({required:true}) text!:string;
@Input() audioUrl?:string;
@Input() imageUrl?:string;

}
