import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-property-management',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './property-management.html',
  styleUrl: './property-management.css'
})
export class PropertyManagement {}
