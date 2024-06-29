import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent implements AfterViewChecked{

@ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService );


    // Este método se ejecuta después de cada verificación de la vista
ngAfterViewChecked() {
  this.scrollToBottom();
}

  handleMessage(prompt: string){
    this.isLoading.set(true);
    this.messages.update( (prev)=>[
      ...prev,
      {
        isGpt: false,
        text: prompt
      }
    ]);
    this.scrollToBottom();
    this.openAiService.makeProsCons( prompt ) 
    .subscribe({
      next: res => {
        this.isLoading.set(false);
        this.messages.update( prev => [
          ...prev,
          {
            isGpt:true,
            text: res.content
          }         
        ]);
        this.scrollToBottom()
      },
      error: err => console.log(err)
    })
  }


  // Método para desplazar el scroll hacia el final
 private scrollToBottom(): void {
  try {
    this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
  } catch (err) {
    console.error('Error while scrolling:', err);
  }
}
}
