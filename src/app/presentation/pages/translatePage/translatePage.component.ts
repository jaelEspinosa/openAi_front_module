import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageEvent, TextMessageBoxEvent, TextMessageBoxSelectComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent implements AfterViewChecked {
  ngAfterViewChecked(): void {
    this.scrollToBottom()
  }
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService )

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  public languages = signal( [
    { id: 'alemán', text: 'Alemán' },
    { id: 'español', text: 'Español' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);
  
   
  
    handleMessageWhithSelect({prompt, selectedOption}:TextMessageBoxEvent){
       const message = `traduce a ${selectedOption}: ${prompt}`
       this.isLoading.set(true)
       this.messages.update( prev =>[
        ...prev,
        {
          isGpt:false,
          text: message
        }
       ]);
       this.scrollToBottom();
       this.openAiService.makeTranslation(prompt, selectedOption)
       .subscribe({
        next: resp => {
          this.messages.update( prev => [
            ...prev,
            {
              isGpt: true,
              text: resp.message
            }
          ]);
          this.isLoading.set(false)
          this.scrollToBottom();
        }
      });
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