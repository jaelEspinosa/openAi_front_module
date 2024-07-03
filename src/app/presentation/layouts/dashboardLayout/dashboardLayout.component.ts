import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from '../../../app.routes';
import { SidebarMenuItemComponent } from '@components/index';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarMenuItemComponent
  ],
  templateUrl: './dashboardLayout.component.html',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent { 
  @ViewChild('menuButton') private menuButton!: ElementRef;
  @ViewChild('menu') private menu!: ElementRef;
  @ViewChild('chatBox') private chatBox!: ElementRef;

  
toggleMenu() {
  console.log('las rutas son', this.routes)
  this.menuButton.nativeElement.classList.toggle('hidden')
  this.menu.nativeElement.classList.toggle('hidden')
  this.chatBox.nativeElement.classList.toggle('hidden')
}
  public routes = routes[0].children?.filter( (route) => route.data )
  
}
