import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, GptMessageEditableImageComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent implements AfterViewChecked {

  ngAfterViewChecked(): void {
   // this.scrollToBottom();
  }
 
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public originalImage = signal<string | undefined>(undefined)
  public maskImage = signal<string | undefined>(undefined)

  public openAiService = inject( OpenAiService )
  public isDisabledButton : boolean = false

  handleMessage(prompt: string){
      this.isLoading.set(true)
      this.messages.update ( prev => [...prev, {isGpt:false, text: prompt}])
      this.openAiService.imageGenerate( prompt, this.originalImage(), this.maskImage() )
      .subscribe({
        next: resp => {
          if(resp.response){
            this.messages.update(prev => [...prev, {isGpt: true, text: resp.response.url, imageUrl: resp.response.url}])
          }
          this.isLoading.set( false );
          this.scrollToBottom()
;        },
        error: error => console.log( error )
      })
    }

  generateVariation () {
       this.isDisabledButton = true;
       this.isLoading.set( true )
       this.openAiService.imageVariation( this.originalImage()! )
       .subscribe({
            next: resp => {
            this.originalImage.set( undefined );
            this.isLoading.set( false );
            this.messages.update( prev => [...prev, {isGpt: true, text: 'Nueva imagen: ', imageUrl:resp.response?.url}])
            this.isDisabledButton = false;
        },
        error: err=>console.log(err)
       })
     }

     handleImageChange( newImage: string, originalImage: string){
      
      this.originalImage.set(originalImage);
      this.maskImage.set( newImage );
      


      
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
