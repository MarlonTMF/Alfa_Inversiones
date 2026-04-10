import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface MediaItem {
    tipo: 'imagen' | 'youtube';
    url: string | SafeResourceUrl;
    thumbnail: string;
}

@Component({
    selector: 'app-terreno-detalle',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './terreno-detalle.html',
    styleUrl: './terreno-detalle.css'
})
export class TerrenoDetalle implements OnChanges {
    @Input() terreno: any;
    @Output() cerrar = new EventEmitter<void>();

    private readonly sanitizer = inject(DomSanitizer);
    private readonly router = inject(Router);

    mediaItems: MediaItem[] = [];
    itemActivo: MediaItem | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['terreno'] && this.terreno) {
            this.procesarMultimedia();
        }
    }

    procesarMultimedia(): void {
        this.mediaItems = [];

        if (this.terreno.youtubeUrl) {
            const videoId = this.extraerYouTubeId(this.terreno.youtubeUrl);
            if (videoId) {
                this.mediaItems.push({
                    tipo: 'youtube',
                    url: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`),
                    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                });
            }
        }

        const imagenes = this.terreno.imagenes && this.terreno.imagenes.length > 0 
            ? this.terreno.imagenes 
            : ['https://images.unsplash.com/photo-1524813686514-a57563d77965?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'];

        imagenes.forEach((img: string) => {
            this.mediaItems.push({
                tipo: 'imagen',
                url: img,
                thumbnail: img
            });
        });

        this.itemActivo = this.mediaItems.length > 0 ? this.mediaItems[0] : null;
    }

    seleccionarMedia(item: MediaItem): void {
        this.itemActivo = item;
    }

    cerrarPanel(): void {
        this.cerrar.emit();
    }

    verAnalisisCompleto(): void {
        const id = this.terreno.id || 'demo';
        console.log('--- MAP DATA DEBUG ---');
        console.log('Terreno seleccionado:', this.terreno);
        console.log('ID para navegación:', id);
        this.router.navigate(['/analisis', id]);
    }


    private extraerYouTubeId(url: string): string | null {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = regExp.exec(url); // Usar exec en lugar de match
        return (match?.[2].length === 11) ? match[2] : null; // Optional chaining
    }
}