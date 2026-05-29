import {ChangeDetectionStrategy, Component, inject, computed, signal} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {NgClass} from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  currentUrl = signal('/');

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects || event.url || '/');
      }
    });
  }

  showCockpit = computed(() => {
    const url = this.currentUrl();
    return url.includes('/admin') || 
           url.includes('/seller') || 
           url.includes('/inspector') || 
           url.includes('/delivery') ||
           url.includes('/auth');
  });
}
