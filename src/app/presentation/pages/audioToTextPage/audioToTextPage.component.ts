import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMessageEvent, ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxFileComponent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/index';
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
  
    handleMessageWhithFile( {file, prompt}: TextMessageEvent){
      this.isLoading.set(true);
      let text = ''
      if ( prompt!.length === 0 || prompt === ''){        
        text = 'transcripción en curso...'
      } else {
        console.log('entro en el else')
        text = prompt!
      }
        
      console.log('el texto es ', text, typeof text, text.length)
      this.messages.update( prev => [...prev, {isGpt: false, text: text}]);

      this.openAiService.audioToText( file, text)
      .subscribe({
        next: resp => {
          this.handleResponse( resp.text )
          
        },
        error: err => console.log(err)
      })
    }
   // metodo para crear los mensajes
   handleResponse( resp: AudioToTextResponse | null) {

    this.isLoading.set(false);
    
    if ( !resp ) return;

    const text = `## Transcripción:
__Duración:__ ${ Math.round( resp.duration ) } segundos.

## El texto es:
${ resp.text }
    `;

    this.messages.update( prev => [...prev, { isGpt: true, text: text }] );
    this.scrollToBottom();
    for (const segment of resp.segments) {
      this.scrollToBottom();
      const segmentMessage = `
        __De ${ Math.round(segment.start) } a ${ Math.round( segment.end ) } segundos.__
        ${ segment.text }
      `;

      this.messages.update( prev => [...prev, { isGpt: true, text: segmentMessage }] );
    }
    
    this.scrollToBottom()


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
