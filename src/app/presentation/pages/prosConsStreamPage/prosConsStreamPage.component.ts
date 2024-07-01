import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageEvent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class ProsConsStreamPageComponent { 

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService );

  public abortSignal = new AbortController();



  async handleMessage(prompt: string){
  this.scrollToBottom();
  this.isLoading.set( true );

  this.abortSignal.abort();
  this.abortSignal = new AbortController();
  this.messages.update( (prev) => [
    ...prev,
    {
      isGpt:false,
      text: prompt
    },
    {
      isGpt:true,
      text: '...'
    }
  ])

  const stream =  this.openAiService.makeProsConsStream( prompt, this.abortSignal.signal )

  for await (const text of stream){
    this.isLoading.set(false)
    this.handleStreamResponse ( text )
  }
  }

handleStreamResponse ( message: string ){
  this.messages().pop()
  const messages = this.messages();
  this. messages.set([...messages, { isGpt: true, text: message }])
  this.scrollToBottom();
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
