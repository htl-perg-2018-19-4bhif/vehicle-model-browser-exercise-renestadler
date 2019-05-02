import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  public year: number;
  public make: string;
  public years: number[];
  public makes: string[];
  public result: IModel[];

  constructor(private http: HttpClient) {
    this.getYears();
    this.getMakes();
  }

  ngOnInit() {
    this.dataChange();
  }

  async getYears() {
    this.years = await this.http.get<number[]>('https://vehicle-data.azurewebsites.net/api/years').toPromise();
  }

  async getMakes() {
    this.makes = await this.http.get<string[]>('https://vehicle-data.azurewebsites.net/api/makes').toPromise();
  }

  async dataChange() {
    if (!isNaN(this.year) && this.make !== undefined && this.make !== 'NONE') {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models?year=${this.year}&&make=${this.make}`).toPromise();
      console.log(this.result.length);
    } else if (!isNaN(this.year)) {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models?year=${this.year}`).toPromise();
      console.log(this.result.length);
    } else if (this.make !== undefined && this.make !== 'NONE') {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models?make=${this.make}`).toPromise();
      console.log(this.result.length);
    } else {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models`).toPromise();
      console.log(this.result.length);
    }
    console.log(this.result);
  }
}

interface IModel {
  id: number;
  year: number;
  make: string;
  model: string;
}
