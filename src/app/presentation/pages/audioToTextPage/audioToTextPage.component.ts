import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMessageEvent, TextMessageBoxEvent, ChatMessageComponent, MyMessageComponent, TextMessageBoxComponent, TypingLoaderComponent, TextMessageBoxFileComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent implements AfterViewChecked {
  
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService )
  
    
   ngAfterViewChecked(): void {
    this.scrollToBottom()
  } 
  
    handleMessageWhithFile( {prompt, file}: TextMessageEvent){
      this.isLoading.set(true);
      prompt ? this.messages.update( prev => [...prev, {isGpt: false, text: prompt!}]) : null
      this.openAiService.audioToText(prompt!, file)
      .subscribe({
        next: ({text}) => {
          //const text = res.text
          this.messages.update(prev => [...prev, {isGpt:true, text: text!.text}])
          this.isLoading.set(false)
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
