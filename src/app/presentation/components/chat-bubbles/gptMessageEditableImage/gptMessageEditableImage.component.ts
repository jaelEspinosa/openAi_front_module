import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-gpt-message-editable-image',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './gptMessageEditableImage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageEditableImageComponent implements AfterViewInit {
  @Input ({ required:true }) text!: string;
  @Input ({ required:true }) image!: string;
  @ViewChild('canvas') private canvasElemnt?:ElementRef<HTMLCanvasElement>;
  
  
  @Output () onSelecetedImage = new EventEmitter<string>();

  public originalImage = signal<HTMLElement|null>(null);
  public isDrawing = signal(false);
  public coords = signal({x:0, y:0});

  onMouseDown( event: MouseEvent ) {
    if(!this.canvasElemnt) return;
    this.isDrawing.set( true );

    // Obtener las coordenadas del mouse relativo al canvas
    const startX =  event.clientX - this.canvasElemnt.nativeElement.getBoundingClientRect().left;
    const startY =  event.clientY - this.canvasElemnt.nativeElement.getBoundingClientRect().top;
    
    // Estos valores son mis coordenadas

    this.coords.set({ x:startX, y:startY })
  }

  onMouseMove( event: MouseEvent ) {
    if( !this.isDrawing() ) return;
    if( !this.canvasElemnt?.nativeElement ) return;

    const canvas = this.canvasElemnt.nativeElement;
    
    const currentX = event.clientX - canvas.getBoundingClientRect().left;
    const currentY = event.clientY - canvas.getBoundingClientRect().top;

    // calcular el alto y ancho de un rectángulo
    const width = currentX - this.coords().x;
    const height = currentY - this.coords().y;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    //Todo Limpiar el canvas

    const ctx = canvas.getContext('2d')!;
   
    ctx.clearRect(0,0, canvas.width, canvas.height )
    
    ctx.drawImage(this.originalImage()!, 0,0, canvas.width, canvas.height )
    
    ctx.fillRect( this.coords().x, this.coords().y, width, height )
  }
  
  ngAfterViewInit(): void {
    if(!this.canvasElemnt?.nativeElement) return;

    const canvas = this.canvasElemnt.nativeElement;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'Anonymus';
    img.src = this.image;

    this.originalImage.set( img );

    img.onload = () => {
      ctx?.drawImage( img, 0 ,0, canvas.width, canvas.height )
    }
  }


  handleClick() {
    
    this.onSelecetedImage.emit( this.image )
  }

 }
