import { EstadoBr } from '../shared/models/estado-br.model';
import { DropdownService } from './../shared/services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;
  estados: EstadoBr[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService

    ) { }

  ngOnInit() {

    this.dropdownService.getEstadosBr()
    .subscribe(dados => {this.estados = dados; console.log(dados);})

    /*  this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });*/

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      })

    });

  }

  onSubmit(){
    console.log(this.formulario.value);

    if (this.formulario.valid){

      this.http
        .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .subscribe(dados => {
          console.log(dados);
          this.resetar();
        },
        (error: any) => alert('erro'));
    } else {
      this.verificaValidacoesForm(this.formulario);

    }
  }

  verificaValidacoesForm(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }

    })
  }
  resetar(){
    this.formulario.reset();
  }

  aplicaCssErro(campo: string){
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }

  verificaValidTouched(campo: string){

      return !this.formulario.get(campo).valid && (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email')
    if(campoEmail.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  consultaCEP(){
    let cep = this.formulario.get('endereco.cep').value

    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)) {

        this.resetaDadosForm();

        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
          //.map(dados => dados.json())
          .subscribe(dados => this.populaDadosForm(dados));

      }
    }

  }

  resetaDadosForm(){
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  populaDadosForm(dados){


    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        //cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

}
