
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatInputModule,
  MatTableModule,
  MatSelectModule,
  MatIconModule
} from '@angular/material'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 



@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    BrowserAnimationsModule
  ]
})
export class MaterialModule { }
