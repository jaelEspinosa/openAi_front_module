import { TextMessageBoxEvent } from './../../components/text-boxes/textMessageBoxSelect/textMessageBoxSelect.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TextMessageBoxComponent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent, TextMessageEvent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';


@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxSelectComponent,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {

public messages = signal<Message[]>([{text:'hola mundo', isGpt: false}]);
public isLoading = signal(false);
public openAiService = inject( OpenAiService )

  handleMessage(prompt: string){
    console.log( "desde el padre ", {prompt})
  }


  handleMessageWhithFile( {prompt, file}: TextMessageEvent){
    console.log({prompt, file})
  }

  handleMessageWhithSelect(event:TextMessageBoxEvent){
     console.log(event)
  }

 }
