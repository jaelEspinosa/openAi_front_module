import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageEvent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService )


    handleMessage(prompt: string){
      this.isLoading.set(true)
      this.messages.update ( prev => [...prev, {isGpt:false, text: prompt}])
      this.openAiService.imageGenerate( prompt )
      .subscribe({
        next: resp => {
          if(resp.response){
            this.messages.update(prev => [...prev, {isGpt: true, text: resp.response.url, imageUrl: resp.response.url}])
          }
          this.isLoading.set( false )
        },
        error: error => console.log( error )
      })
    }
  
   }