import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateFormComponent } from './template-form.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    TemplateFormComponent
    // O form dubug component foi declarado no app module 
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule

  ]
})
export class TemplateFormModule { }
