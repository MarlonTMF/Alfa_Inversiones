import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-registro-socio',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './registro-socio.html',
    styleUrl: './registro-socio.css'
})
export class RegistroSocio implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    formularioSocio: FormGroup = this.fb.group({
        rol: ['constructor', Validators.required],
        nombreEmpresa: ['', Validators.required],
        nit: ['', Validators.required],
        representanteLegal: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        passwordGenerado: [{ value: '', disabled: true }]
    });

    ngOnInit(): void {
        this.regenerarPassword();
    }

    regenerarPassword(): void {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.formularioSocio.patchValue({ passwordGenerado: pass });
    }

    registrarSocio(): void {
        if (this.formularioSocio.valid) {
            this.router.navigate(['/admin/empresas']);
        }
    }
}