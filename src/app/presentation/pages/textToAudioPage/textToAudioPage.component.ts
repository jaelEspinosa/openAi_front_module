import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TextMessageBoxComponent, TextMessageBoxEvent, TextMessageBoxSelectComponent, TextMessageEvent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent { 
  

public messages = signal<Message[]>([]);
public isLoading = signal(false);
public openAiService = inject( OpenAiService )

public voices = signal( [
  { id: 'nova', text: 'nova' },
  { id: 'alloy', text: 'alloy' },
  { id: 'echo', text: 'echo' },
  { id: 'fable', text: 'fable' },
  { id: 'onyx', text: 'onyx' },
  { id: 'shimmer', text: 'shimmer' },
]);

  

  handleMessageWhithSelect({prompt, selectedOption: voice}:TextMessageBoxEvent){
    const message = `${ voice } - ${ prompt }`

    this.isLoading.set(true);

    this.messages.update( prev => [...prev, {isGpt:false, text: message}]);

    this.openAiService.textToAudio(prompt, voice)
     .subscribe({
      next: ({message, audioUrl}) => {
        this.isLoading.set(false);
        this.messages.update(prev => [
          ...prev,
          {
            isGpt: true,
            text: message,
            audioUrl: audioUrl

          }
        ])
      }
     })
  }
 }