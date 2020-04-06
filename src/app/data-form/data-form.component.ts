import { EstadoBr } from '../shared/models/estado-br.model';
import { DropdownService } from './../shared/services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-data-form',
	templateUrl: './data-form.component.html',
	styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

	formulario: FormGroup;
  estados: Observable<EstadoBr[]>;
  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];

	constructor(
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private dropdownService: DropdownService,
		private cepService: ConsultaCepService

		) { }

	ngOnInit() {

    this.estados = this.dropdownService.getEstadosBr();

    this.cargos = this.dropdownService.getCargos();

    this.tecnologias = this.dropdownService.getTecnologias();

    this.newsletterOp = this.dropdownService.getNewsletter();

		/*this.dropdownService.getEstadosBr()
		.subscribe(dados => {this.estados = dados; console.log(dados);})*/

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
        termos: [null, Validators.pattern('true')],
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
    });



	}

	onSubmit(){
		console.log(this.formulario.value);

		if (this.formulario.valid){

			this.http
				.post('https://httpbin.org/post', JSON.stringify(this.formulario.value)).pipe(
				map(res => res))
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

			return (
        !this.formulario.get(campo).valid &&
        (this.formulario.get(campo).touched || this.formulario.get(campo).dirty))
	}

	verificaEmailInvalido(){
		let campoEmail = this.formulario.get('email')
		if(campoEmail.errors){
			return campoEmail.errors['email'] && campoEmail.touched;
		}
	}

	consultaCEP(){
		let cep = this.formulario.get('endereco.cep').value;

		if (cep != null && cep !== '') {
			this.cepService.consultaCEP(cep)
			.subscribe(dados => this.populaDadosForm(dados));
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

  setarCargo(){
    const cargo = {nome:"Dev", nivel: 'Senior', desc: "Dev Sr"}
    this.formulario.get('cargo').setValue(cargo)
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  setarTecnologias() {
    this.formulario.get('tecnologias').setValue(['java', 'javascript', 'php']);
  }

}
