import { Component } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  constructor() {
    console.log('ShellComponent Loaded'); // ✅ Add this for debugging
  }
}
