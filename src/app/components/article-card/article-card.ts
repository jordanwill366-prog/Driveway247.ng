import { Component, input } from '@angular/core';

@Component({
  selector: 'app-article-card',
  standalone: true,
  template: `
    <article class="group cursor-pointer rounded-2xl overflow-hidden glass-panel border border-white/5 bg-driveway-charcoal/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
       <div class="relative w-full h-[200px] overflow-hidden">
          <img [src]="image()" [alt]="title()" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerpolicy="no-referrer" />
          <div class="absolute inset-0 bg-gradient-to-t from-driveway-charcoal via-transparent to-transparent opacity-80"></div>
          
          <div class="absolute top-4 left-4">
             <span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-black rounded">{{ category() }}</span>
          </div>
       </div>
       <div class="p-6">
          <p class="text-gray-400 text-xs mb-3">{{ readTime() }} MIN READ</p>
          <h3 class="text-xl font-display font-medium text-white mb-3 group-hover:text-driveway-gold transition-colors leading-tight">{{ title() }}</h3>
          <p class="text-sm text-gray-500 line-clamp-2">{{ excerpt() }}</p>
       </div>
    </article>
  `
})
export class ArticleCardComponent {
   image = input.required<string>();
   title = input.required<string>();
   category = input.required<string>();
   readTime = input.required<number>();
   excerpt = input.required<string>();
}
